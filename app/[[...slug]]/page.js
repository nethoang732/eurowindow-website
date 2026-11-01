import fs from 'node:fs';
import path from 'node:path';
import Script from 'next/script';
import LegacySiteScript from '../../components/LegacySiteScript';
import HomepageMotionLoader from '../../components/HomepageMotionLoader';
import { SectionPage, sectionPageExists } from '../../components/site-sections/SectionPage';
import { getRobotsMetadata, getSectionDescriptor, getSectionPaths, getSiteOrigin, limitMetaDescription } from '../../lib/content/site-section-utils';
import { renderLegacyPage } from '../../lib/content/legacy-server-renderer';
import content from '../../lib/content/site-sections.json';

const siteShell = fs.readFileSync(path.join(process.cwd(), 'public', 'site-shell.html'), 'utf8');
const routes = [
  '', 'gioi-thieu', 'catalogue', 'san-pham', 'du-an', 'tin-tuc', 'lien-he', 'bao-gia',
  'san-pham/cua-nhom', 'san-pham/cua-upvc', 'san-pham/cua-go', 'san-pham/cua-cuon', 'san-pham/cua-thong-minh-the-he-moi',
  'san-pham/cua-di-mo-quay', 'san-pham/cua-di-mo-truot', 'san-pham/cua-xep-truot',
  'san-pham/cua-so-mo-quay', 'san-pham/cua-so-mo-hat', 'san-pham/vach-kinh-mat-dung',
  ...getSectionPaths()
];
export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(routes)].map((route) => ({ slug: route ? route.split('/') : [] }));
}

function canonicalPath(segments) {
  return segments.length ? `/${segments.join('/')}/` : '/';
}

function addCanonicalMetadata(metadata, path) {
  const origin = getSiteOrigin();
  if (!origin) return metadata;
  const canonical = new URL(path, origin).toString();
  return {
    ...metadata,
    alternates: { canonical },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      siteName: 'Eurowindow',
      locale: 'vi_VN',
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description
    }
  };
}

function shortenTitle(value, maxLength = 60) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const brandSuffix = normalized.endsWith(' | Eurowindow') ? ' | Eurowindow' : '';
  const title = brandSuffix ? normalized.slice(0, -brandSuffix.length).trim() : normalized;
  const budget = maxLength - brandSuffix.length - 1;
  const cutoff = title.lastIndexOf(' ', budget);
  const shortened = title.slice(0, cutoff > 24 ? cutoff : budget).replace(/[\s,;:–-]+$/, '');
  return shortened + '…' + brandSuffix;
}

