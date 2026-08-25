import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/format'

type Segment = { text: string; tone: 'ink' | 'accent' | 'muted'; optional?: boolean }

const TONES: Record<Segment['tone'], CSSProperties> = {
  ink: { '--seg-bg': 'var(--c-ink)', '--seg-fg': 'var(--c-paper)' } as CSSProperties,
  accent: { '--seg-bg': 'var(--c-accent)', '--seg-fg': '#fff' } as CSSProperties,
  muted: { '--seg-bg': 'var(--c-surface-2)', '--seg-fg': 'var(--c-ink-3)' } as CSSProperties,
}

/**
 * A section boundary: a hairline across the column with a shell-prompt chip
 * sitting on it. Gives each section an unmistakable start without a bare rule
 * drifting across the page.
 */
export function SectionRule({
  segments,
  action,
  size = 'lg',
  rule = true,
  as: Tag = 'div',
  label,
  className,
}: {
  segments: Segment[]
  action?: ReactNode
  /** One scale is used site-wide; 'sm' exists for tight, nested contexts. */
  size?: 'sm' | 'lg'
  /** Off when the chip sits directly under another rule and would double it. */
  rule?: boolean
  as?: 'div' | 'h2'
  /** Readable heading text; the chip itself is decorative to assistive tech. */
  label?: string
  className?: string
}) {
  return (
    <Tag className={cn('relative', rule && 'border-t border-rule pt-4', className)}>
      {label ? <span className="sr-only">{label}</span> : null}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className={cn('pl', size === 'lg' && 'pl-lg')} aria-hidden={label ? 'true' : undefined}>
          {segments.map((segment) => (
            <span
              key={segment.text}
              className={cn('pl-seg', segment.optional && 'pl-optional')}
              style={TONES[segment.tone]}
            >
              {segment.text}
            </span>
          ))}
        </span>
        {action}
      </div>
    </Tag>
  )
}
