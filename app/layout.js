import './globals.css';
import InternalRouteNavigation from '../components/InternalRouteNavigation';
import FloatingContactButtons from '../components/FloatingContactButtons';
import ContactSuccessDialog from '../components/ContactSuccessDialog';

export const metadata = {
  icons: {
    icon: [{ url: '/favicon.svg?v=eurowindow-branch-20261023', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg?v=eurowindow-branch-20261023'],
    apple: ['/favicon.svg?v=eurowindow-branch-20261023']
  },
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
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "document.addEventListener('load',function(event){if(event.target&&event.target.id==='eurowindow-google-fonts')event.target.media='all'},true)" }} />
        <link id="eurowindow-google-fonts" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" media="print" />
        <link rel="stylesheet" href={basePath + '/site.css?v=hero-playlist-v1-20261024'} />
        <link rel="stylesheet" href={basePath + '/site-navigation.css?v=mobile-menu-contrast-v1-20261030'} />
        <link rel="stylesheet" href={basePath + '/site-product-pages.css?v=full-site-visual-fix-2026-10-18'} />
        <link rel="stylesheet" href={basePath + '/site-content-sections.css?v=policy-documents-v2-20261024'} />
        <link rel="stylesheet" href={basePath + '/home-hero.css?v=brand-hero-v4-20261027'} />
        <link rel="stylesheet" href={basePath + '/intro-section.css?v=intro-reference-v5-20261027'} />
        <link rel="stylesheet" href={basePath + '/category-section.css?v=category-reference-v3-20261027'} />
        <link rel="stylesheet" href={basePath + '/project-showcase.css?v=project-reference-v2-20261027'} />
        <link rel="stylesheet" href={basePath + '/news-section.css?v=news-reference-v1-20261027'} />
        <link rel="stylesheet" href={basePath + '/home-videos.css?v=home-video-showcase-v7-20261028'} />
        <link rel="stylesheet" href={basePath + '/featured-products.css?v=home-motion-carousel-v1-20261027'} />
        <link rel="stylesheet" href={basePath + '/home-contact.css?v=contact-height-v1-20261028'} />
        <link rel="stylesheet" href={basePath + '/quote-band.css?v=reference-contact-v1-20261028'} />
      </head>
      <body><InternalRouteNavigation /><FloatingContactButtons /><ContactSuccessDialog />{children}</body>
    </html>
  );
}
