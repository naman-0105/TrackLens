export interface OverviewResponse {
  summary: {
    totalEvents: number;
    totalClicks: number;
    totalPageViews: number;
    totalSessions: number;
  };
  topPages: TopPage[];
  eventDistribution: EventDistribution[];
}

export interface SessionsResponse {
  data: Session[];
  pagination: PaginationData;
}

export interface HeatmapResponse {
  page_url: string;
  click_count: number;
  total_sessions: number;
  snapshot: string | null;
  data: HeatmapPoint[];
}

export interface SessionJourneyResponse {
  session_id: string;
  data: SessionEvent[];
}

export interface TopPage {
  url: string;
  title?: string;
  views: number;
  clicks?: number;
}

export interface EventDistribution {
  eventType: string;
  count: number;
}

export interface Session {
  session_id: string;
  user_id?: string;
  started_at: string;
  ended_at?: string;
  events?: SessionEvent[];
}

export interface PaginationData {
  page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  count: number;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface SessionEvent {
  timestamp: string;
  type: string;
  metadata?: Record<string, JsonObject>;
}

export interface PagesResponse {
  success: boolean;
  data: string[];
}

export interface ErrorResponse {
  message?: string;
  details?: unknown;
}