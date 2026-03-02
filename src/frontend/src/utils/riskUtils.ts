import type { Assessment } from "../backend.d";
import { RiskLevel } from "../backend.d";

export { RiskLevel };

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case RiskLevel.low:
      return "#16a34a";
    case RiskLevel.medium:
      return "#ea580c";
    case RiskLevel.high:
      return "#dc2626";
    default:
      return "#6b7280";
  }
}

export function getRiskBgColor(risk: RiskLevel): string {
  switch (risk) {
    case RiskLevel.low:
      return "#dcfce7";
    case RiskLevel.medium:
      return "#fff7ed";
    case RiskLevel.high:
      return "#fee2e2";
    default:
      return "#f3f4f6";
  }
}

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case RiskLevel.low:
      return "Low Risk";
    case RiskLevel.medium:
      return "Medium Risk";
    case RiskLevel.high:
      return "High Risk";
    default:
      return "Unknown";
  }
}

export function getRiskScore(risk: RiskLevel): number {
  switch (risk) {
    case RiskLevel.low:
      return 0;
    case RiskLevel.medium:
      return 1;
    case RiskLevel.high:
      return 2;
    default:
      return 0;
  }
}

export interface MetricChartData {
  name: string;
  score: number;
  risk: RiskLevel;
  fill: string;
}

export function getMetricChartData(assessment: Assessment): MetricChartData[] {
  return [
    {
      name: "Age",
      score: assessment.ageScore.value,
      risk: assessment.ageScore.risk,
      fill: getRiskColor(assessment.ageScore.risk),
    },
    {
      name: "BMI",
      score: assessment.bmiScore.value,
      risk: assessment.bmiScore.risk,
      fill: getRiskColor(assessment.bmiScore.risk),
    },
    {
      name: "Systolic BP",
      score: assessment.systolicBPScore.value,
      risk: assessment.systolicBPScore.risk,
      fill: getRiskColor(assessment.systolicBPScore.risk),
    },
    {
      name: "Diastolic BP",
      score: assessment.diastolicBPScore.value,
      risk: assessment.diastolicBPScore.risk,
      fill: getRiskColor(assessment.diastolicBPScore.risk),
    },
    {
      name: "Glucose",
      score: assessment.glucoseScore.value,
      risk: assessment.glucoseScore.risk,
      fill: getRiskColor(assessment.glucoseScore.risk),
    },
  ];
}

export interface RiskExplanation {
  text: string;
  severity: "high" | "medium" | "low";
}

export function generateRiskExplanations(
  assessment: Assessment,
): RiskExplanation[] {
  const explanations: RiskExplanation[] = [];

  // Age
  if (assessment.ageScore.risk === RiskLevel.high) {
    explanations.push({
      text: "Age above 60 significantly increases cardiovascular risk.",
      severity: "high",
    });
  } else if (assessment.ageScore.risk === RiskLevel.medium) {
    explanations.push({
      text: "Age between 45–60 moderately raises risk.",
      severity: "medium",
    });
  }

  // BMI
  if (assessment.bmiScore.risk === RiskLevel.high) {
    explanations.push({
      text: "BMI above 30 indicates obesity, raising health risk significantly.",
      severity: "high",
    });
  } else if (assessment.bmiScore.risk === RiskLevel.medium) {
    explanations.push({
      text: "BMI between 25–30 (overweight) raises moderate risk.",
      severity: "medium",
    });
  }

  // Systolic BP
  if (assessment.systolicBPScore.risk === RiskLevel.high) {
    explanations.push({
      text: "Elevated systolic blood pressure (>140 mmHg) increased risk significantly.",
      severity: "high",
    });
  } else if (assessment.systolicBPScore.risk === RiskLevel.medium) {
    explanations.push({
      text: "Borderline systolic BP (120–140 mmHg) moderately raised risk.",
      severity: "medium",
    });
  }

  // Diastolic BP
  if (assessment.diastolicBPScore.risk === RiskLevel.high) {
    explanations.push({
      text: "High diastolic blood pressure (>90 mmHg) contributes to risk.",
      severity: "high",
    });
  } else if (assessment.diastolicBPScore.risk === RiskLevel.medium) {
    explanations.push({
      text: "Diastolic BP in prehypertensive range raised moderate risk.",
      severity: "medium",
    });
  }

  // Glucose
  if (assessment.glucoseScore.risk === RiskLevel.high) {
    explanations.push({
      text: "Glucose level above 126 mg/dL suggests diabetes risk, significantly impacting assessment.",
      severity: "high",
    });
  } else if (assessment.glucoseScore.risk === RiskLevel.medium) {
    explanations.push({
      text: "Glucose between 100–126 mg/dL indicates prediabetes, moderately increasing risk.",
      severity: "medium",
    });
  }

  if (explanations.length === 0) {
    explanations.push({
      text: "All health metrics are within normal ranges. Keep maintaining your healthy lifestyle!",
      severity: "low",
    });
  }

  return explanations;
}

export interface Recommendation {
  text: string;
  icon: "check" | "warning" | "alert";
}

export function getRecommendations(risk: RiskLevel): Recommendation[] {
  switch (risk) {
    case RiskLevel.low:
      return [
        {
          text: "Maintain a balanced diet rich in fruits, vegetables, and whole grains.",
          icon: "check",
        },
        {
          text: "Engage in at least 150 minutes of moderate physical activity per week.",
          icon: "check",
        },
        {
          text: "Schedule regular check-ups annually with your healthcare provider.",
          icon: "check",
        },
        {
          text: "Avoid smoking and limit alcohol consumption.",
          icon: "check",
        },
        {
          text: "Monitor your blood pressure and glucose levels periodically.",
          icon: "check",
        },
      ];
    case RiskLevel.medium:
      return [
        {
          text: "Consult your physician for a comprehensive health evaluation.",
          icon: "warning",
        },
        {
          text: "Adopt a heart-healthy diet and reduce sodium intake.",
          icon: "warning",
        },
        {
          text: "Exercise regularly under medical guidance.",
          icon: "warning",
        },
        {
          text: "Monitor blood pressure, BMI, and glucose levels monthly.",
          icon: "warning",
        },
        {
          text: "Consider stress management techniques such as meditation or yoga.",
          icon: "warning",
        },
        {
          text: "Reduce processed food and sugar consumption.",
          icon: "warning",
        },
      ];
    case RiskLevel.high:
      return [
        {
          text: "Seek immediate medical consultation with a specialist.",
          icon: "alert",
        },
        {
          text: "Undergo comprehensive cardiac and metabolic screening.",
          icon: "alert",
        },
        {
          text: "Follow a medically prescribed treatment plan strictly.",
          icon: "alert",
        },
        {
          text: "Monitor vitals daily — blood pressure, glucose, and weight.",
          icon: "alert",
        },
        {
          text: "Avoid strenuous physical activity until cleared by a doctor.",
          icon: "alert",
        },
        {
          text: "Make urgent lifestyle modifications under medical supervision.",
          icon: "alert",
        },
      ];
    default:
      return [];
  }
}

export function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
