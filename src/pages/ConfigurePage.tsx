import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Mic, Briefcase, Users, Video, MessageSquare, TrendingUp, ClipboardList, Code as Code2, ChevronRight, ArrowLeft, CircleCheck as CheckCircle2, Brain, Wand as Wand2, Play, Volume2, Keyboard, Bot } from "lucide-react"

const CATEGORIES = [
  { id: "interview", label: "Interview", icon: Briefcase, desc: "Job interview practice" },
  { id: "hr_session", label: "HR Session", icon: Users, desc: "HR screening & culture" },
  { id: "mock_meeting", label: "Mock Meeting", icon: Video, desc: "Business meetings" },
  { id: "debate", label: "Debate", icon: MessageSquare, desc: "Structured arguments" },
  { id: "sales_pitch", label: "Sales Pitch", icon: TrendingUp, desc: "Pitch & demo practice" },
  { id: "performance_review", label: "Perf. Review", icon: ClipboardList, desc: "Manager reviews" },
  { id: "technical", label: "Technical", icon: Code2, desc: "System design & coding" },
]

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Spanish", value: "es" },
  { label: "German", value: "de" },
  { label: "Urdu", value: "ur" },
  { label: "Arabic", value: "ar" },
]

const DIFFICULTIES = [
  { id: "beginner", label: "Beginner", desc: "Simple questions, patient" },
  { id: "intermediate", label: "Intermediate", desc: "Mix of concepts & practice" },
  { id: "advanced", label: "Advanced", desc: "Deep dives, challenges" },
  { id: "expert", label: "Expert", desc: "Architecture, leadership" },
]

const SUGGESTIONS = [
  "Strict Google-style interviewer",
  "Friendly and encouraging HR manager",
  "Panel of 2 — one technical, one behavioural",
  "Aggressive debater who challenges everything",
  "High-pressure FAANG screening",
  "Patient mentor for beginners",
]

const QUESTION_COUNTS = [3, 5, 8, 10]
const DURATIONS = [5, 10, 15, 20, 30]

const RESPONSE_MODES = [
  { id: "voice-only", label: "Voice Only", icon: Mic, desc: "Speak answers" },
  { id: "voice+text", label: "Voice + Text", icon: Mic, desc: "Recommended", recommended: true },
  { id: "text-only", label: "Text Only", icon: Keyboard, desc: "Type answers" },
]

const STEPS = ["Type", "Role", "Mode", "Settings", "Review"]

interface Config {
  category: string
  language: string
  difficulty: string
  jobRole: string
  company: string
  topics: string[]
  behaviour: string
  questionCount: number
  duration: number
  responseMode: string
  aiVoice: boolean
}

