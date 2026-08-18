export default function DashboardLoading() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
        <div className="h-4 w-96 bg-muted animate-pulse rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-muted animate-pulse rounded-xl border border-border"></div>
        <div className="h-32 bg-muted animate-pulse rounded-xl border border-border"></div>
        <div className="h-32 bg-muted animate-pulse rounded-xl border border-border"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] bg-muted animate-pulse rounded-xl border border-border"></div>
        <div className="h-[400px] bg-muted animate-pulse rounded-xl border border-border"></div>
      </div>
    </div>
  )
}
