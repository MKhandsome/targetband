export const metadata = {
  title: 'Cookie Policy | TargetBand',
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 pb-32">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: August 2026</p>
      </div>

      <div className="prose prose-invert prose-emerald max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">1. What Are Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">2. How We Use Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            TargetBand uses cookies purely for essential operational purposes. We prioritize your privacy and do not use invasive tracking cookies or third-party advertising trackers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">3. Essential Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            The only cookies we set are essential session cookies managed by Supabase. These tokens are required to maintain your logged-in state securely, keeping your dashboard and personal target goals private. Without these cookies, our authentication system cannot function.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">4. Managing Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can control and/or delete cookies as you wish using your browser settings. However, please note that deleting or disabling essential cookies will prevent you from logging into your TargetBand dashboard and saving your scores.
          </p>
        </section>
      </div>
    </div>
  )
}
