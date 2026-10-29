'use client';

import { useEffect } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');

export default function LegacySiteScript({ routeKey }) {
  useEffect(() => {
    if (typeof window.__EUROWINDOW_RENDER__ === 'function') {
      window.requestAnimationFrame(() => window.__EUROWINDOW_RENDER__());
      return;
    }

    if (document.querySelector('script[data-eurowindow-legacy-script]')) return;

    const script = document.createElement('script');
    script.src = `${basePath}/site-script.js?v=header-unified-v3-20261029`;
    script.dataset.eurowindowLegacyScript = 'true';
    document.body.appendChild(script);
  }, [routeKey]);

  return null;
}
