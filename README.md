# YouTube Channel Analyzer

A full-stack web application that fetches YouTube channel performance metrics via the YouTube Data API v3 and displays analytics in a fast, responsive UI. Built for the AgencyHires challenge.

**Live demo**: Deployable to Cloudflare Workers via OpenNext.

---

## Features

- Analyze any YouTube channel by URL, handle (`@channel`), channel ID, or custom URL
- View per-video metrics: total views, views/day, likes, comments
- "Trending" detection — videos with views/day > 1.5× the channel median
- Filter by time window (This Month / 7 days / 30 days), search by title, sort by any metric
- Minimum views threshold filter
- Export filtered results to CSV
- Responsive layout: sortable table on desktop, cards on mobile
- Cloudflare KV caching (10-minute TTL) to reduce API quota usage
- Per-IP rate limiting (20 req/min) on API routes

---

## Project Structure

```
agencyhires-challenge/
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── channel-metrics/    # Fetch video stats for a channel
│   │   │   └── route.ts
│   │   └── resolve-channel/    # Resolve a YouTube URL → channel ID
│   │       └── route.ts
│   ├── globals.css             # Tailwind CSS v4 global styles
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Main page (client component, state machine)
│
├── components/
│   ├── ChannelInput.tsx        # URL input form
│   ├── ErrorState.tsx          # Error display with retry
│   ├── FiltersBar.tsx          # Search, sort, window, CSV export controls
│   ├── LoadingSkeleton.tsx     # Animated skeleton during data fetch
│   ├── ResultsHeader.tsx       # Channel avatar, title, subscriber count
│   ├── VideoCards.tsx          # Mobile card layout
│   └── VideosTable.tsx         # Desktop sortable table
│
├── lib/
│   ├── cache.ts                # Cloudflare KV caching layer
│   ├── normalize.ts            # Data transforms + metric calculations
│   ├── normalize.test.ts       # Unit tests
│   ├── rate-limit.ts           # In-memory per-IP rate limiter
│   ├── url-parser.ts           # Parse YouTube URLs / IDs / handles
│   ├── url-parser.test.ts      # Unit tests
│   └── youtube.ts              # YouTube Data API v3 client
│
├── types/
│   └── index.ts                # Shared TypeScript interfaces
│
├── .env.example                # Required environment variables
├── next.config.ts              # Next.js config (image domains)
├── open-next.config.ts         # OpenNext / Cloudflare Workers config
├── vite.config.ts              # Vite+ toolchain config
└── wrangler.jsonc              # Cloudflare Workers + KV namespace config
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [YouTube Data API v3](https://console.cloud.google.com/) key
- [Vite+](https://viteplus.dev) CLI (`vp`) installed globally
- (Optional) A Cloudflare account with a Workers KV namespace for caching

### Installation

```bash
vp install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your key:

```bash
cp .env.example .env
```

```env
YOUTUBE_API_KEY=your_api_key_here
```

### Development

```bash
vp dev
```

Open [http://localhost:3000](http://localhost:3000).

### Tests

```bash
vp test
```

### Lint + Type-check

```bash
vp check
```

---

## Deployment (Cloudflare Workers)

The app targets Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare). The KV namespace for caching must be created in your Cloudflare dashboard and its ID set in `wrangler.jsonc`.

```bash
# Preview locally against the Workers runtime
pnpm run preview

# Deploy to Cloudflare
pnpm run deploy
```

Set `YOUTUBE_API_KEY` as a Cloudflare Worker secret:

```bash
wrangler secret put YOUTUBE_API_KEY
```

---

## Architecture

### Framework: Next.js App Router on Cloudflare Workers

**Why Next.js?** The App Router gives a clean separation between server-side API routes (quota-sensitive YouTube calls stay server-side, keeping the API key off the client) and a React client for the interactive UI. File-system routing keeps the project minimal — no separate Express server needed.

**Why Cloudflare Workers via OpenNext?** Cloudflare Workers run at the edge, globally distributed, with cold-start times in the low milliseconds. Workers KV is a natural fit for caching YouTube API responses close to users. The [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) bridges the gap between Next.js conventions and the Workers runtime.

**Trade-off:** The Workers runtime is not Node.js — some Node APIs are unavailable. This ruled out heavier server-side libraries and required keeping dependencies lean. In-memory rate limiting is also per-isolate rather than globally consistent, which is acceptable for a challenge demo but would need a Durable Object or KV counter in production.

