import { getCloudflareContext } from "@opennextjs/cloudflare";

const DEFAULT_TTL_SECONDS = 10 * 60; // 10 minutes

export async function cacheGet<T>(key: string): Promise<T | null> {
  const { env } = await getCloudflareContext({ async: true });
  return await env.CACHE_KV.get<T>(key, { type: "json" });
}

export async function cacheSet<T>(
  key: string,
  data: T,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): Promise<void> {
  const { env } = await getCloudflareContext({ async: true });
  await env.CACHE_KV.put(key, JSON.stringify(data), { expirationTtl: ttlSeconds });
}

export function cacheKey(...parts: string[]): string {
  return parts.join(":");
}
