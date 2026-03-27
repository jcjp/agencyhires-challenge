import type { Channel, Video } from "@/types";
import type { YTChannel, YTVideo, YTPlaylistItem } from "./youtube";

export function normalizeChannel(raw: YTChannel): Channel {
  const thumbnail = raw.snippet.thumbnails.high?.url ?? raw.snippet.thumbnails.default?.url ?? "";

  const subscriberCount =
    raw.statistics.hiddenSubscriberCount || !raw.statistics.subscriberCount
      ? undefined
      : Number(raw.statistics.subscriberCount);

  return {
    id: raw.id,
    title: raw.snippet.title,
    customUrl: raw.snippet.customUrl,
    thumbnail,
    subscriberCount,
  };
}

export function normalizeVideo(raw: YTVideo, windowStart: Date, medianViewsPerDay: number): Video {
  const publishedAt = raw.snippet.publishedAt;
  const publishedDate = new Date(publishedAt);
  const now = new Date();

  const ageMs = now.getTime() - publishedDate.getTime();
  const ageDays = Math.max(ageMs / (1000 * 60 * 60 * 24), 1);

  const views = Number(raw.statistics.viewCount ?? 0);
  const likes = Number(raw.statistics.likeCount ?? 0);
  const comments = Number(raw.statistics.commentCount ?? 0);
  const viewsPerDay = Math.round(views / ageDays);

  const isTrending = medianViewsPerDay > 0 && viewsPerDay > medianViewsPerDay * 1.5;
  const inWindow = publishedDate >= windowStart;

  const thumbnail =
    raw.snippet.thumbnails.high?.url ??
    raw.snippet.thumbnails.medium?.url ??
    raw.snippet.thumbnails.default?.url ??
    "";

  return {
    id: raw.id,
    title: raw.snippet.title,
    publishedAt,
    thumbnail,
    url: `https://www.youtube.com/watch?v=${raw.id}`,
    views,
    likes,
    comments,
    duration: raw.contentDetails.duration,
    viewsPerDay,
    isTrending,
    inWindow,
  };
}

/**
 * Computes the median of an array of numbers.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

/**
 * Extracts video IDs from playlist items, preserving order.
 */
export function extractVideoIds(items: YTPlaylistItem[]): string[] {
  return items.map((item) => item.snippet.resourceId.videoId);
}

/**
 * Formats a subscriber count into a compact human-readable string.
 * e.g. 1200000 → "1.2M", 45000 → "45K"
 */
export function formatSubscriberCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

/**
 * Formats a number with locale-aware commas.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Parses ISO 8601 duration (e.g. PT4M13S) into a human-readable string.
 */
export function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = Number(match[1] ?? 0);
  const m = Number(match[2] ?? 0);
  const s = Number(match[3] ?? 0);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
