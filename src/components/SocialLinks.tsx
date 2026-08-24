import type { SocialLink } from '@/data/site'
import { cn } from '@/lib/format'
import { iconFor } from './Icons'

/**
 * Icon row. Each link carries its brand colour and only shows it on hover, so
 * the row is calm at rest and legible about where each link goes.
 */
export function SocialLinks({
  items,
  size = 'md',
  className,
}: {
  items: SocialLink[]
  size?: 'sm' | 'md'
  className?: string
}) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const glyph = size === 'sm' ? 15 : 16

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => {
        const Icon = iconFor[item.id]
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            style={{ '--brand': item.brand } as React.CSSProperties}
            className={cn(
              box,
              'brand-hover flex items-center justify-center rounded-md border border-rule bg-surface text-ink-3',
            )}
          >
            {Icon ? <Icon size={glyph} /> : item.label[0]}
          </a>
        )
      })}
    </div>
  )
}
