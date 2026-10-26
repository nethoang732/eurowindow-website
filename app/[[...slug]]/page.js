import fs from 'node:fs';
import path from 'node:path';
import Script from 'next/script';
import LegacySiteScript from '../../components/LegacySiteScript';
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
    return { title: 'Eurowindow - Chi nh?nh Mi?n Nam', description: 'Eurowindow - Chi nh?nh Mi?n Nam.' };
  }
  const path = segments.join('/');
  if (segments.join('/') === 'gioi-thieu') {
    return {
      title: 'Giới thiệu | Hành trình cửa từ năm 2002',
      description: 'Tìm hiểu hành trình Eurowindow từ năm 2002, các dòng cửa và kính, cùng những công trình đã sử dụng sản phẩm.'
    };
  }
  const productPages = {
    'san-pham': ['Giải pháp cửa, kính và vách kính', 'Xem các dòng cửa, kính và vách kính Eurowindow, cùng thông tin để lựa chọn theo vị trí lắp đặt và nhu cầu sử dụng.'],
    'san-pham/cua-nhom': ['Cửa nhôm: cửa đi, cửa sổ và vách kính', 'Cửa đi, cửa sổ và vách nhôm kính với nhiều kiểu mở. Phương án phụ thuộc vào kích thước ô chờ và yêu cầu của công trình.'],
    'san-pham/cua-upvc': ['Cửa uPVC Eurowindow', 'Cửa đi và cửa sổ uPVC với lựa chọn kiểu mở, kính và phụ kiện theo thiết kế từng công trình.'],
    'san-pham/cua-go': ['Cửa gỗ Eurowindow', 'Cửa gỗ tự nhiên, gỗ công nghiệp, gỗ ghép thanh và composite. Chọn vật liệu, bề mặt và vị trí lắp theo điều kiện sử dụng.'],
    'san-pham/cua-cuon': ['Cửa cuốn Eurowindow', 'Cửa cuốn nhôm khe thoáng EASD45. Xem cấu tạo nan và trao đổi kích thước ô chờ, mặt tiền trước khi chốt mẫu.'],
    'san-pham/cua-thong-minh-the-he-moi': ['Cửa thông minh Eurowindow', 'Cửa tự động, cửa điều khiển và kính điện. Tính năng vận hành tùy từng mẫu và mẫu sản phẩm.'],
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
  if (!descriptor && !productDescriptor) return {};
  const origin = getSiteOrigin();
  const articleTitles = {
    'cong-bo-ket-qua-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-hanh-trinh-cham-toi-trai-tim-va-lan-toa-niem-tu-hao': 'Kết quả cuộc thi Eurowindow – Nơi làm việc tôi yêu | Eurowindow',
    'eurowindow-cung-cap-lap-dat-cua-va-vach-kinh-tai-khu-do-thi-vinhomes-global-gate-co-loa': 'Eurowindow tại Vinhomes Global Gate Cổ Loa | Eurowindow',
    'eurowindow-dong-hanh-cung-gala-doanh-nhan-thang-long-2026-va-vinh-du-nhan-bang-khen-tu-vcci': 'Eurowindow đồng hành Gala Doanh nhân Thăng Long 2026 | Eurowindow',
    'eurowindow-trung-thau-thi-cong-he-cua-va-vach-nhom-kinh-du-an-fpt-telecom-tower': 'Eurowindow thi công cửa và vách kính FPT Telecom Tower | Eurowindow',
    'the-le-chuong-trinh-khuyen-mai-sam-cua-don-sang-san-sang-rinh-xe': 'Thể lệ khuyến mãi Sắm cửa đón sang, sẵn sàng rinh xế | Eurowindow'
  };
  const title = descriptor?.article
    ? articleTitles[descriptor.article.slug] || `${descriptor.title} | Eurowindow`
    : (descriptor?.title || productDescriptor[0]) + ' | Eurowindow';
  const sectionDescriptions = {
    showrooms: 'Tìm địa chỉ và thông tin liên hệ các showroom Eurowindow.',
    projects: 'Xem các công trình cấp quốc gia, văn phòng, chung cư và nhà ở có sản phẩm Eurowindow.',
    policies: 'Đọc chính sách bảo hành và bảo mật thông tin khách hàng của Eurowindow.'
  };
  const description = descriptor?.description || productDescriptor?.[1] || sectionDescriptions[descriptor?.type] || 'Thông tin sản phẩm, công trình và hoạt động của Eurowindow.';
  const imagePath = descriptor?.article?.image || descriptor?.project?.image || contentImageFallback;
  const image = origin ? new URL(imagePath, origin).toString() : undefined;
  const article = descriptor?.article;
  return {
    title,
    description,
    ...(origin ? {
      alternates: { canonical: new URL(canonicalPath(segments), origin).toString() },
      openGraph: {
        title, description, url: new URL(canonicalPath(segments), origin).toString(),
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
  const script = <Script src={basePath + '/site-script.js?v=hero-video-only-v1-20261025'} strategy="afterInteractive" />;
  if (!sectionPageExists(segments)) {
    return <><div dangerouslySetInnerHTML={{ __html: siteShell }} /><LegacySiteScript routeKey={segments.join('/')} /></>;
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
