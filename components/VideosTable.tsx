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
      <div className="text-center py-16 text-gray-500 text-sm">No videos match your filters.</div>
    );
  }

  return (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                scope="col"
                onClick={col.field ? () => onSort(col.field!) : undefined}
                className={[
                  "px-4 py-3 font-semibold text-gray-600 whitespace-nowrap",
                  col.align === "right" ? "text-right" : "text-left",
                  col.field ? "cursor-pointer hover:text-gray-900 select-none" : "",
                ].join(" ")}
              >
                {col.label}
                {col.field === sortField && (
                  <span className="ml-1 text-red-500">{sortDirection === "desc" ? "↓" : "↑"}</span>
                )}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-600">
              Trend
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
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
              className="cursor-pointer hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors"
            >
              {/* Thumbnail + title */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-20 rounded overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={video.thumbnail}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2 leading-tight">
                      {video.title}
                    </p>
                    {video.duration && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {parseDuration(video.duration)}
                      </p>
                    )}
                    {!video.inWindow && (
                      <span className="inline-block mt-1 text-xs text-gray-400 italic">
                        outside window
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-right text-gray-600 tabular-nums whitespace-nowrap">
                {formatPublished(video.publishedAt)}
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums whitespace-nowrap">
                {formatNumber(video.views)}
              </td>
              <td className="px-4 py-3 text-right text-gray-700 tabular-nums whitespace-nowrap">
                {formatNumber(video.viewsPerDay)}
              </td>
              <td className="px-4 py-3 text-right text-gray-600 tabular-nums whitespace-nowrap">
                {formatNumber(video.likes)}
              </td>
              <td className="px-4 py-3">
                {video.isTrending ? (
                  <span className="inline-flex items-center justify-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium leading-none text-green-700">
                    <span className="leading-none">🔥</span>
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
