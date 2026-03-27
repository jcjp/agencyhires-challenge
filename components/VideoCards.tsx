import Image from "next/image";
import { formatNumber, parseDuration } from "@/lib/normalize";
import type { Video } from "@/types";

interface VideoCardsProps {
  videos: Video[];
}

function formatPublished(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function VideoCards({ videos }: VideoCardsProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm md:hidden">
        No videos match your filters.
      </div>
    );
  }

  return (
    <div className="md:hidden grid grid-cols-1 gap-3">
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-gray-200 bg-white p-3 hover:border-red-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="relative h-20 w-32 rounded-lg overflow-hidden shrink-0 bg-gray-100">
              <Image src={video.thumbnail} alt="" fill sizes="128px" className="object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                {video.title}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {video.isTrending && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    🔥 Trending
                  </span>
                )}
                {!video.inWindow && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    Outside window
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
            <Stat label="Views" value={formatNumber(video.views)} />
            <Stat label="Views/Day" value={formatNumber(video.viewsPerDay)} />
            <Stat label="Likes" value={formatNumber(video.likes)} />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{formatPublished(video.publishedAt)}</span>
            {video.duration && (
              <span className="text-xs text-gray-400">{parseDuration(video.duration)}</span>
            )}
            <span className="text-xs font-medium text-red-600">Watch →</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}
