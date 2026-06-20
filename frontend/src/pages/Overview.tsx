import { useCallback } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useRealtimeReload } from "../hooks/useRealtimeReload";

import api from "../services/api";
import { useFetch } from "../hooks/useFetch";

import SummaryCard from "../components/SummaryCard";

import {
  LoadingState,
  ErrorState,
  EmptyState,
  Skeleton,
} from "../components/StatusStates";

import { IconUsers, IconInbox, IconClick, IconEye } from "../components/Icons";

interface Summary {
  totalSessions: number;
  totalEvents: number;
  totalClicks: number;
  totalPageViews: number;
}

interface TopPage {
  page_url: string;
  visits: number;
}

interface EventDistribution {
  event_type: string;
  count: number;
}

interface OverviewResponse {
  summary: Summary;
  topPages: TopPage[];
  eventDistribution: EventDistribution[];
}

const EVENT_COLORS: Record<string, string> = {
  click: "#EF4444",
  page_view: "#00B8A9",
};

const EVENT_LABELS: Record<string, string> = {
  click: "Clicks",
  page_view: "Page views",
};

export default function Overview() {
  const fetcher = useCallback(
    () => api.getOverview() as unknown as Promise<OverviewResponse>,
    [],
  );

  const { data, error, loading, reload } = useFetch<OverviewResponse>(
    fetcher,
    [],
  );

  useRealtimeReload(reload);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[84px]" />
          ))}
        </div>

        <LoadingState label="Crunching the numbers..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={reload} />;
  }

  const summary = data?.summary ?? {
    totalSessions: 0,
    totalEvents: 0,
    totalClicks: 0,
    totalPageViews: 0,
  };

  const topPages = data?.topPages ?? [];

  const eventDistribution = (data?.eventDistribution ?? []).map((item) => ({
    ...item,
    label: EVENT_LABELS[item.event_type] ?? item.event_type,
    color: EVENT_COLORS[item.event_type] ?? "#9A9DA6",
  }));

  const noDataAtAll = summary.totalEvents === 0;

  if (noDataAtAll) {
    return (
      <EmptyState
        title="No events recorded yet"
        description="Run the seed script, or open the demo site with tracker.js installed and start clicking around."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total sessions"
          value={summary.totalSessions}
          icon={IconUsers}
          accent="brand"
        />

        <SummaryCard
          label="Total events"
          value={summary.totalEvents}
          icon={IconInbox}
          accent="ink"
        />

        <SummaryCard
          label="Total clicks"
          value={summary.totalClicks}
          icon={IconClick}
          accent="heat"
        />

        <SummaryCard
          label="Total page views"
          value={summary.totalPageViews}
          icon={IconEye}
          accent="teal"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">
              Top pages
            </h2>

            <Link
              to="/heatmap"
              className="text-sm font-medium text-brand hover:underline"
            >
              View heatmap →
            </Link>
          </div>

          {topPages.length === 0 ? (
            <EmptyState title="No page visits yet" />
          ) : (
            <ul className="space-y-3">
              {topPages.map((page, index) => {
                const max = topPages[0]?.visits || 1;

                const widthPct = Math.max(
                  6,
                  Math.round((page.visits / max) * 100),
                );

                return (
                  <li key={page.page_url} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-xs font-medium text-ink-faint">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-sm text-ink">
                          {page.page_url}
                        </span>

                        <span className="shrink-0 text-sm font-medium text-ink-muted">
                          {page.visits}
                        </span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-ink/[0.06]">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-brand to-teal"
                          style={{
                            width: `${widthPct}%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">
            Event distribution
          </h2>

          {eventDistribution.length === 0 ? (
            <EmptyState title="No events to chart" />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventDistribution}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {eventDistribution.map((entry) => (
                      <Cell
                        key={entry.event_type}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E7E5E1",
                      fontSize: 13,
                    }}
                    formatter={(value, name) => [value, name]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-ink-muted">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
