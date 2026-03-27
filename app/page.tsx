"use client";

import { useState, useMemo } from "react";
import { ChannelInput } from "@/components/ChannelInput";
import { ResultsHeader } from "@/components/ResultsHeader";
import { FiltersBar } from "@/components/FiltersBar";
import { VideosTable } from "@/components/VideosTable";
import { VideoCards } from "@/components/VideoCards";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import type {
  AppState,
  FilterState,
  SortField,
  ChannelMetricsResponse,
  WindowOption,
} from "@/types";

const DEFAULT_FILTERS: FilterState = {
  sortField: "viewsPerDay",
  sortDirection: "desc",
  window: "month",
  minViews: 0,
  search: "",
  inWindowOnly: false,
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>({ status: "idle" });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [lastChannelId, setLastChannelId] = useState<string | null>(null);

  async function handleChannelSubmit(channelUrl: string) {
    setAppState({ status: "loading" });
    setFilters(DEFAULT_FILTERS);

    try {
      // Step 1: resolve channel URL → channelId
      const resolveRes = await fetch(
        `/api/resolve-channel?channelUrl=${encodeURIComponent(channelUrl)}`,
      );
      const resolveData = await resolveRes.json();
      if (!resolveRes.ok) {
        setAppState({
          status: "error",
          message: resolveData.error ?? "Failed to find channel.",
          code: resolveData.code,
        });
        return;
      }

      const channelId: string = resolveData.channelId;
      setLastChannelId(channelId);

      // Step 2: fetch metrics
      await fetchMetrics(channelId, DEFAULT_FILTERS.window);
    } catch {
      setAppState({ status: "error", message: "Network error. Please check your connection." });
    }
  }

  async function fetchMetrics(channelId: string, window: WindowOption) {
    setAppState({ status: "loading" });

    try {
      const metricsRes = await fetch(
        `/api/channel-metrics?channelId=${encodeURIComponent(channelId)}&window=${window}`,
      );
      const metricsData: ChannelMetricsResponse & { error?: string; code?: string } =
        await metricsRes.json();

      if (!metricsRes.ok) {
        setAppState({
          status: "error",
          message: metricsData.error ?? "Failed to load metrics.",
          code: metricsData.code,
        });
        return;
      }

      setAppState({ status: "success", data: metricsData });
      setFilters((f) => ({ ...f, window }));
    } catch {
      setAppState({ status: "error", message: "Network error. Please check your connection." });
    }
  }

  function handleFiltersChange(newFilters: FilterState) {
    const windowChanged = newFilters.window !== filters.window;
    setFilters(newFilters);
    if (windowChanged && lastChannelId) {
      void fetchMetrics(lastChannelId, newFilters.window);
    }
  }

  function handleSort(field: SortField) {
    setFilters((f) => ({
      ...f,
      sortField: field,
      sortDirection: f.sortField === field && f.sortDirection === "desc" ? "asc" : "desc",
    }));
  }

  const filteredVideos = useMemo(() => {
    if (appState.status !== "success") return [];
    let videos = [...appState.data.videos];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      videos = videos.filter((v) => v.title.toLowerCase().includes(q));
    }

    if (filters.minViews > 0) {
      videos = videos.filter((v) => v.views >= filters.minViews);
    }

    if (filters.inWindowOnly) {
      videos = videos.filter((v) => v.inWindow);
    }

    videos.sort((a, b) => {
      const aVal =
        filters.sortField === "publishedAt"
          ? new Date(a.publishedAt).getTime()
          : (a[filters.sortField] as number);
      const bVal =
        filters.sortField === "publishedAt"
          ? new Date(b.publishedAt).getTime()
          : (b[filters.sortField] as number);
      return filters.sortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });

    return videos;
  }, [appState, filters]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="text-red-600 text-2xl font-black tracking-tight select-none">▶</div>
          <span className="text-gray-900 font-semibold text-base">YouTube Channel Analyzer</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Idle: landing */}
        {appState.status === "idle" && (
          <div className="flex flex-col items-center justify-center py-16 gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                What&apos;s crushing it this month?
              </h1>
              <p className="text-gray-500 text-base max-w-md">
                Paste a YouTube channel URL to instantly see which videos are performing best —
                views, views/day, likes, and trending signals.
              </p>
            </div>
            <ChannelInput onSubmit={handleChannelSubmit} />
          </div>
        )}

        {/* Loading */}
        {appState.status === "loading" && <LoadingSkeleton />}

        {/* Error */}
        {appState.status === "error" && (
          <div className="flex flex-col items-center gap-6 py-8">
            <ErrorState
              message={appState.message}
              code={appState.code}
              onRetry={() => setAppState({ status: "idle" })}
            />
          </div>
        )}

        {/* Success */}
        {appState.status === "success" && (
          <div className="space-y-4">
            <ResultsHeader
              channel={appState.data.channel}
              window={appState.data.window}
              analyzedAt={appState.data.analyzedAt}
              onBack={() => setAppState({ status: "idle" })}
            />

            <FiltersBar filters={filters} onChange={handleFiltersChange} videos={filteredVideos} />

            <VideosTable
              videos={filteredVideos}
              sortField={filters.sortField}
              sortDirection={filters.sortDirection}
              onSort={handleSort}
            />

            <VideoCards videos={filteredVideos} />

            <p className="text-xs text-gray-400 text-center pt-2">
              Public metrics from YouTube Data API v3. Views/Day and Trending are derived estimates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
