export const metadata = {
  title: 'Trang không tồn tại | Eurowindow',
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '55vh',
        display: 'grid',
        alignContent: 'center',
        justifyItems: 'center',
        gap: '1rem',
        padding: '4rem 1.25rem',
        color: '#102d4f',
        textAlign: 'center',
        background: '#f5f3ee'
      }}
    >
      <p style={{ margin: 0, color: '#b99a5b', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
        Eurowindow
      </p>
      <h1 style={{ margin: 0 }}>Trang bạn tìm không tồn tại</h1>
      <p style={{ maxWidth: '38rem', margin: 0, lineHeight: 1.7 }}>
        Địa chỉ có thể đã thay đổi hoặc nội dung không còn được đăng tải. Bạn có thể tiếp tục từ trang chủ hoặc xem các tin tức hiện có.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.75rem' }}>
        <a href="/" style={{ padding: '.75rem 1.1rem', color: '#fff', background: '#102d4f', textDecoration: 'none' }}>
          Về trang chủ
        </a>
        <a href="/tin-tuc/" style={{ padding: '.75rem 1.1rem', color: '#102d4f', border: '1px solid #b99a5b', textDecoration: 'none' }}>
          Xem tin tức
        </a>
      </div>
    </main>
  );
}
