import { notFound } from 'next/navigation';
import ProductDetail from '../../../../components/product-detail/ProductDetail';
import { catalogProducts, getCatalogProductByRoute } from '../../../../lib/products/catalog-products';
import { getRobotsMetadata, getSiteOrigin, limitMetaDescription } from '../../../../lib/content/site-section-utils';
const pagePath = (product) => `/san-pham/${product.familySlug}/${product.slug}/`;
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogProducts.map(({ familySlug, slug }) => ({ family: familySlug, productSlug: slug }));
}

export function generateMetadata({ params }) {
  const product = getCatalogProductByRoute(params.family, params.productSlug);
  if (!product) return {};
  const siteOrigin = getSiteOrigin();
  const canonical = siteOrigin ? new URL(pagePath(product), siteOrigin).toString() : undefined;
  const descriptions = {
    'kinh-an-toan-nhieu-lop': 'Kính an toàn nhiều lớp ghép các lớp kính với màng liên kết, hỗ trợ giữ mảnh kính khi nứt vỡ; chiều dày được chọn theo ứng dụng.',
    'kinh-cach-nhiet-an-toan-act': 'Kính cách nhiệt an toàn ACT: thông tin sản phẩm, ứng dụng và các yếu tố lựa chọn theo từng vị trí công trình.'
  };
  const description = descriptions[product.slug] || limitMetaDescription(product.summary);
  return {
    title: `${product.name} | Eurowindow`, description,
    openGraph: { type: 'website', locale: 'vi_VN', title: `${product.name} | Eurowindow`, description, ...(canonical ? { url: canonical } : {}) },
    twitter: { card: 'summary', title: `${product.name} | Eurowindow`, description },
    robots: getRobotsMetadata(),
    ...(canonical ? { alternates: { canonical } } : {})
  };
}

export default function CatalogProductRoute({ params }) {
  const product = getCatalogProductByRoute(params.family, params.productSlug);
  if (!product) notFound();
  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin ? new URL(pagePath(product), siteOrigin).toString() : undefined;
  return <ProductDetail product={product} canonicalUrl={canonicalUrl} siteOrigin={siteOrigin} />;
}
