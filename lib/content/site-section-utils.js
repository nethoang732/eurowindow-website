import content from './site-sections.json';

export function getSiteOrigin() {
  // Canonical URLs are emitted only after the business configures its public
  // production origin. Vercel's project/preview hosts are deployment details,
  // not an approved canonical domain.
  const originValue = process.env.NEXT_PUBLIC_SITE_URL;
  if (!originValue) return null;
  try {
    const url = new URL(originValue.startsWith('http') ? originValue : 'https://' + originValue);
    const hostname = url.hostname.toLowerCase();
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.netlify.app') ||
      hostname.endsWith('.chatgpt.site')
    ) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getRobotsMetadata() {
  const allowIndexing = process.env.VERCEL_ENV !== 'preview';
  return { index: allowIndexing, follow: allowIndexing };
}

export function limitMetaDescription(value, maxLength = 160) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const cutoff = normalized.lastIndexOf(' ', maxLength - 1);
  return normalized.slice(0, cutoff > 100 ? cutoff : maxLength).replace(/[\s,;:–-]+$/, '') + '.';
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
  if (path === 'showroom') return { type: 'showrooms', title: 'Hệ thống showroom Eurowindow', description: 'Trải nghiệm trực tiếp các giải pháp cửa và vật liệu kiến trúc Eurowindow tại showroom trên toàn quốc.' };
  if (path === 'cong-trinh-tieu-bieu' || path === 'du-an') return { type: 'projects', title: 'Công trình tiêu biểu', description: '' };
  if (path.startsWith('cong-trinh-tieu-bieu/')) {
    const slug = path.slice('cong-trinh-tieu-bieu/'.length);
    const category = content.projectCategories.find((item) => item.slug === slug);
    if (category) return { type: 'project-category', title: category.name, description: category.description || '', category };
    const project = content.projects.find((item) => item.slug === slug);
    if (project) return { type: 'project', title: project.name, description: project.summary, project };
  }
  if (path.startsWith('du-an/')) {
    const slug = path.slice('du-an/'.length);
    const project = content.projects.find((item) => item.slug === slug);
    if (project) return { type: 'project', title: project.name, description: project.summary, project, alias: true };
  }
  if (path === 'tin-tuc') return { type: 'news', title: 'Tin tức', description: 'Tin sự kiện, dự án, hoạt động nội bộ và tư vấn từ Eurowindow.' };
  if (path.startsWith('tin-tuc/')) {
    const slug = path.slice('tin-tuc/'.length);
    const category = content.newsCategories.find((item) => item.slug === slug);
    if (category) return { type: slug === 'video' ? 'videos' : 'news-category', title: category.name, description: category.description || '', category };
    const article = content.articles.find((item) => item.slug === slug);
    if (article) return { type: 'article', title: article.title, description: article.summary, article };
  }
  if (path === 'chinh-sach') return { type: 'policies', title: 'Chính sách', description: 'Xem chính sách bảo hành và các thông tin, điều khoản áp dụng cho khách hàng Eurowindow.' };
  if (path.startsWith('chinh-sach/')) {
    const slug = path.slice('chinh-sach/'.length);
    const policy = content.policies.find((item) => item.slug === slug);
    if (policy) return { type: 'policy', title: policy.name, description: policy.summary, policy };
  }
  return null;
}
