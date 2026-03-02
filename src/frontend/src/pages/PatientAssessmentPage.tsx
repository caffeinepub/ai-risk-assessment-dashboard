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
  Activity,
  Brain,
  CheckCircle,
  ChevronDown,
  Clock,
  Droplets,
  Heart,
  Loader2,
  Shield,
  User,
  Weight,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Assessment } from "../backend.d";
import { MetricChart } from "../components/MetricChart";
import { Recommendations } from "../components/Recommendations";
import { RiskBadge } from "../components/RiskBadge";
import { RiskExplanation } from "../components/RiskExplanation";
import { useSubmitAssessment } from "../hooks/useQueries";

interface FormData {
  patientName: string;
  age: string;
  bmi: string;
  systolicBP: string;
  diastolicBP: string;
  glucose: string;
}

interface FormErrors {
  patientName?: string;
  age?: string;
  bmi?: string;
  systolicBP?: string;
  diastolicBP?: string;
  glucose?: string;
}

const INITIAL_FORM: FormData = {
  patientName: "",
  age: "",
  bmi: "",
  systolicBP: "",
  diastolicBP: "",
  glucose: "",
};

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.patientName.trim()) errors.patientName = "Patient name is required";
  const age = Number(data.age);
  if (!data.age || Number.isNaN(age) || age < 1 || age > 120)
    errors.age = "Age must be between 1 and 120";
  const bmi = Number(data.bmi);
  if (!data.bmi || Number.isNaN(bmi) || bmi < 10 || bmi > 60)
    errors.bmi = "BMI must be between 10 and 60";
  const sbp = Number(data.systolicBP);
  if (!data.systolicBP || Number.isNaN(sbp) || sbp < 60 || sbp > 250)
    errors.systolicBP = "Systolic BP must be between 60 and 250";
  const dbp = Number(data.diastolicBP);
  if (!data.diastolicBP || Number.isNaN(dbp) || dbp < 40 || dbp > 150)
    errors.diastolicBP = "Diastolic BP must be between 40 and 150";
  const glucose = Number(data.glucose);
  if (!data.glucose || Number.isNaN(glucose) || glucose < 50 || glucose > 600)
    errors.glucose = "Glucose must be between 50 and 600";
  return errors;
}

