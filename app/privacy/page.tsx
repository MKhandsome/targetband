import Link from 'next/link'
import { Calendar, ShieldCheck, FileText } from 'lucide-react'

export const metadata = {
  title: "Privacy Policy | TargetBand",
  description: "Learn about how TargetBand handles your data, cookies, and account authentication.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-12">
      
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-foreground">Privacy Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Privacy Policy
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <div className="flex items-center gap-1.5 bg-secondary border border-border px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Last updated: August 2026
          </div>
          <span className="hidden sm:inline">&mdash; How we handle your data, cookies, and authentication.</span>
        </div>
      </div>

      {/* Two-Column Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
        
        {/* Left Column (Sticky Sidebar Navigation) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">On this page</h4>
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <a href="#introduction" className="text-muted-foreground hover:text-emerald-400 transition-colors">1. Introduction</a>
              <a href="#data-we-collect" className="text-muted-foreground hover:text-emerald-400 transition-colors">2. Data We Collect</a>
              <a href="#how-we-use" className="text-muted-foreground hover:text-emerald-400 transition-colors">3. How We Use Your Data</a>
              <a href="#security" className="text-muted-foreground hover:text-emerald-400 transition-colors">4. Data Security & RLS</a>
              <a href="#cookies" className="text-muted-foreground hover:text-emerald-400 transition-colors">5. Cookies</a>
              <a href="#contact" className="text-muted-foreground hover:text-emerald-400 transition-colors">6. Contact Us</a>
            </nav>
          </div>
        </div>

        {/* Right Column (Main Content Card) */}
        <div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <section id="introduction" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">1</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Introduction</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                Welcome to TargetBand. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            {/* Section 2 */}
            <section id="data-we-collect" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">2</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Data We Collect</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <span><strong>Identity Data</strong> includes first name, last name, and email address (when you register for an account).</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <span><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <span><strong>Practice Data</strong> includes your practice test scores, target band goals, and test dates that you explicitly input into your dashboard.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="how-we-use" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">3</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">How We Use Your Data</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2"></div>
                  <span>To authenticate your account and maintain session persistence via Supabase Auth.</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2"></div>
                  <span>To generate your personal progress analytics and dashboard charts.</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2"></div>
                  <span>To improve our website, services, marketing, or customer relationships.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="security" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">4</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Data Security & Row-Level Security</h2>
              </div>
              
              {/* Callout Box - Information Highlight */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 text-emerald-300 text-sm sm:text-base flex gap-4 leading-relaxed my-6">
                <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <strong className="block text-emerald-400 font-semibold mb-1">Bank-Grade Isolation</strong>
                  TargetBand employs Supabase as our backend provider. All Practice Data (your test scores, histories, and goals) is protected by strict <strong>Row-Level Security (RLS)</strong> policies at the database level.
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                This guarantees that your sensitive performance data is mathematically isolated&mdash;it can only be queried, viewed, or modified by your authenticated user session. Not even other users can access your data.
              </p>
            </section>

            {/* Section 5 */}
            <section id="cookies" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">5</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Cookies</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                We use strictly necessary cookies to maintain your authenticated session. These are essential for you to browse the website and use its features, such as accessing secure areas of the site (your dashboard).
              </p>
              
              {/* Callout Box - Important Notice */}
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-5 text-purple-300 text-sm sm:text-base flex gap-4 leading-relaxed mt-4">
                <FileText className="w-6 h-6 shrink-0 text-purple-400" />
                <div>
                  <strong className="block text-purple-400 font-semibold mb-1">Essential Operations Only</strong>
                  Without these cookies, the core functionality of TargetBand cannot be provided. We do not use third-party tracking cookies for targeted advertising.
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="contact" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">6</span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Contact Us</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                If you have any questions about this privacy policy or our privacy practices, please contact us via our <Link href="/contact" className="text-emerald-400 hover:underline">Contact Page</Link>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
