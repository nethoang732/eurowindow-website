import Image from 'next/image';
import Link from 'next/link';
import ProductGallery from './ProductGallery';
import ProductStoryGallery from './ProductStoryGallery';
import ProductQuoteForm from './ProductQuoteForm';
import ProductAccordion from './ProductAccordion';
import ProductText from './ProductText';
import { ProductFooter, ProductHeader } from './ProductHeader';
import { getAluminumProduct } from '../../lib/products/cua-nhom';
import { getCatalogProduct } from '../../lib/products/catalog-products';
import { applyEditorialContent } from '../../lib/products/editorial-content';
import styles from './product-detail.module.css';

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export default function ProductDetail({ product: sourceProduct, canonicalUrl, siteOrigin }) {
  const product = applyEditorialContent(sourceProduct);
  const imageUrls = siteOrigin
    ? product.gallery.filter(item => !item.src.startsWith('data:') && !item.src.toLowerCase().endsWith('.svg')).map(item => new URL(item.src, siteOrigin).toString())
    : undefined;
  const productSchema = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.description, category: product.category,
    brand: { '@type': 'Brand', name: 'Eurowindow' },
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
    ...(imageUrls?.length ? { image: imageUrls } : {})
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', ...(siteOrigin ? { item: new URL('/', siteOrigin).toString() } : {}) },
      { '@type': 'ListItem', position: 2, name: 'Sản phẩm', ...(siteOrigin ? { item: new URL('/san-pham/', siteOrigin).toString() } : {}) },
      { '@type': 'ListItem', position: 3, name: product.familyTitle || 'Cửa nhôm', ...(siteOrigin ? { item: new URL(`/san-pham/${product.familySlug || 'cua-nhom'}/`, siteOrigin).toString() } : {}) },
      { '@type': 'ListItem', position: 4, name: product.name, ...(canonicalUrl ? { item: canonicalUrl } : {}) }
    ]
  };
  const relatedProducts = (product.related || []).map((slug) => getAluminumProduct(slug) || getCatalogProduct(slug)).filter(Boolean);
  // Keep the hero image distinct from the single editorial gallery and
  // continue through the remaining product photos in application cards.
  const galleryImages = product.gallery || [];
  const storyImages = galleryImages.length > 1
    ? [...galleryImages.slice(1), galleryImages[0]]
    : galleryImages;
  const emphasisTerms = [product.name, product.category, product.familyTitle, ...(product.heroFacts || [])];
  const familyPath = `/san-pham/${product.familySlug || 'cua-nhom'}/`;
  const constructionRows = new Map();
  [...(product.constructionFacts || []), ...(product.specifications || [])].forEach(([label, value]) => {
    const key = label.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    if (key && !constructionRows.has(key)) constructionRows.set(key, [label, value]);
  });

  return (
    <>
      <JsonLd data={productSchema} /><JsonLd data={breadcrumbSchema} /><ProductHeader />
      <main id="main-content" className={`${styles.page} ${product.showBatchExtensions ? styles.batchPage : ""}`}>
        <section className={styles.hero} aria-labelledby="product-title">
          <div className={styles.wrap}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><Link href="/san-pham/">Sản phẩm</Link><span aria-hidden="true">/</span><Link href={familyPath}>{product.familyTitle || 'Cửa nhôm'}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
            </nav>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <p className={styles.kicker}>{product.heroKicker || 'Cửa đi nhôm · Mở quay ngoài'}</p>
                <h1 id="product-title">{product.name}</h1>
                <p className={styles.lead}><ProductText terms={emphasisTerms}>{product.summary}</ProductText></p>
                <div className={styles.actions}><Link className={styles.primaryButton} href="#bao-gia">Nhận tư vấn cấu hình</Link><Link className={styles.secondaryLink} href="#thong-so">{product.showBatchExtensions ? 'Xem cấu tạo và thông số' : 'Xem cấu tạo và kích thước'} <span aria-hidden="true">↓</span></Link></div>
                {product.heroFacts?.length ? <p className={styles.factLine}>{product.heroFacts.map((fact, index) => <span key={fact}>{index > 0 ? <span aria-hidden="true"> · </span> : null}{fact}</span>)}</p> : <p className={styles.factLine}>2 cánh <span aria-hidden="true">·</span> Mở ra ngoài <span aria-hidden="true">·</span> EA60i / EA55</p>}
              </div>
              <ProductGallery images={product.gallery} productName={product.name} />
            </div>
          </div>
        </section>
        <section className={styles.benefits} aria-labelledby="benefit-title"><div className={styles.wrap}>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>{product.showBatchExtensions ? 'Đặc điểm' : 'Công năng'}</p><h2 id="benefit-title">{product.benefitHeading || 'Giữ phần diện tích bên trong thông thoáng'}</h2></div></div>
          <div className={`${styles.benefitList} ${styles.highlightGrid}`}>{product.benefits.map(([title, text], index) => <article key={title}><span className={styles.benefitIndex}>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p><ProductText terms={emphasisTerms}>{text}</ProductText></p></article>)}</div>
        </div></section>
        {product.editorialIntro?.length || product.editorialSections?.length ? <section className={styles.editorial} aria-labelledby="editorial-title"><div className={styles.wrap}>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>Thông tin sản phẩm</p><h2 id="editorial-title">Tìm hiểu chi tiết {product.name}</h2></div></div>
          {product.editorialIntro?.map((paragraph, index) => <p className={styles.editorialLead} key={`intro-${index}`}>{paragraph}</p>)}
          <div className={styles.editorialGrid}>{product.editorialSections?.map((section, index) => <article className={styles.editorialBlock} key={`${section.heading}-${index}`}>
            {section.heading ? <h3>{section.heading}</h3> : null}
            {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            {section.captions.map((caption, captionIndex) => <p className={styles.editorialCaption} key={`caption-${captionIndex}`}>{caption}</p>)}
          </article>)}</div>
        </div></section> : null}
        <section className={styles.productStory} aria-labelledby="product-story-title">
          <div className={`${styles.wrap} ${styles.productStoryGrid}`}>
            {product.detailImage ? <ProductStoryGallery images={storyImages} productName={product.name} /> : null}
            <div className={styles.storyCopy}><p className={styles.kicker}>Thiết kế và vận hành</p><h2 id="product-story-title">{product.benefitHeading || product.name}</h2><p><ProductText terms={emphasisTerms}>{product.summary}</ProductText></p><Link className={styles.storyLink} href="#thong-so">Xem cấu tạo và thông số <span aria-hidden="true">↓</span></Link>

            </div>
          </div>
        </section>
        <section className={styles.construction} id="thong-so" aria-labelledby="construction-title"><div className={styles.wrap}>
          <div className={styles.constructionIntro}><div><p className={styles.kicker}>Thông tin sản phẩm</p><h2 id="construction-title">Cấu tạo và thông số</h2></div></div>
          <div className={`${styles.constructionBody} ${product.isIllustration ? styles.constructionBodyTextOnly : ""}`}>
            {constructionRows.size ? <table className={styles.specTable} aria-label="Cấu tạo và thông số sản phẩm"><tbody>{[...constructionRows.values()].map(([label, value]) => <tr className={styles.specRow} key={label}><th scope="row">{label}</th><td><ProductText terms={emphasisTerms}>{value}</ProductText></td></tr>)}</tbody></table> : null}
          </div>
        </div></section>
        {product.showBatchExtensions && product.applications?.length ? <section className={styles.applications} aria-labelledby="application-title"><div className={styles.wrap}>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>Vị trí sử dụng</p><h2 id="application-title">Ứng dụng theo không gian</h2></div></div>
          {product.applicationText?.map((paragraph, index) => <p className={styles.applicationIntro} key={`application-${index}`}>{paragraph}</p>)}
          {product.applicationPlaces?.length ? <div className={styles.applicationPlaces}>{product.applicationPlaces.map((place) => <span key={place}>{place}</span>)}</div> : null}
          <div className={styles.applicationGrid}>{product.applications.map(([title, text], index) => { const image = galleryImages.length ? galleryImages[(index + 3) % galleryImages.length] : null; return <article className={styles.applicationCard} key={title}>{image ? <Image src={image.src} alt={image.alt || product.name} width={560} height={360} sizes="(max-width: 700px) 100vw, 25vw" /> : null}<div><h3>{title}</h3><p><ProductText terms={emphasisTerms}>{text}</ProductText></p></div></article>; })}</div>
        </div></section> : null}
        <section className={styles.faq} aria-labelledby="faq-title"><div className={styles.wrap}>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>Giải đáp</p><h2 id="faq-title">{product.showBatchExtensions ? `Giải đáp về ${product.name}` : 'Giải đáp trước khi chọn cửa'}</h2></div></div>
          <ProductAccordion items={product.faqs} emphasisTerms={emphasisTerms} />
        </div></section>
        {product.showBatchExtensions && relatedProducts.length ? <section className={styles.related} aria-labelledby="related-title"><div className={styles.wrap}>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>Khám phá thêm</p><h2 id="related-title">Sản phẩm liên quan</h2></div></div>
          <div className={styles.relatedGrid}>{relatedProducts.map((related) => <Link className={styles.relatedCard} href={`/san-pham/${related.familySlug || 'cua-nhom'}/${related.slug}/`} key={related.slug}>{related.gallery?.[0] ? <Image src={related.gallery[0].src} alt="" width={480} height={320} sizes="(max-width: 700px) 100vw, 25vw" /> : null}<div><span>{related.category}</span><strong>{related.name}</strong><span className={styles.relatedArrow} aria-hidden="true">↗</span></div></Link>)}</div>
        </div></section> : null}
        <section className={styles.quote} id="bao-gia" aria-labelledby="quote-title"><div className={styles.wrap}><div className={styles.quoteGrid}>
          <div><p className={styles.kicker}>Trao đổi cấu hình</p><h2 id="quote-title">Bắt đầu từ vị trí lắp đặt</h2><p>Gọi (024) 3747 4700 để trao đổi cấu hình và nhận báo giá. Biểu mẫu bên cạnh chỉ kiểm tra dữ liệu trên thiết bị.</p></div>
          <ProductQuoteForm productName={product.name} />
        </div></div></section>
        {product.showBatchExtensions ? <div className={styles.mobileCta}><Link href="#bao-gia">Nhận tư vấn cấu hình</Link></div> : null}
      </main>
      <ProductFooter />
    </>
  );
}
