import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Clock, Target, ChevronRight, ChartBar as BarChart3, BookOpen, Code as Code2, Briefcase, MessageSquare, Calculator, Brain, Globe, Star, Search, Plus } from "lucide-react"
import DashboardHeader from "@/components/DashboardHeader"

const categoryIcons: Record<string, React.ReactNode> = {
  "Software Engineering": <Code2 className="h-4 w-4" />,
  "Product Management": <Briefcase className="h-4 w-4" />,
  "Data Science": <BarChart3 className="h-4 w-4" />,
  "Behavioral": <MessageSquare className="h-4 w-4" />,
  "Finance": <Calculator className="h-4 w-4" />,
  "General": <Brain className="h-4 w-4" />,
  "Language": <Globe className="h-4 w-4" />,
}

const categoryColors: Record<string, string> = {
  "Software Engineering": "bg-primary",
  "Product Management": "bg-[oklch(0.75_0.183_84)]",
  "Data Science": "bg-[oklch(0.6_0.118_184.704)]",
  "Behavioral": "bg-[oklch(0.645_0.2_142)]",
  "Finance": "bg-[oklch(0.627_0.265_303.9)]",
  "General": "bg-[oklch(0.769_0.188_70.08)]",
  "Language": "bg-[oklch(0.828_0.189_84.429)]",
}

const mockSessions = [
  {
    id: "s1",
    category: "Software Engineering",
    role: "Senior Frontend Engineer",
    company: "Google",
    difficulty: "Senior",
    language: "English",
    score: 82,
    questions: 5,
    duration: "22 min",
    date: "May 4, 2026",
    status: "completed" as const,
  },
  {
    id: "s2",
    category: "Behavioral",
    role: "Engineering Manager",
    company: "Meta",
    difficulty: "Senior",
    language: "English",
    score: 74,
    questions: 4,
    duration: "18 min",
    date: "May 2, 2026",
    status: "completed" as const,
  },
  {
    id: "s3",
    category: "Software Engineering",
    role: "Backend Engineer",
    company: "Stripe",
    difficulty: "Mid",
    language: "English",
    score: 91,
    questions: 5,
    duration: "24 min",
    date: "Apr 30, 2026",
    status: "completed" as const,
  },
  {
    id: "s4",
    category: "Product Management",
    role: "Product Manager",
    company: "Airbnb",
    difficulty: "Senior",
    language: "English",
    score: 68,
    questions: 4,
    duration: "20 min",
    date: "Apr 28, 2026",
    status: "completed" as const,
  },
  {
    id: "s5",
    category: "Data Science",
    role: "ML Engineer",
    company: "OpenAI",
    difficulty: "Staff",
    language: "English",
    score: 79,
    questions: 5,
    duration: "26 min",
    date: "Apr 25, 2026",
    status: "completed" as const,
  },
  {
    id: "s6",
    category: "Behavioral",
    role: "Software Engineer",
    company: "Amazon",
    difficulty: "Mid",
    language: "English",
    score: 85,
    questions: 5,
    duration: "19 min",
    date: "Apr 22, 2026",
    status: "completed" as const,
  },
]

const trendData = [
  { date: "Apr 22", score: 85 },
  { date: "Apr 25", score: 79 },
  { date: "Apr 28", score: 68 },
  { date: "Apr 30", score: 91 },
  { date: "May 2", score: 74 },
  { date: "May 4", score: 82 },
]

const statCards = [
  {
    label: "Total Sessions",
    value: "6",
    sub: "+2 this week",
    trend: "up" as "up" | "down" | "neutral",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    label: "Avg Score",
    value: "80",
    sub: "+5 from last week",
    trend: "up" as "up" | "down" | "neutral",
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: "Best Score",
    value: "91",
    sub: "Backend Engineer",
    trend: "up" as "up" | "down" | "neutral",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Total Time",
    value: "2h 9m",
    sub: "Across all sessions",
    trend: "neutral" as "up" | "down" | "neutral",
    icon: <Clock className="h-5 w-5" />,
  },
]

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-[oklch(0.645_0.2_142)]/15 text-[oklch(0.645_0.2_142)] border-[oklch(0.645_0.2_142)]/30"
      : score >= 60
        ? "bg-primary/15 text-primary border-primary/30"
        : "bg-[oklch(0.75_0.183_84)]/15 text-[oklch(0.75_0.183_84)] border-[oklch(0.75_0.183_84)]/30"
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold ${color}`}>
      {score}
    </span>
  )
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  const filtered = mockSessions.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = categoryFilter === "all" || s.category === categoryFilter
    const matchDifficulty = difficultyFilter === "all" || s.difficulty === difficultyFilter
    return matchSearch && matchCategory && matchDifficulty
  })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track your mock interview progress
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {stat.icon}
                </div>
                {stat.trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-[oklch(0.645_0.2_142)]" />
                )}
                {stat.trend === "down" && (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5 opacity-70">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-foreground">Score Trend</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 sessions</p>
            </div>
            <Badge variant="outline" className="text-xs gap-1">
              <TrendingUp className="h-3 w-3 text-[oklch(0.645_0.2_142)]" />
              +5 avg improvement
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ fill: "var(--primary)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Session history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Session History</h2>
            <span className="text-xs text-muted-foreground">{filtered.length} sessions</span>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by role, company, or category..."
                className="pl-9 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-card">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                <SelectItem value="Product Management">Product Management</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Behavioral">Behavioral</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-card">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Session cards */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No sessions found</p>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {searchQuery || categoryFilter !== "all" || difficultyFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start your first mock interview session"}
              </p>
              <Button asChild>
                <Link to="/session/configure">
                  <Plus className="h-4 w-4 mr-2" />
                  New Session
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((session, i) => (
                <div key={session.id}>
                  {i > 0 && <Separator className="my-3" />}
                  <Link to={`/session/results/${session.id}`} className="block group">
                    <div className="flex items-center gap-4 rounded-xl border border-transparent hover:border-border hover:bg-card p-3 -mx-3 transition-all">
                      {/* Category color strip + icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${categoryColors[session.category] ?? "bg-primary"} text-white`}
                      >
                        {categoryIcons[session.category] ?? <Brain className="h-4 w-4" />}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{session.role}</span>
                          {session.company && (
                            <span className="text-xs text-muted-foreground">@ {session.company}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs py-0">
                            {session.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs py-0">
                            {session.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {session.questions} questions · {session.duration}
                          </span>
                        </div>
                      </div>

                      {/* Score + date + arrow */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-muted-foreground">{session.date}</div>
                        </div>
                        <ScoreBadge score={session.score} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium text-foreground mb-1">Ready to improve?</p>
          <p className="text-xs text-muted-foreground mb-4">
            Practice makes perfect. Start another session to keep improving.
          </p>
          <Button className="gap-2" asChild>
            <Link to="/session/configure">
              <Plus className="h-4 w-4" />
              Start New Session
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
