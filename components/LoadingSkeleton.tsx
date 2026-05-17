export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading channel data…">
      {/* Channel header skeleton */}
      <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
        <div className="h-20 w-20 rounded-2xl bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-zinc-800 rounded-lg w-64" />
          <div className="h-4 bg-zinc-800 rounded-lg w-40" />
          <div className="h-3 bg-zinc-800 rounded-lg w-32" />
        </div>
      </div>

      {/* Filters bar skeleton */}
      <div className="flex gap-3 py-4 px-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="h-10 bg-zinc-800 rounded-lg flex-1" />
        <div className="h-10 bg-zinc-800 rounded-lg w-40" />
        <div className="h-10 bg-zinc-800 rounded-lg w-52" />
      </div>

      {/* Table skeleton */}
      <div className="hidden md:block rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="bg-zinc-900 px-6 py-4 flex gap-6 border-b border-zinc-800">
          {[240, 100, 100, 100, 100, 80].map((w, i) => (
            <div key={i} className="h-4 bg-zinc-800 rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-6 py-4 border-b border-zinc-800/50 last:border-0"
          >
            <div className="h-14 w-24 bg-zinc-800 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded-lg w-3/4" />
              <div className="h-3 bg-zinc-800 rounded-lg w-1/3" />
            </div>
            <div className="h-4 bg-zinc-800 rounded w-24" />
            <div className="h-4 bg-zinc-800 rounded w-20" />
            <div className="h-4 bg-zinc-800 rounded w-20" />
            <div className="h-4 bg-zinc-800 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Cards skeleton (mobile) */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
            <div className="flex gap-3">
              <div className="h-20 w-32 bg-zinc-800 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded-lg w-full" />
                <div className="h-4 bg-zinc-800 rounded-lg w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-3 bg-zinc-800 rounded mx-auto w-14" />
                  <div className="h-4 bg-zinc-800 rounded mx-auto w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
