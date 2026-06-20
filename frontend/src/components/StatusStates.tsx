import type { ReactNode } from "react";

import { IconAlert, IconInbox } from "./Icons";

interface SkeletonProps {
  className?: string;
}

interface LoadingStateProps {
  label?: string;
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-ink/[0.06] ${className}`} />
  );
}

export function LoadingState({ label = "Loading data..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />

      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-heat/20 bg-heat/5 py-16 text-center">
      <IconAlert className="text-heat" />

      <p className="max-w-sm text-sm text-ink">{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-1">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink-faint">
        <IconInbox />
      </div>

      <p className="font-display text-base font-semibold text-ink">{title}</p>

      {description && (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      )}

      {action}
    </div>
  );
}
