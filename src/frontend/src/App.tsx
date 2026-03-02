import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { PatientAssessmentPage } from "./pages/PatientAssessmentPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<PatientAssessmentPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
