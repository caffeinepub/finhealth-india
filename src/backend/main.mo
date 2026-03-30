import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply state migration to enable upgrades

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    income : Nat;
    riskProfile : Text;
    goals : [Text];
    onboardingComplete : Bool;
    name : Text;
  };

  public type Portfolio = Text;
  public type Transactions = Text;

  public type ChatResponse = {
    reply : Text;
    action : ?Text;
  };

  public type AIChatResponse = {
    reply : Text;
    insight : ?Text;
    action : ?Text;
  };

  // Stable variables for persistent state
  var aiApiKey : Text = "";
  let userProfiles = Map.empty<Principal, UserProfile>();
  let portfolios = Map.empty<Principal, Portfolio>();
  let transactions = Map.empty<Principal, Transactions>();
  let referralCounts = Map.empty<Principal, Nat>();
  let finHealthScores = Map.empty<Principal, Nat>();

  // AI Key Management (Admin Only)
  public shared ({ caller }) func setAIApiKey(key : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set API keys");
    };
    aiApiKey := key;
  };

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Portfolio Functions
  public query ({ caller }) func getPortfolio() : async Portfolio {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access portfolios");
    };
    switch (portfolios.get(caller)) {
      case (null) { Runtime.trap("No portfolio found for caller") };
      case (?portfolio) { portfolio };
    };
  };

  public shared ({ caller }) func savePortfolio(newPortfolio : Portfolio) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save portfolios");
    };
    portfolios.add(caller, newPortfolio);
  };

  // Transactions Functions
  public query ({ caller }) func getTransactions() : async Transactions {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { Runtime.trap("No transactions found for caller") };
      case (?transactionList) { transactionList };
    };
  };

  public shared ({ caller }) func saveTransactions(newTransactions : Transactions) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save transactions");
    };
    transactions.add(caller, newTransactions);
  };

  func generateReferralCode(caller : Principal) : Text {
    let callerText = caller.toText();
    if (callerText.size() < 8) { callerText } else {
      Text.fromIter(callerText.chars().take(8));
    };
  };

  // Referral System Functions
  public query ({ caller }) func getReferralCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get referral codes");
    };
    generateReferralCode(caller);
  };

  public shared ({ caller }) func useReferralCode(referredBy : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can use referral codes");
    };
    if (caller == referredBy) {
      Runtime.trap("Cannot refer yourself");
    };
    let currentCount = switch (referralCounts.get(referredBy)) {
      case (?count) { count };
      case (null) { 0 };
    };
    referralCounts.add(referredBy, currentCount + 1);
  };

  public query ({ caller }) func getReferralCount(user : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check referral counts");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own referral count");
    };
    switch (referralCounts.get(user)) {
      case (null) { 0 };
      case (?count) { count };
    };
  };

  // FinHealth Score Functions
  public query ({ caller }) func getFinHealthScore() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access finhealth score data");
    };
    switch (finHealthScores.get(caller)) {
      case (null) { 0 };
      case (?score) { score };
    };
  };

  public shared ({ caller }) func saveFinHealthScore(newScore : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save finhealth score data");
    };
    finHealthScores.add(caller, newScore);
  };

  // Chatbot Function
  public query ({ caller }) func processChat(message : Text) : async ChatResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat functionality");
    };
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

  // Transform callback for HTTP Outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // AI Chat Function (sends chat + data to OpenAI API)
  public shared ({ caller }) func aiChat(message : Text, portfolio : Text, goals : Text) : async AIChatResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat functionality");
    };

    let openAiKey = aiApiKey;

    // If API key missing, fall back to keyword logic
    if (openAiKey.size() == 0) {
      let fallback = await processChat(message);
      return { fallback with insight = null };
    };

    let prompt =
      "You are FinHealth AI, a financial assistant for Indian users. " # "Help users make better financial decisions, suggest tools (Policy Analyzer, SIP Calculator, Goal Planner, Risk Profile), " # "identify investment mistakes. User message: " # message # ". " # "User portfolio: " # portfolio # ". " # "User goals: " # goals # ". " # "Rules: Give clear simple advice, use rupee and percent symbols, keep response under 120 words. " # "Return ONLY valid JSON: {\"reply\": \"...\", \"insight\": \"...\", \"action\": \"tool-name\"} where action is one of: policy-analyzer, sip-calculator, goal-planner, risk-profile, or omit if not applicable. ";

    let payload =
      "{\"model\": \"gpt-3.5-turbo\", " # "\"messages\": [{\"role\": \"user\", \"content\": \"" # prompt # "\"}], " # "\"temperature\": 0.5, \"max_tokens\": 120}";

    let headers = [
      {
        name = "Content-Type";
        value = "application/json";
      },
      { name = "Authorization"; value = "Bearer " # openAiKey },
    ];

    // Make HTTP outcall to OpenAI
    let response = await OutCall.httpPostRequest("https://api.openai.com/v1/chat/completions", headers, payload, transform);

    // Just return the plain response (frontend will parse JSON)
    {
      reply = response;
      insight = null;
      action = null;
    };
  };
};
