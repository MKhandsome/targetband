import Link from 'next/link'
import { Home, LayoutDashboard } from 'lucide-react'

export const metadata = {
  title: '404 - Page Not Found | TargetBand',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center z-10 max-w-md w-full space-y-8 animate-fade-in-scale">
        
        {/* Large Styled Graphic Badge */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <h1 
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-white/60 text-base md:text-lg">
            The route you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 py-2 text-sm font-bold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <LayoutDashboard className="w-4 h-4" />
            Return to Dashboard
          </Link>
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-8 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
