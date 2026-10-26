'use client';
import { useEffect, useRef, useState } from 'react';
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
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 35);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (openDropdown) {
        event.preventDefault();
        setOpenDropdown(null);
        document.querySelector('.nav-dropdown-' + openDropdown + ' .nav-dropdown-toggle')?.focus();
        return;
      }
      if (open) {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest('.nav-dropdown')) setOpenDropdown(null);
      if (open && !event.target.closest('.site-header')) setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('click', closeOnOutsideClick);
    };
  }, [open, openDropdown]);

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
        <button ref={menuButtonRef} className="menu-btn" type="button" aria-label={open ? '??ng menu' : 'M? menu'} aria-expanded={open} aria-controls="nav" onClick={() => { setOpen(value => !value); setOpenDropdown(null); }}><span aria-hidden="true">{open ? '?' : '?'}</span></button>
        <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Điều hướng chính">
          {links.map(({ label, href, id, children }) => children ? (
            <div
              className={`nav-dropdown nav-dropdown-${id}${openDropdown === id ? ' open' : ''}`}
              key={href}
              onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpenDropdown(id); }}
              onPointerLeave={(event) => { if (event.pointerType === 'mouse') setOpenDropdown((current) => current === id ? null : current); }}
              onFocus={(event) => {
                if (window.matchMedia('(min-width: 701px)').matches && !event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(id);
              }}
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

      </div>
    </header>
  );
}

export function ProductFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Link className="brand brand-image" href="/" aria-label="Eurowindow, trang ch&#7911;"><Image src="/eurowindow-logo.png" alt="Eurowindow" width={216} height={54} /></Link>
            <p className="footer-copy">Eurowindow cung c&#7845;p gi&#7843;i ph&#225;p t&#7893;ng th&#7875; v&#7873; c&#7917;a, v&#225;ch nh&#244;m k&#237;nh ti&#234;u chu&#7849;n Ch&#226;u &#194;u v&#224; v&#7853;t li&#7879;u ki&#7871;n tr&#250;c cao c&#7845;p cho c&#225;c c&#244;ng tr&#236;nh hi&#7879;n &#273;&#7841;i.</p><a className="footer-call-cta" href="tel:0967111082"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l2 4.2-2 1.7a15 15 0 0 0 6.1 6.1l1.7-2 4.2 2-.5 2.4a2 2 0 0 1-2 1.6A15.5 15.5 0 0 1 5 5.5a2 2 0 0 1 1.6-2Z" /></svg><span><small>G&#7885;i t&#432; v&#7845;n</small><strong>0967 111 082</strong></span><b aria-hidden="true"></b></a>
          </div>
          <div><h4>K&#7871;t n&#7889;i</h4><div className="footer-contact-list">
            <a className="footer-contact-item" href="tel:0967111082"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l2 4.2-2 1.7a15 15 0 0 0 6.1 6.1l1.7-2 4.2 2-.5 2.4a2 2 0 0 1-2 1.6A15.5 15.5 0 0 1 5 5.5a2 2 0 0 1 1.6-2Z" /></svg><span><small>Hotline t&#432; v&#7845;n</small><strong>0967 111 082</strong></span></a>
            <a className="footer-contact-item" href="mailto:hoangnm3@eurowindow.biz"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg><span><small>Email</small><strong>hoangnm3@eurowindow.biz</strong></span></a>
            <div className="footer-contact-item"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg><span><small>&#272;&#7883;a ch&#7881;</small><strong>02 T&#244;n Th&#7845;t T&#249;ng, Kim Li&#234;n,<br />H&#224; N&#7897;i</strong></span></div>
          </div></div>
          <div><h4>Kh&#225;m ph&#225;</h4><div className="footer-links"><Link href="/gioi-thieu/">V&#7873; Eurowindow</Link><Link href="/san-pham/">S&#7843;n ph&#7849;m</Link><Link href="/he-nhom/">H&#7879; nh&#244;m</Link><Link href="/cong-trinh-tieu-bieu/">C&#244;ng tr&#236;nh ti&#234;u bi&#7875;u</Link><Link href="/showroom/">H&#7879; th&#7889;ng showroom</Link></div></div>
          <div><h4>Th&#244;ng tin</h4><div className="footer-links"><Link href="/tin-tuc/">Tin t&#7913;c</Link><Link href="/chinh-sach/">Ch&#237;nh s&#225;ch b&#7843;o h&#224;nh</Link><Link href="/bao-gia/">Li&#234;n h&#7879;</Link></div></div>
        </div>
        <div className="footer-bottom"><span>&copy; 2026 Eurowindow. T&#7845;t c&#7843; quy&#7873;n &#273;&#432;&#7907;c b&#7843;o l&#432;u.</span><div className="footer-social" aria-label="M&#7841;ng x&#227; h&#7897;i"><a href="https://www.facebook.com/eurowindow.biz/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8" /></svg></a><a href="https://zalo.me/0967111082" target="_blank" rel="noopener noreferrer" aria-label="Zalo" title="Zalo"><span className="footer-zalo-mark">Z</span></a><a href="https://www.youtube.com/eurowindow" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.2a2.8 2.8 0 0 0-2-2C17.2 5.7 12 5.7 12 5.7s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 3.8 2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 21.5 12a29 29 0 0 0-.5-3.8Z" /><path d="m10 15 5-3-5-3v6Z" /></svg></a></div></div>
      </div>
    </footer>
  );
}
