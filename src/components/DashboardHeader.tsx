import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Mic, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

interface DashboardHeaderProps {
  hideLogout?: boolean
}

export default function DashboardHeader({ hideLogout }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleLogout = () => {
    clearAuth()
    navigate("/login", { replace: true })
  }

  const isDashboard = location.pathname === "/dashboard"
  const isPractice = location.pathname.startsWith("/session")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold">MockAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className={isDashboard ? "text-primary font-medium" : "text-muted-foreground"} asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="sm" className={isPractice ? "text-primary font-medium" : "text-muted-foreground"} asChild>
            <Link to="/session/configure">Practice</Link>
          </Button>
        </nav>

        {!hideLogout && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </header>
  )
}
