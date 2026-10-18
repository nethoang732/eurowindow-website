import fs from 'node:fs';
import path from 'node:path';
import productChildRoutes from '../../public/data/product-child-routes.json';
import productChildContent from '../../public/data/product-child-content.json';

const siteShell = fs.readFileSync(path.join(process.cwd(), 'public', 'site-shell.html'), 'utf8');

const routes = [
  '', 'gioi-thieu', 'catalogue', 'san-pham', 'he-nhom', 'du-an', 'tin-tuc', 'lien-he', 'bao-gia',
  'san-pham/cua-nhom', 'san-pham/cua-upvc', 'san-pham/cua-go', 'san-pham/cua-cuon', 'san-pham/cua-thong-minh-the-he-moi',
  'san-pham/cua-di-mo-quay', 'san-pham/cua-di-mo-truot', 'san-pham/cua-xep-truot',
  'san-pham/cua-so-mo-quay', 'san-pham/cua-so-mo-hat', 'san-pham/vach-kinh-mat-dung',
  'he-nhom/ea55-ea60i', 'he-nhom/ea70', 'he-nhom/ea95-ea95i', 'he-nhom/fa52',
  'du-an/biet-thu-ven-song', 'du-an/nha-vuon-an-yen', 'du-an/khong-gian-do-thi',
  'du-an/villa-an-vien', 'du-an/nha-ben-doi', 'du-an/residence-horizon',
  'tin-tuc/chon-cua-nhom-cho-cong-trinh', 'tin-tuc/anh-sang-tu-nhien-trong-nha',
  'tin-tuc/bao-tri-cua-nhom-kinh', 'tin-tuc/khong-gian-mo-va-cua-truot',
  'tin-tuc/chon-mau-khung-nhom', 'tin-tuc/quy-trinh-tu-van-thiet-ke'
];

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const segments = params.slug || [];
  if (segments[0] !== 'san-pham' || segments[1] !== 'chi-tiet') return {};
  const product = productChildRoutes.find((item) => item.slug === segments[2]);
  if (!product) return {};
  const content = productChildContent.find((item) => item.slug === product.slug);
  const title = `${product.name} Eurowindow`;
  const description = `${content?.intro || `Tìm hiểu ${title}.`} ${content?.body || ''}`.trim().slice(0, 158);
  return {
    title: `${title} | Eurowindow`,
    description,
    keywords: [title, product.name, `${product.name} Eurowindow`, `${product.name} chính hãng`, `báo giá ${product.name}`].filter(Boolean),
    alternates: { canonical: `/san-pham/chi-tiet/${product.slug}/` },
    openGraph: { title, description, images: product.image ? [product.image] : [] },
    twitter: { card: 'summary_large_image', title, description, images: product.image ? [product.image] : [] }
  };
}

export function generateStaticParams() {
  return [
    ...routes.map((route) => ({ slug: route ? route.split('/') : [] })),
    ...productChildRoutes.map(({ slug }) => ({ slug: ['san-pham', 'chi-tiet', slug] }))
  ];
}

