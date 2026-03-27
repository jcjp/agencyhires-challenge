export type ParsedChannel =
  | { type: "id"; value: string }
  | { type: "handle"; value: string }
  | { type: "username"; value: string }
  | { type: "search"; value: string };

/**
 * Parses a YouTube channel URL or ID into a structured lookup strategy.
 *
 * Supported formats:
 *   https://youtube.com/channel/UCxxxxx
 *   https://youtube.com/@handle
 *   https://youtube.com/c/customname
 *   https://youtube.com/user/username
 *   UCxxxxx  (bare channel ID)
 *   @handle  (bare handle)
 */
export function parseChannelUrl(input: string): ParsedChannel {
  const trimmed = input.trim();

  // Bare channel ID
  if (/^UC[\w-]{21,}$/.test(trimmed)) {
    return { type: "id", value: trimmed };
  }

  // Bare handle: @handle
  if (/^@[\w.-]+$/.test(trimmed)) {
    return { type: "handle", value: trimmed };
  }

  let url: URL;
  try {
    // Add protocol if missing so URL can be parsed
    const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    url = new URL(withProtocol);
  } catch {
    throw new InvalidChannelUrlError(`Cannot parse URL: ${trimmed}`);
  }

  if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
    throw new InvalidChannelUrlError(`Not a YouTube URL: ${trimmed}`);
  }

  const parts = url.pathname.split("/").filter(Boolean);

  // /channel/UCxxxxx
  if (parts[0] === "channel" && parts[1]) {
    return { type: "id", value: parts[1] };
  }

  // /@handle
  if (parts[0]?.startsWith("@")) {
    return { type: "handle", value: parts[0] };
  }

  // /user/username
  if (parts[0] === "user" && parts[1]) {
    return { type: "username", value: parts[1] };
  }

  // /c/customname
  if (parts[0] === "c" && parts[1]) {
    return { type: "search", value: parts[1] };
  }

  // Single path segment that looks like a custom URL slug
  if (parts.length === 1 && parts[0] && !["watch", "playlist", "shorts"].includes(parts[0])) {
    return { type: "search", value: parts[0] };
  }

  throw new InvalidChannelUrlError(`Unrecognized YouTube channel URL format: ${trimmed}`);
}

export class InvalidChannelUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidChannelUrlError";
  }
}
