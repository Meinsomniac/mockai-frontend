import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Mic, ArrowLeft, RotateCcw, Plus, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Volume2, Clock, Gauge, MessageSquare, Brain, Activity, Star, Target } from "lucide-react"
import { useGetSessionResults } from "@/api"
import type { DetailedFeedback } from "@/types/session.types"

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
  q: DetailedFeedback
  expanded: boolean
  onToggle: () => void
}) {
  const statusConfig = {
    true: {
      icon: <CheckCircle2 className="h-5 w-5 text-[oklch(0.645_0.2_142)]" />,
      label: "Strong Answer",
      badge: "bg-[oklch(0.645_0.2_142)]/15 text-[oklch(0.645_0.2_142)] border-[oklch(0.645_0.2_142)]/30",
      border: "border-l-[oklch(0.645_0.2_142)]",
    },
    false: {
      icon: <AlertCircle className="h-5 w-5 text-[oklch(0.75_0.183_84)]" />,
      label: "Needs Work",
      badge: "bg-[oklch(0.75_0.183_84)]/15 text-[oklch(0.75_0.183_84)] border-[oklch(0.75_0.183_84)]/30",
      border: "border-l-[oklch(0.75_0.183_84)]",
    },
  }

  const cfg = statusConfig[q.isCorrect ? "true" : "false"]

  return (
    <div className={`rounded-xl border border-border border-l-4 ${cfg.border} bg-card overflow-hidden`}>
      <button className="w-full p-5 text-left" onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {cfg.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">Q{q.questionNumber}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground line-clamp-2">{q.question}</p>
            </div>
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
            <p className="text-sm text-foreground/80 leading-relaxed">{q.explanation}</p>
          </div>

          {q.alternativeApproach && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Better Approach
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">{q.alternativeApproach}</p>
            </div>
          )}

          {q.correctAnswer && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Ideal Answer
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 rounded-lg p-3">
                {q.correctAnswer}
              </p>
            </div>
          )}
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

function ResultsLoadingState(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">Loading your results...</p>
      </div>
    </div>
  )
}

