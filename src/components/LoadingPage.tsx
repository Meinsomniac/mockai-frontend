import { Spinner } from "@/components/ui/spinner"

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
