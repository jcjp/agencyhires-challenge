"use client";

import type { FilterState, SortField, WindowOption } from "@/types";
import type { Video } from "@/types";

interface FiltersBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  videos: Video[];
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "viewsPerDay", label: "Views / Day" },
  { value: "views", label: "Total Views" },
  { value: "likes", label: "Likes" },
  { value: "publishedAt", label: "Published Date" },
];

const WINDOW_OPTIONS: { value: WindowOption; label: string }[] = [
  { value: "month", label: "This Month" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

export function FiltersBar({ filters, onChange, videos }: FiltersBarProps) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function exportCsv() {
    const headers = [
      "Title",
      "Published",
      "Views",
      "Views/Day",
      "Likes",
      "Comments",
      "Trending",
      "In Window",
      "URL",
    ];
    const rows = videos.map((v) => [
      `"${v.title.replace(/"/g, '""')}"`,
      v.publishedAt,
      v.views,
      v.viewsPerDay,
      v.likes,
      v.comments,
      v.isTrending ? "Yes" : "No",
      v.inWindow ? "Yes" : "No",
      v.url,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youtube-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-3 items-end py-4 px-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
      {/* Search */}
      <div className="flex-1 min-w-48">
        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">
          Search
        </label>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Filter by title…"
          className="w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-50 bg-zinc-800 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">
          Sort by
        </label>
        <div className="flex gap-2">
          <select
            value={filters.sortField}
            onChange={(e) => set("sortField", e.target.value as SortField)}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-50 bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-150"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-zinc-800">
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => set("sortDirection", filters.sortDirection === "desc" ? "asc" : "desc")}
            aria-label={`Sort ${filters.sortDirection === "desc" ? "ascending" : "descending"}`}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-150"
          >
            {filters.sortDirection === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Window */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">
          Date Window
        </label>
        <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
          {WINDOW_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => set("window", o.value)}
              className={[
                "px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-150",
                filters.window === o.value
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
              ].join(" ")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min views */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">
          Min Views
        </label>
        <input
          type="number"
          min={0}
          value={filters.minViews || ""}
          onChange={(e) => set("minViews", Number(e.target.value) || 0)}
          placeholder="0"
          className="w-28 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-50 bg-zinc-800 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
        />
      </div>

      {/* In-window toggle */}
      <div className="flex items-end gap-2 pb-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={filters.inWindowOnly}
            onChange={(e) => set("inWindowOnly", e.target.checked)}
            className="rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-800"
          />
          <span className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors">
            In window only
          </span>
        </label>
      </div>

      {/* Export */}
      <button
        onClick={exportCsv}
        className="ml-auto rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-150"
      >
        Export CSV
      </button>
    </div>
  );
}
