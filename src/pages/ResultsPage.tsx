import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Mic, ArrowLeft, RotateCcw, Plus, CircleCheck as CheckCircle2, Circle as XCircle, CircleAlert as AlertCircle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Volume2, Clock, Gauge, MessageSquare, Brain, Activity, Star, Target } from "lucide-react"

// Mock results data
const mockResults = {
  sessionId: "demo-session",
  category: "Software Engineering",
  difficulty: "Senior",
  duration: "18 min",
  completedAt: "May 4, 2026",
  overallScore: 76,
  subscores: {
    technicalAccuracy: 82,
    communication: 71,
    problemSolving: 80,
    confidence: 68,
  },
  strengths: [
    "Clear explanation of system design trade-offs",
    "Good use of concrete examples to illustrate concepts",
    "Structured problem-solving approach",
  ],
  improvements: [
    "Reduce filler words (um, uh) — detected 14 times",
    "Speak more confidently — pitch variance was low",
    "Expand on edge case handling in answers",
  ],
  questions: [
    {
      id: 1,
      question: "Can you walk me through how you would design a URL shortening service like bit.ly?",
      userAnswer:
        "I would design it with a few key components. First, a hash generation service to create short codes from long URLs. I'd use a base62 encoding scheme with 6-7 characters giving us billions of unique URLs. For storage, a distributed key-value store like Redis for caching hot URLs and a relational database for persistence. The write path would hash the URL, store it, and return the short code. The read path would look up in cache first, then the DB. For scale, I'd use consistent hashing to distribute load across multiple nodes.",
      score: 85,
      status: "correct" as const,
      feedback:
        "Excellent response. You correctly identified the core components and explained the trade-offs between caching and persistence. Your mention of consistent hashing shows strong distributed systems knowledge. To improve: discuss collision handling and URL expiration strategies.",
      keyPoints: [
        { point: "Hash generation strategy", met: true },
        { point: "Storage layer design", met: true },
        { point: "Read/write path optimization", met: true },
        { point: "Collision handling", met: false },
        { point: "URL expiration / TTL", met: false },
      ],
      duration: "4m 12s",
    },
    {
      id: 2,
      question: "How would you approach debugging a memory leak in a production Node.js application?",
      userAnswer:
        "Um, I would first, uh, start by monitoring memory usage over time to confirm the leak. Then I'd use Node's built-in heap profiler or a tool like clinic.js to take heap snapshots. By comparing snapshots over time I can identify which objects are growing. Common causes are event listener accumulation, closures holding references, or global variable misuse. Once identified I'd patch and deploy with feature flags.",
      score: 72,
      status: "partial" as const,
      feedback:
        "Good foundational knowledge but the answer lacked depth on specific tooling and the systematic debugging process. You mentioned clinic.js which is correct, but didn't discuss Chrome DevTools remote debugging for production, or heap diff analysis techniques. The mention of feature flags for deployment was a nice touch.",
      keyPoints: [
        { point: "Memory monitoring approach", met: true },
        { point: "Heap snapshot tooling", met: true },
        { point: "Common leak patterns", met: true },
        { point: "Chrome DevTools remote debugging", met: false },
        { point: "Heap diff analysis", met: false },
      ],
      duration: "3m 45s",
    },
    {
      id: 3,
      question: "Explain the difference between horizontal and vertical scaling, and when you'd choose each.",
      userAnswer:
        "Horizontal scaling means adding more machines to your pool, while vertical scaling means adding more resources like CPU or RAM to an existing machine. I'd choose vertical scaling for stateful applications that are hard to distribute, like some databases in early stages. Horizontal scaling is better for stateless services, gives better fault tolerance, and is more cost-effective at scale. Modern cloud architecture favors horizontal scaling with auto-scaling groups.",
      score: 88,
      status: "correct" as const,
      feedback:
        "Strong answer with clear definitions and practical decision criteria. Your mention of statefulness as a deciding factor is exactly right. Good awareness of cloud-native patterns. Minor improvement: could mention specific challenges of horizontal scaling like data consistency and session management.",
      keyPoints: [
        { point: "Clear distinction between approaches", met: true },
        { point: "Stateful vs stateless consideration", met: true },
        { point: "Cost and fault tolerance", met: true },
        { point: "Cloud-native patterns", met: true },
        { point: "Data consistency challenges", met: false },
      ],
      duration: "3m 02s",
    },
  ],
  speechAnalysis: {
    fillerWords: { count: 14, rate: "2.3/min", trend: "down" as const },
    speakingPace: { wpm: 142, status: "good" as const, ideal: "130-160 wpm" },
    pausePattern: { avgPause: "1.2s", longPauses: 3, status: "good" as const },
    clarity: { score: 78, label: "Clear" },
    confidence: { score: 68, label: "Moderate" },
    vocabulary: { score: 82, label: "Strong" },
    topFillerWords: [
      { word: "um", count: 8 },
      { word: "uh", count: 4 },
      { word: "like", count: 2 },
    ],
    toneProfile: {
      energy: 62,
      enthusiasm: 58,
      authority: 71,
      friendliness: 74,
    },
    improvementTips: [
      "Practice pausing instead of using filler words — silence is powerful",
      "Vary your speaking pace to emphasize key points",
      "Use more assertive language: say 'I would' instead of 'I think I would'",
      "Start answers with a direct statement before elaborating",
    ],
  },
}

