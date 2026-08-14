import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/contact', '/tools', '/converter', '/calculator', '/gap-calculator', '/privacy'],
      disallow: ['/dashboard/', '/api/', '/_next/'],
    },
    sitemap: 'https://targetband.com/sitemap.xml',
  }
}
