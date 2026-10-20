"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import content from '../../lib/content/site-sections.json';

function mapsUrl(address) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
}

export default function ShowroomDirectory() {
  const [query, setQuery] = useState('');
  const rooms = useMemo(() => content.showrooms.filter((item) => {
    const text = (item.name + ' ' + item.address).toLocaleLowerCase('vi');
    return text.includes(query.trim().toLocaleLowerCase('vi'));
  }), [query]);

  return (
    <>
      <div className="section-directory-tools section-directory-tools-single">
        <label>
          <span>Tìm theo tên hoặc địa chỉ</span>
          <input type="search" name="showroom-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: Hà Nội…" autoComplete="off" />
        </label>
      </div>
      <p className="section-result-count" role="status" aria-live="polite">Hiển thị {rooms.length} trên {content.showrooms.length} showroom</p>
      {rooms.length ? (
        <div className="showroom-grid">
          {rooms.map((item) => (
            <article className="showroom-card" key={item.name}>
              {item.image ? <Image className="showroom-card-image" src={item.image} alt={item.name} width={640} height={420} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /> : null}
              <div className="showroom-card-top"><span>SHOWROOM</span><span className="showroom-pin" aria-hidden="true">+</span></div>
              <h2>{item.name}</h2>
              <p className="showroom-address">{item.address}</p>
              <div className="showroom-contact">
                <a href={'tel:' + item.tel}>Điện thoại <strong>{item.phone}</strong></a>
                {item.email ? <a href={'mailto:' + item.email}>Email <strong>{item.email}</strong></a> : null}
              </div>
              <a className="section-text-link" href={mapsUrl(item.address)} target="_blank" rel="noreferrer">Mở bản đồ <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      ) : (
        <div className="section-empty"><h2>Chưa có kết quả phù hợp</h2><p>Thử tên tỉnh, thành phố hoặc chọn “Tất cả khu vực”.</p></div>
      )}
    </>
  );
}
