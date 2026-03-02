import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import type { RiskLevel } from "../backend.d";
import { getRecommendations } from "../utils/riskUtils";

interface RecommendationsProps {
  risk: RiskLevel;
}

export function Recommendations({ risk }: RecommendationsProps) {
  const recommendations = getRecommendations(risk);

  const riskHeaderClasses: Record<string, string> = {
    low: "bg-green-50 border-green-200",
    medium: "bg-orange-50 border-orange-200",
    high: "bg-red-50 border-red-200",
  };

  const riskHeaderTextClasses: Record<string, string> = {
    low: "text-green-700",
    medium: "text-orange-700",
    high: "text-red-700",
  };

  const riskDescriptions: Record<string, string> = {
    low: "Your health metrics are good. Maintain your healthy habits.",
    medium: "Some metrics need attention. Follow these guidelines closely.",
    high: "Immediate medical attention recommended. Act on these urgently.",
  };

  return (
    <div data-ocid="results.recommendations_section" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">
            Recommended Actions
          </h3>
          <p className="text-sm text-muted-foreground">
            {riskDescriptions[risk]}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg border p-3.5 mb-3 text-sm font-medium",
          riskHeaderClasses[risk] ?? "bg-muted border-border",
          riskHeaderTextClasses[risk] ?? "text-foreground",
        )}
      >
        {risk === "low" &&
          "✓ Continue your current healthy lifestyle practices."}
        {risk === "medium" &&
          "⚠ Lifestyle modifications and closer monitoring are advised."}
        {risk === "high" &&
          "🚨 Please seek medical attention at the earliest opportunity."}
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec) => {
          const Icon =
            rec.icon === "alert"
              ? AlertCircle
              : rec.icon === "warning"
                ? AlertTriangle
                : CheckCircle2;

          return (
            <div
              key={rec.text}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-lg border text-sm",
                rec.icon === "alert"
                  ? "bg-red-50 border-red-100 text-red-800"
                  : rec.icon === "warning"
                    ? "bg-orange-50 border-orange-100 text-orange-800"
                    : "bg-green-50 border-green-100 text-green-800",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 mt-0.5 shrink-0",
                  rec.icon === "alert"
                    ? "text-red-600"
                    : rec.icon === "warning"
                      ? "text-orange-600"
                      : "text-green-600",
                )}
              />
              <span className="leading-relaxed">{rec.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
