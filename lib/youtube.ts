import type { ParsedChannel } from "./url-parser";

const BASE = "https://www.googleapis.com/youtube/v3";

function apiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

async function ytFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("key", apiKey());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const reason = (body as { error?: { errors?: { reason?: string }[] } })?.error?.errors?.[0]
      ?.reason;
    if (res.status === 403 && reason === "quotaExceeded") {
      throw new QuotaError("YouTube API quota exceeded");
    }
    throw new YouTubeApiError(`YouTube API error ${res.status}: ${JSON.stringify(body)}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types from YouTube Data API v3
// ---------------------------------------------------------------------------

export interface YTChannel {
  id: string;
  snippet: {
    title: string;
    customUrl?: string;
    thumbnails: { high?: { url: string }; default?: { url: string } };
  };
  statistics: {
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
  };
  contentDetails: {
    relatedPlaylists: { uploads: string };
  };
}

export interface YTPlaylistItem {
  snippet: {
    publishedAt: string;
    resourceId: { videoId: string };
    title: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
  };
}

export interface YTVideo {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails: {
    duration: string;
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function resolveChannel(parsed: ParsedChannel): Promise<YTChannel> {
  const parts = "snippet,statistics,contentDetails";

  if (parsed.type === "id") {
    const data = await ytFetch<{ items?: YTChannel[] }>("/channels", {
      part: parts,
      id: parsed.value,
    });
    const channel = data.items?.[0];
    if (!channel) throw new NotFoundError(`Channel not found: ${parsed.value}`);
    return channel;
  }

  if (parsed.type === "handle") {
    const handle = parsed.value.startsWith("@") ? parsed.value : `@${parsed.value}`;
    const data = await ytFetch<{ items?: YTChannel[] }>("/channels", {
      part: parts,
      forHandle: handle,
    });
    const channel = data.items?.[0];
    if (!channel) throw new NotFoundError(`Channel not found for handle: ${handle}`);
    return channel;
  }

  if (parsed.type === "username") {
    const data = await ytFetch<{ items?: YTChannel[] }>("/channels", {
      part: parts,
      forUsername: parsed.value,
    });
    const channel = data.items?.[0];
    if (!channel) throw new NotFoundError(`Channel not found for username: ${parsed.value}`);
    return channel;
  }

  // type === 'search' — fallback via search.list
  const searchData = await ytFetch<{ items?: { snippet: { channelId: string } }[] }>("/search", {
    part: "snippet",
    type: "channel",
    q: parsed.value,
    maxResults: "1",
  });
  const channelId = searchData.items?.[0]?.snippet?.channelId;
  if (!channelId) throw new NotFoundError(`Channel not found for: ${parsed.value}`);

  const data = await ytFetch<{ items?: YTChannel[] }>("/channels", {
    part: parts,
    id: channelId,
  });
  const channel = data.items?.[0];
  if (!channel) throw new NotFoundError(`Channel not found: ${channelId}`);
  return channel;
}

/**
 * Fetches video IDs from the uploads playlist published on or after `since`.
 * Stops paging once a video older than `since - bufferDays` is encountered.
 * Returns at most `maxResults` video IDs.
 */
export async function getUploadsPlaylist(
  uploadsPlaylistId: string,
  since: Date,
  maxResults = 120,
): Promise<YTPlaylistItem[]> {
  const bufferMs = 7 * 24 * 60 * 60 * 1000; // 7-day buffer
  const stopBefore = new Date(since.getTime() - bufferMs);

  const items: YTPlaylistItem[] = [];
  let pageToken: string | undefined;

  while (items.length < maxResults) {
    const params: Record<string, string> = {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch<{
      items?: YTPlaylistItem[];
      nextPageToken?: string;
    }>("/playlistItems", params);

    const page = data.items ?? [];

    let reachedEnd = false;
    for (const item of page) {
      const pub = new Date(item.snippet.publishedAt);
      if (pub < stopBefore) {
        reachedEnd = true;
        break;
      }
      items.push(item);
      if (items.length >= maxResults) {
        reachedEnd = true;
        break;
      }
    }

    if (reachedEnd || !data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return items;
}

/**
 * Fetches full video details (statistics + contentDetails) for up to N video IDs.
 * Batches requests in chunks of 50 (YouTube API limit).
 */
export async function getVideoStats(videoIds: string[]): Promise<YTVideo[]> {
  const results: YTVideo[] = [];
  const chunkSize = 50;

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    const data = await ytFetch<{ items?: YTVideo[] }>("/videos", {
      part: "snippet,statistics,contentDetails",
      id: chunk.join(","),
    });
    results.push(...(data.items ?? []));
  }

  return results;
}

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

export class YouTubeApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YouTubeApiError";
  }
}

export class QuotaError extends YouTubeApiError {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

export class NotFoundError extends YouTubeApiError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
