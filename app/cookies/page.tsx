import Link from 'next/link'
import { Calendar, Info, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Cookie Policy | TargetBand',
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-12">
      
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-foreground">Cookie Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Cookie Policy
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Last updated: August 2026
          </div>
          <span className="hidden sm:inline">&mdash; How we use cookies to provide our service.</span>
        </div>
      </div>

      {/* Two-Column Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
        
        {/* Left Column (Sticky Sidebar Navigation) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">On this page</h4>
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <a href="#what-are-cookies" className="text-muted-foreground hover:text-emerald-400 transition-colors">1. What Are Cookies</a>
              <a href="#how-we-use" className="text-muted-foreground hover:text-emerald-400 transition-colors">2. How We Use Cookies</a>
              <a href="#essential" className="text-muted-foreground hover:text-emerald-400 transition-colors">3. Essential Cookies</a>
              <a href="#managing" className="text-muted-foreground hover:text-emerald-400 transition-colors">4. Managing Cookies</a>
            </nav>
          </div>
        </div>

        {/* Right Column (Main Content Card) */}
        <div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <section id="what-are-cookies" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">1</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">What Are Cookies</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
            </section>

            {/* Section 2 */}
            <section id="how-we-use" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">2</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">How We Use Cookies</h2>
              </div>
              
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 text-emerald-300 text-sm sm:text-base flex gap-4 leading-relaxed mb-4">
                <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <strong className="block text-emerald-400 font-semibold mb-1">Privacy Focused</strong>
                  TargetBand uses cookies purely for essential operational purposes. We prioritize your privacy and do not use invasive tracking cookies or third-party advertising trackers.
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="essential" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">3</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Essential Cookies</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                The only cookies we set are essential session cookies managed by Supabase. These tokens are required to maintain your logged-in state securely, keeping your dashboard and personal target goals private. Without these cookies, our authentication system cannot function.
              </p>
            </section>

            {/* Section 4 */}
            <section id="managing" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">4</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Managing Cookies</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                You can control and/or delete cookies as you wish using your browser settings.
              </p>
              
              {/* Callout Box - Important Notice */}
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-5 text-purple-300 text-sm sm:text-base flex gap-4 leading-relaxed mt-4">
                <Info className="w-6 h-6 shrink-0 text-purple-400" />
                <div>
                  <strong className="block text-purple-400 font-semibold mb-1">Important Consideration</strong>
                  Please note that deleting or disabling essential cookies will prevent you from logging into your TargetBand dashboard and saving your scores.
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
