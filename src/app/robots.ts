import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/checkout/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://captain-farmery.vercel.app'}/sitemap.xml`,
  }
}
