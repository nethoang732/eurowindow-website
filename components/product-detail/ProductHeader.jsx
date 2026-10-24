'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Gi\u1edbi thi\u1ec7u', href: '/gioi-thieu/', id: 'about', children: [['V\u1ec1 ch\u00fang t\u00f4i', '/gioi-thieu/'], ['Catalogue', '/catalogue/']] },
  { label: 'S\u1ea3n ph\u1ea9m', href: '/san-pham/', id: 'products', children: [['C\u1eeda nh\u00f4m', '/san-pham/cua-nhom/'], ['C\u1eeda uPVC', '/san-pham/cua-upvc/'], ['C\u1eeda g\u1ed7', '/san-pham/cua-go/'], ['C\u1eeda cu\u1ed1n', '/san-pham/cua-cuon/'], ['C\u1eeda th\u00f4ng minh', '/san-pham/cua-thong-minh-the-he-moi/'], ['K\u00ednh & V\u00e1ch k\u00ednh', '/san-pham/vach-kinh-mat-dung/']] },
  { label: 'Showroom', href: '/showroom/' },
  { label: 'C\u00f4ng tr\u00ecnh', href: '/cong-trinh-tieu-bieu/', id: 'projects', children: [['T\u1ea5t c\u1ea3 c\u00f4ng tr\u00ecnh', '/cong-trinh-tieu-bieu/'], ['C\u00f4ng tr\u00ecnh c\u1ea5p qu\u1ed1c gia', '/cong-trinh-tieu-bieu/cong-trinh-cap-quoc-gia/'], ['T\u00f2a nh\u00e0 v\u0103n ph\u00f2ng \u2013 chung c\u01b0', '/cong-trinh-tieu-bieu/toa-nha-van-phong-chung-cu/'], ['C\u00f4ng tr\u00ecnh d\u00e2n d\u1ee5ng', '/cong-trinh-tieu-bieu/cong-trinh-dan-dung/']] },
  { label: 'Tin t\u1ee9c', href: '/tin-tuc/', id: 'news', children: [['T\u1ea5t c\u1ea3 tin t\u1ee9c', '/tin-tuc/'], ['Tin t\u1ee9c s\u1ef1 ki\u1ec7n', '/tin-tuc/tin-tuc-su-kien/'], ['Tin d\u1ef1 \u00e1n', '/tin-tuc/tin-du-an/'], ['Tin n\u1ed9i b\u1ed9', '/tin-tuc/tin-noi-bo/'], ['Tin khuy\u1ebfn m\u00e3i', '/tin-tuc/tin-khuyen-mai/']] },
  { label: 'Ch\u00ednh s\u00e1ch', href: '/chinh-sach/', id: 'policies', children: [['Ch\u00ednh s\u00e1ch b\u1ea3o h\u00e0nh', '/chinh-sach/bao-hanh/']] },
  { label: 'Li\u00ean h\u1ec7', href: '/bao-gia/' }
];

export function ProductHeader() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 35);
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
    <header id="header" className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <div className="header-utility">
        <div className="wrap header-utility-inner">
          <div className="header-contact">
            <a href="tel:0967111082" aria-label="G\u1ecdi 0967 111 082">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l2 4.2-2 1.7a15 15 0 0 0 6.1 6.1l1.7-2 4.2 2-.5 2.4a2 2 0 0 1-2 1.6A15.5 15.5 0 0 1 5 5.5a2 2 0 0 1 1.6-2Z" /></svg>
              <span>0967 111 082</span>
            </a>
            <i aria-hidden="true" />
            <a href="mailto:hoangnm3@eurowindow.biz">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg>
              <span>hoangnm3@eurowindow.biz</span>
            </a>
          </div>
          <div className="header-utility-links">
            <Link href="/showroom/">{'T\u00ecm showroom'}</Link>
            <Link href="/bao-gia/">{'Y\u00eau c\u1ea7u b\u00e1o gi\u00e1'} <span aria-hidden="true">{'\u2197'}</span></Link>
          </div>
        </div>
      </div>
      <div className="wrap head-inner">
        <Link className="brand brand-image" href="/" aria-label="Eurowindow, trang chủ">
          <Image src="/eurowindow-logo.png" alt="Eurowindow – Tiên phong. Kiến tạo. Đồng hành." width={216} height={54} priority />
        </Link>
        <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Điều hướng chính">
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
        <button className="menu-btn" type="button" aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open} aria-controls="nav" onClick={() => { setOpen(value => !value); setOpenDropdown(null); }}><span aria-hidden="true">{open ? '×' : '☰'}</span></button>
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
