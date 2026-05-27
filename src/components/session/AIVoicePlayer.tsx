import { useCallback } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIVoicePlayerProps {
  isSpeaking: boolean;
  isSupported: boolean;
  onReplay: () => void;
  onStop: () => void;
  className?: string;
}

export function AIVoicePlayer({
  isSpeaking,
  isSupported,
  onReplay,
  onStop,
  className,
}: AIVoicePlayerProps): React.ReactElement {
  const handleToggle = useCallback(() => {
    if (isSpeaking) {
      onStop();
    } else {
      onReplay();
    }
  }, [isSpeaking, onStop, onReplay]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isSupported && (
        <>
          {/* Waveform animation when speaking */}
          {isSpeaking && (
            <div className="flex items-end gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-primary"
                  style={{
                    height: `${8 + Math.random() * 16}px`,
                    animation: `pulse 0.${3 + i}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 70}ms`,
                  }}
                />
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggle}
            title={isSpeaking ? "Stop speaking" : "Replay last answer"}
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {!isSpeaking && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onReplay}
              title="Replay last answer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </>
      )}

      {!isSupported && (
        <span className="text-xs text-muted-foreground">Voice playback not supported</span>
      )}
    </div>
  );
}
