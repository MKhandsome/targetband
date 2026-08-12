"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Calculator, Crosshair, Target } from "lucide-react"

export default function ToolsDirectoryPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  }

  const tools = [
    {
      title: "Raw Score → Band Converter",
      description: "Instantly convert your raw listening or reading score into an official IELTS band score.",
      icon: <Target className="h-8 w-8 text-primary" />,
      href: "/converter"
    },
    {
      title: "Overall Band Calculator",
      description: "Input your 4 section scores and calculate your official rounded overall IELTS band.",
      icon: <Calculator className="h-8 w-8 text-primary" />,
      href: "/calculator"
    },
    {
      title: "Target Gap Calculator",
      description: "Find out exactly what you need in your weakest skill to hit your overall target band.",
      icon: <Crosshair className="h-8 w-8 text-primary" />,
      href: "/gap-calculator"
    }
  ]

  return (
    <div className="container mx-auto max-w-5xl px-4 py-24">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">IELTS Score Tools</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to calculate, convert, and strategize your IELTS band score.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
      >
        {tools.map((tool, idx) => (
          <motion.div 
            variants={itemVariants}
            key={idx} 
            className="group relative rounded-2xl border border-white/10 bg-[#171717] p-8 shadow-sm hover:shadow-lg hover:border-white/20 transition-all duration-300 flex flex-col"
          >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              {tool.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
            <p className="text-muted-foreground leading-relaxed flex-1 mb-8">
              {tool.description}
            </p>
            <Link
              href={tool.href}
              className="inline-flex items-center text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-auto"
            >
              Open Tool <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              {/* Absolute pseudo-element to make the whole card clickable */}
              <span className="absolute inset-0 z-10"></span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Contextual Bottom Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-accent/5 border border-accent/20 rounded-2xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden"
      >
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Want to save your scores over time?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Create a free account to log your practice tests, set target goals, and visualize your progress on your personal dashboard.
          </p>
          <Link 
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-10 py-3 text-base font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ring-offset-background"
          >
            Sign Up Free
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
