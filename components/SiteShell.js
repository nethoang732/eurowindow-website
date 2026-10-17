'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SiteShell() {
  const rootRef = useRef(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
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

    fetch(`${basePath}/site-shell.html?v=product-pages-29`)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load site shell (${response.status})`);
        return response.text();
      })
      .then((markup) => {
        if (cancelled || !rootRef.current) return;
        rootRef.current.innerHTML = markup;
        window.__EUROWINDOW_BASE_PATH__ = basePath;
        const script = document.createElement('script');
        script.src = `${basePath}/site-script.js?v=product-pages-29`;
        rootRef.current.appendChild(script);
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

  return <div ref={rootRef} />;
}