export default function ConfigurePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [topicInput, setTopicInput] = useState("")
  const [config, setConfig] = useState<Config>({
    category: "interview",
    language: "en",
    difficulty: "intermediate",
    jobRole: "",
    company: "",
    topics: [],
    behaviour: "",
    questionCount: 5,
    duration: 15,
    responseMode: "voice+text",
    aiVoice: true,
  })

  const update = (key: keyof Config, value: unknown) =>
    setConfig((prev) => ({ ...prev, [key]: value }))

  const addTopic = (val: string) => {
    const trimmed = val.trim().replace(/,$/, "")
    if (trimmed && !config.topics.includes(trimmed)) {
      update("topics", [...config.topics, trimmed])
    }
    setTopicInput("")
  }

  const removeTopic = (t: string) =>
    update("topics", config.topics.filter((x) => x !== t))

  const handleStart = () => {
    navigate("/session/demo-session")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
              <Mic className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground">MockAI</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronRight className="h-3 w-3" />
            <span>Configure Session</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Configure Your Session</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up your AI interviewer exactly how you want it.</p>
        </div>

        {/* Progress stepper */}
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            {STEPS.map((label, i) => {
              const n = i + 1
              const isDone = step > n
              const isActive = step === n
              return (
                <div key={label} className="flex flex-1 flex-col items-center">
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${
                        isDone
                          ? "border-primary bg-primary/20 text-primary"
                          : isActive
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : n}
                    </div>
                    <span
                      className={`mt-1.5 text-xs ${
                        isActive ? "font-semibold text-foreground" : isDone ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`absolute left-0 right-0 top-4 h-px ${
                        step > n ? "bg-primary/40" : "bg-border"
                      }`}
                      style={{ left: `${(100 / (STEPS.length - 1)) * i + 100 / STEPS.length / 2}%`, right: `${100 - (100 / (STEPS.length - 1)) * (i + 1) - 100 / STEPS.length / 2}%` }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8 min-h-[400px]">
          {step === 1 && <Step1 config={config} update={update} />}
          {step === 2 && <Step2 config={config} update={update} topicInput={topicInput} setTopicInput={setTopicInput} addTopic={addTopic} removeTopic={removeTopic} />}
          {step === 3 && <Step3 config={config} update={update} />}
          {step === 4 && <Step4 config={config} update={update} />}
          {step === 5 && <Step5 config={config} setStep={setStep} />}
        </div>

        {/* Footer navigation */}
        <div className="sticky bottom-0 z-10 rounded-xl border border-border bg-background/95 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className={step === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <span className="text-xs text-muted-foreground">Step {step} of 5</span>
            {step < 5 ? (
              <Button size="sm" onClick={() => setStep((s) => Math.min(5, s + 1))}>
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleStart}>
                <Play className="mr-1 h-4 w-4" /> Start Session
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step1({ config, update }: { config: Config; update: (k: keyof Config, v: unknown) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <Label className="mb-4 block text-sm font-semibold text-foreground">What type of session?</Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("category", cat.id)}
              className={`relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
                config.category === cat.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/40"
              }`}
            >
              {config.category === cat.id && (
                <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                <cat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{cat.label}</span>
              <span className="text-xs text-muted-foreground">{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold text-foreground">Language</Label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => update("language", lang.value)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                config.language === lang.value
                  ? "bg-primary text-white"
                  : "border border-border bg-card text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step2({
  config, update, topicInput, setTopicInput, addTopic, removeTopic,
}: {
  config: Config
  update: (k: keyof Config, v: unknown) => void
  topicInput: string
  setTopicInput: (v: string) => void
  addTopic: (v: string) => void
  removeTopic: (v: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Job Role</Label>
        <Input
          value={config.jobRole}
          onChange={(e) => update("jobRole", e.target.value)}
          placeholder="e.g. Senior React Developer"
          className="bg-muted/30"
        />
        <p className="text-xs text-muted-foreground">Leave blank for a general session</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Company</Label>
        <Input
          value={config.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="e.g. Google, Startup, FAANG"
          className="bg-muted/30"
        />
        <p className="text-xs text-muted-foreground">Tailors session to that company's standards</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Topics</Label>
        <div className="flex gap-2">
          <Input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addTopic(topicInput)
              }
            }}
            placeholder="e.g. React, System Design (press Enter)"
            className="bg-muted/30"
          />
          <Button variant="outline" size="sm" onClick={() => addTopic(topicInput)}>Add</Button>
        </div>
        {config.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {config.topics.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-0.5 text-xs text-primary"
              >
                {t}
                <button onClick={() => removeTopic(t)} className="ml-1 opacity-60 hover:opacity-100">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Difficulty</Label>
        <div className="grid grid-cols-2 gap-3">
          {DIFFICULTIES.map((d) => {
            const colors: Record<string, string> = {
              beginner: "border-l-[oklch(0.645_0.2_142)]",
              intermediate: "border-l-primary",
              advanced: "border-l-[oklch(0.75_0.183_84)]",
              expert: "border-l-destructive",
            }
            return (
              <button
                key={d.id}
                onClick={() => update("difficulty", d.id)}
                className={`flex items-start gap-3 rounded-xl border border-l-4 p-3 text-left transition-all ${
                  colors[d.id]
                } ${
                  config.difficulty === d.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                } bg-card`}
              >
                <div className="mt-0.5">
                  <div
                    className={`h-3.5 w-3.5 rounded-full border-2 ${
                      config.difficulty === d.id ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{d.label}</span>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Step3({ config, update }: { config: Config; update: (k: keyof Config, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Define the AI's Behaviour</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell the AI how to conduct your session. It will follow these instructions precisely.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Behaviour Instructions</Label>
          <span className="text-xs text-muted-foreground">{config.behaviour.length} / 500</span>
        </div>
        <Textarea
          value={config.behaviour}
          onChange={(e) => update("behaviour", e.target.value.slice(0, 500))}
          placeholder={`e.g. Be a strict senior engineer at Google. Challenge every answer.\nAsk follow-ups when the answer is vague...`}
          className="min-h-32 bg-muted/30 font-mono text-sm"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-medium text-muted-foreground">Quick suggestions</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => update("behaviour", s)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              <Wand2 className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      </div>

      {config.behaviour && (
        <div className="rounded-xl border border-dashed border-primary/30 bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">System Prompt Preview</span>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">AI Preview</Badge>
          </div>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            "You are an expert interviewer conducting a session. {config.behaviour.slice(0, 200)}
            {config.behaviour.length > 200 ? "..." : ""}"
          </p>
        </div>
      )}
    </div>
  )
}

function Step4({ config, update }: { config: Config; update: (k: keyof Config, v: unknown) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <Label className="mb-3 block text-sm font-semibold">Number of Questions</Label>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => update("questionCount", n)}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  config.questionCount === n
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block text-sm font-semibold">Target Duration</Label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => update("duration", d)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  config.duration === d
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold">How will you respond?</Label>
        <div className="grid grid-cols-3 gap-3">
          {RESPONSE_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => update("responseMode", mode.id)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                config.responseMode === mode.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/40"
              }`}
            >
              {mode.recommended && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                  Recommended ✦
                </span>
              )}
              <mode.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{mode.label}</span>
              <span className="text-xs text-muted-foreground">{mode.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">AI Voice Output</p>
            <p className="text-xs text-muted-foreground">The AI will speak questions aloud using text-to-speech.</p>
          </div>
        </div>
        <Switch
          checked={config.aiVoice}
          onCheckedChange={(v) => update("aiVoice", v)}
        />
      </div>
    </div>
  )
}

function Step5({ config, setStep }: { config: Config; setStep: (n: number) => void }) {
  const CATEGORY_LABELS: Record<string, string> = {
    interview: "Interview", hr_session: "HR Session", mock_meeting: "Mock Meeting",
    debate: "Debate", sales_pitch: "Sales Pitch", performance_review: "Perf. Review",
    technical: "Technical",
  }
  const LANG_LABELS: Record<string, string> = {
    en: "English", fr: "French", es: "Spanish", de: "German", ur: "Urdu", ar: "Arabic",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.645_0.2_142)]/10">
          <CheckCircle2 className="h-7 w-7 text-[oklch(0.645_0.2_142)]" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Ready to start?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here's a summary of your session configuration.</p>
      </div>

      <div className="relative rounded-xl border border-border bg-card p-5">
        <button
          onClick={() => setStep(1)}
          className="absolute right-4 top-4 flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          ✎ Edit
        </button>

        <div className="space-y-3">
          {[
            { label: "Category", value: <Badge variant="outline" className="text-xs">{CATEGORY_LABELS[config.category]}</Badge> },
            { label: "Language", value: LANG_LABELS[config.language] || config.language },
            { label: "Difficulty", value: <Badge variant="outline" className="capitalize text-xs">{config.difficulty}</Badge> },
            { label: "Job Role", value: config.jobRole || "General" },
            { label: "Company", value: config.company || "Not specified" },
            { label: "Questions", value: `${config.questionCount} questions` },
            { label: "Duration", value: `${config.duration} minutes` },
            { label: "Mode", value: config.responseMode },
            { label: "AI Voice", value: config.aiVoice ? "On" : "Off" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground">{row.value}</span>
            </div>
          ))}

          {config.topics.length > 0 && (
            <div className="flex items-start justify-between text-sm">
              <span className="text-muted-foreground">Topics</span>
              <div className="flex flex-wrap justify-end gap-1">
                {config.topics.map((t) => (
                  <span key={t} className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {config.behaviour && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">"{config.behaviour}"</p>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">Session begins immediately after clicking Start</p>
    </div>
  )
}
