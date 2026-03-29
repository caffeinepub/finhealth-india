import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type UserProfile = {
    income : Nat;
    riskProfile : Text;
    goals : [Text];
    onboardingComplete : Bool;
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    portfolios : Map.Map<Principal, Text>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    portfolios : Map.Map<Principal, Text>;
    transactions : Map.Map<Principal, Text>;
    referralCounts : Map.Map<Principal, Nat>;
    finHealthScores : Map.Map<Principal, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    let convertedProfiles = old.userProfiles.map<Principal, { name : Text }, UserProfile>(
      func(_id, oldProfile) {
        {
          name = oldProfile.name;
          income = 0;
          riskProfile = "";
          goals = [];
          onboardingComplete = false;
        };
      }
    );
    {
      userProfiles = convertedProfiles : Map.Map<Principal, UserProfile>;
      portfolios = old.portfolios : Map.Map<Principal, Text>;
      transactions = Map.empty<Principal, Text>();
      referralCounts = Map.empty<Principal, Nat>();
      finHealthScores = Map.empty<Principal, Nat>();
    };
  };
};
