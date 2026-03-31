import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AIAssistantPage from "./components/AIAssistantPage";
import AboutPage from "./components/AboutPage";
import AppLayout from "./components/AppLayout";
import ContactPage from "./components/ContactPage";
import DashboardNew from "./components/DashboardNew";
import DisclaimerPage from "./components/DisclaimerPage";
import FinancialHealthPage from "./components/FinancialHealthPage";
import InsurancePage from "./components/InsurancePage";
import InvestmentsPage from "./components/InvestmentsPage";
import LandingPageNew from "./components/LandingPageNew";
import LoansPage from "./components/LoansPage";
import LoginPageNew from "./components/LoginPageNew";
import PlanningPage from "./components/PlanningPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import ProfilePage from "./components/ProfilePage";
import SignupPage from "./components/SignupPage";
import TaxPage from "./components/TaxPage";
import TermsPage from "./components/TermsPage";
import ToolsHub from "./components/ToolsHub";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("finhealth_logged_in") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-bg">
        <Routes>
          <Route path="/" element={<LandingPageNew />} />
          <Route path="/login" element={<LoginPageNew />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardNew />} />
            <Route path="financial-health" element={<FinancialHealthPage />} />
            <Route path="investments" element={<InvestmentsPage />} />
            <Route path="insurance" element={<InsurancePage />} />
            <Route path="planning" element={<PlanningPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="tax" element={<TaxPage />} />
            <Route path="ai" element={<AIAssistantPage />} />
            <Route path="tools" element={<ToolsHub />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" theme="dark" />
      </div>
    </BrowserRouter>
  );
}
