'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Giới thiệu', href: '/gioi-thieu/', id: 'about', children: [['Về chúng tôi', '/gioi-thieu/'], ['Catalogue', '/catalogue/']] },
  { label: 'Sản phẩm', href: '/san-pham/', id: 'products', children: [['Cửa nhôm', '/san-pham/cua-nhom/'], ['Cửa uPVC', '/san-pham/cua-upvc/'], ['Cửa gỗ', '/san-pham/cua-go/'], ['Cửa cuốn', '/san-pham/cua-cuon/'], ['Cửa thông minh', '/san-pham/cua-thong-minh-the-he-moi/'], ['Kính & Vách kính', '/san-pham/vach-kinh-mat-dung/']] },
  { label: 'Hệ nhôm', href: '/he-nhom/' }, { label: 'Dự án', href: '/du-an/' },
  { label: 'Tin tức', href: '/tin-tuc/' }, { label: 'Liên hệ', href: '/lien-he/' }
];

export function ProductHeader() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setOpen(false);
      }
    };
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest('.nav-dropdown')) setOpenDropdown(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('click', closeOnOutsideClick);
    };
  }, []);

  const closeNavigation = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <div className="wrap head-inner">
        <Link className="brand brand-image" href="/" aria-label="Eurowindow, trang chủ">
          <Image src="/eurowindow-logo.png" alt="Eurowindow – Tiên phong. Kiến tạo. Đồng hành." width={216} height={54} priority />
        </Link>
        <nav id="product-navigation" className={open ? 'nav open' : 'nav'} aria-label="Điều hướng chính">
          {links.map(({ label, href, id, children }) => children ? (
            <div
              className={`nav-dropdown nav-dropdown-${id}${openDropdown === id ? ' open' : ''}`}
              key={href}
              onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpenDropdown(id); }}
              onPointerLeave={(event) => { if (event.pointerType === 'mouse') setOpenDropdown((current) => current === id ? null : current); }}
              onFocus={() => setOpenDropdown(id)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null); }}
            >
              <div className="nav-dropdown-head">
                <Link className="nav-dropdown-trigger" href={href} aria-haspopup="true" aria-expanded={openDropdown === id} onClick={closeNavigation}>{label}</Link>
                <button className="nav-dropdown-toggle" type="button" aria-label={`${openDropdown === id ? 'Đóng' : 'Mở'} menu ${label}`} aria-expanded={openDropdown === id} aria-controls={`product-submenu-${id}`} onClick={() => setOpenDropdown((current) => current === id ? null : id)}>⌄</button>
              </div>
              <div className={`nav-dropdown-menu${id === 'products' ? ' nav-dropdown-menu-products' : ''}`} id={`product-submenu-${id}`}>
                {children.map(([childLabel, childHref]) => <Link href={childHref} key={childHref} onClick={closeNavigation}>{childLabel}</Link>)}
              </div>
            </div>
          ) : <Link key={href} href={href} onClick={closeNavigation}>{label}</Link>)}
        </nav>
        <Link className="head-cta" href="/bao-gia/">Nhận tư vấn <span className="arrow" aria-hidden="true">↗</span></Link>
        <button className="menu-btn" type="button" aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open} aria-controls="product-navigation" onClick={() => { setOpen(value => !value); setOpenDropdown(null); }}><span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      </div>
    </header>
  );
}

export function ProductFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand brand-image" href="/" aria-label="Eurowindow, trang chủ"><Image src="/eurowindow-logo.png" alt="Eurowindow" width={216} height={54} /></Link>
            <p className="footer-copy">Giải pháp cửa nhôm kính cho những công trình đề cao ánh sáng, độ bền và vẻ đẹp kiến trúc.</p>
            <div className="footer-links"><Link href="/bao-gia/">Bắt đầu dự án ↗</Link></div>
          </div>
          <div><h4>Khám phá</h4><div className="footer-links"><Link href="/gioi-thieu/">Về Eurowindow</Link><Link href="/san-pham/">Sản phẩm</Link><Link href="/he-nhom/">Hệ nhôm</Link><Link href="/du-an/">Công trình</Link></div></div>
          <div><h4>Thông tin</h4><div className="footer-links"><Link href="/tin-tuc/">Góc kiến trúc</Link><Link href="/lien-he/">Liên hệ</Link><Link href="/bao-gia/">Yêu cầu báo giá</Link><a href="tel:+842437474700">(024) 3747 4700</a></div></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Eurowindow.</span></div>
      </div>
    </footer>
  );
}
