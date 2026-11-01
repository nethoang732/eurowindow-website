import { getSiteOrigin } from '../lib/content/site-section-utils';

export default function robots() {
  if (process.env.VERCEL_ENV === 'preview') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  const origin = getSiteOrigin();
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(origin ? { sitemap: new URL('/sitemap.xml', origin).toString() } : {})
  };
}
