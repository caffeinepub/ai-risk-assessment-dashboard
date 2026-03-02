import { cn } from "@/lib/utils";
import { AlertTriangle, Brain, CheckCircle2, XCircle } from "lucide-react";
import type { Assessment } from "../backend.d";
import { generateRiskExplanations } from "../utils/riskUtils";

interface RiskExplanationProps {
  assessment: Assessment;
}

export function RiskExplanation({ assessment }: RiskExplanationProps) {
  const explanations = generateRiskExplanations(assessment);

  return (
    <div data-ocid="results.explanation_section" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">
            AI Risk Explanation
          </h3>
          <p className="text-sm text-muted-foreground">
            Factors contributing to your assessment
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {explanations.map((exp) => {
          const Icon =
            exp.severity === "high"
              ? XCircle
              : exp.severity === "medium"
                ? AlertTriangle
                : CheckCircle2;

          return (
            <div
              key={exp.text}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-lg border text-sm",
                exp.severity === "high"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : exp.severity === "medium"
                    ? "bg-orange-50 border-orange-200 text-orange-800"
                    : "bg-green-50 border-green-200 text-green-800",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 mt-0.5 shrink-0",
                  exp.severity === "high"
                    ? "text-red-600"
                    : exp.severity === "medium"
                      ? "text-orange-600"
                      : "text-green-600",
                )}
              />
              <span className="leading-relaxed">{exp.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