---

### Two-Route API Design

| Route | Purpose |
|---|---|
| `GET /api/resolve-channel` | Turns a user-pasted URL/handle/ID into a canonical channel ID |
| `GET /api/channel-metrics` | Given a channel ID + window, returns all video metrics |

Splitting resolution from metrics means the expensive metrics fetch can be cached by a stable channel ID key, independent of how the user typed the URL. The resolution step handles the messiness of YouTube's inconsistent URL formats in one isolated place.

---

### YouTube API Strategy

The YouTube Data API has a daily quota of 10,000 units. Key call costs:

| Operation | Cost |
|---|---|
| Channel lookup by ID | 1 unit |
| Channel lookup by handle/username | 100 units |
| Playlist items (per page, up to 50 items) | 1 unit |
| Video stats (per batch, up to 50 videos) | 1 unit |

**Batching**: Video stats are fetched 50 at a time (the API maximum), so a channel with 100 recent videos costs 2 stats calls, not 100.

**Pagination cap**: The app fetches up to 120 playlist items (3 pages × 50) to keep response times reasonable and quota usage bounded. Full-history scraping would be impractical within the free quota.

**Fallback resolution**: If a `@handle` lookup returns no results, the client falls back to a YouTube search query. This uses more quota (100 units) but handles edge cases where the handle API is unresponsive.

---

### Caching

Two layers reduce quota consumption and latency:

1. **Cloudflare KV** — API responses are stored with a 10-minute TTL. A repeated lookup of the same channel within that window costs zero YouTube API quota.
2. **HTTP `Cache-Control` headers** — `max-age=600, stale-while-revalidate=300` lets Cloudflare's CDN serve cached responses while a revalidation happens in the background, so the user never blocks on a slow refresh.

**Trade-off:** A 10-minute cache means very recent uploads may not appear immediately. This is acceptable for an analytics tool but would need a shorter TTL (or a force-refresh parameter) for near-real-time use cases.

---

### Trending Detection

A video is flagged as "trending" when its `viewsPerDay` exceeds 1.5× the channel's **median** `viewsPerDay` for the selected window:

```
viewsPerDay = totalViews / max(ageInDays, 1)
isTrending  = viewsPerDay > median(allViewsPerDay) × 1.5
```

Using the median (rather than the mean) makes the threshold robust to outlier viral videos that would otherwise skew the average upward and suppress all other flags.

---

### Client-Side Filtering

All filtering (search, sort, min views, window toggle) runs in the browser against the already-fetched dataset. This keeps the API simple (one fetch per channel/window combination) and makes the UI feel instant — no round trips for filter changes.

**Trade-off:** For channels with thousands of videos this would hit memory/render limits. The current cap of 50 returned videos (sorted by views/day) keeps it practical.

---

### Rate Limiting

Each API route enforces 20 requests per minute per IP using an in-memory sliding window keyed on client IP with an array of request timestamps.

**Known limitation:** Because Cloudflare Workers run as separate isolates, the in-memory store is not shared globally. A user could exceed 20 req/min by hitting different edge nodes. A Durable Object or KV-backed counter would be needed for a globally consistent limit in production.

---

### Styling

Tailwind CSS v4 with no external component library. Components are hand-rolled and minimal, which keeps the bundle small and avoids compatibility issues with the rapidly-evolving React 19 / Next.js 16 stack.

---

## Trade-offs Summary

| Decision | Why | Cost |
|---|---|---|
| Cloudflare Workers | Edge latency, free tier generous, KV caching | Non-Node runtime; no global in-memory state |
| No component library | Lean bundle, no React 19 compat issues | More bespoke CSS |
| Client-side filtering | Zero API calls per filter interaction | All data must be fetched upfront |
| 10-minute KV cache | Protects YouTube quota | Stale data window |
| In-memory rate limit | Simple, zero dependencies | Not globally consistent across edge nodes |
| 120-video cap per fetch | Bounded quota + response time | Older uploads excluded from analysis |
| Median trending threshold | Robust to viral outliers | Threshold shifts with channel activity level |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Deployment | Cloudflare Workers (via OpenNext) |
| Caching | Cloudflare KV |
| Styling | Tailwind CSS v4 |
| Toolchain | Vite+ (`vp`) |
| Testing | Vitest (via `vp test`) |
| Language | TypeScript (strict mode) |
| API | YouTube Data API v3 |
