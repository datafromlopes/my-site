import { Link } from 'react-router'
import { ArrowLeft, ArrowRight } from './Icons'

type Item = { href: string; title: string } | undefined

/** Previous / next pager shown at the foot of every long-form page. */
export function ArticleNav({ previous, next, label }: { previous: Item; next: Item; label: string }) {
  if (!previous && !next) return null

  return (
    <nav
      className="no-print mt-20 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2"
      aria-label={label}
    >
      {previous ? (
        <Link
          to={previous.href}
          className="group flex flex-col gap-2 bg-surface p-6 transition-colors hover:bg-surface-2"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
            <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />{' '}
            Previous
          </span>
          <span className="display text-[1.0625rem] leading-snug text-ink transition-colors group-hover:text-accent">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="bg-surface" />
      )}

      {next ? (
        <Link
          to={next.href}
          className="group flex flex-col items-end gap-2 bg-surface p-6 text-right transition-colors hover:bg-surface-2"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
            Next{' '}
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="display text-[1.0625rem] leading-snug text-ink transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="bg-surface" />
      )}
    </nav>
  )
}
