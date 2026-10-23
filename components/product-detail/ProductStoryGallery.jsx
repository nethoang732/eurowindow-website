'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './product-detail.module.css';

export default function ProductStoryGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className={styles.storyGallery}>
      <a
        className={styles.storyImage}
        href={activeImage.src}
        target="_blank"
        rel="noreferrer"
        aria-label={`Mở ảnh lớn: ${activeImage.alt || productName}`}
        title="Mở ảnh kích thước đầy đủ trong tab mới"
      >
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt || productName}
          width={960}
          height={700}
          sizes="(max-width: 800px) 100vw, 50vw"
        />
        <span className={styles.storyImageHint}>Phóng to ảnh ↗</span>
        {images.length > 1 ? (
          <span className={styles.storyImageCount} aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        ) : null}
      </a>

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
    </div>
  );
}