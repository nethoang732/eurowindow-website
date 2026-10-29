"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import content from '../../lib/content/site-sections.json';

const showrooms = content.showrooms;
const mapSearch = (address) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
const cityOf = (room) => (room.address.match(/(?:Thành phố|Tỉnh)\s+[^,-]+/gi) || []).pop() || '';
const areaOf = (room) => (room.address.match(/(?:Phường|Xã|Quận|Huyện)\s+[^,-]+/i) || [''])[0];

function Icon({ name }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    phone: <path d="M6 3h3l2 5-2 2a15 15 0 0 0 5 5l2-2 5 2v3c0 1-1 2-2 2C10 20 4 14 4 5c0-1 1-2 2-2Z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></>,
    grid: <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

export default function ShowroomDirectory() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [page, setPage] = useState(1);
  const [layout, setLayout] = useState('grid');
  const [selected, setSelected] = useState(showrooms[0]);
  const [geoMessage, setGeoMessage] = useState('');
  const cities = useMemo(() => [...new Set(showrooms.map(cityOf).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'vi')), []);
  const areas = useMemo(() => [...new Set(showrooms.filter((item) => !city || cityOf(item) === city).map(areaOf).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'vi')), [city]);
  const filtered = useMemo(() => showrooms.filter((item) => {
    const text = (item.name + ' ' + item.address + ' ' + item.phone).toLocaleLowerCase('vi');
    return (!query || text.includes(query.trim().toLocaleLowerCase('vi'))) &&
      (!city || cityOf(item) === city) && (!area || areaOf(item) === area);
  }), [query, city, area]);
  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const resetPage = (setter) => (event) => { setter(event.target.value); setPage(1); };
  const findNearby = () => {
    setGeoMessage('');
    if (!navigator.geolocation) { setGeoMessage('Trình duyệt không hỗ trợ định vị.'); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => window.open('https://www.google.com/maps/search/showroom+Eurowindow/@' + coords.latitude + ',' + coords.longitude + ',12z', '_blank', 'noopener,noreferrer'),
      () => setGeoMessage('Không thể lấy vị trí. Hãy cho phép định vị hoặc chọn tỉnh/thành phố.'),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  return (
    <div className="showroom-directory">
      <section className="showroom-search-panel" aria-label="Tìm showroom">
        <form className="showroom-search" onSubmit={(event) => event.preventDefault()}>
          <label className="showroom-search-input"><Icon name="search"/><span className="visually-hidden">Tìm showroom</span><input type="search" value={query} onChange={resetPage(setQuery)} placeholder="Tìm theo tên showroom, tỉnh/thành phố hoặc quận/huyện…" autoComplete="off"/></label>
          <button className="showroom-search-submit" type="submit">Tìm kiếm</button>
          <button className="showroom-nearby" type="button" onClick={findNearby}><Icon name="pin"/> Tìm showroom gần bạn</button>
        </form>
        <div className="showroom-filters">
          <label><span>Tỉnh/Thành phố</span><select value={city} onChange={(event) => { setCity(event.target.value); setArea(''); setPage(1); }}><option value="">Chọn tỉnh/thành</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Quận/Huyện</span><select value={area} onChange={resetPage(setArea)}><option value="">Chọn quận/huyện</option>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Loại showroom</span><select value="all" disabled><option value="all">Tất cả</option></select></label>
          <button className="showroom-clear" type="button" onClick={() => { setQuery(''); setCity(''); setArea(''); setPage(1); }}>Xóa bộ lọc</button>
        </div>
        {geoMessage ? <p className="showroom-geo-message" role="status">{geoMessage}</p> : null}
      </section>

      <div className="showroom-highlights" aria-label="Thông tin hệ thống showroom">
        <div><span className="showroom-highlight-icon"><Icon name="grid"/></span><p>Hệ thống trên toàn quốc<strong>{showrooms.length}<small>Showroom</small></strong></p></div>
        <div><span className="showroom-highlight-icon showroom-flower">✳</span><p>Trải nghiệm thực tế<strong>Đa dạng<small>sản phẩm</small></strong></p></div>
        <div><span className="showroom-highlight-icon"><Icon name="phone"/></span><p>Đội ngũ chuyên nghiệp<strong>Tư vấn<small>tận tâm</small></strong></p></div>
        <div><span className="showroom-highlight-icon"><Icon name="pin"/></span><p>Vị trí thuận tiện<strong>Dễ dàng<small>di chuyển</small></strong></p></div>
      </div>

      <section className="showroom-results" aria-labelledby="showroom-results-title">
        <div className="showroom-results-heading">
          <div><p className="eyebrow">DANH SÁCH SHOWROOM</p><h2 id="showroom-results-title">Hệ thống showroom trên toàn quốc</h2></div>
          <div className="showroom-result-actions"><span>Hiển thị {filtered.length} showroom</span><div role="group" aria-label="Kiểu hiển thị">{[['grid','Dạng lưới'],['list','Dạng danh sách']].map(([value,label]) => <button key={value} type="button" aria-label={label} aria-pressed={layout === value} onClick={() => setLayout(value)}><Icon name={value}/></button>)}</div></div>
        </div>
        {visible.length ? <div className={'showroom-grid' + (layout === 'list' ? ' is-list' : '')}>
          {visible.map((item) => <article className="showroom-card" key={item.name}>
            <button className="showroom-card-map" type="button" onClick={() => setSelected(item)} aria-label={'Chọn ' + item.name + ' trên bản đồ'}>
              {item.image ? <Image className="showroom-card-image" src={item.image} alt={item.name} width={720} height={420} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"/> : <span className="showroom-image-fallback"><Icon name="pin"/></span>}
              <span className="showroom-city-tag">{cityOf(item).replace(/^(Thành phố|Tỉnh)\s+/i, '')}</span>
            </button>
            <div className="showroom-card-body">
              <h3>{item.name.replace(/^SHOWROOM\s+/i, 'Showroom ')}</h3>
              <p className="showroom-address">{item.address}</p>
              <div className="showroom-contact"><a href={'tel:' + item.tel}><Icon name="phone"/><span>{item.phone}</span></a>{item.email ? <a href={'mailto:' + item.email}><Icon name="mail"/><span>{item.email}</span></a> : null}</div>
              <div className="showroom-card-links"><button type="button" onClick={() => setSelected(item)}>Xem trên bản đồ <span aria-hidden="true">→</span></button><a href={mapSearch(item.address)} target="_blank" rel="noreferrer">Chỉ đường <span aria-hidden="true">→</span></a></div>
            </div>
          </article>)}
        </div> : <div className="showroom-empty"><h3>Không tìm thấy showroom</h3><p>Thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ địa điểm.</p></div>}
        {pageCount > 1 ? <nav className="showroom-pagination" aria-label="Phân trang">{Array.from({length: pageCount}, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-current={page === number ? 'page' : undefined} onClick={() => { setPage(number); document.getElementById('showroom-results-title')?.scrollIntoView({behavior:'smooth',block:'start'}); }}>{number}</button>)}</nav> : null}
      </section>

      <section className="showroom-map-section" aria-labelledby="showroom-map-title">
        <div className="showroom-map-copy"><p className="eyebrow">BẢN ĐỒ SHOWROOM</p><h2 id="showroom-map-title">Tìm showroom gần bạn</h2><p>Khám phá vị trí các showroom Eurowindow trên toàn quốc để được tư vấn và trải nghiệm sản phẩm trực tiếp.</p><a href={mapSearch(selected.address)} target="_blank" rel="noreferrer">XEM ĐƯỜNG ĐI <span aria-hidden="true">→</span></a></div>
        <div className="showroom-map-frame"><iframe title={'Bản đồ vị trí ' + selected.name} src={'https://maps.google.com/maps?q=' + encodeURIComponent(selected.address) + '&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="showroom-map-card">{selected.image ? <Image src={selected.image} alt="" width={140} height={120} sizes="70px"/> : null}<div><strong>{selected.name.replace(/^SHOWROOM\s+/i, 'Showroom ')}</strong><p>{selected.address}</p><a href={'tel:' + selected.tel}>{selected.phone}</a><a href={mapSearch(selected.address)} target="_blank" rel="noreferrer">Xem chỉ đường →</a></div></div></div>
      </section>
    </div>
  );
}
