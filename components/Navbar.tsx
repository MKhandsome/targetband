"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, ChevronDown, Calculator, Repeat, BarChart } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Navigation States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsToolsOpen(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Hide Navbar on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo (Left Side) */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" prefetch={true} className="text-xl font-bold tracking-tighter">
                Target<span className="text-primary">Band</span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links (Center) */}
            <div className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
              
              {/* Tools Dropdown */}
              <div 
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
              >
                <Link 
                  href="/tools"
                  prefetch={true}
                  className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                  onClick={(e) => {
                    // Allow navigation but toggle dropdown for mobile users who tap
                    if (window.innerWidth < 768) {
                      e.preventDefault();
                      setIsToolsOpen(!isToolsOpen);
                    }
                  }}
                >
                  Tools <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`} />
                </Link>
                
                {/* Glassmorphism Dropdown Menu */}
                {isToolsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
                      <Link 
                        href="/converter"
                        prefetch={true}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-blue-500/10 hover:text-blue-500 transition-colors group"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <Repeat className="h-4 w-4" />
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-blue-500 transition-colors">Score Converter</div>
                          <div className="text-xs opacity-70">Raw to Official Band</div>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/calculator"
                        prefetch={true}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary transition-colors group"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <Calculator className="h-4 w-4" />
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Band Calculator</div>
                          <div className="text-xs opacity-70">4-Skill Average</div>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/gap-calculator"
                        prefetch={true}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:text-accent transition-colors group"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <BarChart className="h-4 w-4" />
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-accent transition-colors">Gap Calculator</div>
                          <div className="text-xs opacity-70">Target vs Current</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/dashboard" prefetch={true} className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">
                Dashboard
              </Link>
              <Link href="/about" prefetch={true} className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">
                About Us
              </Link>
              <Link href="/contact" prefetch={true} className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">
                Contact
              </Link>
            </div>

            {/* Right Actions & Mobile Hamburger */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Theme Toggle */}
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
              
              {/* Auth Actions (Desktop) */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  prefetch={true}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/tools"
                  prefetch={true}
                  className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ring-offset-background bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20 h-9 px-5"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-1">
              
              {/* Tools Section Mobile */}
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tools
                </div>
                <div className="space-y-1 pl-3">
                  <Link href="/converter" prefetch={true} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10">
                    <Repeat className="h-4 w-4 text-blue-500" /> Score Converter
                  </Link>
                  <Link href="/calculator" prefetch={true} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10">
                    <Calculator className="h-4 w-4 text-primary" /> Band Calculator
                  </Link>
                  <Link href="/gap-calculator" prefetch={true} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10">
                    <BarChart className="h-4 w-4 text-accent" /> Gap Calculator
                  </Link>
                </div>
              </div>

              <div className="h-px w-full bg-border/50 my-2"></div>

              <Link href="/dashboard" prefetch={true} className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10">
                Dashboard
              </Link>
              <Link href="/about" prefetch={true} className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10">
                About Us
              </Link>
              <Link href="/contact" prefetch={true} className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10">
                Contact
              </Link>

              <div className="h-px w-full bg-border/50 my-4"></div>

              {/* Mobile Auth */}
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" prefetch={true} className="w-full text-center px-4 py-2 rounded-md text-base font-medium border border-border/50 bg-muted/20 hover:bg-muted/50 transition-colors">
                  Sign In
                </Link>
                <Link href="/tools" prefetch={true} className="w-full text-center px-4 py-2 rounded-md text-base font-bold bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90 transition-colors">
                  Get Started
                </Link>
              </div>

            </div>
          </div>
        )}
      </nav>
    </>
  )
}
