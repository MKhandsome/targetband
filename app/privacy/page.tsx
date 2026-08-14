import Link from 'next/link'

export const metadata = {
  title: "Privacy Policy | TargetBand",
  description: "Learn about how TargetBand handles your data, cookies, and account authentication.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 2026</p>
      </div>

      <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary">
        <h2>1. Introduction</h2>
        <p>
          Welcome to TargetBand. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>

        <h2>2. Data We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul>
          <li><strong>Identity Data</strong> includes first name, last name, and email address (when you register for an account).</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
          <li><strong>Practice Data</strong> includes your practice test scores, target band goals, and test dates that you explicitly input into your dashboard.</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul>
          <li>To authenticate your account and maintain session persistence via Supabase Auth.</li>
          <li>To generate your personal progress analytics and dashboard charts.</li>
          <li>To improve our website, services, marketing, or customer relationships.</li>
        </ul>

        <h2>4. Data Security & Row-Level Security</h2>
        <p>
          TargetBand employs Supabase as our backend provider. All Practice Data (your test scores, histories, and goals) is protected by strict <strong>Row-Level Security (RLS)</strong> policies at the database level. This guarantees that your sensitive performance data is mathematically isolated—it can only be queried, viewed, or modified by your authenticated user session. Not even other users can access your data.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We use strictly necessary cookies to maintain your authenticated session. These are essential for you to browse the website and use its features, such as accessing secure areas of the site (your dashboard). Without these cookies, the core functionality of TargetBand cannot be provided.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us via our <Link href="/contact">Contact Page</Link>.
        </p>
      </div>
    </div>
  )
}
