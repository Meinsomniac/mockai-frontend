import { useCallback } from "react";
import { Mic, MicOff, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  onStart: () => void;
  onStop: () => void;
  onSubmit: () => void;
  onFallbackToText: () => void;
  disabled?: boolean;
}

export function VoiceRecorder({
  isListening,
  isSupported,
  interimTranscript,
  onStart,
  onStop,
  onSubmit,
  onFallbackToText,
  disabled = false,
}: VoiceRecorderProps): React.ReactElement {
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  }, [isListening, onStart, onStop]);

  if (!isSupported) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-[oklch(0.75_0.183_84)]/20 bg-[oklch(0.75_0.183_84)]/10 px-3 py-2 text-xs text-[oklch(0.75_0.183_84)]">
          Voice not supported in this browser. Using text input.
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={onFallbackToText} className="gap-1.5 text-xs">
            <Keyboard className="h-3.5 w-3.5" /> Type Instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Interim transcript display */}
      {isListening && (
        <div className="min-h-10 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <p className="font-mono text-xs italic text-muted-foreground">
            {interimTranscript || "Listening... (your words appear here)"}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant={isListening ? "destructive" : "default"}
            className={cn(
              "h-10 w-10 rounded-full",
              isListening && "animate-pulse",
            )}
            onClick={handleMicToggle}
            disabled={disabled}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {isListening && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-xs font-medium text-destructive">Recording</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {interimTranscript.trim().length > 0 && (
            <Button size="sm" onClick={onSubmit} className="gap-1.5 text-xs">
              Submit Answer
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onFallbackToText}
            className="gap-1.5 text-xs"
          >
            <Keyboard className="h-3.5 w-3.5" /> Type Instead
          </Button>
        </div>
      </div>
    </div>
  );
}