function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function mergeProductChildPricing(markup) {
  const section = markup.match(/<section class="section aluminum-pricing">[\s\S]*?<\/section>/)?.[0];
  if (!section) return markup;
  const title = section.match(/<h2 class="serif">([\s\S]*?)<\/h2>/)?.[1] || 'Báo giá sản phẩm';
  const note = section.match(/<div class="section-head">[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
  const detail = section.match(/<p class="detail-copy">([\s\S]*?)<\/p>/)?.[1] || '';
  const link = section.match(/<a class="button" href="([^"]+)">([\s\S]*?)<\/a>/);
  const card = `<div class="product-child-price"><span class="eyebrow">TƯ VẤN CHI PHÍ</span><h3>${title}</h3><p>${note}</p><p>${detail}</p>${link ? `<a class="button" href="${link[1]}">${link[2]}</a>` : ''}</div>`;
  return markup.replace(section, '').replace('</ul></aside></div></section>', `</ul>${card}</aside></div></section>`);
}

function productSeoMarkup(product) {
  if (!product) return '';
  const images = [
    { src: product.image, caption: product.name },
    ...(product.gallery || [])
  ].filter((item, index, all) => all.findIndex(other => other.src === item.src) === index).slice(0, 5);
  const imageMarkup = images.map((item, index) => `<figure><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.caption)} Eurowindow" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('');
  const usesMarkup = product.uses.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const storyMarkup = (product.storySections || []).map((item) => `<article class="product-child-story"><h3>${escapeHtml(item.heading)}</h3><p>${escapeHtml(item.body)}</p>${item.image ? `<figure><img loading="lazy" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption || product.name)} Eurowindow"><figcaption>${escapeHtml(item.caption || product.name)}</figcaption></figure>` : ''}</article>`).join('');
  const faqMarkup = product.faq.map(([question, answer]) => `<article class="aluminum-faq-item"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join('');
  const quoteUrl = `/bao-gia?san-pham=${encodeURIComponent(product.name)}`;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} Eurowindow`,
    description: `${product.intro} ${product.body}`,
    image: images.map((item) => item.src),
    brand: { '@type': 'Brand', name: 'Eurowindow' },
    category: product.family.replaceAll('-', ' ')
  }).replaceAll('<', '\\u003c');
  return `<script type="application/ld+json">${schema}</script><main id="main" class="product-seo-fallback"><div class="page-hero page-hero-compact"><div class="wrap"><div class="crumb">Trang chủ&nbsp; / &nbsp;Sản phẩm&nbsp; / &nbsp;${escapeHtml(product.name)}</div><span class="eyebrow">${escapeHtml(product.type)} · Eurowindow</span><h1>${escapeHtml(product.name)} Eurowindow</h1></div></div><section class="section product-child-hero"><div class="wrap"><nav class="product-breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>/</span><a href="/san-pham">Sản phẩm</a><span>/</span><a href="/san-pham/${escapeHtml(product.family)}/">${escapeHtml(product.family === 'cua-nhom' ? 'Cửa nhôm Eurowindow' : product.family.replaceAll('-', ' '))}</a><span>/</span><span>${escapeHtml(product.name)}</span></nav><div class="detail-grid"><div class="product-seo-gallery">${imageMarkup}</div><div class="detail-info"><span class="detail-label">${escapeHtml(product.type)} · Eurowindow</span><h2 class="product-child-title">${escapeHtml(product.name)} Eurowindow</h2><div class="detail-copy"><p>${escapeHtml(product.intro)}</p><p>${escapeHtml(product.body)}</p></div><a class="button" href="${quoteUrl}">Nhận tư vấn và báo giá <span class="arrow">&nearr;</span></a></div></div></div></section><section class="section product-child-information"><div class="wrap product-child-information-grid"><div><span class="eyebrow">THÔNG TIN SẢN PHẨM</span><h2 class="serif">Giới thiệu ${escapeHtml(product.name)}</h2><div class="product-child-story-list">${storyMarkup}</div></div><aside class="product-child-uses"><span class="eyebrow">GỢI Ý ỨNG DỤNG</span><h2 class="serif">Phù hợp với</h2><ul>${usesMarkup}</ul></aside></div></section><section class="section aluminum-pricing"><div class="wrap"><div class="section-head"><div><span class="eyebrow">THÔNG TIN SẢN PHẨM</span><h2 class="serif">Báo giá ${escapeHtml(product.name)}</h2></div><p>Giá bán thay đổi tùy dòng sản phẩm và thời điểm.</p></div><p class="detail-copy">Liên hệ Eurowindow để nhận thông tin giá bán và ưu đãi mới nhất cho sản phẩm này.</p><a class="button" href="${quoteUrl}">Yêu cầu báo giá <span class="arrow">&nearr;</span></a></div></section><section class="section aluminum-faq"><div class="wrap"><div class="section-head"><div><span class="eyebrow">CÂU HỎI THƯỜNG GẶP</span><h2 class="serif">Giải đáp về ${escapeHtml(product.name)}</h2></div></div><div class="aluminum-faq-list">${faqMarkup}</div></div></section></main>`;
}

export default function Page({ params }) {
  const segments = params.slug || [];
  const product = segments[0] === 'san-pham' && segments[1] === 'chi-tiet'
    ? productChildContent.find(item => item.slug === segments[2])
    : null;
  const initialMarkup = mergeProductChildPricing(productSeoMarkup(product));
  const markup = siteShell.replace('<main id="main"></main>', `<main id="main">${initialMarkup}</main>`);
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
