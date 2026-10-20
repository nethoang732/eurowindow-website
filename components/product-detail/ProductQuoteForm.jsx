'use client';

import { useState } from 'react';
import styles from './product-detail.module.css';

export default function ProductQuoteForm({ productName }) {
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.elements.website.value) {
      setMessage('Không thể kiểm tra biểu mẫu này. Vui lòng gọi để được hỗ trợ.');
      return;
    }
    setMessage('Đã kiểm tra thông tin trên thiết bị này. Yêu cầu chưa được gửi. Gọi (024) 3747 4700 để nhận tư vấn.');
  }

  return (
    <form className={styles.quoteForm} onSubmit={handleSubmit}>
      <input type="hidden" name="san-pham" value={productName} />
      <div className={styles.formIntro}>
        <span className={styles.kicker}>Tư vấn theo công trình</span>
        <h2>Thông tin báo giá</h2>
        <p>Biểu mẫu này chưa gửi yêu cầu. Gọi <a href="tel:+842437474700">(024) 3747 4700</a>.</p>
      </div>
      <label htmlFor="quote-name">Tên người liên hệ<input id="quote-name" name="name" type="text" autoComplete="name" required /></label>
      <label htmlFor="quote-phone">Số điện thoại<input id="quote-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+() .-]{9,16}" required /></label>
      <label htmlFor="quote-email">Email (không bắt buộc)<input id="quote-email" name="email" type="email" autoComplete="email" spellCheck={false} /></label>
      <label htmlFor="quote-place">Vị trí lắp đặt<select id="quote-place" name="vi-tri" defaultValue=""><option value="" disabled>Chọn vị trí</option><option>Ban công</option><option>Hiên hoặc sân vườn</option><option>Cửa phụ</option><option>Khác</option></select></label>
      <label className={styles.messageField} htmlFor="quote-note">Kích thước ô chờ hoặc ghi chú<textarea id="quote-note" name="ghi-chu" rows="3" placeholder="Ngang × cao (mm)" /></label>
      <label className={styles.honeypot} htmlFor="quote-website" aria-hidden="true">Website<input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      <button className={styles.submitButton} type="submit">Kiểm tra thông tin <span aria-hidden="true">↗</span></button>
      <p className={styles.formNote}>Thông tin chỉ được kiểm tra trên trình duyệt, không được lưu hoặc gửi đi.</p>
      <p className={styles.formStatus} role="status" aria-live="polite">{message}</p>
    </form>
  );
}