import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ClipboardList,
  Loader2,
  Lock,
  LogOut,
  Shield,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { RiskBadge } from "../components/RiskBadge";
import {
  useDeleteAssessment,
  useGetAllAssessments,
  useGetRiskLevelCounts,
} from "../hooks/useQueries";
import { RiskLevel, formatTimestamp } from "../utils/riskUtils";

const ADMIN_PIN = "1234";

const RISK_PIE_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.low]: "#16a34a",
  [RiskLevel.medium]: "#ea580c",
  [RiskLevel.high]: "#dc2626",
};

// PIN Entry Screen
function PinGate({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onAuth();
      toast.success("Access granted");
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card className="medical-card border shadow-medical-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 animate-pulse-ring">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="font-display text-2xl">
              Admin Access
            </CardTitle>
            <CardDescription>
              Enter your PIN code to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-pin">PIN Code</Label>
                <Input
                  id="admin-pin"
                  data-ocid="admin.pin_input"
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={8}
                  className={`text-center text-xl tracking-widest ${error ? "border-destructive animate-shake" : ""}`}
                  autoComplete="current-password"
                />
                {error && (
                  <p className="text-xs text-destructive text-center">
                    Incorrect PIN. Please try again.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                data-ocid="admin.pin_submit_button"
                className="w-full font-semibold"
                disabled={pin.length < 4}
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Stats card
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  ocid,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  ocid: string;
}) {
  return (
    <Card data-ocid={ocid} className="medical-card border">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {title}
            </p>
            <p className="font-display text-3xl font-bold text-foreground">
              {value}
            </p>
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgColor}`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Admin Dashboard Content
function AdminContent({ onLogout }: { onLogout: () => void }) {
  const assessmentsQuery = useGetAllAssessments();
  const countsQuery = useGetRiskLevelCounts();
  const deleteMutation = useDeleteAssessment();

  const assessments = assessmentsQuery.data ?? [];
  const counts = countsQuery.data ?? { low: 0n, high: 0n, medium: 0n };

  const total = assessments.length;
  const lowCount = Number(counts.low);
  const mediumCount = Number(counts.medium);
  const highCount = Number(counts.high);

  const pieData = [
    { name: "Low Risk", value: lowCount, risk: RiskLevel.low },
    { name: "Medium Risk", value: mediumCount, risk: RiskLevel.medium },
    { name: "High Risk", value: highCount, risk: RiskLevel.high },
  ].filter((d) => d.value > 0);

  const handleDelete = async (id: bigint, index: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Assessment deleted successfully");
    } catch {
      toast.error("Failed to delete assessment");
    }
    // suppress unused variable warning
    void index;
  };

  const isLoading = assessmentsQuery.isLoading || countsQuery.isLoading;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground ml-1 text-sm">
            Patient Assessments — Overview &amp; Management
          </p>
        </div>
        <Button
          variant="outline"
          data-ocid="admin.logout_button"
          onClick={onLogout}
          className="gap-2 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div
          data-ocid="admin.loading_state"
          className="flex items-center justify-center py-12"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Assessments"
              value={total}
              icon={Users}
              color="text-blue-600"
              bgColor="bg-blue-50"
              ocid="admin.stats_total_card"
            />
            <StatCard
              title="Low Risk"
              value={lowCount}
              icon={CheckCircle}
              color="text-green-600"
              bgColor="bg-green-50"
              ocid="admin.stats_low_card"
            />
            <StatCard
              title="Medium Risk"
              value={mediumCount}
              icon={AlertTriangle}
              color="text-orange-600"
              bgColor="bg-orange-50"
              ocid="admin.stats_medium_card"
            />
            <StatCard
              title="High Risk"
              value={highCount}
              icon={TrendingUp}
              color="text-red-600"
              bgColor="bg-red-50"
              ocid="admin.stats_high_card"
            />
          </div>

          {/* Charts + Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <Card
              className="medical-card border lg:col-span-1"
              data-ocid="admin.distribution_chart"
            >
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Risk Distribution
                </CardTitle>
                <CardDescription>Patient risk level breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {pieData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2">
                    <BarChart3 className="w-8 h-8 opacity-40" />
                    No data yet
                  </div>
                ) : (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="45%"
                          outerRadius={80}
                          innerRadius={45}
                          dataKey="value"
                          paddingAngle={3}
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={RISK_PIE_COLORS[entry.risk]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [value, "Patients"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: "13px",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "12px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assessments Table */}
            <Card className="medical-card border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Recent Assessments
                </CardTitle>
                <CardDescription>
                  All patient assessments — scroll to see more
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {assessments.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3"
                  >
                    <ClipboardList className="w-10 h-10 opacity-40" />
                    <p className="text-sm">No assessments yet.</p>
                    <p className="text-xs opacity-70">
                      Completed patient assessments will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.assessments_table">
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-xs font-semibold">
                            Patient
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            Age
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            BMI
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            SBP
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            DBP
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            Glucose
                          </TableHead>
                          <TableHead className="text-xs font-semibold">
                            Risk
                          </TableHead>
                          <TableHead className="text-xs font-semibold">
                            Date
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            Delete
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessments.map((assessment, index) => (
                          <TableRow
                            key={assessment.id.toString()}
                            data-ocid={`admin.assessment_row.${index + 1}`}
                            className="hover:bg-muted/20"
                          >
                            <TableCell className="font-medium text-sm">
                              {assessment.patientName}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {assessment.age.toString()}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {assessment.bmi.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {assessment.systolicBP.toString()}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {assessment.diastolicBP.toString()}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {assessment.glucose.toString()}
                            </TableCell>
                            <TableCell>
                              <RiskBadge
                                risk={assessment.overallRisk}
                                size="sm"
                              />
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(assessment.timestamp)}
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    data-ocid={`admin.delete_button.${index + 1}`}
                                    className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Assessment
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the
                                      assessment for{" "}
                                      <strong>{assessment.patientName}</strong>?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-ocid="admin.delete_cancel_button">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      data-ocid="admin.delete_confirm_button"
                                      onClick={() =>
                                        handleDelete(assessment.id, index + 1)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {deleteMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        "Delete"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="pin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PinGate onAuth={() => setIsAuthenticated(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AdminContent onLogout={() => setIsAuthenticated(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
