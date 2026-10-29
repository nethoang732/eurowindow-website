'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './product-detail.module.css';

export default function ProductStoryGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const activeImage = images[activeIndex];

  function move(step) {
    setActiveIndex((current) => (current + step + images.length) % images.length);
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
    <div className={styles.storyGallery}>
      <button
        className={styles.storyImage}
        type="button"
        onClick={() => setZoomOpen(true)}
        aria-label={`Phóng to ảnh ${activeIndex + 1} của ${productName}`}
        title="Nhấn để phóng to ảnh"
      >
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt || productName}
          width={960}
          height={700}
          sizes="(max-width: 800px) 100vw, 50vw"
        />
        <span className={styles.storyImageHint}>Phóng to ảnh →</span>
        {images.length > 1 ? (
          <span className={styles.storyImageCount} aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        ) : null}
      </button>

      {images.length > 1 ? (
        <div className={styles.storyThumbs} role="group" aria-label={`Chọn ảnh ${productName}`}>
          {images.map((image, index) => (
            <button
              key={image.src}
              className={index === activeIndex ? styles.storyThumbActive : styles.storyThumb}
              type="button"
              aria-label={`Hiển thị ảnh ${index + 1} của ${productName}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <Image src={image.src} alt="" width={180} height={120} sizes="180px" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      ) : null}

      {zoomOpen ? (
        <div className={styles.zoomOverlay} role="dialog" aria-modal="true" aria-label={`Ảnh phóng to ${productName}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setZoomOpen(false); }}>
          <button className={styles.zoomClose} type="button" onClick={() => setZoomOpen(false)} aria-label="Đóng ảnh phóng to">×</button>
          {images.length > 1 ? <button className={`${styles.zoomNav} ${styles.zoomPrev}`} type="button" onClick={() => move(-1)} aria-label="Ảnh trước">‹</button> : null}
          <Image className={styles.zoomImage} src={activeImage.src} alt={activeImage.alt || productName} width={1800} height={1400} sizes="100vw" priority />
          {images.length > 1 ? <button className={`${styles.zoomNav} ${styles.zoomNext}`} type="button" onClick={() => move(1)} aria-label="Ảnh tiếp theo">›</button> : null}
          {images.length > 1 ? <span className={styles.zoomCounter}>{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
