'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  
  const supabase = createClient()

  useEffect(() => {
    if (!email) {
      router.push('/login')
    }
  }, [email, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || otpCode.length !== 6) return
    
    setIsLoading(true)
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode.trim(),
      type: 'signup'
    })
    
    setIsLoading(false)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Email verified successfully!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleResend = async () => {
    if (!email || countdown > 0) return
    setIsLoading(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    setIsLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('OTP resent successfully!')
      setCountdown(60)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col p-8 relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Verify your email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Verification Code</label>
            <input 
              type="text" 
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-center text-xl tracking-widest font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all shadow-sm" 
              placeholder="000000"
              required
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || otpCode.length !== 6}
            className="inline-flex items-center justify-center rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 w-full shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all active:scale-[0.98] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Verify Email
          </button>
        </form>

        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-muted-foreground">Resend in {countdown}s</span>
            ) : (
              <button 
                onClick={handleResend}
                disabled={isLoading}
                className="text-primary hover:underline font-medium transition-colors"
              >
                Resend now
              </button>
            )}
          </p>
          
          <div className="text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
