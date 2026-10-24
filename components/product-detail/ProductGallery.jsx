'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './product-detail.module.css';

export default function ProductGallery({ images, productName }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const item = images[active];

  function move(step) {
    setActive((current) => (current + step + images.length) % images.length);
  }

  useEffect(() => {
    if (!zoomOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(event) {
      if (event.key === 'Escape') setZoomOpen(false);
      if (event.key === 'ArrowLeft' && images.length > 1) move(-1);
      if (event.key === 'ArrowRight' && images.length > 1) move(1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [zoomOpen, images.length]);

  return (
    <div className={styles.gallery} aria-label={`Hình ảnh ${productName}`}>
      <div className={styles.galleryStage}>
        <div className={styles.galleryMain}>
          <button className={styles.imageZoomTrigger} type="button" onClick={() => setZoomOpen(true)} aria-label={`Phóng to ảnh ${active + 1} của ${productName}`} title="Nhấn để phóng to ảnh">
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt || productName}
              width={1080}
              height={840}
              priority={active === 0}
              sizes="(max-width: 900px) 100vw, 54vw"
              unoptimized={item.src.startsWith('data:')}
            />
          </button>
          {images.length > 1 ? (
            <>
              <span className={styles.galleryIndex} aria-live="polite">
                {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              <div className={styles.galleryControls}>
                <button type="button" onClick={() => move(-1)} aria-label="Ảnh trước">‹</button>
                <button type="button" onClick={() => move(1)} aria-label="Ảnh tiếp theo">›</button>
              </div>
            </>
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className={styles.galleryRail} aria-label="Chọn góc nhìn">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={index === active ? styles.thumbActive : styles.thumb}
                aria-label={`Hiển thị ảnh ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <Image src={image.src} alt="" width={110} height={84} sizes="110px" unoptimized={image.src.startsWith('data:')} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {zoomOpen ? (
        <div className={styles.zoomOverlay} role="dialog" aria-modal="true" aria-label={`Ảnh phóng to ${productName}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setZoomOpen(false); }}>
          <button className={styles.zoomClose} type="button" onClick={() => setZoomOpen(false)} aria-label="Đóng ảnh phóng to">×</button>
          {images.length > 1 ? <button className={`${styles.zoomNav} ${styles.zoomPrev}`} type="button" onClick={() => move(-1)} aria-label="Ảnh trước">‹</button> : null}
          <Image className={styles.zoomImage} src={item.src} alt={item.alt || productName} width={1800} height={1400} sizes="100vw" priority unoptimized={item.src.startsWith('data:')} />
          {images.length > 1 ? <button className={`${styles.zoomNav} ${styles.zoomNext}`} type="button" onClick={() => move(1)} aria-label="Ảnh tiếp theo">›</button> : null}
          {images.length > 1 ? <span className={styles.zoomCounter}>{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
