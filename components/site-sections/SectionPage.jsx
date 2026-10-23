import Image from 'next/image';
import Link from 'next/link';
import content from '../../lib/content/site-sections.json';
import ShowroomDirectory from './ShowroomDirectory';
import { getSectionDescriptor, getSiteOrigin } from '../../lib/content/site-section-utils';

const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function RouteLink({ href, children, className }) {
  return <Link data-next-route="true" href={href} className={className}>{children}</Link>;
}

function Breadcrumbs({ segments, descriptor }) {
  const items = [{ name: 'Trang chủ', href: '/' }];
  if (descriptor.type.startsWith('project')) {
    items.push({ name: 'Công trình tiêu biểu', href: '/cong-trinh-tieu-bieu/' });
    if (descriptor.type === 'project-category') items.push({ name: descriptor.title });
    if (descriptor.type === 'project') {
      const category = content.projectCategories.find((item) => item.slug === descriptor.project.category);
      items.push({ name: category.name, href: '/cong-trinh-tieu-bieu/' + category.slug + '/' });
      items.push({ name: descriptor.title });
    }
  } else if (descriptor.type === 'article' || descriptor.type === 'news-category' || descriptor.type === 'videos') {
    items.push({ name: 'Tin tức', href: '/tin-tuc/' });
    if (descriptor.type === 'article') {
      const category = content.newsCategories.find((item) => item.slug === descriptor.article.category);
      items.push({ name: category.name, href: '/tin-tuc/' + category.slug + '/' });
      items.push({ name: descriptor.title });
    } else items.push({ name: descriptor.title });
  } else if (descriptor.type === 'policy') {
    items.push({ name: 'Chính sách', href: '/chinh-sach/' }, { name: descriptor.title });
  } else items.push({ name: descriptor.title });

  const origin = getSiteOrigin();
  const routePath = '/' + segments.join('/') + '/';
  const jsonLd = origin ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name,
      item: new URL(item.href || routePath, origin).toString()
    }))
  } : null;
  return (
    <>
      <nav className="section-breadcrumb" aria-label="Đường dẫn trang">
        <ol>{items.map((item, index) => <li key={item.name}>{item.href ? <RouteLink href={item.href}>{item.name}</RouteLink> : <span aria-current="page">{item.name}</span>}{index < items.length - 1 ? <span aria-hidden="true">/</span> : null}</li>)}</ol>
      </nav>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }} /> : null}
    </>
  );
}

function PageHero({ segments, descriptor, eyebrow }) {
  const showroom = descriptor.type === 'showrooms';
  return (
    <header className={'section-page-hero' + (showroom ? ' section-page-hero-showroom' : '')}>
      {showroom && content.showrooms[0]?.image ? <><Image className="section-page-hero-image" src={content.showrooms[0].image} alt="" fill priority sizes="100vw" /><span className="section-page-hero-shade" aria-hidden="true" /></> : null}
      <div className="wrap">
        <Breadcrumbs segments={segments} descriptor={descriptor} />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{descriptor.title}</h1>
        {descriptor.description ? <p className="section-hero-copy">{descriptor.description}</p> : null}
      </div>
    </header>
  );
}

function SectionImage({ alt, src }) {
  if (!src) return null;
  return <div className="section-card-image"><Image src={src} alt={alt} width={1440} height={960} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 50vw" /></div>;
}

function projectImage(project) {
  return project.image;
}

function ProjectCard({ project }) {
  const category = content.projectCategories.find((item) => item.slug === project.category);
  return (
    <article className="section-content-card">
      <RouteLink href={'/cong-trinh-tieu-bieu/' + project.slug + '/'} className="section-card-link">
        <SectionImage src={projectImage(project)} alt={project.name} />
        <div className="section-content-card-body"><p className="section-card-kicker">{category.name}</p><h2>{project.name}</h2>{project.summary ? <p>{project.summary}</p> : null}<span className="section-text-link">Xem thông tin công trình <span aria-hidden="true">↗</span></span></div>
      </RouteLink>
    </article>
  );
}

function ArticleCard({ article }) {
  const category = content.newsCategories.find((item) => item.slug === article.category);
  return (
    <article className="section-content-card">
      <RouteLink href={'/tin-tuc/' + article.slug + '/'} className="section-card-link">
        <SectionImage src={article.image} alt={article.title} />
        <div className="section-content-card-body"><p className="section-card-kicker">{category.name} <span>·</span> <time dateTime={article.date}>{formatDate(article.date)}</time></p><h2>{article.title}</h2><p>{article.summary}</p><span className="section-text-link">Đọc bài viết <span aria-hidden="true">↗</span></span></div>
      </RouteLink>
    </article>
  );
}

function CategoryLinks({ base, items, current }) {
  return <nav className="section-category-nav" aria-label="Danh mục"><RouteLink className={!current ? 'is-current' : ''} href={base + '/'}>Tất cả</RouteLink>{items.map((item) => <RouteLink key={item.slug} className={current === item.slug ? 'is-current' : ''} href={base + '/' + item.slug + '/'}>{item.name}</RouteLink>)}</nav>;
}

function JsonLd({ value }) {
  return value ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(value) }} /> : null;
}

