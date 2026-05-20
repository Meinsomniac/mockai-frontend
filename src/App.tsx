import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GuestRoute from "@/components/GuestRoute";
import OnboardingRoute from "@/components/OnboardingRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SetPasswordPage from "@/pages/SetPasswordPage";
import ConfigurePage from "@/pages/ConfigurePage";
import SessionPage from "@/pages/SessionPage";
import ResultsPage from "@/pages/ResultsPage";
import DashboardPage from "@/pages/DashboardPage";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/set-password" element={<OnboardingRoute><SetPasswordPage /></OnboardingRoute>} />
        <Route path="/session/configure" element={<ProtectedRoute><ConfigurePage /></ProtectedRoute>} />
        <Route path="/session/:id" element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
        <Route path="/session/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
