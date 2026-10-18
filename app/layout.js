import './globals.css';

export const metadata = {
  title: 'Eurowindow | Kiến tạo không gian sống',
  description: 'Eurowindow – giải pháp cửa nhôm kính kiến trúc, tinh tế trong thiết kế và chỉn chu trong từng chi tiết.'
};

export default function RootLayout({ children }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <html lang="vi" data-motion-mode="auto">
      <head>
        <meta name="theme-color" content="#102b4c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={`${basePath}/site.css?v=website-refresh-2026-10-18`} />
        <link rel="stylesheet" href={`${basePath}/site-navigation.css?v=header-logo-fit-2026-10-18`} />
        <link rel="stylesheet" href={`${basePath}/site-product-pages.css?v=full-site-visual-fix-2026-10-18`} />
      </head>
      <body>
        {children}
        <script src={`${basePath}/site-script.js?v=full-site-visual-fix-2026-10-18`} defer />
      </body>
    </html>
  );
}
