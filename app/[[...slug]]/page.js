import SiteShell from '../../components/SiteShell';

const routes = [
  '', 'gioi-thieu', 'san-pham', 'he-nhom', 'du-an', 'tin-tuc', 'lien-he', 'bao-gia',
  'san-pham/cua-di-mo-quay', 'san-pham/cua-di-mo-truot', 'san-pham/cua-xep-truot',
  'san-pham/cua-so-mo-quay', 'san-pham/cua-so-mo-hat', 'san-pham/vach-kinh-mat-dung',
  'he-nhom/ea45', 'he-nhom/ea65', 'he-nhom/ea70', 'he-nhom/ea90', 'he-nhom/ea95',
  'du-an/biet-thu-ven-song', 'du-an/nha-vuon-an-yen', 'du-an/khong-gian-do-thi',
  'du-an/villa-an-vien', 'du-an/nha-ben-doi', 'du-an/residence-horizon',
  'tin-tuc/chon-cua-nhom-cho-cong-trinh', 'tin-tuc/anh-sang-tu-nhien-trong-nha',
  'tin-tuc/bao-tri-cua-nhom-kinh', 'tin-tuc/khong-gian-mo-va-cua-truot',
  'tin-tuc/chon-mau-khung-nhom', 'tin-tuc/quy-trinh-tu-van-thiet-ke'
];

export const dynamicParams = false;

export function generateStaticParams() {
  return routes.map((route) => ({ slug: route ? route.split('/') : [] }));
}

export default function Page() {
  return <SiteShell />;
}
