import Image from "next/image";
import { formatSubscriberCount } from "@/lib/normalize";
import type { Channel, WindowOption } from "@/types";

interface ResultsHeaderProps {
  channel: Channel;
  window: WindowOption;
  analyzedAt: string;
  onBack: () => void;
}

const WINDOW_LABELS: Record<WindowOption, string> = {
  month: "This Month",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
};

function formatAnalyzedDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ResultsHeader({ channel, window, analyzedAt, onBack }: ResultsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-zinc-800">
      {/* Channel avatar */}
      <div className="relative h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-zinc-700 shrink-0">
        <Image
          src={channel.thumbnail}
          alt={channel.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Channel info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-semibold text-zinc-50 truncate tracking-tight">
          {channel.title}
        </h2>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {channel.customUrl && (
            <span className="text-sm text-zinc-500 font-mono">{channel.customUrl}</span>
          )}
          {channel.subscriberCount !== undefined && (
            <span className="inline-flex items-center rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300">
              {formatSubscriberCount(channel.subscriberCount)} subscribers
            </span>
          )}
          <span className="inline-flex items-center rounded-lg bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-400">
            {WINDOW_LABELS[window]}
          </span>
        </div>
        <p className="text-xs text-zinc-600 mt-2 font-mono">
          Analyzed {formatAnalyzedDate(analyzedAt)}
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="shrink-0 text-sm font-medium text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 rounded-xl px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 transition-all duration-150"
      >
        ← New Search
      </button>
    </div>
  );
}
