import { getSiteOrigin } from '../lib/content/site-section-utils';

export default function robots() {
  const origin = getSiteOrigin();
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(origin ? { sitemap: new URL('/sitemap.xml', origin).toString() } : {})
  };
}