export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading channel data…">
      {/* Channel header skeleton */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <div className="h-16 w-16 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Filters bar skeleton */}
      <div className="flex gap-3 py-3">
        <div className="h-9 bg-gray-200 rounded-md flex-1" />
        <div className="h-9 bg-gray-200 rounded-md w-36" />
        <div className="h-9 bg-gray-200 rounded-md w-48" />
      </div>

      {/* Table skeleton */}
      <div className="hidden md:block rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex gap-4 border-b border-gray-200">
          {[200, 80, 80, 80, 80].map((w, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
          >
            <div className="h-12 w-20 bg-gray-200 rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Cards skeleton (mobile) */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-3">
            <div className="flex gap-3">
              <div className="h-20 w-32 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded mx-auto w-12" />
                  <div className="h-4 bg-gray-200 rounded mx-auto w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
