import Image from "next/image";
import { formatNumber, parseDuration } from "@/lib/normalize";
import type { Video, SortField, SortDirection } from "@/types";

interface VideosTableProps {
  videos: Video[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const COLUMNS: { field: SortField | null; label: string; align?: "right" }[] = [
  { field: null, label: "Video" },
  { field: "publishedAt", label: "Published", align: "right" },
  { field: "views", label: "Views", align: "right" },
  { field: "viewsPerDay", label: "Views/Day", align: "right" },
  { field: "likes", label: "Likes", align: "right" },
];

function formatPublished(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function VideosTable({ videos, sortField, sortDirection, onSort }: VideosTableProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-24 text-zinc-500 text-sm">No videos match your filters.</div>
    );
  }

  return (
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-zinc-800 text-sm">
        <thead className="bg-zinc-900 sticky top-0 z-10">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                scope="col"
                onClick={col.field ? () => onSort(col.field!) : undefined}
                className={[
                  "px-6 py-4 font-medium text-zinc-400 whitespace-nowrap text-xs tracking-wide uppercase",
                  col.align === "right" ? "text-right" : "text-left",
                  col.field
                    ? "cursor-pointer hover:text-zinc-200 select-none transition-colors duration-150"
                    : "",
                ].join(" ")}
              >
                {col.label}
                {col.field === sortField && (
                  <span className="ml-1.5 text-emerald-400">
                    {sortDirection === "desc" ? "↓" : "↑"}
                  </span>
                )}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-4 text-left font-medium text-zinc-400 text-xs tracking-wide uppercase"
            >
              Trend
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/40">
          {videos.map((video) => (
            <tr
              key={video.id}
              onClick={() => window.open(video.url, "_blank", "noopener,noreferrer")}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.open(video.url, "_blank", "noopener,noreferrer");
                }
              }}
              role="link"
              aria-label={`Open ${video.title} on YouTube`}
              className="cursor-pointer hover:bg-zinc-800/40 focus:outline-none focus:bg-zinc-800/40 transition-colors duration-150 group"
            >
              {/* Thumbnail + title */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-14 w-24 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-zinc-700">
                    <Image
                      src={video.thumbnail}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-50 line-clamp-2 leading-snug">
                      {video.title}
                    </p>
                    {video.duration && (
                      <p className="text-xs text-zinc-500 mt-1 font-mono">
                        {parseDuration(video.duration)}
                      </p>
                    )}
                    {!video.inWindow && (
                      <span className="inline-block mt-1 text-xs text-zinc-600 font-mono">
                        outside window
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-right text-zinc-400 tabular-nums whitespace-nowrap">
                {formatPublished(video.publishedAt)}
              </td>
              <td className="px-6 py-4 text-right font-medium text-zinc-200 tabular-nums whitespace-nowrap">
                {formatNumber(video.views)}
              </td>
              <td className="px-6 py-4 text-right text-zinc-300 tabular-nums whitespace-nowrap">
                {formatNumber(video.viewsPerDay)}
              </td>
              <td className="px-6 py-4 text-right text-zinc-400 tabular-nums whitespace-nowrap">
                {formatNumber(video.likes)}
              </td>
              <td className="px-6 py-4">
                {video.isTrending ? (
                  <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 text-xs font-medium leading-none text-emerald-400">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="leading-none">Trending</span>
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
