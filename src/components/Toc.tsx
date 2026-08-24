import type { TocEntry } from '@/lib/content'
import { cn } from '@/lib/format'
import { useActiveHeading } from '@/lib/hooks'

/** Sticky table of contents, shown in the margin on wide screens only. */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const ids = entries.map((entry) => entry.id)
  const active = useActiveHeading(ids)

  if (entries.length < 3) return null

  return (
    <nav
      aria-label="On this page"
      className="no-print sticky top-24 hidden max-h-[70vh] overflow-y-auto xl:block"
    >
      <p className="label mb-4">On this page</p>
      <ul className="space-y-1 border-l border-rule">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                'block border-l-2 py-1.5 text-[0.8125rem] leading-snug transition-all duration-300',
                entry.depth === 3 ? 'pl-6' : 'pl-4',
                active === entry.id
                  ? '-ml-px border-accent text-accent'
                  : '-ml-px border-transparent text-ink-4 hover:text-ink-2',
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
