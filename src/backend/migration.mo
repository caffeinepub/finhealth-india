import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldUserProfile = {
    income : Nat;
    riskProfile : Text;
    goals : [Text];
    onboardingComplete : Bool;
    name : Text;
  };

  type NewUserProfile = {
    income : Nat;
    riskProfile : Text;
    goals : [Text];
    onboardingComplete : Bool;
    name : Text;
    plan : PlanType;
  };

  type PlanType = {
    #free;
    #pro;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    portfolios : Map.Map<Principal, Text>;
    transactions : Map.Map<Principal, Text>;
    referralCounts : Map.Map<Principal, Nat>;
    finHealthScores : Map.Map<Principal, Nat>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    portfolios : Map.Map<Principal, Text>;
    transactions : Map.Map<Principal, Text>;
    referralCounts : Map.Map<Principal, Nat>;
    finHealthScores : Map.Map<Principal, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldUser) {
        { oldUser with plan = #free };
      }
    );
    { old with userProfiles = newUserProfiles };
  };
};