type ExpandedState = Record<number, boolean>

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color =
    score >= 80
      ? "oklch(0.645 0.2 142)"
      : score >= 60
        ? "oklch(0.585 0.233 277)"
        : "oklch(0.75 0.183 84)"

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

function SubScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80
      ? "bg-[oklch(0.645_0.2_142)]"
      : score >= 60
        ? "bg-primary"
        : "bg-[oklch(0.75_0.183_84)]"

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{score}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function QuestionCard({
  q,
  expanded,
  onToggle,
}: {
  q: (typeof mockResults.questions)[0]
  expanded: boolean
  onToggle: () => void
}) {
  const statusConfig = {
    correct: {
      icon: <CheckCircle2 className="h-5 w-5 text-[oklch(0.645_0.2_142)]" />,
      label: "Strong Answer",
      badge: "bg-[oklch(0.645_0.2_142)]/15 text-[oklch(0.645_0.2_142)] border-[oklch(0.645_0.2_142)]/30",
      border: "border-l-[oklch(0.645_0.2_142)]",
    },
    partial: {
      icon: <AlertCircle className="h-5 w-5 text-[oklch(0.75_0.183_84)]" />,
      label: "Partial Credit",
      badge: "bg-[oklch(0.75_0.183_84)]/15 text-[oklch(0.75_0.183_84)] border-[oklch(0.75_0.183_84)]/30",
      border: "border-l-[oklch(0.75_0.183_84)]",
    },
    incorrect: {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      label: "Needs Work",
      badge: "bg-destructive/15 text-destructive border-destructive/30",
      border: "border-l-destructive",
    },
  }

  const cfg = statusConfig[q.status]

  return (
    <div className={`rounded-xl border border-border border-l-4 ${cfg.border} bg-card overflow-hidden`}>
      <button className="w-full p-5 text-left" onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {cfg.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">Q{q.id}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                  {cfg.label}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{q.duration}</span>
              </div>
              <p className="text-sm font-medium text-foreground line-clamp-2">{q.question}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">{q.score}</div>
              <div className="text-xs text-muted-foreground">score</div>
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your Answer
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 rounded-lg p-3">
              {q.userAnswer}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              AI Feedback
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">{q.feedback}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Key Points Coverage
            </p>
            <div className="space-y-2">
              {q.keyPoints.map((kp, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {kp.met ? (
                    <CheckCircle2 className="h-4 w-4 text-[oklch(0.645_0.2_142)] shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm ${kp.met ? "text-foreground" : "text-muted-foreground"}`}>
                    {kp.point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SpeechScoreCard({
  icon,
  label,
  score,
  sublabel,
}: {
  icon: React.ReactNode
  label: string
  score: number
  sublabel: string
}) {
  const color =
    score >= 80
      ? "text-[oklch(0.645_0.2_142)]"
      : score >= 60
        ? "text-primary"
        : "text-[oklch(0.75_0.183_84)]"

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">{icon}</div>
        <span className={`text-2xl font-bold ${color}`}>{score}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full bg-current ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default function ResultsPage() {
  useParams()
  const [expandedQuestions, setExpandedQuestions] = useState<ExpandedState>({})
  const r = mockResults

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const avgScore = Math.round(
    (r.subscores.technicalAccuracy +
      r.subscores.communication +
      r.subscores.problemSolving +
      r.subscores.confidence) /
      4
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
                <Mic className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">MockAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {r.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {r.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {r.completedAt}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link to="/session/configure">
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </Link>
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link to="/session/configure">
                <Plus className="h-3.5 w-3.5" />
                New Session
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Score hero */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Ring */}
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={r.overallScore} size={160} />
              <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
            </div>

            {/* Sub scores */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">Session Complete</h2>
                <p className="text-sm text-muted-foreground">
                  {r.questions.length} questions answered · {r.duration} · {r.category}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SubScoreBar label="Technical Accuracy" score={r.subscores.technicalAccuracy} />
                <SubScoreBar label="Communication" score={r.subscores.communication} />
                <SubScoreBar label="Problem Solving" score={r.subscores.problemSolving} />
                <SubScoreBar label="Confidence" score={r.subscores.confidence} />
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex md:flex-col gap-4 md:gap-3 shrink-0">
              {[
                { label: "Questions", value: r.questions.length.toString() },
                {
                  label: "Correct",
                  value: r.questions.filter((q) => q.status === "correct").length.toString(),
                },
                { label: "Avg Score", value: avgScore.toString() },
              ].map((stat) => (
                <div key={stat.label} className="text-center md:text-right">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="answers" className="text-xs sm:text-sm">
              Answers
            </TabsTrigger>
            <TabsTrigger value="speech" className="text-xs sm:text-sm">
              Speech
            </TabsTrigger>
            <TabsTrigger value="transcript" className="text-xs sm:text-sm">
              Transcript
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.645_0.2_142)]/15">
                    <Star className="h-4 w-4 text-[oklch(0.645_0.2_142)]" />
                  </div>
                  <h3 className="font-semibold text-foreground">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {r.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[oklch(0.645_0.2_142)] mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/80">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {r.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-[oklch(0.75_0.183_84)] mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/80">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question summary */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Question Performance</h3>
              <div className="space-y-3">
                {r.questions.map((q) => (
                  <div key={q.id} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">{q.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{q.question}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${q.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8 text-right">
                        {q.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ANSWERS TAB */}
          <TabsContent value="answers" className="mt-6 space-y-4">
            {r.questions.map((q) => (
              <QuestionCard
                key={q.id}
                q={q}
                expanded={!!expandedQuestions[q.id]}
                onToggle={() => toggleQuestion(q.id)}
              />
            ))}
          </TabsContent>

          {/* SPEECH TAB */}
          <TabsContent value="speech" className="mt-6 space-y-6">
            {/* Score grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SpeechScoreCard
                icon={<Volume2 className="h-4 w-4" />}
                label="Clarity"
                score={r.speechAnalysis.clarity.score}
                sublabel={r.speechAnalysis.clarity.label}
              />
              <SpeechScoreCard
                icon={<Gauge className="h-4 w-4" />}
                label="Confidence"
                score={r.speechAnalysis.confidence.score}
                sublabel={r.speechAnalysis.confidence.label}
              />
              <SpeechScoreCard
                icon={<Brain className="h-4 w-4" />}
                label="Vocabulary"
                score={r.speechAnalysis.vocabulary.score}
                sublabel={r.speechAnalysis.vocabulary.label}
              />
            </div>

            {/* Metrics detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Speaking Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Speaking Pace
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">
                        {r.speechAnalysis.speakingPace.wpm} wpm
                      </span>
                      <p className="text-xs text-[oklch(0.645_0.2_142)]">
                        {r.speechAnalysis.speakingPace.ideal}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Avg Pause Length
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {r.speechAnalysis.pausePattern.avgPause}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      Filler Words
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">
                        {r.speechAnalysis.fillerWords.count} total
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {r.speechAnalysis.fillerWords.rate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Top Filler Words
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {r.speechAnalysis.topFillerWords.map((fw) => (
                      <div
                        key={fw.word}
                        className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1"
                      >
                        <span className="text-sm font-medium text-foreground">"{fw.word}"</span>
                        <span className="text-xs text-muted-foreground">×{fw.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tone profile */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Tone Profile</h3>
                <div className="space-y-3">
                  {Object.entries(r.speechAnalysis.toneProfile).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <div className="flex items-center gap-1">
                          {val >= 70 ? (
                            <TrendingUp className="h-3 w-3 text-[oklch(0.645_0.2_142)]" />
                          ) : val >= 50 ? (
                            <Minus className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          )}
                          <span className="font-medium text-foreground">{val}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Improvement Tips
                  </p>
                  <ul className="space-y-2">
                    {r.speechAnalysis.improvementTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TRANSCRIPT TAB */}
          <TabsContent value="transcript" className="mt-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Full Session Transcript</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.questions.length} exchanges · {r.duration}
                </p>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-6">
                  {r.questions.map((q, i) => (
                    <div key={q.id}>
                      {i > 0 && <Separator className="mb-6" />}
                      <div className="space-y-4">
                        {/* AI message */}
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
                            <Mic className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-foreground">AI Interviewer</span>
                              <span className="text-xs text-muted-foreground">Q{q.id}</span>
                            </div>
                            <div className="rounded-xl rounded-tl-none bg-muted/50 border border-border p-3">
                              <p className="text-sm text-foreground">{q.question}</p>
                            </div>
                          </div>
                        </div>

                        {/* User message */}
                        <div className="flex gap-3 flex-row-reverse">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary border border-border">
                            <span className="text-xs font-semibold text-foreground">You</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <span className="text-xs text-muted-foreground">{q.duration}</span>
                              <span className="text-xs font-semibold text-foreground">You</span>
                            </div>
                            <div className="rounded-xl rounded-tr-none bg-primary/10 border border-primary/20 p-3">
                              <p className="text-sm text-foreground">{q.userAnswer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-8">
          <Button variant="outline" className="flex-1 gap-2" asChild>
            <Link to="/session/configure">
              <RotateCcw className="h-4 w-4" />
              Retry This Session
            </Link>
          </Button>
          <Button className="flex-1 gap-2" asChild>
            <Link to="/session/configure">
              <Plus className="h-4 w-4" />
              Start New Session
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 gap-2" asChild>
            <Link to="/dashboard">View History</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
