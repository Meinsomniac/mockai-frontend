import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface OnboardingRouteProps {
  children: React.ReactNode;
}

export default function OnboardingRoute({ children }: OnboardingRouteProps) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isOnBoarded) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
