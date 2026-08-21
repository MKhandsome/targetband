import { FAQSection } from '@/components/FAQSection'
import { Target, Calculator, TrendingUp, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: "About Us | TargetBand",
  description: "Learn about TargetBand's mission and IELTS band score rounding methodology.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-24 space-y-24">
      {/* Hero Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Demystifying the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-500">
            IELTS Scoring System
          </span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          At TargetBand, we believe that preparing for the IELTS exam shouldn&apos;t involve guesswork. Our mission is to provide precise, reliable tools to help you track, calculate, and achieve your goals.
        </p>
      </div>

      {/* Value Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:border-emerald-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Precision Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            Stop guessing your progress. We created TargetBand because we saw students struggling to manually calculate their gaps across multiple spreadsheets. Everything is now built natively into a single, beautiful dashboard.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:border-violet-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Actionable Analytics</h2>
          <p className="text-muted-foreground leading-relaxed">
            Whether you are aiming for a Band 6 for university admission or a Band 8 for immigration, our analytics engine automatically identifies your weakest skills and visualizes exactly what you need to improve.
          </p>
        </div>
      </div>

      {/* Official Rounding Rules Glassmorphic Box */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-md p-8 md:p-12">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Calculator className="w-64 h-64 text-emerald-500" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-6 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            Official Methodology
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">How We Calculate Band Scores</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The IELTS overall band score is calculated by taking the exact average of the four component scores (Listening, Reading, Writing, and Speaking). The average is then rounded to the nearest half or whole band.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-4 bg-muted/30 p-4 rounded-xl border border-border">
              <span className="text-emerald-400 font-black text-xl leading-none mt-1">.25</span>
              <span className="text-muted-foreground">If the average ends in <strong>.25</strong>, it is rounded up to the next half band <span className="text-foreground">(e.g., 6.25 → 6.5)</span>.</span>
            </li>
            <li className="flex items-start gap-4 bg-muted/30 p-4 rounded-xl border border-border">
              <span className="text-emerald-400 font-black text-xl leading-none mt-1">.75</span>
              <span className="text-muted-foreground">If the average ends in <strong>.75</strong>, it is rounded up to the next whole band <span className="text-foreground">(e.g., 6.75 → 7.0)</span>.</span>
            </li>
            <li className="flex items-start gap-4 bg-muted/30 p-4 rounded-xl border border-border">
              <span className="text-emerald-400 font-black text-xl leading-none mt-1">&lt;</span>
              <span className="text-muted-foreground">If the average ends in a fraction below .25 or .75, it is rounded down <span className="text-foreground">(e.g., 6.125 → 6.0)</span>.</span>
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-border/50" />
      
      <FAQSection />
    </div>
  )
}
