import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useRealtimeReload } from "../hooks/useRealtimeReload";

import { ErrorState, EmptyState, Skeleton } from "../components/StatusStates";

import Pagination from "../components/Pagination";

import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
} from "../components/Icons";

const PAGE_SIZE = 10;

interface Session {
  session_id: string;
  total_events: number;
  total_clicks: number;
  total_page_views: number;
  session_duration: number;
  first_event: string;
  last_event: string;
  pages_visited: string[];
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface SessionsResponse {
  data: Session[];
  pagination: PaginationData;
}

interface SortOption {
  key: string;
  label: string;
}

interface SortHeaderProps {
  option: SortOption;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
}

const SORT_OPTIONS: SortOption[] = [
  {
    key: "last_event",
    label: "Last activity",
  },
  {
    key: "total_events",
    label: "Events",
  },
  {
    key: "session_duration",
    label: "Duration",
  },
];

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 1) {
    return "< 1s";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.round(seconds % 60);

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (iso?: string): string => {
  if (!iso) {
    return "—";
  }

  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function SortHeader({ option, sortBy, sortOrder, onSort }: SortHeaderProps) {
  const active = sortBy === option.key;

  return (
    <button
      type="button"
      onClick={() => onSort(option.key)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide ${
        active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
      }`}
    >
      {option.label}

      {active ? (
        sortOrder === "asc" ? (
          <IconChevronUp className="h-3.5 w-3.5" />
        ) : (
          <IconChevronDown className="h-3.5 w-3.5" />
        )
      ) : null}
    </button>
  );
}

export default function Sessions() {
  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("last_event");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());

      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetcher = useCallback(
    () =>
      api.getSessions({
        page,
        limit: PAGE_SIZE,
        search,
        sortBy,
        sortOrder,
      }) as unknown as Promise<SessionsResponse>,
    [page, search, sortBy, sortOrder],
  );

  const { data, error, loading, reload } = useFetch<SessionsResponse>(fetcher, [
    page,
    search,
    sortBy,
    sortOrder,
  ]);

  useRealtimeReload(reload);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }

    setPage(1);
  };

  const sessions = data?.data ?? [];

  const pagination = data?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    totalCount: 0,
  };

  return (
    <div className="space-y-5">
      <div className="card p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by session ID..."
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {SORT_OPTIONS.map((option) => (
              <SortHeader
                key={option.key}
                option={option}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            ))}
          </div>
        </div>

        {loading && (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((skeleton) => (
              <Skeleton key={skeleton} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error.message} onRetry={reload} />
        )}

        {!loading && !error && sessions.length === 0 && (
          <EmptyState
            title="No sessions found"
            description={
              search
                ? `No sessions matched "${search}".`
                : "Run the seed script or generate some traffic from the demo site."
            }
          />
        )}

        {!loading && !error && sessions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    <th className="py-3 pr-4">Session ID</th>

                    <th className="py-3 pr-4">Total events</th>

                    <th className="py-3 pr-4">Duration</th>

                    <th className="py-3 pr-4">First activity</th>

                    <th className="py-3 pr-4">Last activity</th>

                    <th className="py-3" />
                  </tr>
                </thead>

                <tbody>
                  {sessions.map((session) => (
                    <tr
                      key={session.session_id}
                      className="border-b border-border last:border-0 hover:bg-ink/[0.02]"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-mono text-[13px] text-ink">
                          {session.session_id.slice(0, 8)}…
                        </span>
                      </td>

                      <td className="py-3 pr-4 text-ink">
                        {session.total_events}
                      </td>

                      <td className="py-3 pr-4 text-ink-muted">
                        {formatDuration(session.session_duration)}
                      </td>

                      <td className="py-3 pr-4 text-ink-muted">
                        {formatDate(session.first_event)}
                      </td>

                      <td className="py-3 pr-4 text-ink-muted">
                        {formatDate(session.last_event)}
                      </td>

                      <td className="py-3 text-right">
                        <Link
                          to={`/sessions/${session.session_id}`}
                          className="text-sm font-medium text-brand hover:underline"
                        >
                          View journey
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
