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
    <div className="flex flex-wrap gap-3 items-end py-3">
      {/* Search */}
      <div className="flex-1 min-w-40">
        <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Filter by title…"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Sort by</label>
        <div className="flex gap-1">
          <select
            value={filters.sortField}
            onChange={(e) => set("sortField", e.target.value as SortField)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => set("sortDirection", filters.sortDirection === "desc" ? "asc" : "desc")}
            aria-label={`Sort ${filters.sortDirection === "desc" ? "ascending" : "descending"}`}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {filters.sortDirection === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Window */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Date Window</label>
        <div className="flex rounded-md border border-gray-300 overflow-hidden">
          {WINDOW_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => set("window", o.value)}
              className={[
                "px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500",
                filters.window === o.value
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min views */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Min Views</label>
        <input
          type="number"
          min={0}
          value={filters.minViews || ""}
          onChange={(e) => set("minViews", Number(e.target.value) || 0)}
          placeholder="0"
          className="w-28 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* In-window toggle */}
      <div className="flex items-end gap-1.5">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inWindowOnly}
            onChange={(e) => set("inWindowOnly", e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-700">In window only</span>
        </label>
      </div>

      {/* Export */}
      <button
        onClick={exportCsv}
        className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        Export CSV
      </button>
    </div>
  );
}
