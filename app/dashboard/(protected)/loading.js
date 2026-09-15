export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-gray-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl bg-navy/10 p-3.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 animate-pulse rounded bg-navy/20" />
            <div className="h-7 w-7 animate-pulse rounded-full bg-navy/20" />
          </div>
          <div className="mt-3 h-6 w-20 animate-pulse rounded bg-navy/25" />
          <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-navy/15" />
          <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-navy/10" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-3.5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
              <div className="h-7 w-7 animate-pulse rounded-full bg-gray-100" />
            </div>
            <div className="mt-3 h-6 w-20 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-gray-100" />
          </div>
          <div className="mt-6 h-52 w-full animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
          <div className="mt-6 flex items-center gap-6">
            <div className="h-[140px] w-[140px] shrink-0 animate-pulse rounded-full bg-gray-100" />
            <div className="flex flex-1 flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-10 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
