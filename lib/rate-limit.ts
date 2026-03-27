interface WindowEntry {
  timestamps: number[];
}

const windows = new Map<string, WindowEntry>();

const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit(ip: string): { limited: boolean } {
  const now = Date.now();
  const entry = windows.get(ip) ?? { timestamps: [] };

  // Drop timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    windows.set(ip, entry);
    return { limited: true };
  }

  entry.timestamps.push(now);
  windows.set(ip, entry);
  return { limited: false };
}
