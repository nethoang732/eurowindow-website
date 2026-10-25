'use client';

export default function FloatingContactButtons() {
  const scrollToTop = () => {
    if (window.__EUROWINDOW_LENIS__?.scrollTo) {
      window.__EUROWINDOW_LENIS__.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="floating-contact" aria-label="Liên hệ nhanh">
      <button
        className="floating-contact__button floating-contact__button--top"
        type="button"
        onClick={scrollToTop}
        title="Lên đầu trang"
        aria-label="Lên đầu trang"
      >
        <span className="floating-contact__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 19V5m-6 6 6-6 6 6" />
          </svg>
        </span>
      </button>
      <a
        className="floating-contact__button floating-contact__button--zalo"
        href="https://zalo.me/0967111082"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo"
        aria-label="Liên hệ qua Zalo"
      >
        <span className="floating-contact__icon floating-contact__icon--zalo" aria-hidden="true">Z</span>
        <span className="floating-contact__label">Chat Zalo</span>
        <span className="floating-contact__arrow" aria-hidden="true">↗</span>
      </a>
      <a
        className="floating-contact__button floating-contact__button--call"
        href="tel:0967111082"
        title="Gọi 0967 111 082"
        aria-label="Gọi 0967 111 082"
      >
        <span className="floating-contact__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6.7 3.8 9.3 3l2 4.2-2.1 1.7a14.5 14.5 0 0 0 5.9 5.9l1.7-2.1 4.2 2-.8 2.6a2 2 0 0 1-2.1 1.4A15.7 15.7 0 0 1 5.3 5.9a2 2 0 0 1 1.4-2.1Z" />
          </svg>
        </span>
        <span className="floating-contact__label">Gọi 0967 111 082</span>
        <span className="floating-contact__arrow" aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
