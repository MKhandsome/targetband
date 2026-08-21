"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()

  // Hide Footer on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return (
    <footer className="bg-background border-t border-border/50 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
              Target<span className="text-primary">Band</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Master your IELTS score with our instant converter, calculator, and practice tracker.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.instagram.com/targetbandielts/" target="_blank" rel="noopener noreferrer" aria-label="Follow TargetBand on Instagram" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://x.com/targetbandielts" target="_blank" rel="noopener noreferrer" aria-label="Follow TargetBand on X" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#calculator" className="hover:text-primary transition-colors">Band Calculator</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/#changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/#careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li>
                <a 
                  href="mailto:ieltstargetband@gmail.com" 
                  className="text-muted-foreground hover:text-emerald-400 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  ieltstargetband@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button type="submit" className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TargetBand. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
