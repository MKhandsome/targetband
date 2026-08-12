"use client"

import { Users, Activity, DollarSign, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import { motion } from "motion/react"

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          Overview
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1"
        >
          Here's what's happening with your platform today.
        </motion.p>
      </div>

      {/* Stats Widgets */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Total Users</h3>
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">14,293</div>
          <div className="text-xs text-primary mt-2 font-medium bg-primary/10 inline-block px-2 py-0.5 rounded-full">+12.5% from last month</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Active Sessions</h3>
            <div className="h-8 w-8 rounded-md bg-accent/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold">2,543</div>
          <div className="text-xs text-primary mt-2 font-medium bg-primary/10 inline-block px-2 py-0.5 rounded-full">+5.2% from last week</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Revenue</h3>
            <div className="h-8 w-8 rounded-md bg-yellow-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <div className="text-3xl font-bold">$42,891.00</div>
          <div className="text-xs text-primary mt-2 font-medium bg-primary/10 inline-block px-2 py-0.5 rounded-full">+18.1% from last month</div>
        </motion.div>
      </motion.div>

      {/* Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Recent Signups</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="h-9 w-full sm:w-64 rounded-md border border-input bg-background px-8 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <button 
              onClick={() => toast.info("Filter functionality coming soon!")}
              className="h-9 px-3 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-3.5 font-semibold">User</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold">Plan</th>
                <th className="px-6 py-3.5 font-semibold text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Alice Johnson", email: "alice@example.com", status: "Active", plan: "Pro", date: "Oct 24, 2026" },
                { name: "Bob Smith", email: "bob@example.com", status: "Inactive", plan: "Free", date: "Oct 23, 2026" },
                { name: "Charlie Davis", email: "charlie@example.com", status: "Active", plan: "Pro", date: "Oct 22, 2026" },
                { name: "Diana Evans", email: "diana@example.com", status: "Active", plan: "Free", date: "Oct 21, 2026" },
                { name: "Evan Wright", email: "evan@example.com", status: "Pending", plan: "Pro", date: "Oct 20, 2026" },
              ].map((user, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-primary/10 text-primary border border-primary/20' : 
                      user.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                      'bg-muted text-muted-foreground border border-border/50'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.plan}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
