import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useRealtimeReload } from "../hooks/useRealtimeReload";

import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/StatusStates";

import { IconArrowLeft, IconClick, IconEye } from "../components/Icons";

interface ClickCoordinates {
  x: number;
  y: number;
}

interface SessionEvent {
  event_type: "click" | "page_view";
  page_url: string;
  timestamp: string;
  click?: ClickCoordinates;
}

interface SessionJourneyResponse {
  session_id: string;
  data: SessionEvent[];
}

interface ApiError {
  message: string;
  status?: number;
}

const formatTime = (iso: string): string => {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatFullDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function SessionDetails() {
  const { sessionId } = useParams<{
    sessionId: string;
  }>();

  const fetcher = useCallback(() => {
    if (!sessionId) {
      return Promise.resolve(null);
    }

    return api.getSessionJourney(
      sessionId,
    ) as unknown as Promise<SessionJourneyResponse>;
  }, [sessionId]);

  const { data, error, loading, reload } =
    useFetch<SessionJourneyResponse | null>(fetcher, [sessionId]);

  useRealtimeReload(reload);

  const events = data?.data ?? [];

  const apiError = error as ApiError | null;

  return (
    <div className="space-y-5">
      <Link
        to="/sessions"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <IconArrowLeft className="h-4 w-4" />
        Back to sessions
      </Link>

      <div className="card p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Session
            </p>

            <p className="font-mono text-sm text-ink">{sessionId}</p>
          </div>

          {events.length > 0 && (
            <span className="badge bg-ink/5 text-ink-muted">
              {events.length} events
            </span>
          )}
        </div>

        {loading && <LoadingState label="Loading session journey..." />}

        {!loading &&
          apiError &&
          (apiError.status === 404 ? (
            <EmptyState
              title="Session not found"
              description={`No events exist for session "${sessionId}".`}
            />
          ) : (
            <ErrorState message={apiError.message} onRetry={reload} />
          ))}

        {!loading && !apiError && events.length === 0 && (
          <EmptyState title="No events in this session" />
        )}

        {!loading && !apiError && events.length > 0 && (
          <ol className="relative ml-3 space-y-6 border-l border-border pl-6">
            {events.map((event, index) => {
              const isClick = event.event_type === "click";

              const previousDate =
                index > 0 ? formatFullDate(events[index - 1].timestamp) : null;

              const currentDate = formatFullDate(event.timestamp);

              const showDateDivider =
                index === 0 || currentDate !== previousDate;

              return (
                <li key={`${event.timestamp}-${index}`} className="relative">
                  {showDateDivider && (
                    <p className="-ml-6 mb-3 pl-0 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      {currentDate}
                    </p>
                  )}

                  <span
                    className={`absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-canvas ${
                      isClick ? "bg-heat" : "bg-teal"
                    }`}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-medium text-ink">
                      {formatTime(event.timestamp)}
                    </span>

                    <span
                      className={isClick ? "badge-click" : "badge-pageview"}
                    >
                      {isClick ? (
                        <IconClick className="h-3 w-3" />
                      ) : (
                        <IconEye className="h-3 w-3" />
                      )}

                      {isClick ? "Click" : "Page view"}
                    </span>

                    <span className="font-mono text-sm text-ink-muted">
                      {event.page_url}
                    </span>

                    {isClick && event.click && (
                      <span className="rounded-md bg-ink/5 px-2 py-0.5 font-mono text-xs text-ink-muted">
                        x=
                        {event.click.x}, y=
                        {event.click.y}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
