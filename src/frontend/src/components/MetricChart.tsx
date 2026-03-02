import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Assessment } from "../backend.d";
import { getMetricChartData } from "../utils/riskUtils";

interface MetricChartProps {
  assessment: Assessment;
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    name: string;
    score: number;
    risk: string;
    fill: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const RISK_LABELS: Record<number, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const riskLabel = RISK_LABELS[item.value] ?? "Unknown";

  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-medical text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p style={{ color: item.payload.fill }} className="font-medium">
        Risk Level: {riskLabel}
      </p>
    </div>
  );
}

export function MetricChart({ assessment }: MetricChartProps) {
  const data = getMetricChartData(assessment);

  return (
    <div data-ocid="results.chart" className="w-full h-64 md:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: -8, bottom: 8 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 2]}
            ticks={[0, 1, 2]}
            tickFormatter={(v) => RISK_LABELS[v as number] ?? ""}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
