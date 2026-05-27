import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TranscriptMessage {
  role: "ai" | "user";
  content: string;
  timestamp?: string;
}

interface TranscriptPanelProps {
  messages: TranscriptMessage[];
  interimText?: string;
  className?: string;
}

export function TranscriptPanel({
  messages,
  interimText,
  className,
}: TranscriptPanelProps): React.ReactElement {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}-${msg.timestamp ?? ""}`}
              className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  msg.role === "ai" ? "bg-primary/15" : "bg-muted",
                )}
              >
                {msg.role === "ai" ? (
                  <Bot className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className={cn("max-w-[200px]", msg.role === "user" && "text-right")}>
                <p className="mb-1 text-xs text-muted-foreground">
                  {msg.role === "ai" ? "AI" : "You"}
                </p>
                <p className="text-xs leading-relaxed text-foreground">{msg.content}</p>
              </div>
            </div>
          ))}

          {interimText && interimText.trim().length > 0 && (
            <div className="flex flex-row-reverse gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="max-w-[200px] text-right">
                <p className="mb-1 text-xs text-muted-foreground">You</p>
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  {interimText}
                </p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
