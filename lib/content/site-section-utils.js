import content from './site-sections.json';

const originValue = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_SITE_URL;
export function getSiteOrigin() {
  if (!originValue) return null;
  try {
    const url = new URL(originValue.startsWith('http') ? originValue : 'https://' + originValue);
    if (url.hostname === 'eurowindow.biz' || url.hostname.endsWith('.eurowindow.biz')) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getSectionPaths() {
  return [
    'showroom',
    'cong-trinh-tieu-bieu',
    ...content.projectCategories.map((item) => 'cong-trinh-tieu-bieu/' + item.slug),
    ...content.projects.map((item) => 'cong-trinh-tieu-bieu/' + item.slug),
    'tin-tuc',
    ...content.newsCategories.map((item) => 'tin-tuc/' + item.slug),
    ...content.articles.map((item) => 'tin-tuc/' + item.slug),
    'chinh-sach',
    ...content.policies.map((item) => 'chinh-sach/' + item.slug)
  ];
}

export function getSectionDescriptor(segments = []) {
  const path = segments.filter(Boolean).join('/');
  if (path === 'showroom') return { type: 'showrooms', title: 'Hệ thống showroom', description: '' };
  if (path === 'cong-trinh-tieu-bieu' || path === 'du-an') return { type: 'projects', title: 'Công trình tiêu biểu', description: '' };
  if (path.startsWith('cong-trinh-tieu-bieu/')) {
    const slug = path.slice('cong-trinh-tieu-bieu/'.length);
    const category = content.projectCategories.find((item) => item.slug === slug);
    if (category) return { type: 'project-category', title: category.name, description: category.description || '', category };
    const project = content.projects.find((item) => item.slug === slug);
    if (project) return { type: 'project', title: project.name, description: project.summary, project };
  }
  if (path === 'tin-tuc') return { type: 'news', title: 'Tin tức', description: 'Tổng hợp toàn bộ thông tin, tin tức mới nhất về Eurowindow.' };
  if (path.startsWith('tin-tuc/')) {
    const slug = path.slice('tin-tuc/'.length);
    const category = content.newsCategories.find((item) => item.slug === slug);
    if (category) return { type: slug === 'video' ? 'videos' : 'news-category', title: category.name, description: category.description || '', category };
    const article = content.articles.find((item) => item.slug === slug);
    if (article) return { type: 'article', title: article.title, description: article.summary, article };
  }
  if (path === 'chinh-sach') return { type: 'policies', title: 'Chính sách', description: '' };
  if (path.startsWith('chinh-sach/')) {
    const slug = path.slice('chinh-sach/'.length);
    const policy = content.policies.find((item) => item.slug === slug);
    if (policy) return { type: 'policy', title: policy.name, description: policy.summary, policy };
  }
  return null;
}
