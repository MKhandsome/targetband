import Link from 'next/link'
import { Calendar, Info } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | TargetBand',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-12">
      
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-foreground">Terms of Service</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Terms of Service
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <div className="flex items-center gap-1.5 bg-secondary border border-border px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Last updated: August 2026
          </div>
          <span className="hidden sm:inline">&mdash; The rules governing your use of TargetBand.</span>
        </div>
      </div>

      {/* Two-Column Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
        
        {/* Left Column (Sticky Sidebar Navigation) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">On this page</h4>
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <a href="#acceptance" className="text-muted-foreground hover:text-emerald-400 transition-colors">1. Acceptance of Terms</a>
              <a href="#description" className="text-muted-foreground hover:text-emerald-400 transition-colors">2. Description of Service</a>
              <a href="#accuracy" className="text-muted-foreground hover:text-emerald-400 transition-colors">3. Accuracy of Calculations</a>
              <a href="#accounts" className="text-muted-foreground hover:text-emerald-400 transition-colors">4. User Accounts and Data</a>
              <a href="#termination" className="text-muted-foreground hover:text-emerald-400 transition-colors">5. Termination</a>
            </nav>
          </div>
        </div>

        {/* Right Column (Main Content Card) */}
        <div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">1</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Acceptance of Terms</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                By accessing or using TargetBand (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.
              </p>
            </section>

            {/* Section 2 */}
            <section id="description" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">2</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Description of Service</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                TargetBand provides IELTS score calculation, conversion, and progress tracking tools. Our service is designed for educational and self-assessment purposes only.
              </p>
              
              {/* Callout Box - Important Notice */}
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-5 text-purple-300 text-sm sm:text-base flex gap-4 leading-relaxed mt-4">
                <Info className="w-6 h-6 shrink-0 text-purple-400" />
                <div>
                  <strong className="block text-purple-400 font-semibold mb-1">Not an Official IELTS Product</strong>
                  We are not affiliated with, approved by, or endorsed by the British Council, IDP: IELTS Australia, or Cambridge Assessment English.
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="accuracy" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">3</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Accuracy of Calculations</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                While we strive for maximum accuracy using official scoring rubrics, TargetBand&apos;s calculations are approximations. Real test boundaries may vary slightly based on test version difficulty. We cannot guarantee the exact score you will achieve on an official test.
              </p>
            </section>

            {/* Section 4 */}
            <section id="accounts" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">4</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">User Accounts and Data</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mb-4">
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <span>Your test score data is private and stored securely.</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <span>We do not sell your personal data to third parties.</span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="termination" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">5</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Termination</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
