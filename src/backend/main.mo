import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type RiskLevel = {
    #low;
    #medium;
    #high;
  };

  module RiskLevel {
    public func compare(a : RiskLevel, b : RiskLevel) : Order.Order {
      let toNat = func(r : RiskLevel) : Nat {
        switch (r) {
          case (#low) { 0 };
          case (#medium) { 1 };
          case (#high) { 2 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  type MetricScore = {
    value : Float;
    risk : RiskLevel;
  };

  type Assessment = {
    id : Nat;
    timestamp : Int;
    patientName : Text;
    age : Nat;
    bmi : Float;
    systolicBP : Nat;
    diastolicBP : Nat;
    glucose : Nat;
    overallRisk : RiskLevel;
    ageScore : MetricScore;
    bmiScore : MetricScore;
    systolicBPScore : MetricScore;
    diastolicBPScore : MetricScore;
    glucoseScore : MetricScore;
  };

  module Assessment {
    public func compare(a : Assessment, b : Assessment) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let assessments = Map.empty<Nat, Assessment>();
  var nextId = 0;

  func calculateMetricScore(value : Float, highThreshold : Float, mediumThreshold : Float) : MetricScore {
    let risk = if (value > highThreshold) {
      #high;
    } else if (value > mediumThreshold) {
      #medium;
    } else {
      #low;
    };
    {
      value;
      risk;
    };
  };

  func calculateOverallRisk(scores : [MetricScore]) : RiskLevel {
    let highCount = scores.filter(func(s) { s.risk == #high }).size();
    let mediumCount = scores.filter(func(s) { s.risk == #medium }).size();

    if (highCount > 0) {
      return #high;
    };
    if (mediumCount > 1) {
      return #medium;
    };
    #low;
  };

  public shared ({ caller }) func submitAssessment(
    patientName : Text,
    age : Nat,
    bmi : Float,
    systolicBP : Nat,
    diastolicBP : Nat,
    glucose : Nat,
  ) : async Assessment {
    let ageScore = calculateMetricScore(age.toFloat() : Float, 60, 45);
    let bmiScore = calculateMetricScore(bmi, 30, 25);
    let systolicBPScore = calculateMetricScore(systolicBP.toFloat() : Float, 140, 120);
    let diastolicBPScore = calculateMetricScore(diastolicBP.toFloat() : Float, 90, 80);
    let glucoseScore = calculateMetricScore(glucose.toFloat() : Float, 126, 100);

    let overallRisk = calculateOverallRisk([ageScore, bmiScore, systolicBPScore, diastolicBPScore, glucoseScore]);

    let assessment : Assessment = {
      id = nextId;
      timestamp = Time.now();
      patientName;
      age;
      bmi;
      systolicBP;
      diastolicBP;
      glucose;
      overallRisk;
      ageScore;
      bmiScore;
      systolicBPScore;
      diastolicBPScore;
      glucoseScore;
    };

    assessments.add(nextId, assessment);
    nextId += 1;
    assessment;
  };

  public query ({ caller }) func getAllAssessments() : async [Assessment] {
    assessments.values().toArray().sort();
  };

  public query ({ caller }) func getAssessment(id : Nat) : async Assessment {
    switch (assessments.get(id)) {
      case (null) { Runtime.trap("Assessment not found") };
      case (?assessment) { assessment };
    };
  };

  public shared ({ caller }) func deleteAssessment(id : Nat) : async () {
    if (not assessments.containsKey(id)) {
      Runtime.trap("Assessment not found");
    };
    assessments.remove(id);
  };

  public query ({ caller }) func getRiskLevelCounts() : async {
    low : Nat;
    medium : Nat;
    high : Nat;
  } {
    var low = 0;
    var medium = 0;
    var high = 0;

    assessments.values().forEach(
      func(assessment) {
        switch (assessment.overallRisk) {
          case (#low) { low += 1 };
          case (#medium) { medium += 1 };
          case (#high) { high += 1 };
        };
      }
    );
    { low; medium; high };
  };
};