function ArticleDetail({ article, segments }) {
  const descriptor = getSectionDescriptor(segments);
  const origin = getSiteOrigin();
  const category = content.newsCategories.find((item) => item.slug === article.category);
  const articleUrl = origin ? new URL('/tin-tuc/' + article.slug + '/', origin).toString() : null;
  const jsonLd = articleUrl ? {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: article.title, description: article.summary, datePublished: article.date,
    dateModified: article.date, mainEntityOfPage: articleUrl,
    image: origin + article.image
  } : null;
  const related = content.articles.filter((item) => item.slug !== article.slug && (item.category === article.category || item.project === article.project)).slice(0, 3);
  return (
    <>
      <PageHero segments={segments} descriptor={descriptor} eyebrow={category.name} />
      <article className="section-detail wrap">
        <div className="section-detail-meta"><span>{category.name}</span><time dateTime={article.date}>{formatDate(article.date)}</time></div>
        <div className="section-detail-image"><SectionImage src={article.image} alt={article.title} /></div>
        <div className="section-detail-body">{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        {related.length ? <aside className="section-related"><h2>Bài viết liên quan</h2><div className="section-content-grid">{related.map((item) => <ArticleCard article={item} key={item.slug} />)}</div></aside> : null}
      </article>
      <JsonLd value={jsonLd} />
    </>
  );
}

function ProjectDetail({ project, segments }) {
  const descriptor = getSectionDescriptor(segments);
  const category = content.projectCategories.find((item) => item.slug === project.category);
  const related = content.projects.filter((item) => item.slug !== project.slug && item.category === project.category).slice(0, 3);
  return (
    <>
      <PageHero segments={segments} descriptor={descriptor} eyebrow={category.name} />
      <article className="section-detail wrap">
        <div className="section-detail-meta"><span>{category.name}</span></div>
        <div className="section-detail-image"><SectionImage src={projectImage(project)} alt={project.name} /></div>
        {project.summary ? <div className="section-detail-body"><p>{project.summary}</p></div> : null}
        {related.length ? <aside className="section-related"><h2>Công trình cùng nhóm</h2><div className="section-content-grid">{related.map((item) => <ProjectCard project={item} key={item.slug} />)}</div></aside> : null}
      </article>
    </>
  );
}

function VideoDirectory() {
  return <section className="section-content-area"><div className="wrap"><div className="video-title-grid">{content.videos.map((video) => <article className="video-title-card" key={video.title}><SectionImage src={video.image} alt={video.title} /><p className="section-card-kicker">VIDEO <span>·</span> <time dateTime={video.date}>{formatDate(video.date)}</time></p><h2>{video.title}</h2></article>)}</div></div></section>;
}

function PolicyPage({ segments, policy }) {
  const descriptor = getSectionDescriptor(segments);
  return (
    <>
      <PageHero segments={segments} descriptor={descriptor} eyebrow="Thông tin và điều khoản" />
      <section className="section-content-area"><div className="wrap policy-notice">
        <p className="eyebrow">CHÍNH SÁCH</p>
        <h2>{policy.name}</h2>
        <p>{policy.summary}</p>
      </div></section>
    </>
  );
}

export function SectionPage({ segments = [] }) {
  const descriptor = getSectionDescriptor(segments);
  if (!descriptor) return null;
  if (descriptor.type === 'showrooms') return <><PageHero segments={segments} descriptor={descriptor} eyebrow="SHOWROOM" /><section className="section-content-area"><div className="wrap"><ShowroomDirectory /></div></section></>;
  if (descriptor.type === 'project') return <ProjectDetail project={descriptor.project} segments={segments} />;
  if (descriptor.type === 'article') return <ArticleDetail article={descriptor.article} segments={segments} />;
  if (descriptor.type === 'policy') return <PolicyPage segments={segments} policy={descriptor.policy} />;
  if (descriptor.type === 'policies') return <><PageHero segments={segments} descriptor={descriptor} eyebrow="CHÍNH SÁCH" /><section className="section-content-area"><div className="wrap"><div className="policy-grid">{content.policies.map((item) => <article className="policy-notice" key={item.slug}><p className="eyebrow">CHÍNH SÁCH</p><h2>{item.name}</h2><p>{item.summary}</p><RouteLink href={'/chinh-sach/' + item.slug + '/'}>Xem chính sách <span aria-hidden="true">↗</span></RouteLink></article>)}</div></div></section></>;
  if (descriptor.type === 'videos') return <><PageHero segments={segments} descriptor={descriptor} eyebrow="VIDEO" /><VideoDirectory /></>;
  if (descriptor.type === 'project-category' || descriptor.type === 'projects') {
    const projects = content.projects.filter((item) => !descriptor.category || item.category === descriptor.category.slug);
    return <><PageHero segments={segments} descriptor={descriptor} eyebrow="CÔNG TRÌNH TIÊU BIỂU" /><section className="section-content-area"><div className="wrap"><CategoryLinks base="/cong-trinh-tieu-bieu" items={content.projectCategories} current={descriptor.category?.slug} /><div className="section-content-grid">{projects.map((item) => <ProjectCard project={item} key={item.slug} />)}</div></div></section></>;
  }
  const articles = content.articles.filter((item) => !descriptor.category || item.category === descriptor.category.slug);
  return <><PageHero segments={segments} descriptor={descriptor} eyebrow={descriptor.category?.name || 'TIN TỨC'} /><section className="section-content-area"><div className="wrap"><CategoryLinks base="/tin-tuc" items={content.newsCategories} current={descriptor.category?.slug} /><div className="section-content-grid">{articles.map((item) => <ArticleCard article={item} key={item.slug} />)}</div></div></section></>;
}

export function sectionPageExists(segments = []) {
  return Boolean(getSectionDescriptor(segments));
}
