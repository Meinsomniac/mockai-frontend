import { useEffect, useCallback, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  Bot,
  Square,
  PanelRight,
  Loader as Loader2,
  CircleCheck as CheckCircle2,
  X,
} from "lucide-react";
import { useGetSession, useStartSession, useSendMessage, useEndSession } from "@/api";
import { useSessionStore } from "@/store/sessionStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { TranscriptPanel } from "@/components/session/TranscriptPanel";
import { VoiceRecorder } from "@/components/session/VoiceRecorder";
import { AIVoicePlayer } from "@/components/session/AIVoicePlayer";
import { SessionTimer } from "@/components/session/SessionTimer";
import { SpeechIndicator } from "@/components/session/SpeechIndicator";

export default function SessionPage(): React.ReactElement {
  const navigate = useNavigate();
  const { id: sessionId } = useParams<{ id: string }>();

  // API hooks
  const { data: sessionData, isLoading: sessionLoading } = useGetSession(sessionId || "");
  const startSessionMutation = useStartSession();
  const sendMessageMutation = useSendMessage();
  const endSessionMutation = useEndSession();

  // Zustand store
  const {
    status,
    transcript,
    currentQuestion,
    totalQuestions,
    speakerState,
    responseMode,
    lastAIResponse,
    setSessionId,
    setStatus,
    addMessage,
    setTranscript,
    incrementQuestion,
    setTotalQuestions,
    setResponseMode,
    setSpeakerState,
    setLastAIResponse,
    reset,
  } = useSessionStore();

  // Local UI state
  const [showTranscript, setShowTranscript] = useState(true);
  const [textAnswer, setTextAnswer] = useState("");
  const [isSending, setIsSending] = useState(false);

  const session = sessionData?.session;
  const isVoiceMode = responseMode === "voice+text" || responseMode === "voice-only";

  // Refs for stable callbacks
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // --- Speech Synthesis ---
  const handleSpeechEnd = useCallback(() => {
    setSpeakerState("idle");
  }, [setSpeakerState]);

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis({
    language: session?.languageLocale ?? "en-US",
    onEnd: handleSpeechEnd,
  });

  // --- Speech Recognition ---
  const handleSpeechResult = useCallback(
    (transcriptText: string, isFinal: boolean) => {
      if (isFinal && transcriptText.trim().length > 0 && !isSending) {
        handleSendAnswer(transcriptText.trim());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSending],
  );

  const handleSpeechError = useCallback((error: string) => {
    console.warn("[SpeechRecognition] Error:", error);
  }, []);

  const {
    start: startListening,
    stop: stopListening,
    isListening,
    isSupported: sttSupported,
    interimTranscript,
  } = useSpeechRecognition({
    language: session?.languageLocale ?? "en-US",
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  // --- Send answer to backend ---
  const handleSendAnswer = useCallback(
    async (answer: string) => {
      if (!sessionId || !answer.trim() || isSending) return;

      // Stop recording if active
      if (isListening) {
        stopListening();
      }

      setIsSending(true);
      setSpeakerState("ai_thinking");

      // Add user message to transcript immediately
      addMessage({
        role: "user",
        content: answer,
        timestamp: new Date().toISOString(),
      });
      setTextAnswer("");

      try {
        const response = await sendMessageMutation.mutateAsync({
          sessionId,
          message: answer,
        });

        // Add AI response to transcript
        addMessage({
          role: "ai",
          content: response.aiResponse,
          timestamp: new Date().toISOString(),
        });

        setLastAIResponse(response.aiResponse);
        incrementQuestion();

        if (response.isComplete) {
          // Session complete — show completing state, then end
          setStatus("completing");
          setSpeakerState("ai_speaking");
          speak(response.aiResponse);

          // Wait for speech to finish, then end session
          const checkSpeaking = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              clearInterval(checkSpeaking);
              endSessionAndNavigate();
            }
          }, 500);

          // Fallback timeout in case speech gets stuck
          setTimeout(() => {
            clearInterval(checkSpeaking);
            if (status !== "completed") {
              endSessionAndNavigate();
            }
          }, 30000);
        } else {
          // AI has a follow-up question — speak it
          setSpeakerState("ai_speaking");
          speak(response.aiResponse);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        setSpeakerState("idle");
      } finally {
        setIsSending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionId, isSending, isListening],
  );

  // --- End session and navigate to results ---
  const endSessionAndNavigate = useCallback(async () => {
    if (status === "completed") return;
    setStatus("completed");
    stopListening();
    stopSpeaking();

    if (sessionId) {
      try {
        await endSessionMutation.mutateAsync(sessionId);
      } catch (err) {
        console.error("Failed to end session:", err);
      }
    }

    setTimeout(() => {
      navigate(`/session/results/${sessionId}`);
    }, 1500);
  }, [status, sessionId, navigate, endSessionMutation, stopListening, stopSpeaking, setStatus]);

  // --- Initialize session on mount ---
  useEffect(() => {
    if (!sessionId) return;
    setSessionId(sessionId);

    return () => {
      reset();
    };
  }, [sessionId, setSessionId, reset]);

  // --- Load session data and configure store ---
  useEffect(() => {
    if (!session) return;

    setResponseMode(session.responseMode);
    setTotalQuestions(session.questionCount);

    // If session is pending, start it
    if (session.status === "pending" && !startSessionMutation.isPending) {
      setStatus("loading");
      startSessionMutation.mutateAsync(sessionId!).then((response) => {
        setStatus("active");

        // Add the initial AI question to transcript
        if (response.initialQuestion) {
          addMessage({
            role: "ai",
            content: response.initialQuestion,
            timestamp: new Date().toISOString(),
          });
          setLastAIResponse(response.initialQuestion);

          // Speak the initial question if voice mode
          if (isVoiceMode && session.aiVoiceEnabled) {
            setSpeakerState("ai_speaking");
            speak(response.initialQuestion);
          } else {
            setSpeakerState("idle");
          }
        }
      }).catch((err) => {
        console.error("Failed to start session:", err);
        setStatus("idle");
      });
      return;
    }

    // If session is already active, load existing transcript
    if (session.status === "active") {
      setStatus("active");

      if (session.transcript && session.transcript.length > 0) {
        const mapped = session.transcript.map((item) => ({
          role: item.role as "ai" | "user",
          content: item.content,
          timestamp: item.timestamp,
        }));
        setTranscript(mapped);

        // Count user messages for question tracking
        const userCount = mapped.filter((m) => m.role === "user").length;
        for (let i = 0; i < userCount; i++) {
          incrementQuestion();
        }

        // Set last AI response for replay
        const lastAI = [...mapped].reverse().find((m) => m.role === "ai");
        if (lastAI) {
          setLastAIResponse(lastAI.content);
        }
      }

      setSpeakerState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.status]);

  // --- Auto-start listening when AI finishes speaking (voice mode) ---
  useEffect(() => {
    if (
      status === "active" &&
      !isSpeaking &&
      !isSending &&
      isVoiceMode &&
      speakerState === "idle" &&
      !isListening &&
      transcript.length > 0
    ) {
      // Small delay before starting to listen
      const timer = setTimeout(() => {
        startListening();
        setSpeakerState("user_recording");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, status, speakerState, isSending]);

  // --- Text input submit ---
  const handleTextSubmit = useCallback(() => {
    if (textAnswer.trim().length > 0) {
      handleSendAnswer(textAnswer.trim());
    }
  }, [textAnswer, handleSendAnswer]);

  // --- Skip question ---
  const handleSkip = useCallback(() => {
    handleSendAnswer("I'd like to skip this question.");
  }, [handleSendAnswer]);

  // --- Manual end session ---
  const handleEndSession = useCallback(() => {
    endSessionAndNavigate();
  }, [endSessionAndNavigate]);

  // --- Replay last AI response ---
  const handleReplay = useCallback(() => {
    if (lastAIResponse) {
      setSpeakerState("ai_speaking");
      speak(lastAIResponse);
    }
  }, [lastAIResponse, speak, setSpeakerState]);

  // --- Fallback to text mode ---
  const handleFallbackToText = useCallback(() => {
    setResponseMode("text-only");
    stopListening();
  }, [setResponseMode, stopListening]);

  // --- Keyboard shortcut: Enter to submit in text mode ---
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleTextSubmit();
      }
    },
    [handleTextSubmit],
  );

  // --- Determine the latest AI question to display ---
  const currentAIQuestion =
    transcript.length > 0
      ? [...transcript].reverse().find((m) => m.role === "ai")?.content ?? ""
      : "";

  // --- Loading state ---
  if (sessionLoading || status === "loading") {
    return (
      <div className="flex h-screen flex-col bg-background overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
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
          <Badge variant="outline" className="text-xs capitalize">
            {session?.difficulty || "Intermediate"}
          </Badge>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bot className="h-3.5 w-3.5" />
            AI Interviewer
          </div>
        </div>

        <SessionTimer
          durationMinutes={session?.duration}
          isRunning={status === "active"}
          onTimeUp={handleEndSession}
          currentQuestion={currentQuestion + 1}
          totalQuestions={totalQuestions}
        />

        <div className="flex items-center gap-2">
          {isVoiceMode && (
            <AIVoicePlayer
              isSpeaking={isSpeaking}
              isSupported={ttsSupported}
              onReplay={handleReplay}
              onStop={stopSpeaking}
            />
          )}
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
            onClick={handleEndSession}
            disabled={status === "completed" || status === "completing"}
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
                speakerState === "ai_speaking"
                  ? "pulse-ring ring-4 ring-primary/20"
                  : "ring-4 ring-primary/10"
              }`}
            >
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Speech Indicator */}
          <SpeechIndicator state={speakerState} />

          {/* Question card */}
          {currentAIQuestion && status !== "completing" && status !== "completed" && (
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
              </div>
              <Separator className="mb-4" />
              <p className="text-sm leading-relaxed text-foreground">{currentAIQuestion}</p>
            </div>
          )}

          {/* Sending indicator */}
          {isSending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              AI is thinking...
            </div>
          )}
        </div>

        {/* Transcript Panel */}
        {showTranscript && (
          <div className="flex w-80 flex-col border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Transcript</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowTranscript(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <TranscriptPanel
              messages={transcript}
              interimText={isListening ? interimTranscript : undefined}
              className="flex-1"
            />

            <div className="border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {currentQuestion + 1} of {totalQuestions} questions answered
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      {status === "active" && !isSending && (
        <div className="border-t border-border bg-card/90 px-6 py-4 backdrop-blur-sm">
          {isVoiceMode ? (
            <VoiceRecorder
              isListening={isListening}
              isSupported={sttSupported}
              interimTranscript={interimTranscript}
              onStart={() => {
                startListening();
                setSpeakerState("user_recording");
              }}
              onStop={() => {
                stopListening();
                setSpeakerState("idle");
              }}
              onSubmit={() => {
                if (interimTranscript.trim().length > 0) {
                  handleSendAnswer(interimTranscript.trim());
                }
              }}
              onFallbackToText={handleFallbackToText}
              disabled={isSpeaking}
            />
          ) : (
            /* Text-only input mode */
            <div className="space-y-3">
              <Textarea
                placeholder="Type your answer here..."
                rows={3}
                className="bg-muted/30"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSpeaking}
              />
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSkip}
                  className="gap-1.5 text-xs text-muted-foreground"
                >
                  Skip Question
                </Button>
                <Button
                  size="sm"
                  onClick={handleTextSubmit}
                  disabled={textAnswer.trim().length === 0}
                  className="gap-1.5 text-xs"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completing overlay */}
      {(status === "completing" || status === "completed") && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-10 text-center shadow-2xl">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[oklch(0.645_0.2_142)]" />
            <h2 className="mb-2 text-xl font-bold text-foreground">Session Complete!</h2>
            <p className="mb-6 text-sm text-muted-foreground">Your answers are being analyzed...</p>
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your performance...
            </div>
            <Button
              className="w-full gap-2"
              onClick={() => navigate(`/session/results/${sessionId}`)}
            >
              View Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
