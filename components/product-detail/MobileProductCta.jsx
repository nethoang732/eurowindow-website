'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './product-detail.module.css';

export default function MobileProductCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[data-product-hero]');
    const quote = document.querySelector('#bao-gia');
    const footer = document.querySelector('.footer');
    if (!hero || !quote || !footer) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const inView = new Map([[hero, true], [quote, false], [footer, false]]);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => inView.set(entry.target, entry.isIntersecting));
      setVisible(![...inView.values()].some(Boolean));
    }, { rootMargin: '0px 0px -80px 0px' });

    inView.forEach((_, target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.mobileCta} hidden={!visible}>
      <Link href="#bao-gia" onClick={() => setVisible(false)}>Nhận tư vấn sản phẩm</Link>
    </div>
  );
}
