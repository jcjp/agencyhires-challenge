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
      <div className="text-center py-24 text-zinc-500 text-sm md:hidden">
        No videos match your filters.
      </div>
    );
  }

  return (
    <div className="md:hidden grid grid-cols-1 gap-4">
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-4 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 group"
        >
          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="relative h-20 w-32 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-zinc-700">
              <Image
                src={video.thumbnail}
                alt=""
                fill
                sizes="128px"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-50 text-sm line-clamp-2 leading-snug">
                {video.title}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {video.isTrending && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Trending
                  </span>
                )}
                {!video.inWindow && (
                  <span className="rounded-lg bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500 font-mono">
                    outside window
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-800">
            <Stat label="Views" value={formatNumber(video.views)} />
            <Stat label="Views/Day" value={formatNumber(video.viewsPerDay)} />
            <Stat label="Likes" value={formatNumber(video.likes)} />
          </div>

          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-zinc-500 font-mono">{formatPublished(video.publishedAt)}</span>
            {video.duration && (
              <span className="text-zinc-500 font-mono">{parseDuration(video.duration)}</span>
            )}
            <span className="text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
              Watch →
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-zinc-200 tabular-nums mt-1">{value}</p>
    </div>
  );
}
