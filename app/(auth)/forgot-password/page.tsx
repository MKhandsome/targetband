"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const supabase = createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://targetband.vercel.app'
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    })
    
    setIsLoading(false)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password reset link has been sent to your email.")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col p-8 relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
        
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email address and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all shadow-sm" 
              placeholder="name@example.com"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg text-sm font-bold bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-4 w-full shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] transition-all active:scale-[0.98] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Remember your password?{' '}
          <Link href="/login" className="text-accent hover:underline font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
