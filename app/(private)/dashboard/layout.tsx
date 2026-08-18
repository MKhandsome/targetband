import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/DashboardSidebar"

export const metadata = {
  title: "Dashboard - TargetBand",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar email={user.email || 'user@example.com'} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (simplified for dashboard) */}
        <header className="h-16 flex md:hidden items-center justify-between border-b border-border/50 px-4 bg-card">
           <span className="font-bold tracking-tighter text-lg">Target<span className="text-primary">Band</span></span>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 lg:p-10 relative">
          {/* Subtle gradient background element for depth */}
          <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>
          {children}
        </main>
      </div>
    </div>
  )
}
