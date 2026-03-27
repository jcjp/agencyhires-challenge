import { NextRequest, NextResponse } from "next/server";
import { parseChannelUrl, InvalidChannelUrlError } from "@/lib/url-parser";
import { resolveChannel, NotFoundError, QuotaError } from "@/lib/youtube";
import { normalizeChannel } from "@/lib/normalize";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ResolveChannelResponse } from "@/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { limited } = checkRateLimit(ip);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const channelUrl = request.nextUrl.searchParams.get("channelUrl");
  if (!channelUrl) {
    return NextResponse.json({ error: "Missing channelUrl parameter" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = parseChannelUrl(channelUrl);
  } catch (err) {
    if (err instanceof InvalidChannelUrlError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const ck = cacheKey("resolve", channelUrl);
  const cached = await cacheGet<ResolveChannelResponse>(ck);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=300" },
    });
  }

  try {
    const raw = await resolveChannel(parsed);
    const channel = normalizeChannel(raw);

    const response: ResolveChannelResponse = {
      channelId: channel.id,
      title: channel.title,
      thumbnail: channel.thumbnail,
    };

    await cacheSet(ck, response);

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=300" },
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }
    if (err instanceof QuotaError) {
      return NextResponse.json(
        { error: "YouTube API quota exceeded. Please try again later.", code: "QUOTA_EXCEEDED" },
        { status: 503 },
      );
    }
    console.error("[resolve-channel]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
