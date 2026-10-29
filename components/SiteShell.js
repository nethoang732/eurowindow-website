'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SiteShell({ initialMarkup = '' }) {
  const rootRef = useRef(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: false,
      syncTouch: false,
      // The site keeps smooth scrolling enabled for every visitor. Reduced-motion
      // preferences are handled by shortening and softening decorative transitions.
      respectReducedMotion: true
    });
    window.__EUROWINDOW_LENIS__ = lenis;

    return () => {
      lenis.destroy();
      if (window.__EUROWINDOW_LENIS__ === lenis) delete window.__EUROWINDOW_LENIS__;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let siteScript = null;

    fetch(`${basePath}/site-shell.html?v=header-unified-v3-20261029`)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load site shell (${response.status})`);
        return response.text();
      })
      .then((markup) => {
        if (cancelled || !rootRef.current) return;
        rootRef.current.innerHTML = markup;
        window.__EUROWINDOW_BASE_PATH__ = basePath;
        siteScript = document.createElement('script');
        siteScript.src = `${basePath}/site-script.js?v=header-unified-v3-20261029`;
        rootRef.current.appendChild(siteScript);
      })
      .catch((error) => {
        if (!cancelled && rootRef.current) {
          rootRef.current.textContent = `Kh\u00f4ng th\u1ec3 t\u1ea3i website: ${error.message}`;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [basePath]);

  return <div ref={rootRef} dangerouslySetInnerHTML={initialMarkup ? { __html: initialMarkup } : undefined} />;
}
