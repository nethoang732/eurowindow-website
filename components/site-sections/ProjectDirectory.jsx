'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function categoryFromPath(pathname) {
  return pathname.match(/\/cong-trinh-tieu-bieu\/([^/]+)\/?$/)?.[1] || '';
}

function categoryPath(category) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');
  return `${basePath}/cong-trinh-tieu-bieu/${category ? `${category}/` : ''}`;
}

function ProjectCard({ project, category }) {
  return (
    <article className="section-content-card">
      <Link className="section-card-link" href={`/cong-trinh-tieu-bieu/${project.slug}/`} data-next-route="true">
        {project.image ? <div className="section-card-image"><Image src={project.image} alt={project.name} width={1440} height={960} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 50vw" /></div> : null}
        <div className="section-content-card-body"><p className="section-card-kicker">{category?.name || 'Công trình tiêu biểu'}</p><h2>{project.name}</h2>{project.summary ? <p>{project.summary}</p> : null}<span className="section-text-link">Xem thông tin công trình <span aria-hidden="true">↗</span></span></div>
      </Link>
    </article>
  );
}

export default function ProjectDirectory({ projects, categories, currentCategory = '' }) {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  useEffect(() => {
    const syncCategory = () => setSelectedCategory(categoryFromPath(window.location.pathname));
    window.addEventListener('popstate', syncCategory);
    return () => window.removeEventListener('popstate', syncCategory);
  }, []);

  const selectCategory = (event, category) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const nextPath = categoryPath(category);
    if (window.location.pathname !== nextPath) window.history.pushState({ projectCategory: category }, '', nextPath);
    setSelectedCategory(category);
  };
  const visibleProjects = useMemo(() => projects.filter((project) => !selectedCategory || project.category === selectedCategory), [projects, selectedCategory]);

  return <>
    <nav className="section-category-nav" aria-label="Danh mục công trình">
      <a href={categoryPath('')} onClick={(event) => selectCategory(event, '')} aria-current={!selectedCategory ? 'page' : undefined} className={!selectedCategory ? 'is-current' : ''}>Tất cả</a>
      {categories.map((category) => <a key={category.slug} href={categoryPath(category.slug)} onClick={(event) => selectCategory(event, category.slug)} aria-current={selectedCategory === category.slug ? 'page' : undefined} className={selectedCategory === category.slug ? 'is-current' : ''}>{category.name}</a>)}
    </nav>
    <div className="section-content-grid" aria-live="polite">{visibleProjects.map((project) => <ProjectCard project={project} category={categories.find((item) => item.slug === project.category)} key={project.slug} />)}</div>
  </>;
}
