import { useCallback, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import api from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useRealtimeReload } from "../hooks/useRealtimeReload";

import {
  LoadingState,
  ErrorState,
  EmptyState,
  Skeleton,
} from "../components/StatusStates";

import {
  IconZoomIn,
  IconZoomOut,
  IconUsers,
  IconClick,
} from "../components/Icons";

interface HeatmapPoint {
  x: number;
  y: number;
}

interface HoveredPoint {
  idx: number;
  x: number;
  y: number;
}

interface PagesResponse {
  data: string[];
}

interface HeatmapResponse {
  data: HeatmapPoint[];
  click_count: number;
  total_sessions: number;
  snapshot: string | null;
}

interface LayoutContext {
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1;

export default function Heatmap() {
  const [selectedPage, setSelectedPage] = useState("");
  const [zoom, setZoom] = useState(0.8);
  const [hovered, setHovered] = useState<HoveredPoint | null>(null);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setSidebarCollapsed } = useOutletContext<LayoutContext>();

  const pagesFetcher = useCallback(
    () => api.getPages() as Promise<PagesResponse>,
    [],
  );

  const {
    data: pagesData,
    error: pagesError,
    loading: pagesLoading,
  } = useFetch<PagesResponse>(pagesFetcher, []);

  const pages = pagesData?.data ?? [];
  const effectiveSelectedPage = selectedPage || pages[0] || "";

  const heatmapFetcher = useCallback(() => {
    if (!effectiveSelectedPage) {
      return Promise.resolve(null);
    }

    return api.getHeatmap(effectiveSelectedPage) as Promise<HeatmapResponse>;
  }, [effectiveSelectedPage]);

  const {
    data: heatmapData,
    error: heatmapError,
    loading: heatmapLoading,
    reload,
  } = useFetch<HeatmapResponse | null>(heatmapFetcher, [selectedPage]);

  useRealtimeReload(reload);

  const points = heatmapData?.data ?? [];
  const snapshot = heatmapData?.snapshot ?? null;

  const adjustZoom = (delta: number) => {
    setZoom((current) => {
      const next = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Math.round((current + delta) * 100) / 100),
      );

      if (next > 0.8) {
        setSidebarCollapsed(true);
      }

      return next;
    });
  };

  const handleImageLoad = () => {
    if (!imgRef.current || !containerRef.current) return;

    const naturalWidth = imgRef.current.naturalWidth;
    const naturalHeight = imgRef.current.naturalHeight;

    setImageSize({
      width: naturalWidth,
      height: naturalHeight,
    });
  };

  if (pagesLoading) {
    return <LoadingState label="Loading available pages..." />;
  }

  if (pagesError) {
    return <ErrorState message={pagesError.message} />;
  }

  if (pages.length === 0) {
    return (
      <EmptyState
        title="No pages tracked yet"
        description="Generate some traffic first."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="card flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Page</label>

            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="input min-w-[220px]"
            >
              {pages.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <IconClick className="h-4 w-4 text-heat" />
            <span>{heatmapData?.click_count ?? 0}</span>
            clicks
          </div>

          <div className="flex items-center gap-2 text-sm">
            <IconUsers className="h-4 w-4 text-brand" />
            <span>{heatmapData?.total_sessions ?? 0}</span>
            sessions
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <button
              onClick={() => adjustZoom(-ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              className="flex h-8 w-8 items-center justify-center rounded-md"
            >
              <IconZoomOut className="h-4 w-4" />
            </button>

            <span className="w-12 text-center text-xs">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => adjustZoom(ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              className="flex h-8 w-8 items-center justify-center rounded-md"
            >
              <IconZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5">
        {heatmapLoading && <Skeleton className="h-[600px] w-full" />}

        {!heatmapLoading && heatmapError && (
          <ErrorState message={heatmapError.message} onRetry={reload} />
        )}

        {!heatmapLoading && !heatmapError && !snapshot && (
          <EmptyState
            title="No snapshot available"
            description="Snapshot will be generated automatically on the first page visit."
          />
        )}

        {!heatmapLoading && !heatmapError && snapshot && (
          <div
            ref={containerRef}
            className="overflow-hidden"
            style={{
              width: imageSize.width > 0 ? Math.min(imageSize.width * zoom, 1340) : "100%",
              height: imageSize.height > 0 ? imageSize.height * zoom : "600px",
            }}
          >
            <div
              className="relative"
              style={{
                width: imageSize.width * zoom,
                height: imageSize.height * zoom,
              }}
            >
              <img
                ref={imgRef}
                src={`http://localhost:5000${snapshot}`}
                alt="Page Snapshot"
                className="block"
                onLoad={handleImageLoad}
                style={{
                  width: imageSize.width * zoom,
                  height: imageSize.height * zoom,
                }}
              />

              {imageSize.width > 0 &&
                points.map((point, idx) => {
                  const px = point.x * imageSize.width * zoom;
                  const py = point.y * imageSize.height * zoom;

                  return (
                    <div
                      key={`${px}-${py}-${idx}`}
                      onMouseEnter={() => setHovered({ idx, x: px, y: py })}
                      onMouseLeave={() => setHovered(null)}
                      className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
                      style={{ left: px, top: py, opacity: 0.65 }}
                    />
                  );
                })}

              {hovered && (
                <div
                  className="absolute z-50 rounded-md bg-black px-2 py-1 text-xs text-white"
                  style={{
                    left: hovered.x,
                    top: hovered.y - 30,
                  }}
                >
                  x: {hovered.x}, y: {hovered.y}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
