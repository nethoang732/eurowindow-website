import './globals.css';
import InternalRouteNavigation from '../components/InternalRouteNavigation';

export const metadata = {
  title: 'Eurowindow | Kiến tạo không gian sống',
  description: 'Eurowindow – giải pháp cửa nhôm kính kiến trúc, tinh tế trong thiết kế và chỉn chu trong từng chi tiết.'
};

export default function RootLayout({ children }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');
  return (
    <html lang="vi" data-motion-mode="auto">
      <head>
        <meta name="theme-color" content="#102b4c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={basePath + '/site.css?v=catalogue-restored-2026-10-21'} />
        <link rel="stylesheet" href={basePath + '/site-navigation.css?v=brand-consistency-2026-10-20'} />
        <link rel="stylesheet" href={basePath + '/site-product-pages.css?v=full-site-visual-fix-2026-10-18'} />
        <link rel="stylesheet" href={basePath + '/site-content-sections.css?v=brand-consistency-2026-10-20'} />
      </head>
      <body><InternalRouteNavigation />{children}</body>
    </html>
  );
}
