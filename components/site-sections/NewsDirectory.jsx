'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PAGE_SIZE = 8;
const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));
const categoryLabel = (value) => value.toLocaleLowerCase('vi').replace(/(^|\s)\p{L}/gu, (letter) => letter.toLocaleUpperCase('vi'));

function categoryFromPath(pathname) {
  return pathname.match(/\/tin-tuc\/([^/]+)\/?$/)?.[1] || '';
}

function categoryPath(category) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');
  return `${basePath}/tin-tuc/${category ? `${category}/` : ''}`;
}

function NewsCard({ article, category, featured = false }) {
  return (
    <Link className={`news-card${featured ? ' news-card-featured' : ''}`} href={`/tin-tuc/${article.slug}/`} data-next-route="true">
      <div className="news-card-image">
        <Image src={article.image} alt={article.title} fill sizes={featured ? '(max-width: 700px) 100vw, 50vw' : '(max-width: 700px) 100vw, 33vw'} />
      </div>
      <div className="news-card-body">
        <p className="news-card-meta"><span>{category}</span><i aria-hidden="true">|</i><time dateTime={article.date}>{formatDate(article.date)}</time></p>
        <h2>{article.title}</h2>
        {article.summary ? <p className="news-card-summary">{article.summary}</p> : null}
        <span className="news-card-action">Đọc bài viết <span aria-hidden="true">↗</span></span>
      </div>
      <span className="news-card-arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function pageNumbers(count, current) {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);
  const selected = [...new Set([1, current - 1, current, current + 1, count].filter((page) => page >= 1 && page <= count))].sort((a, b) => a - b);
  return selected.flatMap((page, index) => index && page - selected[index - 1] > 1 ? ['…', page] : [page]);
}

export default function NewsDirectory({ articles, categories, currentCategory = '' }) {
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  useEffect(() => {
    const syncCategory = () => {
      setSelectedCategory(categoryFromPath(window.location.pathname));
      setPage(1);
    };
    window.addEventListener('popstate', syncCategory);
    return () => window.removeEventListener('popstate', syncCategory);
  }, []);
  const selectCategory = useCallback((event, category) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const nextPath = categoryPath(category);
    if (window.location.pathname !== nextPath) window.history.pushState({ newsCategory: category }, '', nextPath);
    setSelectedCategory(category);
    setPage(1);
  }, []);
  const categoryNames = useMemo(() => Object.fromEntries(categories.map((category) => [category.slug, category.name])), [categories]);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return articles.filter((article) => {
      if (selectedCategory && article.category !== selectedCategory) return false;
      if (!normalizedQuery) return true;
      const text = `${article.title} ${article.summary || ''} ${categoryNames[article.category] || ''}`.toLocaleLowerCase('vi');
      return text.includes(normalizedQuery);
    });
  }, [articles, categoryNames, selectedCategory, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const featured = visible.slice(0, 2);
  const remaining = visible.slice(2);

  return (
    <div className="news-directory">
      <div className="news-toolbar">
        <nav className="news-category-tabs" aria-label="Lọc tin theo danh mục">
          <a href={categoryPath('')} onClick={(event) => selectCategory(event, '')} aria-current={!selectedCategory ? 'page' : undefined} className={!selectedCategory ? 'is-current' : ''}>Tất cả</a>
          {categories.map((category) => <a key={category.slug} href={categoryPath(category.slug)} onClick={(event) => selectCategory(event, category.slug)} aria-current={selectedCategory === category.slug ? 'page' : undefined} className={selectedCategory === category.slug ? 'is-current' : ''}>{categoryLabel(category.name)}</a>)}
        </nav>
        <label className="news-search" htmlFor={searchId}>
          <span className="sr-only">Tìm kiếm tin tức</span>
          <input id={searchId} type="search" placeholder="Tìm kiếm tin tức..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
          <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.2" /><path d="m15.4 15.4 5 5" /></svg>
        </label>
      </div>

      <p className="news-result-count" aria-live="polite">{filtered.length} bài viết</p>
      {visible.length ? <>
        <div className="news-featured-grid">{featured.map((article) => <NewsCard key={article.slug} article={article} category={categoryNames[article.category] || 'Tin tức'} featured />)}</div>
        {remaining.length ? <div className="news-card-grid">{remaining.map((article) => <NewsCard key={article.slug} article={article} category={categoryNames[article.category] || 'Tin tức'} />)}</div> : null}
        {pageCount > 1 ? <nav className="news-pagination" aria-label="Phân trang">
          <button type="button" aria-label="Trang trước" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>←</button>
          {pageNumbers(pageCount, safePage).map((number, index) => number === '…' ? <span key={`dots-${index}`} aria-hidden="true">…</span> : <button type="button" key={number} aria-current={safePage === number ? 'page' : undefined} onClick={() => setPage(number)}>{number}</button>)}
          <button type="button" aria-label="Trang sau" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>→</button>
        </nav> : null}
      </> : <div className="news-empty"><h2>Không tìm thấy bài viết</h2><p>Thử từ khóa khác hoặc chọn danh mục khác.</p></div>}
    </div>
  );
}
