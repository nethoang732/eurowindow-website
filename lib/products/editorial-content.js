import sourceContent from './product-editorial-content.json';

const contentBySlug = new Map(sourceContent.map(({ slug, text }) => [slug, text]));
const aliases = {
  'cua-cuon-nhom-khe-thoang-easd45': 'cua-cuon-khe-thoang-easd45',
  'cua-so-upvc-2-canh-mo-truot': 'cua-so-mo-truot-upvc-2-canh',
  'cua-so-upvc-4-canh-mo-truot': 'cua-so-mo-truot-upvc-4-canh',
  'cua-so-upvc-2-canh-quay-lat-trong': 'cua-so-upvc-2-canh-mo-quay-lat-trong',
  'cua-truot-tu-dong': 'cua-truot-tu-dong-2-canh',
  'kinh-an-toan-nhieu-lop': 'kinh-an-toan'
};

const clean = (line) => line.replace(/\s+/g, ' ').trim();
const endsLikeSentence = (line) => /[.!?。！？:]$/.test(line);

function isSubheading(line, nextLine) {
  return Boolean(line && nextLine && line.length <= 110 && nextLine.length >= 90 && !endsLikeSentence(line));
}

function parseEditorial(text, productName) {
  const lines = text.split(/\r?\n/).map(clean);
  const introHeader = lines.findIndex((line) => line.toLocaleUpperCase('vi') === 'GIỚI THIỆU SẢN PHẨM');
  const specsHeader = lines.findIndex((line) => line.toLocaleUpperCase('vi') === 'THÔNG SỐ KỸ THUẬT');
  const applicationsHeader = lines.findIndex((line) => line.toLocaleUpperCase('vi') === 'ỨNG DỤNG TRONG CÔNG TRÌNH');
  if (introHeader < 0 || applicationsHeader < 0) return null;
  const contentEnd = specsHeader >= 0 ? specsHeader : applicationsHeader;

  const introLines = lines.slice(introHeader + 1, contentEnd).filter((line) => line && line !== 'LIÊN HỆ TƯ VẤN' && line !== 'LIÊN HỆ NGAY NHẬN BÁO GIÁ');
  if (introLines[0]?.toLocaleLowerCase('vi') === productName?.toLocaleLowerCase('vi')) introLines.shift();
  const firstHeading = introLines.findIndex((line, index) => isSubheading(line, introLines[index + 1]));
  const intro = (firstHeading < 0 ? introLines.slice(0, 2) : introLines.slice(0, firstHeading)).filter((line) => line.length > 50);
  const bodyLines = introLines.slice(firstHeading < 0 ? intro.length : firstHeading);
  const sections = [];
  let current = null;
  for (let index = 0; index < bodyLines.length; index += 1) {
    const line = bodyLines[index];
    if (!line) continue;
    if (line === 'LIÊN HỆ TƯ VẤN' || line === 'LIÊN HỆ NGAY NHẬN BÁO GIÁ') continue;
    if (isSubheading(line, bodyLines[index + 1])) {
      current = { heading: line, paragraphs: [], captions: [] };
      sections.push(current);
    } else if (line.length >= 90) {
      if (!current) {
        current = { heading: '', paragraphs: [], captions: [] };
        sections.push(current);
      }
      current.paragraphs.push(line);
    } else if (current) {
      current.captions.push(line);
    }
  }

  const specText = specsHeader >= 0 ? lines.slice(specsHeader + 1, applicationsHeader).join('\n') : '';
  const specCells = specText.split('|').flatMap((cell) => {
    const cellLines = cell.split('\n').map(clean).filter(Boolean);
    if (cellLines.length > 1 && cellLines.every((line) => /^(ON|OFF)\s*:/i.test(line))) return [cellLines.join('; ')];
    return cellLines;
  });
  const specifications = [];
  for (let index = 0; index + 1 < specCells.length; index += 2) {
    const label = specCells[index];
    const value = specCells[index + 1];
    if (label && value) specifications.push([label, value]);
  }

  const applicationLines = lines.slice(applicationsHeader + 1).filter((line) => line && !/^LIÊN HỆ/i.test(line));
  const applicationText = applicationLines.filter((line) => line.length >= 90);
  const applicationPlaces = applicationLines.filter((line) => line.length < 90 && !endsLikeSentence(line));
  return { intro, sections, specifications, applicationText, applicationPlaces };
}

export function applyEditorialContent(product) {
  const sourceSlug = aliases[product.slug] || product.slug;
  const text = contentBySlug.get(sourceSlug);
  if (!text) return product;
  const editorial = parseEditorial(text, product.name);
  if (!editorial) return product;

  const featureBenefits = editorial.sections
    .filter((section) => section.heading && section.paragraphs.length)
    .slice(0, 3)
    .map(({ heading, paragraphs }) => [heading, paragraphs[0]]);
  const description = editorial.intro[0] || product.summary;
  const shortSummary = description.length > 300 ? `${description.slice(0, 297).replace(/\s+\S*$/, '')}…` : description;

  return {
    ...product,
    summary: shortSummary,
    description: editorial.intro.join('\n\n') || product.description,
    ...(featureBenefits.length ? { benefitHeading: featureBenefits[0][0], benefits: featureBenefits } : {}),
    ...(editorial.specifications.length ? { constructionFacts: [], specifications: editorial.specifications } : {}),
    editorialIntro: editorial.intro.slice(1),
    editorialSections: editorial.sections.filter((section) => !featureBenefits.some(([heading]) => heading === section.heading)),
    applicationText: editorial.applicationText,
    applicationPlaces: editorial.applicationPlaces
  };
}
