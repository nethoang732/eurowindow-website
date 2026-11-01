import { notFound } from 'next/navigation';
import ProductDetail from '../../../../components/product-detail/ProductDetail';
import { aluminumProducts, getAluminumProduct } from '../../../../lib/products/cua-nhom';
import { getRobotsMetadata, getSiteOrigin, limitMetaDescription } from '../../../../lib/content/site-section-utils';
const pagePath = (product) => '/san-pham/cua-nhom/' + product.slug + '/';
export const dynamicParams = false;
export function generateStaticParams() {
  return aluminumProducts.map(({ slug }) => ({ productSlug: slug }));
}

export function generateMetadata({ params }) {
  const product = getAluminumProduct(params.productSlug);
  if (!product) return {};
  const origin = getSiteOrigin();
  const canonical = origin ? new URL(pagePath(product), origin).toString() : undefined;
  const description = limitMetaDescription(product.summary);
  return {
    title: product.name + ' | Eurowindow',
    description,
    openGraph: { type: 'website', locale: 'vi_VN', title: product.name + ' | Eurowindow', description, ...(canonical ? { url: canonical } : {}) },
    twitter: { card: 'summary', title: product.name + ' | Eurowindow', description },
    robots: getRobotsMetadata(),
    ...(canonical ? { alternates: { canonical } } : {})
  };
}

export default function ProductRoute({ params }) {
  const product = getAluminumProduct(params.productSlug);
  if (!product) notFound();
  const origin = getSiteOrigin();
  const canonicalUrl = origin ? new URL(pagePath(product), origin).toString() : undefined;
  return <ProductDetail product={product} canonicalUrl={canonicalUrl} siteOrigin={origin} />;
}
