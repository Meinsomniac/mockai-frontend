import { create } from "zustand";
import type { ResponseMode } from "@/types/session.types";

export type SessionStatus =
  | "idle"
  | "loading"
  | "active"
  | "paused"
  | "completing"
  | "completed";

export type SpeakerState = "idle" | "ai_thinking" | "ai_speaking" | "user_recording";

export interface TranscriptMessage {
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

interface SessionState {
  sessionId: string | null;
  status: SessionStatus;
  transcript: TranscriptMessage[];
  currentQuestion: number;
  totalQuestions: number;
  isAISpeaking: boolean;
  isUserSpeaking: boolean;
  speakerState: SpeakerState;
  responseMode: ResponseMode;
  lastAIResponse: string;

  // Actions
  setSessionId: (id: string) => void;
  setStatus: (status: SessionStatus) => void;
  addMessage: (message: TranscriptMessage) => void;
  setTranscript: (messages: TranscriptMessage[]) => void;
  incrementQuestion: () => void;
  setTotalQuestions: (total: number) => void;
  setResponseMode: (mode: ResponseMode) => void;
  setAISpeaking: (speaking: boolean) => void;
  setUserSpeaking: (speaking: boolean) => void;
  setSpeakerState: (state: SpeakerState) => void;
  setLastAIResponse: (response: string) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null as string | null,
  status: "idle" as SessionStatus,
  transcript: [] as TranscriptMessage[],
  currentQuestion: 0,
  totalQuestions: 5,
  isAISpeaking: false,
  isUserSpeaking: false,
  speakerState: "idle" as SpeakerState,
  responseMode: "voice+text" as ResponseMode,
  lastAIResponse: "",
};

export const useSessionStore = create<SessionState>()((set) => ({
  ...initialState,

  setSessionId: (id: string): void => {
    set({ sessionId: id });
  },

  setStatus: (status: SessionStatus): void => {
    set({ status });
  },

  addMessage: (message: TranscriptMessage): void => {
    set((state) => ({
      transcript: [...state.transcript, message],
    }));
  },

  setTranscript: (messages: TranscriptMessage[]): void => {
    set({ transcript: messages });
  },

  incrementQuestion: (): void => {
    set((state) => ({
      currentQuestion: state.currentQuestion + 1,
    }));
  },

  setTotalQuestions: (total: number): void => {
    set({ totalQuestions: total });
  },

  setResponseMode: (mode: ResponseMode): void => {
    set({ responseMode: mode });
  },

  setAISpeaking: (speaking: boolean): void => {
    set({ isAISpeaking: speaking });
  },

  setUserSpeaking: (speaking: boolean): void => {
    set({ isUserSpeaking: speaking });
  },

  setSpeakerState: (state: SpeakerState): void => {
    set({
      speakerState: state,
      isAISpeaking: state === "ai_speaking" || state === "ai_thinking",
      isUserSpeaking: state === "user_recording",
    });
  },

  setLastAIResponse: (response: string): void => {
    set({ lastAIResponse: response });
  },

  reset: (): void => {
    set(initialState);
  },
}));