function ResultsErrorState({ onRetry }: { onRetry: () => void }): React.ReactElement {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="h-12 w-12 rounded-full bg-destructive/15 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Results Not Available</h2>
        <p className="text-sm text-muted-foreground">
          The results for this session could not be loaded. The session may still be processing or no results were generated.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage(): React.ReactElement {
  const { id: sessionId } = useParams<{ id: string }>()
  const { data, isLoading, isError, refetch } = useGetSessionResults(sessionId || "")
  const [expandedQuestions, setExpandedQuestions] = useState<ExpandedState>({})

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (isLoading) {
    return <ResultsLoadingState />
  }

  if (isError || !data) {
    return <ResultsErrorState onRetry={() => refetch()} />
  }

  const { result: r, session } = data

  const durationMinutes = session.durationActual
    ? Math.floor(session.durationActual / 60)
    : session.duration ?? 0

  const categoryLabel = session.category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase())

  const avgScore = Math.round(
    (r.technicalScore + r.communicationScore + r.confidenceScore) / 3
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
              {categoryLabel}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {session.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {durationMinutes} min
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
                  {r.detailedFeedback.length} questions answered · {durationMinutes} min · {categoryLabel}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SubScoreBar label="Technical Accuracy" score={r.technicalScore} />
                <SubScoreBar label="Communication" score={r.communicationScore} />
                <SubScoreBar label="Confidence" score={r.confidenceScore} />
                <SubScoreBar label="Professionalism" score={r.professionalismScore} />
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex md:flex-col gap-4 md:gap-3 shrink-0">
              {[
                { label: "Questions", value: r.detailedFeedback.length.toString() },
                {
                  label: "Correct",
                  value: r.detailedFeedback.filter((q) => q.isCorrect).length.toString(),
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
                  {r.areasOfImprovement.map((s, i) => (
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
                {r.detailedFeedback.map((q) => (
                  <div key={q.questionNumber} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">{q.questionNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{q.question}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {q.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-[oklch(0.645_0.2_142)]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-[oklch(0.75_0.183_84)]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ANSWERS TAB */}
          <TabsContent value="answers" className="mt-6 space-y-4">
            {r.detailedFeedback.map((q) => (
              <QuestionCard
                key={q.questionNumber}
                q={q}
                expanded={!!expandedQuestions[q.questionNumber]}
                onToggle={() => toggleQuestion(q.questionNumber)}
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
                score={r.clarityScore}
                sublabel={r.clarityScore >= 80 ? "Excellent" : r.clarityScore >= 60 ? "Good" : "Needs Work"}
              />
              <SpeechScoreCard
                icon={<Gauge className="h-4 w-4" />}
                label="Confidence"
                score={r.speechConfidenceScore}
                sublabel={r.speechConfidenceScore >= 80 ? "Strong" : r.speechConfidenceScore >= 60 ? "Moderate" : "Low"}
              />
              <SpeechScoreCard
                icon={<Brain className="h-4 w-4" />}
                label="Expression"
                score={r.expressionScore}
                sublabel={r.expressionScore >= 80 ? "Engaging" : r.expressionScore >= 60 ? "Natural" : "Monotone"}
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
                        {r.linguisticMetrics?.wordsPerMinute ?? 0} wpm
                      </span>
                      <p className="text-xs text-[oklch(0.645_0.2_142)]">
                        {r.paceScore >= 80 ? "Ideal pace" : "Review pace"}
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
                      {r.acousticMetrics?.avgPauseDuration?.toFixed(1) ?? 0}s
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
                        {r.linguisticMetrics?.fillerWordCount ?? 0} total
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {(r.linguisticMetrics?.fillerWordRate ?? 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {(r.linguisticMetrics?.fillerWordsUsed?.length ?? 0) > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Top Filler Words
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {r.linguisticMetrics?.fillerWordsUsed.map((word) => (
                        <div
                          key={word}
                          className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1"
                        >
                          <span className="text-sm font-medium text-foreground">"{word}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tone profile from speechFeedback */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Speech Analysis</h3>
                {r.speechFeedback?.toneAnalysis && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Detected Tone</span>
                      <span className="text-sm font-medium text-foreground capitalize">
                        {r.speechFeedback.toneAnalysis.detectedTone}
                      </span>
                    </div>
                    <Separator />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {r.speechFeedback.toneAnalysis.description}
                    </p>
                  </div>
                )}

                {r.speechFeedback?.pacingFeedback && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pacing</span>
                      <span className="text-sm font-medium text-foreground capitalize">
                        {r.speechFeedback.pacingFeedback.classification}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.speechFeedback.pacingFeedback.wpmRating}</p>
                    <p className="text-xs text-foreground/80">{r.speechFeedback.pacingFeedback.recommendation}</p>
                  </div>
                )}

                {(r.speechFeedback?.improvementTips?.length ?? 0) > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Improvement Tips
                    </p>
                    <ul className="space-y-2">
                      {r.speechFeedback?.improvementTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TRANSCRIPT TAB */}
          <TabsContent value="transcript" className="mt-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Full Session Transcript</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.detailedFeedback.length} exchanges · {durationMinutes} min
                </p>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-6">
                  {session.transcript?.map((item, i) => (
                    <div key={i}>
                      {i > 0 && <Separator className="mb-6" />}
                      <div className="flex gap-3">
                        {item.role === "ai" ? (
                          <>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
                              <Mic className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-foreground">AI Interviewer</span>
                              </div>
                              <div className="rounded-xl rounded-tl-none bg-muted/50 border border-border p-3">
                                <p className="text-sm text-foreground">{item.content}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex gap-3 flex-row-reverse w-full">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary border border-border">
                              <span className="text-xs font-semibold text-foreground">You</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 justify-end mb-1">
                                <span className="text-xs font-semibold text-foreground">You</span>
                              </div>
                              <div className="rounded-xl rounded-tr-none bg-primary/10 border border-primary/20 p-3">
                                <p className="text-sm text-foreground">{item.content}</p>
                              </div>
                            </div>
                          </div>
                        )}
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
