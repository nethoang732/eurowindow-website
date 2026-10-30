'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './contact-success-dialog.module.css';

export default function ContactSuccessDialog() {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSuccess = () => setIsOpen(true);
    window.addEventListener('eurowindow:contact-success', handleSuccess);
    return () => window.removeEventListener('eurowindow:contact-success', handleSuccess);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function closeDialog() {
    setIsOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="contact-success-title"
      aria-describedby="contact-success-description"
      onClose={() => setIsOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m5 12.5 4.2 4.2L19.5 6.8" />
          </svg>
        </span>
        <p className={styles.eyebrow}>EUROWINDOW</p>
        <h2 id="contact-success-title">Cảm ơn bạn đã gửi thông tin!</h2>
        <p id="contact-success-description" className={styles.description}>
          Eurowindow đã nhận được yêu cầu và sẽ sớm liên hệ với bạn.
        </p>
        <button className={styles.closeButton} type="button" onClick={closeDialog}>
          Đã hiểu
        </button>
      </div>
    </dialog>
  );
}
