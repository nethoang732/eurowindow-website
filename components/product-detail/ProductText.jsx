import styles from './product-detail.module.css';

const technicalPattern = String.raw`EA\d{2,3}i?|PA66|EPDM|RAL\s?\d{4}|\d+(?:[.,]\d+)?\s?(?:mm|cm|m|kg|dB|%)|\d+\s+cánh|mở\s+(?:quay|trượt|hất|lật|xếp)`;

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function ProductText({ children, terms = [], className }) {
  const candidates = [...new Set(terms.filter((term) => typeof term === 'string' && term.trim().length >= 3))]
    .sort((a, b) => b.length - a.length)
    .map(escapePattern);
  const pattern = [...candidates, technicalPattern].filter(Boolean).join('|');
  if (!pattern || typeof children !== 'string') return children;

  const matcher = new RegExp(pattern, 'giu');
  const result = [];
  let cursor = 0;
  for (const match of children.matchAll(matcher)) {
    if (match.index > cursor) result.push(children.slice(cursor, match.index));
    result.push(<strong className={styles.copyHighlight} key={`${match.index}-${match[0]}`}>{match[0]}</strong>);
    cursor = match.index + match[0].length;
  }
  if (!result.length) return children;
  result.push(children.slice(cursor));
  return className ? <span className={className}>{result}</span> : result;
}
