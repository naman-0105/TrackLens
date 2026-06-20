import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type {
  OverviewResponse,
  SessionsResponse,
  HeatmapResponse,
  SessionJourneyResponse,
  PagesResponse,
  ErrorResponse,
} from "../types/analytics";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export interface ApiError {
  message: string;
  status: number | null;
  details?: unknown;
}

export interface SessionParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const normalizeError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response) {
      return {
        message:
          axiosError.response.data?.message || "The server returned an error.",
        status: axiosError.response.status,
        details: axiosError.response.data?.details,
      };
    }

    if (axiosError.request) {
      return {
        message: "Could not reach the API. Is the backend server running?",
        status: null,
      };
    }
  }

  return {
    message: error instanceof Error ? error.message : "Something went wrong.",
    status: null,
  };
};

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await client.request<T>(config);

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

const api = {
  getOverview: () =>
    request<OverviewResponse>({
      method: "GET",
      url: "/stats/overview",
    }),

  getSessions: (params: SessionParams) =>
    request<SessionsResponse>({
      method: "GET",
      url: "/sessions",
      params,
    }),

  getSessionJourney: (sessionId: string) =>
    request<SessionJourneyResponse>({
      method: "GET",
      url: `/sessions/${encodeURIComponent(sessionId)}`,
    }),

  getHeatmap: (pageUrl: string) =>
    request<HeatmapResponse>({
      method: "GET",
      url: "/heatmap",
      params: {
        pageUrl,
      },
    }),

  getPages: () =>
    request<PagesResponse>({
      method: "GET",
      url: "/pages",
    }),
};

export default api;
