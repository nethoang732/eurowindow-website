'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './product-detail.module.css';

export default function ProductGallery({ images, productName }) {
  const [active, setActive] = useState(0);
  const item = images[active];

  function move(step) {
    setActive((current) => (current + step + images.length) % images.length);
  }

  return (
    <div className={styles.gallery} aria-label={`Hình ảnh ${productName}`}>
      <div className={styles.galleryStage}>
        <div className={styles.galleryMain}>
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
    </div>
  );
}
