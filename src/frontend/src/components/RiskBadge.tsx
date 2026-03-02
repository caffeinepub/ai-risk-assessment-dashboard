import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { RiskLevel, getRiskLabel } from "../utils/riskUtils";

interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  risk: RiskLevel;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({
  risk,
  size = "md",
  className,
  ...props
}: RiskBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2.5 py-0.5 gap-1",
    md: "text-sm px-3.5 py-1.5 gap-1.5",
    lg: "text-lg px-6 py-3 gap-2.5 font-bold",
  };

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const riskClasses: Record<RiskLevel, string> = {
    [RiskLevel.low]: "risk-low",
    [RiskLevel.medium]: "risk-medium",
    [RiskLevel.high]: "risk-high",
  };

  const Icon =
    risk === RiskLevel.low
      ? ShieldCheck
      : risk === RiskLevel.medium
        ? ShieldAlert
        : ShieldX;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        sizeClasses[size],
        riskClasses[risk],
        className,
      )}
      {...props}
    >
      <Icon className={iconSize[size]} />
      {getRiskLabel(risk)}
    </span>
  );
}
