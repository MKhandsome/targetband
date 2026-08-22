export default function ToolsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-md mx-auto"></div>
        <div className="h-4 w-96 bg-muted animate-pulse rounded-md mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl border border-border"></div>
        ))}
      </div>
    </div>
  )
}
