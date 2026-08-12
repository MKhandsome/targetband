"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true)
  }, [])


  // Hide Navbar on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo Placeholder */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              Target<span className="text-primary">Band</span>
            </Link>
          </div>


          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-background"
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            )}
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Log In
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ring-offset-background bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20 h-10 px-6 py-2"
            >
              Get Started
            </Link>
          </div>

          </div>
        </div>
    </nav>
  </>
  )
}
