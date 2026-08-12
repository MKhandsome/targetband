"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const unauthorized = searchParams.get('error') === 'unauthorized'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    setIsLoading(false)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Successfully signed in!")
      router.push('/dashboard')
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#171717] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col p-8 relative">
        {/* Decorative ambient light */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
        
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {unauthorized && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-sm font-semibold text-destructive">
              Access Denied: Only the system Administrator account can access the workspace dashboard.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-[#0C0C0C] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent transition-all shadow-sm" 
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <a href="#" className="text-xs text-accent hover:underline underline-offset-4 font-medium transition-all">Forgot password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-[#0C0C0C] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent transition-all shadow-sm" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg text-sm font-bold bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-4 w-full shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] transition-all active:scale-[0.98] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sign In
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-medium">
            <span className="bg-[#171717] px-3 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg text-sm font-semibold border border-white/10 bg-[#0C0C0C] hover:bg-white/5 h-11 px-4 w-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
          )}
          Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent hover:underline font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
