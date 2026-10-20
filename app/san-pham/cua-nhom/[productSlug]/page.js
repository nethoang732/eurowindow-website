import { notFound } from 'next/navigation';
import ProductDetail from '../../../../components/product-detail/ProductDetail';
import { aluminumProducts, getAluminumProduct } from '../../../../lib/products/cua-nhom';

const siteOrigin = () => {
  const configured = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return undefined;
  const url = new URL(configured.startsWith('http') ? configured : 'https://' + configured);
  if (url.hostname.toLowerCase() === 'eurowindow.biz' || url.hostname.toLowerCase().endsWith('.eurowindow.biz')) return undefined;
  return url.origin;
};
const pagePath = (product) => '/san-pham/cua-nhom/' + product.slug + '/';
export const dynamicParams = false;
export function generateStaticParams() {
  return aluminumProducts.map(({ slug }) => ({ productSlug: slug }));
}

export function generateMetadata({ params }) {
  const product = getAluminumProduct(params.productSlug);
  if (!product) return {};
  const origin = siteOrigin();
  const canonical = origin ? new URL(pagePath(product), origin).toString() : undefined;
  const description = product.summary.slice(0, 155);
  return {
    title: product.name + ' | Eurowindow',
    description,
    openGraph: { type: 'website', locale: 'vi_VN', title: product.name + ' | Eurowindow', description, ...(canonical ? { url: canonical } : {}) },
    robots: { index: true, follow: true },
    ...(canonical ? { alternates: { canonical } } : {})
  };
}

export default function ProductRoute({ params }) {
  const product = getAluminumProduct(params.productSlug);
  if (!product) notFound();
  const origin = siteOrigin();
  const canonicalUrl = origin ? new URL(pagePath(product), origin).toString() : undefined;
  return <ProductDetail product={product} canonicalUrl={canonicalUrl} siteOrigin={origin} />;
}
