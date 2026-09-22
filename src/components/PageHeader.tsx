import type { ReactNode } from 'react'
import { Container } from './ui'

/** The masthead every index page opens with. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  action,
}: {
  eyebrow: string
  title: string
  lede?: ReactNode
  meta?: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div
        className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_0%,black,transparent)]"
        aria-hidden="true"
      />

      <Container className="relative pb-12 pt-14 sm:pt-16">
        <p className="label mb-5" style={{ animation: 'fade-in .6s ease-out backwards' }}>
          {eyebrow}
        </p>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1
            className="display max-w-2xl text-[clamp(2.25rem,5.5vw,3.5rem)] text-ink"
            style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) backwards' }}
          >
            {title}
          </h1>
          {action}
        </div>

        {lede ? (
          <p
            className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-2"
            style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) 100ms backwards' }}
          >
            {lede}
          </p>
        ) : null}

        {meta ? (
          <div
            className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4"
            style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) 160ms backwards' }}
          >
            {meta}
          </div>
        ) : null}
      </Container>
    </section>
  )
}

export function PageMeta({ label, value }: { label: string; value: ReactNode }) {
  // Stacked key/value: the key is small and muted, the value carries the
  // weight — so the two never read as the same kind of text.
  return (
    <span className="flex flex-col gap-1">
      <span className="label text-[0.625rem]">{label}</span>
      <span className="text-[1rem] font-semibold tracking-[-0.01em] text-ink">{value}</span>
    </span>
  )
}
