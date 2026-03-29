import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use migration module for data migration on upgrade
(with migration = Migration.run)
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
  type Transactions = Text;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let portfolios = Map.empty<Principal, Portfolio>();
  let transactions = Map.empty<Principal, Transactions>();
  let referralCounts = Map.empty<Principal, Nat>();
  let finHealthScores = Map.empty<Principal, Nat>();

  func generateReferralCode(caller : Principal) : Text {
    let callerText = caller.toText();
    if (callerText.size() < 8) { callerText } else {
      Text.fromIter(callerText.chars().take(8));
    };
  };

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
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
};
