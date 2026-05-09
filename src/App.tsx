import { Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ConfigurePage from "@/pages/ConfigurePage"
import SessionPage from "@/pages/SessionPage"
import ResultsPage from "@/pages/ResultsPage"
import DashboardPage from "@/pages/DashboardPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/session/configure" element={<ConfigurePage />} />
      <Route path="/session/:id" element={<SessionPage />} />
      <Route path="/session/results/:id" element={<ResultsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}
