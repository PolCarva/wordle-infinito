import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/custom/',
    },
    sitemap: 'https://wordleinfinito.com/sitemap.xml',
  }
} 