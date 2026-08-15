export const metadata = {
  title: 'Terms of Service | TargetBand',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 pb-32">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: August 2026</p>
      </div>

      <div className="prose prose-invert prose-emerald max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using TargetBand (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            TargetBand provides IELTS score calculation, conversion, and progress tracking tools. Our service is designed for educational and self-assessment purposes only. We are not affiliated with, approved by, or endorsed by the British Council, IDP: IELTS Australia, or Cambridge Assessment English.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">3. Accuracy of Calculations</h2>
          <p className="text-muted-foreground leading-relaxed">
            While we strive for maximum accuracy using official scoring rubrics, TargetBand&apos;s calculations are approximations. Real test boundaries may vary slightly based on test version difficulty. We cannot guarantee the exact score you will achieve on an official test.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">4. User Accounts and Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. Your test score data is private and stored securely. We do not sell your personal data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">5. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
      </div>
    </div>
  )
}
