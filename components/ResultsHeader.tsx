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
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-200">
      {/* Channel avatar */}
      <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-gray-200 shrink-0">
        <Image
          src={channel.thumbnail}
          alt={channel.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Channel info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-gray-900 truncate">{channel.title}</h2>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {channel.customUrl && <span className="text-sm text-gray-500">{channel.customUrl}</span>}
          {channel.subscriberCount !== undefined && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {formatSubscriberCount(channel.subscriberCount)} subscribers
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            {WINDOW_LABELS[window]}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Analyzed {formatAnalyzedDate(analyzedAt)}</p>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="shrink-0 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-3 py-1.5 border border-gray-300 hover:border-gray-400 transition-colors"
      >
        ← New Search
      </button>
    </div>
  );
}
