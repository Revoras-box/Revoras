import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /** Plain-language explanation of what failed — never a raw status code or stack trace. */
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  className,
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
  retryLabel = "Retry",
  ...props
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 px-6 text-center", className)} {...props}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-container text-on-error-container mb-1">
        <AlertTriangle size={ICON_SIZE.lg} />
      </div>
      <h3 className="font-headline text-base font-semibold text-on-surface">{title}</h3>
      <p className="text-sm text-muted max-w-xs">{description}</p>
      {onRetry ? (
        <Button intent="outline" size="sm" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
