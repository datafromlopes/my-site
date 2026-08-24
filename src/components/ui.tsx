import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/format'
import { useCopy, useReveal } from '@/lib/hooks'
import { ArrowRight, ArrowUpRight, Check, Copy } from './Icons'

/* ------------------------------------------------------------------ layout */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-5xl px-5 sm:px-8', className)}>{children}</div>
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useReveal<HTMLDivElement>()

  // TypeScript widens a union of intrinsic tags into an intersection of their
  // ref types, which nothing satisfies. Every tag we allow is an HTMLElement,
  // so pinning the type to one of them is accurate at runtime.
  const El = Tag as 'div'

  return (
    <El
      ref={ref}
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </El>
  )
}

/** The numbered heading used to open every section on the site. */
export function SectionHead({
  index,
  title,
  lede,
  action,
  className,
}: {
  index: string
  title: string
  lede?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-10', className)}>
      {/* A short accent tick marks the start of a section — enough structure to
          read as a boundary, without a rule running the width of the page. */}
      <div className="mb-5 h-[3px] w-8 rounded-full bg-accent" aria-hidden="true" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="label text-ink-4">{index}</span>
        {action}
      </div>
      <h2 className="display text-[clamp(1.75rem,3.4vw,2.5rem)] text-ink">{title}</h2>
      {lede ? <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-3">{lede}</p> : null}
    </div>
  )
}

/* ------------------------------------------------------------------- atoms */

/**
 * A tag reads like a code token. Pass `to` to make it a link into the filtered
 * index — those get a pointer and an accent hover; plain tags get neither, so
 * the affordance never lies about whether something is clickable.
 */
export function Tag({
  children,
  to,
  active,
  onClick,
  count,
  hash = true,
  className,
}: {
  children: ReactNode
  to?: string
  active?: boolean
  onClick?: () => void
  count?: number
  /** Off for chips that are not topical tags — a duration, a stack item. */
  hash?: boolean
  className?: string
}) {
  const interactive = Boolean(to || onClick)

  const classes = cn(
    'inline-flex items-center gap-1 rounded-md border px-2 py-[0.1875rem]',
    'font-mono text-[0.6875rem] leading-none tracking-wide',
    active ? 'border-accent-line bg-accent-soft text-accent' : 'border-rule bg-surface-2 text-ink-2',
    interactive &&
      !active &&
      'cursor-pointer transition-colors duration-150 hover:border-accent-line hover:bg-accent-soft hover:text-accent',
    className,
  )

  const body = (
    <>
      {hash ? <span className={cn('select-none', active ? 'opacity-70' : 'text-ink-4')}>#</span> : null}
      {children}
      {typeof count === 'number' ? <span className="ml-0.5 opacity-60">{count}</span> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes} aria-pressed={active}>
        {body}
      </button>
    )
  }

  return <span className={classes}>{body}</span>
}

export function Pill({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'ok' | 'mark'
  className?: string
}) {
  const tones = {
    neutral: 'border-rule bg-surface-2 text-ink-3',
    accent: 'border-accent-line bg-accent-soft text-accent',
    ok: 'border-transparent bg-ok-soft text-ok',
    mark: 'border-transparent bg-mark-soft text-mark',
  } as const

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'font-mono text-[0.6875rem] uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function LiveBadge({ children }: { children: ReactNode }) {
  return (
    <Pill tone="ok">
      <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </Pill>
  )
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-rule', className)} />
}

/* -------------------------------------------------------------------- links */

export function TextLink({
  href,
  children,
  className,
  external,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href)
  const classes = cn('link-rule font-medium', className)

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={classes}>
      {children}
    </Link>
  )
}

/** Call-to-action link with an arrow that slides on hover. */
export function ArrowLink({
  href,
  children,
  external,
  className,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}) {
  const isExternal = external ?? /^https?:/.test(href)
  const content = (
    <>
      <span>{children}</span>
      {isExternal ? (
        <ArrowUpRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      ) : (
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  )

  const classes = cn(
    'group inline-flex items-center gap-1.5 text-[0.875rem] font-medium',
    'text-accent transition-colors hover:text-accent-2',
    className,
  )

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link to={href} className={classes}>
      {content}
    </Link>
  )
}

export function Button({
  href,
  onClick,
  children,
  variant = 'solid',
  external,
  className,
  type = 'button',
}: {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  external?: boolean
  className?: string
  type?: 'button' | 'submit'
}) {
  const variants = {
    solid: 'bg-ink text-paper border-ink hover:bg-accent hover:border-accent',
    outline: 'border-rule-2 text-ink hover:border-ink hover:bg-surface-2',
    ghost: 'border-transparent text-ink-3 hover:text-ink hover:bg-surface-2',
  } as const

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2',
    'text-[0.875rem] font-medium',
    'transition-colors duration-200',
    variants[variant],
    className,
  )

  if (href) {
    const isExternal = external ?? /^(https?:|mailto:)/.test(href)
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    ) : (
      <Link to={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------- copy */

export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
}: {
  value: string
  label?: string
  copiedLabel?: string
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-rule bg-surface px-2.5 py-1',
        'font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-2',
        'transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent',
        copied && 'border-transparent bg-ok-soft text-ok',
        className,
      )}
      aria-live="polite"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? copiedLabel : label}
    </button>
  )
}

/* ------------------------------------------------------------------ layout */

/** Two-column row: a sticky mono label on the left, content on the right. */
export function LabelledRow({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid gap-3 sm:grid-cols-[7.5rem_1fr] sm:gap-6', className)}>
      <div className="label pt-1">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-rule px-6 py-14 text-center">
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-4">{children}</p>
    </div>
  )
}
