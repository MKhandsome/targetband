"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { LayoutDashboard, Target, ChevronLeft, LogOut, History, LineChart, Repeat, Calculator, BarChart, Info, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function DashboardSidebar({ email }: { email: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const navGroups = [
    {
      title: "Main Navigation",
      links: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Target Goals", href: "/dashboard/targets", icon: Target },
        { name: "Score Logs & History", href: "/dashboard/history", icon: History },
        { name: "Performance Analytics", href: "/dashboard/analytics", icon: LineChart },
      ]
    },
    {
      title: "Quick Tools & Utilities",
      links: [
        { name: "Score Converter", href: "/dashboard/tools?tool=converter", icon: Repeat },
        { name: "Band Calculator", href: "/dashboard/tools?tool=calculator", icon: Calculator },
        { name: "Gap Analyzer", href: "/dashboard/tools?tool=gap-calculator", icon: BarChart },
      ]
    },
    {
      title: "Pages & Support",
      links: [
        { name: "About Us", href: "/about", icon: Info },
        { name: "Contact & Support", href: "/contact", icon: Phone },
      ]
    }
  ]

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <aside className={`bg-[#171717] border-r border-white/10 transition-all duration-300 flex flex-col hidden md:flex relative ${collapsed ? "w-20" : "w-72"}`}>
      {/* Brand Header */}
      <div className="h-16 flex flex-shrink-0 items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <Link href="/" prefetch={true} className="font-bold tracking-tighter text-lg text-foreground hover:opacity-80 transition-opacity">
            Target<span className="text-primary">Band</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" prefetch={true} className="font-bold text-lg text-primary mx-auto hover:opacity-80 transition-opacity">
            T
          </Link>
        )}
        
        {/* Collapse button */}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground absolute -right-3 top-5 bg-[#0C0C0C] border border-white/10 z-10 hidden md:flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-6 overflow-y-auto">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {!collapsed && (
              <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.links.map((link) => {
              const Icon = link.icon
              let isActive = false
              
              if (link.href.includes('?tool=')) {
                const toolParam = link.href.split('?tool=')[1]
                isActive = pathname === '/dashboard/tools' && searchParams?.get('tool') === toolParam
              } else {
                isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== '/dashboard' && !link.href.includes('?'))
              }
              
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  prefetch={true}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive ? "bg-primary/10 text-primary font-medium shadow-[inset_2px_0_0_0_rgba(16,185,129,1)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                  title={collapsed ? link.name : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {!collapsed && <span className="truncate">{link.name}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4 flex-shrink-0 bg-[#171717]">
        {!collapsed && (
          <div className="px-2 overflow-hidden flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0 border border-primary/30">
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-foreground truncate font-medium" title={email}>{email}</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 transition-colors group-hover:text-destructive" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
