import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Bot, User, Square, PanelRight, Volume2, Loader as Loader2, CircleCheck as CheckCircle2, SkipForward, Keyboard, X, Clock, TriangleAlert as AlertTriangle } from "lucide-react"
import { useGetSession, useEndSession } from "@/api"

type Phase = "ai_thinking" | "ai_speaking" | "user_recording" | "processing" | "complete"

interface Message {
  role: "ai" | "user"
  content: string
}

const DEMO_CONVERSATION: { q: string; phase: Phase }[] = [
  { q: "Welcome! Let's begin. Question 1: Can you walk me through your experience with React and how you've used it in production?", phase: "ai_speaking" },
  { q: "Question 2: How would you approach optimizing a React application that's experiencing performance issues?", phase: "ai_speaking" },
  { q: "Question 3: Explain the concept of React's reconciliation algorithm and why it matters for performance.", phase: "ai_speaking" },
]

export default function SessionPage() {
  const navigate = useNavigate()
  const { id: sessionId } = useParams<{ id: string }>()
  const { data: sessionData, isLoading: sessionLoading } = useGetSession(sessionId || "")
  const endSessionMutation = useEndSession()

  const [phase, setPhase] = useState<Phase>("ai_thinking")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [transcript, setTranscript] = useState<Message[]>([])
  const [textAnswer, setTextAnswer] = useState("")
  const [showTranscript, setShowTranscript] = useState(true)
  const [recordingTime, setRecordingTime] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [sttPreview, setSttPreview] = useState("")
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const session = sessionData?.session

  useEffect(() => {
    sessionInterval.current = setInterval(() => setSessionTime((t) => t + 1), 1000)
    if (session) {
      setTimeout(() => {
        const q = DEMO_CONVERSATION[0].q
        setCurrentQuestion(q)
        setTranscript([{ role: "ai", content: q }])
        setPhase("ai_speaking")
        setTimeout(() => setPhase("user_recording"), 2000)
      }, 1500)
    }

    return () => {
      if (sessionInterval.current) clearInterval(sessionInterval.current)
    }
  }, [session])

  useEffect(() => {
    if (phase === "user_recording") {
      setRecordingTime(0)
      recordingInterval.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    } else {
      if (recordingInterval.current) clearInterval(recordingInterval.current)
    }
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current)
    }
  }, [phase])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  const handleSubmit = () => {
    const answer = textAnswer || sttPreview || "I believe React's architecture provides..."
    setTranscript((prev) => [...prev, { role: "user", content: answer }])
    setTextAnswer("")
    setSttPreview("")
    setPhase("processing")

    setTimeout(() => {
      const nextIdx = questionIndex + 1
      if (nextIdx >= DEMO_CONVERSATION.length) {
        setPhase("complete")
      } else {
        const q = DEMO_CONVERSATION[nextIdx].q
        setQuestionIndex(nextIdx)
        setCurrentQuestion(q)
        setTranscript((prev) => [...prev, { role: "ai", content: q }])
        setPhase("ai_speaking")
        setTimeout(() => setPhase("user_recording"), 2000)
      }
    }, 1500)
  }

  const handleEnd = async () => {
    setPhase("complete")
    if (sessionId) {
      try {
        await endSessionMutation.mutateAsync(sessionId)
      } catch (err) {
        console.error("Failed to end session:", err)
      }
    }
    setTimeout(() => navigate(`/session/results/${sessionId}`), 1500)
  }

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {sessionLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading session...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Session Topbar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/80 px-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
              <Mic className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold">MockAI</span>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline" className="border-primary/30 text-xs text-primary capitalize">
            {session?.category?.replace("_", " ") || "Interview"}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">{session?.difficulty || "Intermediate"}</Badge>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bot className="h-3.5 w-3.5" />
            AI Interviewer
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-mono text-sm font-semibold">{formatTime(sessionTime)}</span>
          </div>
          <span className="text-xs text-muted-foreground">Q {questionIndex + 1} / {DEMO_CONVERSATION.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranscript(!showTranscript)}
            className="gap-1.5 text-xs"
          >
            <PanelRight className="h-3.5 w-3.5" />
            Transcript
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEnd}
            className="gap-1.5 text-xs text-destructive hover:text-destructive"
          >
            <Square className="h-3.5 w-3.5" />
            End Session
          </Button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* AI Panel */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
          {/* Avatar */}
          <div className="relative flex flex-col items-center">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)] ${
                phase === "ai_speaking" ? "pulse-ring ring-4 ring-primary/20" : "ring-4 ring-primary/10"
              }`}
            >
              <Bot className="h-12 w-12 text-white" />
              {phase === "ai_speaking" && (
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border">
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </div>

            {/* Waveform */}
            {phase === "ai_speaking" && (
              <div className="mt-3 flex items-end gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="waveform-bar w-1.5 rounded-full bg-primary"
                    style={{ height: `${[8, 18, 12, 24, 14, 20, 10][i]}px`, animationDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>
            )}

            {/* Bounce dots for thinking */}
            {phase === "ai_thinking" && (
              <div className="mt-3 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bounce-dot h-2 w-2 rounded-full bg-primary"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            )}

            {phase === "processing" && (
              <Loader2 className="mt-3 h-5 w-5 animate-spin text-primary" />
            )}
          </div>

          {/* Phase indicator */}
          <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${
            phase === "ai_thinking" ? "bg-muted text-muted-foreground" :
            phase === "ai_speaking" ? "bg-primary/15 text-primary" :
            phase === "user_recording" ? "bg-destructive/15 text-destructive" :
            "bg-muted text-muted-foreground"
          }`}>
            {phase === "ai_thinking" && <><Loader2 className="h-3 w-3 animate-spin" /> Thinking...</>}
            {phase === "ai_speaking" && <><Volume2 className="h-3 w-3" /> Speaking...</>}
            {phase === "user_recording" && <><div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />&nbsp;Listening...</>}
            {phase === "processing" && <><Loader2 className="h-3 w-3 animate-spin" /> Processing...</>}
            {phase === "complete" && <><CheckCircle2 className="h-3 w-3 text-[oklch(0.645_0.2_142)]" /> Complete</>}
          </div>

          {/* Question card */}
          {currentQuestion && (
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Question {questionIndex + 1}</span>
                {phase === "ai_speaking" && (
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    <Volume2 className="h-3 w-3" /> Stop
                  </Button>
                )}
              </div>
              <Separator className="mb-4" />
              <p className="text-sm leading-relaxed text-foreground">{currentQuestion}</p>
            </div>
          )}
        </div>

        {/* Transcript Panel */}
        {showTranscript && (
          <div className="flex w-80 flex-col border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Transcript</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTranscript(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-4">
                {transcript.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        msg.role === "ai" ? "bg-primary/15" : "bg-muted"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className={`max-w-[200px] ${msg.role === "user" ? "text-right" : ""}`}>
                      <p className="mb-1 text-xs text-muted-foreground">{msg.role === "ai" ? "AI" : "You"}</p>
                      <p className="text-xs leading-relaxed text-foreground">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {phase === "ai_thinking" && (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="bounce-dot h-1.5 w-1.5 rounded-full bg-primary"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {questionIndex} of {DEMO_CONVERSATION.length} questions answered
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Bar */}
      <div
        className={`border-t border-border bg-card/90 px-6 py-4 backdrop-blur-sm transition-opacity ${
          phase !== "user_recording" ? "pointer-events-none opacity-40" : ""
        }`}
      >
        {phase === "user_recording" ? (
          <div className="space-y-3">
            {/* STT preview */}
            <div className="min-h-10 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <p className="font-mono text-xs italic text-muted-foreground">
                {sttPreview || "Listening... (your words appear here)"}
              </p>
            </div>

            {/* Amplitude bars */}
            <div className="flex items-end gap-0.5 h-6">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar flex-1 rounded-sm bg-primary/60"
                  style={{
                    minHeight: "4px",
                    maxHeight: "24px",
                    animationDelay: `${(i % 10) * 40}ms`,
                    animationDuration: `${400 + (i % 5) * 80}ms`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                <span className="text-xs font-medium text-destructive">Recording</span>
                <span className="font-mono text-xs text-muted-foreground">{formatTime(recordingTime)}</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmit} className="gap-1.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Submit Answer
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                  <Keyboard className="h-3.5 w-3.5" /> Type Instead
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-muted-foreground">
                  <SkipForward className="h-3.5 w-3.5" /> Skip
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {phase !== "complete" && (
              <>
                <AlertTriangle className="h-3.5 w-3.5" />
                Wait for the AI to finish...
              </>
            )}
          </div>
        )}
      </div>

      {/* Text fallback input */}
      {false && (
        <div className="border-t border-border bg-card/90 px-6 py-4">
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-[oklch(0.75_0.183_84)]/10 px-3 py-2 text-xs text-[oklch(0.75_0.183_84)]">
            <AlertTriangle className="h-3.5 w-3.5" />
            Voice not supported in this browser. Using text input.
          </div>
          <Textarea placeholder="Type your answer here..." rows={3} className="bg-muted/30" />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={handleSubmit}>Submit Answer</Button>
          </div>
        </div>
      )}

      {/* Complete overlay */}
      {phase === "complete" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-10 text-center shadow-2xl">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[oklch(0.645_0.2_142)]" />
            <h2 className="mb-2 text-xl font-bold text-foreground">Session Complete!</h2>
            <p className="mb-6 text-sm text-muted-foreground">Your answers are being analyzed...</p>
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your performance...
            </div>
            <Button className="w-full gap-2" onClick={() => navigate(`/session/results/${sessionId}`)}>
              View Results →
            </Button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
