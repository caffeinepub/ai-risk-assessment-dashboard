# AI-Powered Risk Assessment Dashboard

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full-stack Risk Assessment Dashboard with AI-powered features
- Patient intake form with fields: Age, BMI, Systolic BP, Diastolic BP, Glucose
- Risk prediction engine (Low / Medium / High) based on health metric thresholds
- Visualization section: responsive pie chart and/or bar chart showing per-metric risk contribution, updates dynamically with patient input
- AI Risk Explanation section: auto-generated explanations for why a risk level was assigned, based on individual metric values
- Personalized Health Recommendations section: condition-based professional actions per risk level (Low/Medium/High)
- Color-coded risk indicators: green (Low), orange (Medium), red (High)
- Sections appear only after assessment is completed
- Admin section: view all submitted assessments, patient list, aggregate stats, risk distribution chart
- Medical-themed UI with relevant health imagery, clean layout, fully responsive

### Modify
- None (new project)

### Remove
- None

## Implementation Plan

**Backend (Motoko)**
- Data model: PatientAssessment { id, age, bmi, systolicBP, diastolicBP, glucose, riskLevel, timestamp, patientName }
- Store assessments in stable array/map
- Endpoints:
  - submitAssessment(input) → returns RiskResult with level + metric scores
  - getAssessments() → returns all assessments (admin)
  - getRiskStats() → returns aggregate counts per risk level
  - deleteAssessment(id)
- Risk calculation logic on backend: thresholds per metric → weighted risk score → Low/Medium/High

**Frontend**
- Landing/hero section with medical imagery and CTA
- Assessment form page with real-time validation
- Results page (same page, shown after submit):
  - Risk level badge (color-coded)
  - Metric contribution bar chart (Recharts)
  - AI Risk Explanation auto-generated from values
  - Recommended Actions section
- Admin dashboard (separate route /admin):
  - Patient assessment table
  - Aggregate risk distribution pie chart
  - Summary stats cards
  - Delete assessment capability
- Navigation between Patient view and Admin view
- Fully responsive, medical-themed design
