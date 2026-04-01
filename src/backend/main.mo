import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type PlanType = {
    #free;
    #pro;
  };

  public type UserProfile = {
    income : Nat;
    riskProfile : Text;
    goals : [Text];
    onboardingComplete : Bool;
    name : Text;
    plan : PlanType;
  };

  public type ChatResponse = {
    reply : Text;
    action : ?Text;
  };

  public type AIChatResponse = {
    reply : Text;
    insight : ?Text;
    action : ?Text;
  };

  public type PlanRequest = {
    items : [Stripe.ShoppingItem];
    successUrl : Text;
    cancelUrl : Text;
  };

  // Stripe variables
  let proPrice = 1200;
  let stripeStates = Map.empty<Principal, PlanType>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Data stores
  var aiApiKey : Text = "";
  let userProfiles = Map.empty<Principal, UserProfile>();
  let portfolios = Map.empty<Principal, Text>();
  let transactions = Map.empty<Principal, Text>();
  let referralCounts = Map.empty<Principal, Nat>();
  let finHealthScores = Map.empty<Principal, Nat>();

  // Stripe API integration
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setAIApiKey(key : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set API keys");
    };
    aiApiKey := key;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) {
        Runtime.trap("Stripe needs to be first configured");
      };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func handleStripeWebhook(sessionId : Text, userId : Principal) : async () {
    userProfiles.add(userId, {
      income = 0;
      riskProfile = "";
      goals = [];
      onboardingComplete = false;
      name = "";
      plan = #pro;
    });
    stripeStates.add(userId, #pro);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check Stripe session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Store the given profile to persistent storage.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Store the given portfolio to persistent storage.
  public shared ({ caller }) func savePortfolio(portfolio : Text) : async () {
    portfolios.add(caller, portfolio);
  };

  /// Store the given transactions to persistent storage.
  public shared ({ caller }) func saveTransactions(transactionList : Text) : async () {
    transactions.add(caller, transactionList);
  };

  /// Store the given FinHealthScore to persistent storage.
  public shared ({ caller }) func saveFinHealthScore(score : Nat) : async () {
    finHealthScores.add(caller, score);
  };

  /// Send chat message using cached data.
  public query ({ caller }) func processChat(message : Text) : async ChatResponse {
    let lowerMessage = message.toLower();

    if (
      lowerMessage.contains(#text("policy")) or
      lowerMessage.contains(#text("insurance")) or
      lowerMessage.contains(#text("ulip"))
    ) {
      return {
        reply = "You can analyze your policy using our Policy Analyzer tool.";
        action = ?"policy-analyzer";
      };
    };

    if (
      lowerMessage.contains(#text("sip")) or
      lowerMessage.contains(#text("investment"))
    ) {
      return {
        reply = "Use SIP Calculator or Goal Planner to plan your investments.";
        action = ?"sip-calculator";
      };
    };

    if (
      lowerMessage.contains(#text("loan")) or
      lowerMessage.contains(#text("emi"))
    ) {
      return {
        reply = "You can optimize your loan using the Loan Prepayment tool.";
        action = ?"loan-prepayment";
      };
    };

    if (lowerMessage.contains(#text("risk"))) {
      return {
        reply = "Check your risk profile using the Risk Profile tool.";
        action = ?"risk-profile";
      };
    };

    {
      reply = "Please provide more details about your financial query.";
      action = null;
    };
  };
};
