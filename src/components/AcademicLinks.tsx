import type { SocialLink } from '@/data/site'
import { cn } from '@/lib/format'
import { iconFor } from './Icons'

/**
 * Scholarly identifiers as a text list: icon, then the handle in mono.
 * Used by the footer and the research page so both read identically.
 */
export function AcademicLinks({ items, className }: { items: SocialLink[]; className?: string }) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item) => {
        const Icon = iconFor[item.id]
        return (
          <li key={item.id}>
            <a
              href={item.href}
              target="_blank"
              rel="me noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[0.8125rem] text-ink-3 transition-colors hover:text-ink"
            >
              {Icon ? <Icon size={13} className="shrink-0" /> : null}
              <span className="font-mono text-[0.6875rem]">{item.handle}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
