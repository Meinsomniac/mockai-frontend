export type SessionCategory =
  | "interview"
  | "hr_session"
  | "mock_meeting"
  | "debate"
  | "sales_pitch"
  | "performance_review"
  | "technical_assessment"

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert"
export type ResponseMode = "voice+text" | "text-only" | "voice-only"
export type QuestionCount = 3 | 5 | 8 | 10
export type Duration = 5 | 10 | 15 | 20 | 30

export interface SessionConfig {
  category: SessionCategory
  language: string
  languageLocale: string
  difficulty: Difficulty
  behaviour: string
  jobRole?: string
  topic?: string
  company?: string
  questionCount: QuestionCount
  duration?: Duration
  responseMode: ResponseMode
  aiVoiceEnabled: boolean
}

export interface Session {
  id: string
  userId: string
  category: SessionCategory
  language: string
  languageLocale: string
  difficulty: Difficulty
  behaviour: string
  jobRole?: string
  topic?: string
  company?: string
  questionCount: number
  duration?: number
  responseMode: ResponseMode
  aiVoiceEnabled: boolean
  status: "pending" | "active" | "completed" | "cancelled"
  transcript: TranscriptItem[]
  startedAt: string | null
  endedAt: string | null
  durationActual: number | null
  createdAt: string
  updatedAt: string
}

export interface TranscriptItem {
  role: "ai" | "user"
  content: string
  timestamp: string
}

export interface CreateSessionResponse {
  message: string
  sessionId: string
}

export interface StartSessionResponse {
  message: string
  session: Session
  initialQuestion: string
}

export interface GetSessionResponse {
  session: Session
}

export interface SendMessageResponse {
  aiResponse: string
  questionNumber: number
  isComplete: boolean
}

export interface EndSessionResponse {
  message: string
  sessionId: string
}
