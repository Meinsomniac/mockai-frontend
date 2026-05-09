import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion, useScroll, useTransform } from "motion/react"
import { Mic, Mic as Mic2, ArrowRight, ChevronRight, Activity, LayoutGrid, ChartBar as BarChart3, Globe as Globe2, FileSliders as Sliders, Settings2, TrendingUp, CircleCheck as CheckCircle2, Bot, Play, Briefcase, Users, Video, MessageSquare, ClipboardList, Code as Code2, Volume2, Check } from "lucide-react"
import { useRef } from "react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      {/* <StatsBar /> */}
      <FeaturesGrid />
      <HowItWorks />
      <SessionTypesShowcase />
      <SpeechAnalysisSpotlight />
      <FinalCTA />
      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-15 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">MockAI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground">Features</Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">How it Works</Button>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">
              Get Started <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background effects with parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "25%"]) }}
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/6 blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "40%"]) }}
          className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-[oklch(0.627_0.265_303.9)]/5 blur-3xl"
        />
      </div>

      <motion.div style={{ y: yContent, opacity }} className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Headline */}
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Ace Every Interview
              <br />
              With{" "}
              <span className="gradient-text">AI-Powered Practice</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
              Practice real interviews, HR sessions, and meetings with an AI that listens to your voice,
              analyzes your delivery, and gives you honest feedback — completely free.
            </p>

            {/* Buttons */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="gap-2 px-8 py-6 text-base" asChild>
                <Link to="/session/configure">
                  <Play className="h-4 w-4" /> Start Free Session
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="gap-2 px-8 py-6 text-base" asChild>
                <Link to="/dashboard">
                  Watch Demo <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
              {["No credit card", "No API key", "100% Free"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[oklch(0.645_0.2_142)]" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
          <div className="border-b border-border bg-card/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-warning/70" />
                <div className="h-3 w-3 rounded-full bg-success/70" />
              </div>
              <div className="flex-1 rounded-md bg-muted px-3 py-1 text-center font-mono text-xs text-muted-foreground">
                mockAI.app/session/live
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Session topbar mockup */}
            <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2">
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Interviewer</span>
                <Badge variant="outline" className="border-primary/30 text-xs text-primary">Interview</Badge>
                <Badge variant="outline" className="text-xs">Advanced</Badge>
              </div>
              <span className="font-mono text-sm text-muted-foreground">14:22</span>
            </div>

            {/* AI panel mockup */}
            <div className="flex flex-col items-center py-6">
              <div className="pulse-ring mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)] ring-4 ring-primary/20">
                <Bot className="h-10 w-10 text-white" />
              </div>

              {/* Waveform */}
              <div className="mb-4 flex items-end gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="waveform-bar w-1 rounded-full bg-primary"
                    style={{
                      height: `${[12, 24, 8, 28, 16, 22, 10][i]}px`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>

              <div className="max-w-lg rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Question 3</p>
                <p className="text-sm text-foreground">
                  Explain how React's virtual DOM works and why it improves performance...
                </p>
              </div>
            </div>

            {/* Input bar mockup */}
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                  <span className="text-xs text-destructive">Recording</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">0:08</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="gap-1 text-xs">
                  <Check className="h-3 w-3" /> Submit Answer
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">Type Instead</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </section>
  )
}

function FeaturesGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Everything you need to master your interviews
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Professional-grade tools, zero cost, all in your browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Large card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group col-span-1 cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg md:col-span-2"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Mic2 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">AI Voice Interviewer</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Natural voice-based interviews powered by state-of-the-art free AI models. The AI asks questions, listens to your answers, and adapts in real time.
            </p>
            <div className="flex items-end gap-1">
              {[4, 8, 6, 12, 9, 14, 7, 18, 11, 15, 8, 20, 13, 17, 10].map((h, i) => (
                <div
                  key={i}
                  className="waveform-bar rounded-full bg-primary/70"
                  style={{ width: "6px", height: `${h}px`, animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Speech Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Confidence, pace, hesitation, filler words — all tracked in real time using browser APIs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">7 Session Types</h3>
            <p className="text-sm text-muted-foreground">
              Interviews, HR sessions, debates, sales pitches, performance reviews, and more.
            </p>
          </motion.div>

          {/* Second large card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group col-span-1 cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg md:col-span-2"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Detailed Results & Analysis</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Per-question scoring, strengths, areas to improve, speech analysis, and a full transcript with actionable tips.
            </p>
            <div className="space-y-2">
              {[{ label: "Communication", pct: 82 }, { label: "Technical", pct: 68 }, { label: "Speech", pct: 74 }].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-muted-foreground">{s.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary score-fill"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-xs font-medium text-foreground">{s.pct}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="group cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Globe2 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">6 Languages</h3>
            <p className="text-sm text-muted-foreground">
              English, French, Spanish, German, Urdu, Arabic — full multi-language support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="group cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Sliders className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Custom AI Mode</h3>
            <p className="text-sm text-muted-foreground">
              Define the AI's personality — strict Google interviewer, encouraging mentor, aggressive debater.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: Settings2,
      title: "Configure",
      desc: "Choose category, language, difficulty and custom AI behaviour.",
    },
    {
      icon: Mic,
      title: "Practice",
      desc: "Talk with the AI using voice or text. It adapts to you in real time.",
    },
    {
      icon: TrendingUp,
      title: "Improve",
      desc: "Get scores, feedback, and detailed speech analysis after every session.",
    },
  ]

  return (
    <section className="bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">How It Works</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Up and running in minutes
          </h2>
        </motion.div>

        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-start">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-1 flex-col items-center text-center"
            >
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <step.icon className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card text-xs font-bold text-foreground border border-border">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SessionTypesShowcase() {
  const types = [
    { icon: Briefcase, title: "Interview", desc: "Technical & behavioral job interviews", color: "text-primary bg-primary/10" },
    { icon: Users, title: "HR Session", desc: "HR screening and culture fit", color: "text-[oklch(0.627_0.265_303.9)] bg-[oklch(0.627_0.265_303.9)]/10" },
    { icon: Video, title: "Mock Meeting", desc: "Business meetings and stand-ups", color: "text-[oklch(0.6_0.2_248)] bg-[oklch(0.6_0.2_248)]/10" },
    { icon: MessageSquare, title: "Debate", desc: "Structured arguments and rebuttals", color: "text-[oklch(0.75_0.183_84)] bg-[oklch(0.75_0.183_84)]/10" },
    { icon: TrendingUp, title: "Sales Pitch", desc: "Product demos and pitch practice", color: "text-[oklch(0.645_0.2_142)] bg-[oklch(0.645_0.2_142)]/10" },
    { icon: ClipboardList, title: "Performance Review", desc: "Self-assessment and manager reviews", color: "text-[oklch(0.63_0.24_25)] bg-[oklch(0.63_0.24_25)]/10" },
    { icon: Code2, title: "Technical", desc: "Deep coding and system design", color: "text-[oklch(0.696_0.17_162.48)] bg-[oklch(0.696_0.17_162.48)]/10" },
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Practice any session type</h2>
          <p className="mt-4 text-muted-foreground">Seven distinct AI personas, each tuned for its scenario.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {types.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to="/session/configure"
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${type.color}`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{type.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{type.desc}</p>
                </div>
                <span className="mt-auto text-xs text-primary group-hover:underline">Try Now →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SpeechAnalysisSpotlight() {
  return (
    <section className="bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Speech Intelligence
            </p>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              We don't just judge what you say — we analyze{" "}
              <span className="gradient-text">how you say it</span>
            </h2>
            <div className="space-y-3">
              {[
                "Real-time confidence scoring",
                "Words-per-minute tracking",
                "Filler word detection (um, like, uh)",
                "Hesitation & pause analysis",
                "Tone & expressiveness metrics",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.645_0.2_142)]" />
                  <span className="text-sm text-foreground">{feat}</span>
                </div>
              ))}
            </div>
            <Button className="mt-8 gap-2" asChild>
              <Link to="/session/configure">
                <Play className="h-4 w-4" /> Start Practicing
              </Link>
            </Button>
          </motion.div>

          {/* Mini report card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Speech Analysis</span>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: "Confidence", score: 78 },
                { label: "Clarity", score: 68 },
                { label: "Pace", score: 52 },
                { label: "Expression", score: 61 },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-muted-foreground">{s.label}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
                    <div
                      className="h-full rounded-full bg-primary score-fill"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-medium">{s.score}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-[oklch(0.75_0.183_84)]">⚠</span>
                <span>Fillers: "um" ×5, "like" ×4</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📏</span>
                <span>Pace: 148 WPM — Slightly Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">⏸</span>
                <span>3 long pauses detected (&gt;2s)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🎭</span>
                <span>Tone: Formal, slightly nervous</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-y border-border py-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Ready to ace your next interview?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Join developers, managers, and professionals who use MockAI to build interview confidence.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link to="/session/configure">
              <Play className="h-4 w-4" /> Start Free Session
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard">View Sample Results</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">No account needed for guest demo</p>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.627_0.265_303.9)]">
                <Mic className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-semibold">MockAI</span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI-powered practice for every professional interaction.
            </p>
            <Mic2 className="mt-3 h-5 w-5 text-muted-foreground" />
          </div>

          {[
            { heading: "Product", links: ["Features", "How it Works", "Session Types"] },
            { heading: "Resources", links: ["Documentation", "API", "Changelog"] },
            { heading: "Company", links: ["About", "Blog", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
          <span>© 2025 MockAI. All rights reserved.</span>
          <span>Made with ♥ using Next.js + OpenRouter</span>
        </div>
      </div>
    </footer>
  )
}