export function generateMetadata({ params }) {
  const segments = params?.slug || [];
  if (segments.length === 0) {
    return addCanonicalMetadata({
      title: 'Giải pháp cửa, kính cho công trình | Eurowindow',
      description: 'Khám phá cửa, kính và vách kính Eurowindow cho nhà ở, văn phòng và công trình; tìm hiểu vật liệu, kiểu mở và ứng dụng theo từng vị trí.'
    }, '/');
  }
  const path = segments.join('/');
  if (segments.join('/') === 'gioi-thieu') {
    return addCanonicalMetadata({
      title: 'Giới thiệu | Hành trình cửa từ năm 2002',
      description: 'Tìm hiểu hành trình Eurowindow từ năm 2002, các dòng cửa và kính, cùng những công trình đã sử dụng sản phẩm.'
    }, canonicalPath(segments));
  }
  const legacyPages = {
    catalogue: ['Catalogue cửa và kính Eurowindow', 'Xem catalogue Eurowindow để tham khảo các dòng cửa, kính và thông tin sản phẩm.'],
    'lien-he': ['Liên hệ Eurowindow | Tư vấn giải pháp cửa', 'Liên hệ Eurowindow để trao đổi nhu cầu, vị trí lắp đặt và lựa chọn giải pháp cửa cho công trình.'],
    'bao-gia': ['Báo giá cửa Eurowindow | Nhận tư vấn', 'Gửi thông tin công trình để được tư vấn dòng cửa, vật liệu và phương án phù hợp trước khi nhận báo giá.']
  };
  const productPages = {
    'san-pham': ['Giải pháp cửa, kính và vách kính', 'Xem các dòng cửa, kính và vách kính Eurowindow, cùng thông tin để lựa chọn theo vị trí lắp đặt và nhu cầu sử dụng.'],
    'san-pham/cua-nhom': ['Cửa nhôm Eurowindow: cửa đi, cửa sổ và vách kính', 'Tìm hiểu ưu điểm, cấu tạo, vật liệu và kiểu mở cửa nhôm Eurowindow. Lựa chọn cửa đi, cửa sổ và vách nhôm kính theo vị trí lắp đặt, yêu cầu sử dụng và hồ sơ kỹ thuật.'],
    'san-pham/cua-upvc': ['Cửa uPVC Eurowindow', 'Cửa đi và cửa sổ uPVC với lựa chọn kiểu mở, kính và phụ kiện theo thiết kế từng công trình.'],
    'san-pham/cua-go': ['Cửa gỗ Eurowindow', 'Cửa gỗ tự nhiên, gỗ công nghiệp, gỗ ghép thanh và composite. Chọn vật liệu, bề mặt và vị trí lắp theo điều kiện sử dụng.'],
    'san-pham/cua-cuon': ['Cửa cuốn Eurowindow', 'Cửa cuốn nhôm khe thoáng EASD45. Xem cấu tạo nan và trao đổi kích thước ô chờ, mặt tiền trước khi chốt mẫu.'],
    'san-pham/cua-thong-minh-the-he-moi': ['Cửa thông minh Eurowindow', 'Khám phá cửa thông minh Eurowindow: cửa tự động, kính điện đổi màu, cửa sổ điều khiển giọng nói và các giải pháp kết nối Smarthome.'],
    'san-pham/vach-kinh-mat-dung': ['Kính và vách kính Eurowindow', 'Các loại kính và hệ vách kính cho cửa, vách ngăn và mặt dựng. Cấu tạo cần chọn theo vị trí và yêu cầu kỹ thuật.'],
    'san-pham/cua-di-mo-quay': ['Cửa đi mở quay', 'Tìm hiểu cửa đi mở quay, hướng mở và khoảng thao tác cần tính theo mặt bằng công trình.'],
    'san-pham/cua-di-mo-truot': ['Cửa đi mở trượt', 'Cửa đi mở trượt phù hợp vị trí cần dành khoảng trống bên cạnh cửa. Chọn số cánh và hướng trượt theo mặt bằng.'],
    'san-pham/cua-xep-truot': ['Cửa xếp trượt', 'Cửa nhiều cánh xếp gọn về một phía. Cần tính vị trí gom cánh, lối đi và kích thước ô chờ.'],
    'san-pham/cua-so-mo-quay': ['Cửa sổ mở quay', 'Chọn hướng mở cửa sổ theo vị trí lắp, đồ nội thất và khoảng thao tác bên trong hoặc bên ngoài.'],
    'san-pham/cua-so-mo-hat': ['Cửa sổ mở hất', 'Cửa sổ mở hất tạo khe thông gió phía trên. Kiểm tra vị trí, kích thước và yêu cầu che mưa của ô cửa.'],
    'he-nhom': ['Hệ nhôm Eurowindow', 'Tìm hiểu các hệ nhôm, kiểu mở và ứng dụng phù hợp với từng công trình.'],
    'he-nhom/ea55-ea60i': ['Hệ nhôm EA55 và EA60i', 'Xem thông tin hệ nhôm EA55 và EA60i, các kiểu cửa tương ứng và chi tiết cần xác nhận tùy mẫu.'],
    'he-nhom/ea70': ['Hệ nhôm EA70', 'Tìm hiểu ứng dụng hệ nhôm EA70 và chọn cửa theo thiết kế ô cửa.'],
    'he-nhom/ea95-ea95i': ['Hệ nhôm EA95 và EA95i', 'Tìm hiểu hệ nhôm EA95 và EA95i, kiểu mở và yêu cầu kỹ thuật của công trình.'],
    'he-nhom/fa52': ['Hệ nhôm FA52', 'Tìm hiểu hệ nhôm FA52 và các yếu tố cần tính theo vị trí lắp đặt, thiết kế và yêu cầu kỹ thuật.']
  };
  const descriptor = getSectionDescriptor(segments);
  const productDescriptor = productPages[path];
  const legacyDescriptor = legacyPages[path];
  if (!descriptor && !productDescriptor && !legacyDescriptor) return {};
  const origin = getSiteOrigin();
  const articleTitles = {
    'cap-nhat-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-16-cau-chuyen-dau-tien-va-loi-moi-goi-tiep-noi-hanh-trinh': 'Cuộc thi Eurowindow: 16 câu chuyện | Eurowindow',
    'cap-nhat-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-28-bai-du-thi-va-chang-nuoc-rut-truoc-gio-khoa-cong': 'Cuộc thi Eurowindow: 28 bài dự thi | Eurowindow',
    'cong-bo-ket-qua-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-hanh-trinh-cham-toi-trai-tim-va-lan-toa-niem-tu-hao': 'Kết quả cuộc thi Eurowindow – Nơi làm việc tôi yêu | Eurowindow',
    'eurowindow-cung-cap-lap-dat-cua-va-vach-kinh-tai-khu-do-thi-vinhomes-global-gate-co-loa': 'Eurowindow tại Vinhomes Global Gate Cổ Loa | Eurowindow',
    'eurowindow-dong-hanh-cung-gala-doanh-nhan-thang-long-2026-va-vinh-du-nhan-bang-khen-tu-vcci': 'Eurowindow đồng hành Gala Doanh nhân Thăng Long 2026 | Eurowindow',
    'eurowindow-trung-thau-thi-cong-he-cua-va-vach-nhom-kinh-du-an-fpt-telecom-tower': 'Eurowindow thi công cửa và vách kính FPT Telecom Tower | Eurowindow',
    'the-le-chuong-trinh-khuyen-mai-sam-cua-don-sang-san-sang-rinh-xe': 'Thể lệ khuyến mãi Sắm cửa đón sang, sẵn sàng rinh xế | Eurowindow'
  };
  const rawTitle = legacyDescriptor?.[0] || (path === 'du-an'
    ? 'Dự án Eurowindow | Công trình tiêu biểu'
    : descriptor?.article
    ? articleTitles[descriptor.article.slug] || `${descriptor.title} | Eurowindow`
    : (descriptor?.title || productDescriptor?.[0]) + ' | Eurowindow');
  const title = shortenTitle(rawTitle);
  const sectionDescriptions = {
    showrooms: 'Tìm địa chỉ và thông tin liên hệ các showroom Eurowindow.',
    projects: 'Xem các công trình cấp quốc gia, văn phòng, chung cư và nhà ở có sản phẩm Eurowindow.',
    policies: 'Đọc chính sách bảo hành và bảo mật thông tin khách hàng của Eurowindow.'
  };
  const descriptionSource = path === 'du-an'
    ? 'Khám phá các công trình tiêu biểu có giải pháp cửa, kính và vách kính Eurowindow.'
    : descriptor?.article
    ? [descriptor.title, descriptor.description].filter(Boolean).join('. ')
    : descriptor?.project
      ? descriptor.description
        ? [descriptor.project.name, descriptor.description].join('. ')
        : `Xem thông tin và hình ảnh về ${descriptor.project.name}, thuộc danh mục công trình tiêu biểu của Eurowindow.`
      : descriptor?.description || productDescriptor?.[1] || sectionDescriptions[descriptor?.type] || legacyDescriptor?.[1] || 'Thông tin sản phẩm, công trình và hoạt động của Eurowindow.';
  const description = limitMetaDescription(descriptionSource);
  const imagePath = descriptor?.article?.image || descriptor?.project?.image;
  const image = origin && imagePath ? new URL(imagePath, origin).toString() : undefined;
  const article = descriptor?.article;
  const canonicalSegments = path === 'du-an'
    ? ['cong-trinh-tieu-bieu']
    : descriptor?.alias && descriptor.project
      ? ['cong-trinh-tieu-bieu', descriptor.project.slug]
      : segments;
  const canonicalUrl = origin ? new URL(canonicalPath(canonicalSegments), origin).toString() : undefined;
  return {
    title,
    description,
    robots: getRobotsMetadata(),
    ...(canonicalUrl ? {
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title, description, url: canonicalUrl,
        siteName: 'Eurowindow', locale: 'vi_VN', type: article ? 'article' : 'website',
        ...(image ? { images: [{ url: image, alt: descriptor?.title || productDescriptor[0] }] } : {}),
        ...(article ? { publishedTime: article.date } : {})
      },
      twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) }
    } : {}),
  };
}

export default function Page({ params }) {
  const segments = params?.slug || [];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');
  const script = <Script src={basePath + '/site-script.js?v=ssr-reveal-20261031'} strategy="afterInteractive" />;
  if (!sectionPageExists(segments)) {
    const isHomePage = segments.length === 0;
    const parts = siteShell.split('<main id="main"></main>');
    if (parts.length !== 2) throw new Error('Could not place server-rendered legacy page inside the site shell');
    const routePath = canonicalPath(segments);
    const { markup, mainClassName } = renderLegacyPage(routePath);
    return (
      <>
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: parts[0] }} />
        <main
          id="main"
          data-server-route={routePath}
          className={mainClassName}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: parts[1] }} />
        <LegacySiteScript routeKey={segments.join('/')} />
        {isHomePage ? <HomepageMotionLoader /> : null}
      </>
    );
  }
  const parts = siteShell.split('<main id="main"></main>');
  if (parts.length !== 2) throw new Error('Could not place server-rendered section inside the site shell');
  const routePath = canonicalPath(segments);
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: parts[0] }} />
      <main id="main" data-server-route={routePath} className={segments.length === 0 ? 'home-page' : undefined}><SectionPage segments={segments} /></main>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: parts[1] }} />
      {script}
    </>
  );
}
