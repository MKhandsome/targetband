import { FAQSection } from '@/components/FAQSection'

export const metadata = {
  title: "About Us | TargetBand",
  description: "Learn about TargetBand's mission and IELTS band score rounding methodology.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 space-y-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About TargetBand</h1>
        <p className="text-xl text-muted-foreground">
          Your ultimate companion for achieving your desired IELTS score.
        </p>
      </div>

      <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:tracking-tight prose-a:text-primary">
        <h2>Our Mission</h2>
        <p>
          At TargetBand, we believe that preparing for the IELTS exam shouldn&apos;t involve guesswork. Our mission is to provide students with precise, reliable, and easy-to-use tools that demystify the IELTS scoring system. Whether you are aiming for a Band 6 for university admission or a Band 8 for immigration, we&apos;re here to help you track, calculate, and achieve your goals.
        </p>

        <h2>How We Calculate Band Scores</h2>
        <p>
          The IELTS overall band score is calculated by taking the average of the four component scores: Listening, Reading, Writing, and Speaking. The average is then rounded to the nearest half or whole band based on official IELTS methodology.
        </p>
        
        <div className="bg-muted/30 border border-border/50 rounded-xl p-6 not-prose my-8">
          <h3 className="font-semibold text-lg mb-4">Official Rounding Rules:</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>If the average ends in <strong>.25</strong>, it is rounded up to the next half band (e.g., 6.25 → 6.5).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>If the average ends in <strong>.75</strong>, it is rounded up to the next whole band (e.g., 6.75 → 7.0).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>If the average ends in a fraction below .25 or .75, it is rounded down (e.g., 6.125 → 6.0).</span>
            </li>
          </ul>
        </div>

        <h2>Why TargetBand?</h2>
        <p>
          We created TargetBand because we saw students struggling to manually calculate their gaps and test histories across multiple spreadsheets. With TargetBand, everything from raw-score conversions to historical performance analytics is built natively into a single, beautiful dashboard.
        </p>
      </div>

      <hr className="border-border/50" />
      
      <FAQSection />
    </div>
  )
}
