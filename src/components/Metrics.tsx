import { useEffect, useRef, useState } from 'react'
import type { Metric } from '@/data/career'
import { cn } from '@/lib/format'

/**
 * Counts up to the target once the strip scrolls into view.
 *
 * The initial state is the final value, not zero — so the prerendered HTML and
 * anyone without JavaScript sees the real number rather than a misleading 0.
 */
function useCountUp(target: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (!active) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()
    const duration = 1100

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(Number((target * eased).toFixed(decimals)))
      if (t < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, decimals, active])

  return value
}

function MetricValue({ raw, active }: { raw: string; active: boolean }) {
  const numeric = Number(raw)
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  const animated = useCountUp(Number.isFinite(numeric) ? numeric : 0, decimals, active)

  if (!Number.isFinite(numeric)) return <>{raw}</>
  return <>{animated.toFixed(decimals)}</>
}

export function MetricStrip({ metrics, className }: { metrics: Metric[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setActive(true)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule lg:grid-cols-4',
        className,
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-surface px-5 py-6">
          <div className="flex items-baseline gap-0.5 font-mono text-ink tabular-nums">
            <span className="text-[1.75rem] leading-none tracking-tight">
              <MetricValue raw={metric.value} active={active} />
            </span>
            {metric.unit ? <span className="text-[1rem] text-accent">{metric.unit}</span> : null}
          </div>
          <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-2">
            {metric.label}
          </p>
          <p className="mt-1 text-[0.75rem] leading-snug text-ink-4">{metric.context}</p>
        </div>
      ))}
    </div>
  )
}
