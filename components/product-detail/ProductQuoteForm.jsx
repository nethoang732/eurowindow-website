'use client';

import { useState } from 'react';
import styles from './product-detail.module.css';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/Hoangnm3@eurowindow.biz';

export default function ProductQuoteForm({ productName }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.elements.website.value) {
      setMessage('Không thể gửi yêu cầu. Vui lòng thử lại.');
      return;
    }

    if (!form.reportValidity()) return;

    setIsSubmitting(true);
    setMessage('Đang gửi yêu cầu...');

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      delete payload.website;
      payload._subject = 'Yêu cầu báo giá sản phẩm từ website Eurowindow';
      payload._template = 'table';

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !(result?.success === true || result?.success === 'true')) {
        throw new Error('Form delivery failed');
      }

      setMessage('Yêu cầu đã được gửi. Eurowindow sẽ sớm liên hệ với bạn.');
      form.reset();
    } catch {
      setMessage('Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline (024) 3747 4700.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.quoteForm} onSubmit={handleSubmit}>
      <input type="hidden" name="Sản phẩm" value={productName} />
      <div className={styles.formIntro}>
        <span className={styles.kicker}>Tư vấn theo công trình</span>
        <h2>Thông tin báo giá</h2>
        <p>Để lại thông tin công trình, Eurowindow sẽ liên hệ tư vấn.</p>
      </div>
      <label htmlFor="quote-name">Tên người liên hệ<input id="quote-name" name="Họ và tên" type="text" autoComplete="name" required /></label>
      <label htmlFor="quote-phone">Số điện thoại<input id="quote-phone" name="Số điện thoại" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+() .-]{9,16}" required /></label>
      <label htmlFor="quote-address">Địa chỉ công trình<input id="quote-address" name="Địa chỉ công trình" type="text" autoComplete="street-address" /></label>
      <label htmlFor="quote-place">Vị trí lắp đặt<select id="quote-place" name="Vị trí lắp đặt" defaultValue=""><option value="" disabled>Chọn vị trí</option><option>Ban công</option><option>Hiên hoặc sân vườn</option><option>Cửa phụ</option><option>Khác</option></select></label>
      <label className={styles.messageField} htmlFor="quote-note">Kích thước ô chờ hoặc ghi chú<textarea id="quote-note" name="Kích thước ô chờ hoặc ghi chú" rows="3" placeholder="Ngang × cao (mm)" /></label>
      <label className={styles.honeypot} htmlFor="quote-website" aria-hidden="true">Website<input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu tư vấn'} <span aria-hidden="true">→</span>
      </button>
      <p className={styles.formNote}>Thông tin công trình sẽ được gửi tới Eurowindow để tư vấn.</p>
      <p className={styles.formStatus} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
