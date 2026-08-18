'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: React.ReactNode
}

const faqs: FAQItem[] = [
  {
    question: "How does the IELTS Overall Band calculation work?",
    answer: "The IELTS overall band score is calculated by taking the exact average of your four section scores (Listening, Reading, Writing, Speaking). The resulting average is then rounded to the nearest half or whole band. For example, if your average ends in .25, it rounds up to the next half band (e.g., 6.25 becomes 6.5). If it ends in .75, it rounds up to the next whole band (e.g., 6.75 becomes 7.0). Any fraction below .25 or .75 is rounded down."
  },
  {
    question: "Are raw-to-band conversions official?",
    answer: "Our raw-to-band conversions are based on the official IELTS guidelines and aggregated data from past test administrations. While Cambridge English and IDP do not release the exact boundary logic for every single test version (as difficulty slightly varies), our converter provides a highly accurate estimate that matches the standard scoring thresholds used globally."
  },
  {
    question: "Is my practice data secure?",
    answer: (
      <span>
        Absolutely. Your test scores, target goals, and history logs are securely encrypted and isolated using <strong>Row-Level Security (RLS)</strong> via our Supabase backend. This means that only you—when authenticated into your personal account—can access, view, or modify your practice data.
      </span>
    )
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-16 md:py-24" id="faq">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about TargetBand and IELTS scoring.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div 
                key={index} 
                className="bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-border"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:bg-muted transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-lg pr-8">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-foreground' : ''}`} 
                  />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
