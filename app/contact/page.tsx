"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <div className="space-y-4 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact & Support</h1>
        <p className="text-lg text-muted-foreground">
          Have a question, feature request, or need help with your account? We&apos;re here for you.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-lg">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
              <Send className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Message Sent!</h2>
            <p className="text-muted-foreground">
              Thank you for reaching out. Our support team will get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 text-primary hover:underline text-sm font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input 
                  id="name" 
                  required
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input 
                  id="email" 
                  type="email"
                  required
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="john@example.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <select 
                id="subject"
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="support">General Support</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                required
                rows={5}
                className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="How can we help you today?" 
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-md"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
