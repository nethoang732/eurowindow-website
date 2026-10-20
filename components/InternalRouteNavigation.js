'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');
const prefetched = new Set();

function getRouteHref(anchor) {
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  let pathname = url.pathname;
  if (basePath && (pathname === basePath || pathname.startsWith(basePath + '/'))) {
    pathname = pathname.slice(basePath.length) || '/';
  }
  return pathname + url.search + url.hash;
}

export default function InternalRouteNavigation() {
  const router = useRouter();

  useEffect(() => {
    function prefetch(anchor) {
      const href = getRouteHref(anchor);
      if (!href || prefetched.has(href)) return;
      prefetched.add(href);
      router.prefetch(href);
    }

    function onPointerOver(event) {
      const anchor = event.target instanceof Element ? event.target.closest('a[data-next-route="true"]') : null;
      if (anchor) prefetch(anchor);
    }

    function onFocusIn(event) {
      const anchor = event.target instanceof Element ? event.target.closest('a[data-next-route="true"]') : null;
      if (anchor) prefetch(anchor);
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[data-next-route="true"]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const href = getRouteHref(anchor);
      if (!href) return;
      event.preventDefault();
      router.push(href);
    }

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('click', onClick);
    };
  }, [router]);

  return null;
}