"use client"

import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import FeatureShowcase from "@/components/FeatureShowcase"

export default function Home() {
  const handleScrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoElement = document.getElementById('interactive-demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden pb-20 pt-16 md:pt-24 lg:pt-32">
      {/* Subtle background gradient grid effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-40 blur-[100px]"></div>
      </div>

      <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          TargetBand 1.0 is now live
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-balance">
          Master Your IELTS Score with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            TargetBand
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance">
          Instant IELTS score converter, overall band calculator, gap analyzer, and practice tracker designed to help you achieve your target band faster and with confidence.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/tools"
            prefetch={true}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-md shadow-primary/20"
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <button
            onClick={handleScrollToDemo}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-border bg-background hover:bg-muted hover:text-foreground h-11 px-8"
          >
            <Play className="mr-2 h-4 w-4" /> View Demo
          </button>
        </div>
      </div>

      {/* Dashboard Preview Card */}
      <div className="container px-4 md:px-6 mt-16 md:mt-24 max-w-5xl mx-auto w-full">
        <div className="relative rounded-xl border border-border bg-background/50 backdrop-blur-sm shadow-2xl p-2 md:p-4 overflow-hidden ring-1 ring-border/50">
          {/* Subtle inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 pointer-events-none"></div>
          
          {/* Mock Browser/Dashboard Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-border/50 mb-4 px-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            </div>
            <div className="mx-auto bg-muted/40 rounded-md text-xs text-muted-foreground px-4 py-1.5 flex items-center justify-center w-64 border border-border/50 font-mono">
              targetband.app/dashboard
            </div>
          </div>

          {/* Mock Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-2 md:p-4">
            {/* Sidebar Mock */}
            <div className="hidden md:flex flex-col gap-4 border-r border-border/50 pr-4">
              <div className="h-8 w-full bg-muted/60 rounded-md"></div>
              <div className="h-5 w-2/3 bg-muted/40 rounded-md mt-2"></div>
              <div className="h-5 w-3/4 bg-muted/40 rounded-md"></div>
              <div className="h-5 w-1/2 bg-muted/40 rounded-md"></div>
              <div className="h-5 w-4/5 bg-muted/40 rounded-md mt-6"></div>
              <div className="h-5 w-2/3 bg-muted/40 rounded-md"></div>
            </div>

            {/* Main Content Mock */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Overall Band Score</div>
                  <div className="text-4xl font-bold flex items-baseline gap-2">
                    7.5 <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">+0.5 from last test</span>
                  </div>
                </div>
                <div className="hidden sm:block h-10 w-32 bg-primary/20 rounded-md border border-primary/30"></div>
              </div>

              {/* Chart/Grid Mock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50 aspect-square flex flex-col justify-between items-center text-center">
                  <div className="text-xs text-muted-foreground">Listening</div>
                  <div className="text-2xl font-bold">8.0</div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden"><div className="w-[80%] h-full bg-primary"></div></div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50 aspect-square flex flex-col justify-between items-center text-center">
                  <div className="text-xs text-muted-foreground">Reading</div>
                  <div className="text-2xl font-bold">7.5</div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden"><div className="w-[75%] h-full bg-primary"></div></div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50 aspect-square flex flex-col justify-between items-center text-center">
                  <div className="text-xs text-muted-foreground">Writing</div>
                  <div className="text-2xl font-bold">6.5</div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden"><div className="w-[65%] h-full bg-accent"></div></div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50 aspect-square flex flex-col justify-between items-center text-center">
                  <div className="text-xs text-muted-foreground">Speaking</div>
                  <div className="text-2xl font-bold">7.5</div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden"><div className="w-[75%] h-full bg-primary"></div></div>
                </div>
              </div>

              <div className="h-32 w-full bg-muted/20 rounded-lg border border-border/50 p-4 flex items-end gap-2">
                 <div className="w-full bg-accent/20 h-[30%] rounded-t-sm"></div>
                 <div className="w-full bg-accent/30 h-[45%] rounded-t-sm"></div>
                 <div className="w-full bg-accent/40 h-[60%] rounded-t-sm"></div>
                 <div className="w-full bg-accent/60 h-[75%] rounded-t-sm"></div>
                 <div className="w-full bg-primary/70 h-[85%] rounded-t-sm"></div>
                 <div className="w-full bg-primary h-[100%] rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Section */}
      <FeatureShowcase />
    </div>
  )
}
