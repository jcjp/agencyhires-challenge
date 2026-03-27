import { NextRequest, NextResponse } from "next/server";
import { getUploadsPlaylist, getVideoStats, QuotaError } from "@/lib/youtube";
import { normalizeChannel, normalizeVideo, extractVideoIds, median } from "@/lib/normalize";
import { resolveChannel } from "@/lib/youtube";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ChannelMetricsResponse, WindowOption } from "@/types";

const VALID_WINDOWS: WindowOption[] = ["month", "7d", "30d"];
const MAX_VIDEOS = 50;

function getWindowStart(window: WindowOption): Date {
  const now = new Date();
  if (window === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  const days = window === "7d" ? 7 : 30;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { limited } = checkRateLimit(ip);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const channelId = request.nextUrl.searchParams.get("channelId");
  const windowParam = (request.nextUrl.searchParams.get("window") ?? "month") as WindowOption;

  if (!channelId) {
    return NextResponse.json({ error: "Missing channelId parameter" }, { status: 400 });
  }

  if (!VALID_WINDOWS.includes(windowParam)) {
    return NextResponse.json(
      { error: `Invalid window. Must be one of: ${VALID_WINDOWS.join(", ")}` },
      { status: 400 },
    );
  }

  const ck = cacheKey("metrics", channelId, windowParam);
  const cached = await cacheGet<ChannelMetricsResponse>(ck);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=300" },
    });
  }

  try {
    // 1. Fetch channel metadata
    const rawChannel = await resolveChannel({ type: "id", value: channelId });
    const channel = normalizeChannel(rawChannel);
    const uploadsPlaylistId = rawChannel.contentDetails.relatedPlaylists.uploads;

    // 2. Determine window
    const windowStart = getWindowStart(windowParam);

    // 3. Fetch playlist items (up to 120)
    const playlistItems = await getUploadsPlaylist(uploadsPlaylistId, windowStart, 120);

    // 4. Extract and de-duplicate video IDs
    const allIds = [...new Set(extractVideoIds(playlistItems))];

    // 5. Fetch video stats in batches
    const rawVideos = await getVideoStats(allIds);

    // 6. First pass: compute viewsPerDay for all to get median
    const windowStartDate = windowStart;
    const now = new Date();
    const tempViewsPerDay = rawVideos.map((v) => {
      const pub = new Date(v.snippet.publishedAt);
      const ageDays = Math.max((now.getTime() - pub.getTime()) / (1000 * 60 * 60 * 24), 1);
      return Math.round(Number(v.statistics.viewCount ?? 0) / ageDays);
    });
    const medianViewsPerDay = median(tempViewsPerDay);

    // 7. Normalize videos
    const videos = rawVideos
      .map((v) => normalizeVideo(v, windowStartDate, medianViewsPerDay))
      .sort((a, b) => b.viewsPerDay - a.viewsPerDay)
      .slice(0, MAX_VIDEOS);

    const response: ChannelMetricsResponse = {
      channel,
      videos,
      window: windowParam,
      analyzedAt: new Date().toISOString(),
      medianViewsPerDay,
    };

    await cacheSet(ck, response);

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=300" },
    });
  } catch (err) {
    if (err instanceof QuotaError) {
      return NextResponse.json(
        { error: "YouTube API quota exceeded. Please try again later.", code: "QUOTA_EXCEEDED" },
        { status: 503 },
      );
    }
    console.error("[channel-metrics]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
