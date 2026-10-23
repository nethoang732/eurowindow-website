import fs from 'node:fs';
import path from 'node:path';
import Script from 'next/script';
import { SectionPage, sectionPageExists } from '../../components/site-sections/SectionPage';
import { getSectionDescriptor, getSectionPaths, getSiteOrigin } from '../../lib/content/site-section-utils';
import content from '../../lib/content/site-sections.json';

const contentImageFallback = content.showrooms[0]?.image;

const siteShell = fs.readFileSync(path.join(process.cwd(), 'public', 'site-shell.html'), 'utf8');
const routes = [
  '', 'gioi-thieu', 'catalogue', 'san-pham', 'du-an', 'tin-tuc', 'lien-he', 'bao-gia',
  'san-pham/cua-nhom', 'san-pham/cua-upvc', 'san-pham/cua-go', 'san-pham/cua-cuon', 'san-pham/cua-thong-minh-the-he-moi',
  'san-pham/cua-di-mo-quay', 'san-pham/cua-di-mo-truot', 'san-pham/cua-xep-truot',
  'san-pham/cua-so-mo-quay', 'san-pham/cua-so-mo-hat', 'san-pham/vach-kinh-mat-dung',
  'du-an/biet-thu-ven-song', 'du-an/nha-vuon-an-yen', 'du-an/khong-gian-do-thi',
  'du-an/villa-an-vien', 'du-an/nha-ben-doi', 'du-an/residence-horizon',
  'tin-tuc/chon-cua-nhom-cho-cong-trinh', 'tin-tuc/anh-sang-tu-nhien-trong-nha',
  'tin-tuc/bao-tri-cua-nhom-kinh', 'tin-tuc/khong-gian-mo-va-cua-truot',
  'tin-tuc/chon-mau-khung-nhom', 'tin-tuc/quy-trinh-tu-van-thiet-ke',
  ...getSectionPaths()
];
export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(routes)].map((route) => ({ slug: route ? route.split('/') : [] }));
}

function canonicalPath(segments) {
  return '/' + segments.join('/') + '/';
}

export function generateMetadata({ params }) {
  const segments = params?.slug || [];
  if (segments.length === 0) {
    return {
      title: 'Eurowindow - Chi nhánh Miền Nam',
      description: 'Eurowindow - Chi nhánh Miền Nam.'
    };
  }
  if (segments.join('/') === 'gioi-thieu') {
    return {
      title: 'Tiên phong, Kiến tạo, Đồng hành | Eurowindow',
      description: 'Tìm hiểu hành trình Eurowindow từ năm 2002, các dòng sản phẩm và ba giá trị Tiên phong, Kiến tạo, Đồng hành.'
    };
  }  const descriptor = getSectionDescriptor(segments);
  if (!descriptor) return {};
  const origin = getSiteOrigin();
  const title = descriptor.title + ' | Eurowindow';
  const imagePath = descriptor.article?.image || descriptor.project?.image || contentImageFallback;
  const image = origin ? new URL(imagePath, origin).toString() : undefined;
  const article = descriptor.article;
  return {
    title,
    description: descriptor.description,
    ...(origin ? {
      alternates: { canonical: new URL(canonicalPath(segments), origin).toString() },
      openGraph: {
        title, description: descriptor.description, url: new URL(canonicalPath(segments), origin).toString(),
        siteName: 'Eurowindow', locale: 'vi_VN', type: article ? 'article' : 'website',
        ...(image ? { images: [{ url: image, alt: descriptor.title }] } : {}),
        ...(article ? { publishedTime: article.date } : {})
      },
      twitter: { card: 'summary_large_image', title, description: descriptor.description, ...(image ? { images: [image] } : {}) }
    } : {}),
  };
}

export default function Page({ params }) {
  const segments = params?.slug || [];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');
  const script = <Script src={basePath + '/site-script.js?v=asset-refresh-67f9d1c-20261023'} strategy="afterInteractive" />;
  if (!sectionPageExists(segments)) {
    return <><div dangerouslySetInnerHTML={{ __html: siteShell }} />{script}</>;
  }
  const parts = siteShell.split('<main id="main"></main>');
  if (parts.length !== 2) throw new Error('Could not place server-rendered section inside the site shell');
  const routePath = canonicalPath(segments);
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: parts[0] }} />
      <main id="main" data-server-route={routePath}><SectionPage segments={segments} /></main>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: parts[1] }} />
      {script}
    </>
  );
}
