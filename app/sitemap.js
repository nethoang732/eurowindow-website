import { aluminumProducts } from '../lib/products/cua-nhom';
import { catalogProducts } from '../lib/products/catalog-products';
import { getSectionPaths, getSiteOrigin } from '../lib/content/site-section-utils';

const indexableRoutes = [
  '/', '/gioi-thieu/', '/catalogue/', '/san-pham/', '/san-pham/cua-nhom/', '/san-pham/cua-upvc/', '/san-pham/cua-go/', '/san-pham/cua-cuon/', '/san-pham/cua-thong-minh-the-he-moi/', '/san-pham/vach-kinh-mat-dung/',
  '/he-nhom/', '/he-nhom/ea55-ea60i/', '/he-nhom/ea70/', '/he-nhom/ea95-ea95i/', '/he-nhom/fa52/',
  '/du-an/', '/tin-tuc/', '/lien-he/', '/bao-gia/',
  ...getSectionPaths().filter((route) => !route.startsWith('chinh-sach')).map((route) => '/' + route + '/')
];

export default function sitemap() {
  const origin = getSiteOrigin();
  if (!origin) return [];
  const pages = [
    ...indexableRoutes.map((route) => ({ url: new URL(route, origin).toString() })),
    ...aluminumProducts.map((product) => ({ url: new URL('/san-pham/cua-nhom/' + product.slug + '/', origin).toString() })),
    ...catalogProducts.map((product) => ({ url: new URL('/san-pham/' + product.familySlug + '/' + product.slug + '/', origin).toString() }))
  ];
  const unique = [...new Map(pages.map((page) => [page.url, page])).values()];
  return unique.map((page) => ({ ...page, changeFrequency: 'monthly', priority: page.url.includes('/san-pham/cua-nhom/') ? 0.7 : 0.6 }));
}