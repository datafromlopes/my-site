import { Link } from 'react-router'

/**
 * Filesystem-style breadcrumb: `~/posts/tf-idf`. Every segment but the last
 * is a link, so it doubles as the back navigation on detail pages.
 */
export function PathCrumb({ segments }: { segments: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="no-print font-mono text-[0.75rem] text-ink-4">
      <Link to="/" className="transition-colors hover:text-accent">
        ~
      </Link>
      {segments.map((segment, i) => (
        <span key={segment.label}>
          <span className="px-0.5 text-ink-4">/</span>
          {segment.href && i < segments.length - 1 ? (
            <Link to={segment.href} className="transition-colors hover:text-accent">
              {segment.label}
            </Link>
          ) : (
            <span className="text-ink-2">{segment.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
