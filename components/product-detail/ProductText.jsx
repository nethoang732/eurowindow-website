export default function ProductText({ children, className }) {
  return className ? <span className={className}>{children}</span> : children;
}
