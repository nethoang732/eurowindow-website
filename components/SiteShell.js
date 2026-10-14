'use client';

import { useEffect, useRef } from 'react';

export default function SiteShell() {
  const rootRef = useRef(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    let cancelled = false;

    fetch(`${basePath}/site-shell.html`)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load site shell (${response.status})`);
        return response.text();
      })
      .then((markup) => {
        if (cancelled || !rootRef.current) return;
        rootRef.current.innerHTML = markup;
        window.__EUROWINDOW_BASE_PATH__ = basePath;
        const script = document.createElement('script');
        script.src = `${basePath}/site-script.js`;
        rootRef.current.appendChild(script);
      })
      .catch((error) => {
        if (!cancelled && rootRef.current) {
          rootRef.current.textContent = `Không thể tải website: ${error.message}`;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [basePath]);

  return <div ref={rootRef} />;
}
