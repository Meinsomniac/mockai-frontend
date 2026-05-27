import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  durationMinutes?: number;
  isRunning: boolean;
  onTimeUp?: () => void;
  currentQuestion: number;
  totalQuestions: number;
  className?: string;
}

export function SessionTimer({
  durationMinutes,
  isRunning,
  onTimeUp,
  currentQuestion,
  totalQuestions,
  className,
}: SessionTimerProps): React.ReactElement {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;

          // Check if time is up
          if (durationMinutes && next >= durationMinutes * 60) {
            onTimeUpRef.current?.();
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, durationMinutes]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const remaining = durationMinutes ? Math.max(0, durationMinutes * 60 - elapsed) : null;
  const isLowTime = remaining !== null && remaining <= 60;

  return (
    <div className={cn("flex flex-col items-center gap-0.5", className)}>
      <div className="flex items-center gap-1.5">
        <Clock
          className={cn(
            "h-3.5 w-3.5",
            isLowTime ? "text-destructive" : "text-muted-foreground",
          )}
        />
        <span
          className={cn(
            "font-mono text-sm font-semibold",
            isLowTime && "text-destructive",
          )}
        >
          {remaining !== null ? formatTime(remaining) : formatTime(elapsed)}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        Q{currentQuestion} of {totalQuestions}
      </span>
    </div>
  );
}
