import { Bot, User, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeakerState = "idle" | "ai_thinking" | "ai_speaking" | "user_recording";

interface SpeechIndicatorProps {
  state: SpeakerState;
  className?: string;
}

const stateConfig: Record<
  SpeakerState,
  { label: string; icon: typeof Bot; bgClass: string; textClass: string }
> = {
  idle: {
    label: "Idle",
    icon: Bot,
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
  ai_thinking: {
    label: "Thinking...",
    icon: Loader2,
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
  ai_speaking: {
    label: "Speaking...",
    icon: Volume2,
    bgClass: "bg-primary/15",
    textClass: "text-primary",
  },
  user_recording: {
    label: "Listening...",
    icon: User,
    bgClass: "bg-destructive/15",
    textClass: "text-destructive",
  },
};

export function SpeechIndicator({ state, className }: SpeechIndicatorProps): React.ReactElement {
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
        config.bgClass,
        config.textClass,
        className,
      )}
    >
      <Icon
        className={cn(
          "h-3 w-3",
          (state === "ai_thinking" || state === "ai_speaking") && "animate-spin",
        )}
      />
      {state === "user_recording" && (
        <>
          <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
          &nbsp;
        </>
      )}
      {config.label}
    </div>
  );
}
