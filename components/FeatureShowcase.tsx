"use client"

import { useState } from "react"
import { Target, TrendingUp, Zap, Calculator, BarChart, CheckCircle } from "lucide-react"
import { motion } from "motion/react"

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState("calculator")

  const features = [
    {
      icon: <Calculator className="h-6 w-6 text-primary" />,
      title: "Precise Score Calculator",
      description: "Input your individual section bands to instantly calculate your overall IELTS score."
    },
    {
      icon: <Target className="h-6 w-6 text-accent" />,
      title: "Gap Analysis",
      description: "Identify exactly how many points you need in each section to reach your target band."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Instant Feedback",
      description: "Real-time updates as you log practice test scores to track your progress over time."
    }
  ]

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

  return (
    <section id="features" className="container px-4 md:px-6 py-24 mx-auto max-w-6xl w-full">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Supercharge Your Preparation</h2>
        <p className="text-muted-foreground sm:text-lg max-w-2xl mx-auto text-balance">
          Everything you need to analyze your performance and focus on what matters most to achieve your desired IELTS band.
        </p>
      </div>

      {/* 3-Column Grid Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
      >
        {features.map((feature, idx) => (
          <motion.div 
            variants={itemVariants}
            key={idx} 
            className="group relative rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Ambient hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 backdrop-blur-sm border border-border/50">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Demo Section */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden ring-1 ring-border/50 flex flex-col md:flex-row">
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 p-4 md:p-6 bg-muted/20 space-y-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Interactive Demo</h3>
            <p className="text-sm text-muted-foreground">Toggle features to preview live changes</p>
          </div>

          <button 
            onClick={() => setActiveTab("calculator")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === "calculator" ? "bg-background border border-border/50 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
          >
            <Calculator className={`h-5 w-5 ${activeTab === "calculator" ? "text-primary" : ""}`} />
            <span className="font-medium">Band Calculator</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("analyzer")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === "analyzer" ? "bg-background border border-border/50 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
          >
            <BarChart className={`h-5 w-5 ${activeTab === "analyzer" ? "text-accent" : ""}`} />
            <span className="font-medium">Gap Analyzer</span>
          </button>

          <button 
            onClick={() => setActiveTab("tracker")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === "tracker" ? "bg-background border border-border/50 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
          >
            <TrendingUp className={`h-5 w-5 ${activeTab === "tracker" ? "text-yellow-500" : ""}`} />
            <span className="font-medium">Progress Tracker</span>
          </button>
        </div>

        {/* Demo Content Area */}
        <div className="w-full md:w-2/3 p-6 md:p-10 bg-background relative min-h-[400px] flex items-center justify-center">
           {/* Ambient background glow for demo area */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 pointer-events-none"></div>

           {activeTab === "calculator" && (
             <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
               <div className="space-y-4">
                 {['Listening', 'Reading', 'Writing', 'Speaking'].map((sec, i) => (
                   <div key={sec} className="flex items-center justify-between">
                     <span className="text-sm font-medium">{sec}</span>
                     <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs hover:bg-muted/80 cursor-pointer transition-colors">-</div>
                       <div className="h-8 w-12 rounded-md border border-border/50 flex items-center justify-center font-bold">{(8.0 - i * 0.5).toFixed(1)}</div>
                       <div className="h-8 w-8 rounded-md bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center text-xs cursor-pointer transition-colors">+</div>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="pt-6 border-t border-border/50 flex justify-between items-end">
                 <div className="text-sm text-muted-foreground">Overall Band</div>
                 <div className="text-4xl font-bold text-primary">7.5</div>
               </div>
             </div>
           )}

           {activeTab === "analyzer" && (
             <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span>Target: 8.0</span>
                   <span className="text-accent font-medium">-0.5 points needed</span>
                 </div>
                 <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary w-[75%] transition-all duration-1000 ease-out"></div>
                    <div className="h-full bg-accent/40 w-[25%] animate-pulse"></div>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
                     <div className="text-xs text-muted-foreground mb-1">Strongest</div>
                     <div className="font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/> Listening</div>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
                     <div className="text-xs text-muted-foreground mb-1">Needs Work</div>
                     <div className="font-bold flex items-center gap-2"><Target className="h-4 w-4 text-destructive"/> Writing</div>
                  </div>
               </div>
             </div>
           )}

           {activeTab === "tracker" && (
             <div className="w-full h-full flex flex-col justify-end gap-2 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
                <div className="flex justify-between items-end h-48 w-full border-b border-l border-border/50 pb-2 pl-2">
                   {[6.0, 6.5, 6.5, 7.0, 7.5, 7.5].map((score, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group w-1/6">
                        <div className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 bg-popover text-popover-foreground px-2 py-1 rounded shadow-md border border-border/50">{score}</div>
                        <div 
                          className="w-8 md:w-12 bg-gradient-to-t from-primary/80 to-primary rounded-t-md transition-all duration-700 hover:brightness-110 shadow-sm" 
                          style={{ height: `${((score - 5) / 3.5) * 100}%` }}
                        ></div>
                      </div>
                   ))}
                </div>
                <div className="flex justify-between w-full pl-2 text-xs text-muted-foreground mt-2 font-mono">
                   <span>M1</span>
                   <span>M2</span>
                   <span>M3</span>
                   <span>M4</span>
                   <span>M5</span>
                   <span className="text-primary font-bold">Now</span>
                </div>
             </div>
           )}
        </div>
      </div>
    </section>
  )
}
