import type { Metadata } from 'next'
import { plusJakartaSans, jetBrainsMono } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | TargetBand',
    default: 'TargetBand | Master Your IELTS Band Score',
  },
  description: 'Instant IELTS raw score converter, overall band calculator, gap analyzer, and progress tracker.',
  openGraph: {
    title: 'TargetBand | Master Your IELTS Band Score',
    description: 'Instant IELTS raw score converter, overall band calculator, gap analyzer, and progress tracker.',
    url: 'https://targetband.com',
    siteName: 'TargetBand',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for OG image
        width: 1200,
        height: 630,
        alt: 'TargetBand Dark Mode Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TargetBand | Master Your IELTS Band Score',
    description: 'Instant IELTS raw score converter, overall band calculator, gap analyzer, and progress tracker.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