export function PatientAssessmentPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<Assessment | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const submitMutation = useSubmitAssessment();

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const assessment = await submitMutation.mutateAsync({
        patientName: form.patientName.trim(),
        age: BigInt(Math.round(Number(form.age))),
        bmi: Number(form.bmi),
        systolicBP: BigInt(Math.round(Number(form.systolicBP))),
        diastolicBP: BigInt(Math.round(Number(form.diastolicBP))),
        glucose: BigInt(Math.round(Number(form.glucose))),
      });
      setResult(assessment);
      toast.success("Assessment completed successfully!");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      toast.error("Failed to submit assessment. Please try again.");
      console.error(err);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center">
        <img
          src="/assets/hero-banner.dim_1200x400.jpg"
          alt="Medical hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Health Analysis
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              AI-Powered Health
              <br />
              <span className="text-white/70">Risk Assessment</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Get instant AI-powered health risk predictions based on your
              vitals. Understand your health better with personalized insights.
            </p>
            <Button
              size="lg"
              onClick={scrollToForm}
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-medical-lg gap-2 px-8"
            >
              Start Assessment
              <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
        >
          {[
            { label: "Accuracy", value: "94%", icon: CheckCircle },
            { label: "Metrics Analyzed", value: "5+", icon: Activity },
            { label: "Instant Results", value: "<1s", icon: Clock },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3 text-white"
            >
              <stat.icon className="w-5 h-5 text-white/80" />
              <div>
                <div className="font-bold text-lg leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Assessment Form */}
      <section
        ref={formRef}
        className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Patient Health Assessment
            </h2>
            <p className="text-muted-foreground">
              Enter your health metrics below for an instant AI analysis
            </p>
          </div>

          <Card className="medical-card border shadow-medical">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">
                    Enter Health Metrics
                  </CardTitle>
                  <CardDescription>
                    All fields are required for accurate assessment
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                data-ocid="assessment.form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Patient Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="patientName"
                    className="flex items-center gap-1.5 text-sm font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    Patient Name
                  </Label>
                  <Input
                    id="patientName"
                    data-ocid="assessment.name_input"
                    type="text"
                    placeholder="Enter patient's full name"
                    value={form.patientName}
                    onChange={(e) =>
                      handleChange("patientName", e.target.value)
                    }
                    className={errors.patientName ? "border-destructive" : ""}
                    autoComplete="name"
                  />
                  {errors.patientName && (
                    <p className="text-xs text-destructive">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                {/* Age + BMI row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="age"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Age
                    </Label>
                    <Input
                      id="age"
                      data-ocid="assessment.age_input"
                      type="number"
                      placeholder="e.g., 45"
                      min={1}
                      max={120}
                      value={form.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      className={errors.age ? "border-destructive" : ""}
                    />
                    {errors.age && (
                      <p className="text-xs text-destructive">{errors.age}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="bmi"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Weight className="w-3.5 h-3.5 text-muted-foreground" />
                      BMI
                    </Label>
                    <Input
                      id="bmi"
                      data-ocid="assessment.bmi_input"
                      type="number"
                      placeholder="e.g., 24.5"
                      min={10}
                      max={60}
                      step={0.1}
                      value={form.bmi}
                      onChange={(e) => handleChange("bmi", e.target.value)}
                      className={errors.bmi ? "border-destructive" : ""}
                    />
                    {errors.bmi && (
                      <p className="text-xs text-destructive">{errors.bmi}</p>
                    )}
                  </div>
                </div>

                {/* BP row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="systolicBP"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                      Systolic BP (mmHg)
                    </Label>
                    <Input
                      id="systolicBP"
                      data-ocid="assessment.systolic_input"
                      type="number"
                      placeholder="e.g., 120"
                      min={60}
                      max={250}
                      value={form.systolicBP}
                      onChange={(e) =>
                        handleChange("systolicBP", e.target.value)
                      }
                      className={errors.systolicBP ? "border-destructive" : ""}
                    />
                    {errors.systolicBP && (
                      <p className="text-xs text-destructive">
                        {errors.systolicBP}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="diastolicBP"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                      Diastolic BP (mmHg)
                    </Label>
                    <Input
                      id="diastolicBP"
                      data-ocid="assessment.diastolic_input"
                      type="number"
                      placeholder="e.g., 80"
                      min={40}
                      max={150}
                      value={form.diastolicBP}
                      onChange={(e) =>
                        handleChange("diastolicBP", e.target.value)
                      }
                      className={errors.diastolicBP ? "border-destructive" : ""}
                    />
                    {errors.diastolicBP && (
                      <p className="text-xs text-destructive">
                        {errors.diastolicBP}
                      </p>
                    )}
                  </div>
                </div>

                {/* Glucose */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="glucose"
                    className="flex items-center gap-1.5 text-sm font-medium"
                  >
                    <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
                    Glucose (mg/dL)
                  </Label>
                  <Input
                    id="glucose"
                    data-ocid="assessment.glucose_input"
                    type="number"
                    placeholder="e.g., 95"
                    min={50}
                    max={600}
                    value={form.glucose}
                    onChange={(e) => handleChange("glucose", e.target.value)}
                    className={errors.glucose ? "border-destructive" : ""}
                  />
                  {errors.glucose && (
                    <p className="text-xs text-destructive">{errors.glucose}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  data-ocid="assessment.submit_button"
                  disabled={submitMutation.isPending}
                  className="w-full font-semibold h-11"
                  size="lg"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Assess Risk
                    </>
                  )}
                </Button>

                {submitMutation.isError && (
                  <p
                    data-ocid="assessment.error_state"
                    className="text-sm text-destructive text-center"
                  >
                    Failed to submit assessment. Please try again.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pb-16 container mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Risk Level Banner */}
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Assessment Results for{" "}
                  <span className="text-primary">{result.patientName}</span>
                </h2>
                <div className="inline-block" data-ocid="results.risk_badge">
                  <RiskBadge risk={result.overallRisk} size="lg" />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Overall cardiovascular risk classification
                </div>
              </div>

              {/* Metric Chart */}
              <Card className="medical-card border shadow-medical">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Health Metric Risk Contributions
                  </CardTitle>
                  <CardDescription>
                    Risk level for each individual health metric (0=Low,
                    1=Medium, 2=High)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricChart assessment={result} />
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Card className="medical-card border shadow-medical">
                <CardContent className="pt-6">
                  <RiskExplanation assessment={result} />
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="medical-card border shadow-medical">
                <CardContent className="pt-6">
                  <Recommendations risk={result.overallRisk} />
                </CardContent>
              </Card>

              {/* Reset button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setForm(INITIAL_FORM);
                    formRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  Start New Assessment
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Feature Info Section */}
      <section className="py-16 section-gradient border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our AI analyzes your health metrics to provide instant, actionable
              insights
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description:
                  "Advanced algorithms analyze 5 key health metrics to determine your cardiovascular risk profile with high accuracy.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Clock,
                title: "Instant Results",
                description:
                  "Get your complete health risk assessment in under a second, with detailed metric breakdowns and visualizations.",
                color: "text-teal-600",
                bg: "bg-teal-50",
              },
              {
                icon: Shield,
                title: "Personalized Advice",
                description:
                  "Receive condition-specific recommendations tailored to your individual risk level and health metrics.",
                color: "text-green-600",
                bg: "bg-green-50",
              },
            ].map((feat) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="medical-card h-full">
                  <CardContent className="pt-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feat.bg} mb-4`}
                    >
                      <feat.icon className={`w-7 h-7 ${feat.color}`} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Doctor analytics card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="medical-card overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3.5 py-1 text-sm font-medium mb-4 w-fit">
                    <Zap className="w-3.5 h-3.5" />
                    Predictive Healthcare Analytics
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">
                    Clinical-Grade AI for Every Patient
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    HealthAI combines evidence-based medical knowledge with
                    machine learning to deliver reliable cardiovascular risk
                    predictions. Our model considers age, BMI, blood pressure,
                    and glucose levels — the five most predictive biomarkers for
                    heart disease risk.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Clinical Accuracy", value: "94.2%" },
                      { label: "Patients Analyzed", value: "50K+" },
                      { label: "Risk Factors", value: "5 Key" },
                      { label: "Response Time", value: "<500ms" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-muted/50 rounded-xl p-3 text-center"
                      >
                        <div className="font-display font-bold text-xl text-primary">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative h-64 lg:h-auto min-h-[280px]">
                  <img
                    src="/assets/doctor-analytics.dim_800x500.jpg"
                    alt="Doctor using analytics"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/30 hidden lg:block" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Health icons */}
          <div className="mt-10 flex justify-center">
            <img
              src="/assets/health-icons-transparent.dim_600x400.png"
              alt="Health metric icons"
              className="max-h-32 object-contain opacity-80"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
