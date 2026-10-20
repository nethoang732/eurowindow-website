import { notFound } from 'next/navigation';
import ProductDetail from '../../../../components/product-detail/ProductDetail';
import { catalogProducts, getCatalogProductByRoute } from '../../../../lib/products/catalog-products';

const origin = () => {
  const configured = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return undefined;
  const url = new URL(configured.startsWith('http') ? configured : `https://${configured}`);
  if (url.hostname.toLowerCase() === 'eurowindow.biz' || url.hostname.toLowerCase().endsWith('.eurowindow.biz')) return undefined;
  return url.origin;
};
const pagePath = (product) => `/san-pham/${product.familySlug}/${product.slug}/`;
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogProducts.map(({ familySlug, slug }) => ({ family: familySlug, productSlug: slug }));
}

export function generateMetadata({ params }) {
  const product = getCatalogProductByRoute(params.family, params.productSlug);
  if (!product) return {};
  const siteOrigin = origin();
  const canonical = siteOrigin ? new URL(pagePath(product), siteOrigin).toString() : undefined;
  return {
    title: `${product.name} | Eurowindow`, description: product.summary.slice(0, 155),
    openGraph: { type: 'website', locale: 'vi_VN', title: `${product.name} | Eurowindow`, description: product.summary.slice(0, 155), ...(canonical ? { url: canonical } : {}) },
    robots: { index: true, follow: true },
    ...(canonical ? { alternates: { canonical } } : {})
  };
}

export default function CatalogProductRoute({ params }) {
  const product = getCatalogProductByRoute(params.family, params.productSlug);
  if (!product) notFound();
  const siteOrigin = origin();
  const canonicalUrl = siteOrigin ? new URL(pagePath(product), siteOrigin).toString() : undefined;
  return <ProductDetail product={product} canonicalUrl={canonicalUrl} siteOrigin={siteOrigin} />;
}
