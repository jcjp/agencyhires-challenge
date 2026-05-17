"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-50 font-semibold text-sm tracking-tight">
              Channel Analytics
            </span>
          </div>
        </div>
      </header>

      {/* Idle: landing - centered, no scroll */}
      {appState.status === "idle" && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="flex flex-col items-center justify-center gap-8 w-full max-w-7xl">
            <div className="flex flex-col items-center gap-6">
              <Image
                src="/logo.svg"
                alt="Channel Analytics"
                width={64}
                height={64}
                className="w-16 h-16"
              />
              <div className="text-center space-y-3 max-w-2xl">
                <p className="text-sm text-zinc-500 font-medium">Performance Intelligence</p>
                <h1 className="text-5xl md:text-6xl font-semibold text-zinc-50 tracking-tight leading-[0.95]">
                  Identify top-performing content
                </h1>
                <p className="text-base leading-7 text-zinc-400 max-w-lg mx-auto">
                  Analyze any YouTube channel to surface high-momentum videos, engagement patterns,
                  and trending signals across configurable time windows.
                </p>
              </div>
            </div>
            <ChannelInput onSubmit={handleChannelSubmit} />
          </div>
        </div>
      )}

      {/* Loading */}
      {appState.status === "loading" && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-7xl">
            <LoadingSkeleton />
          </div>
        </div>
      )}

      {/* Error */}
      {appState.status === "error" && (
        <div className="flex-1 flex items-center justify-center px-6">
          <ErrorState
            message={appState.message}
            code={appState.code}
            onRetry={() => setAppState({ status: "idle" })}
          />
        </div>
      )}

      {/* Success - scrollable */}
      {appState.status === "success" && (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 w-full">
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

          <div className="pt-8 pb-4">
            <p className="text-xs text-zinc-600 text-center font-mono">
              Data: YouTube API v3 · Views/Day and Trending metrics are calculated estimates
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
