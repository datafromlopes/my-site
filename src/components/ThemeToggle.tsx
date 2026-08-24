import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/format'
import { useTheme, type ThemeChoice } from '@/lib/hooks'
import { Monitor, Moon, Sun } from './Icons'

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

export function ThemeToggle() {
  const { choice, select } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Render the neutral icon until mounted so SSR output and hydration agree.
  const Active = mounted ? (OPTIONS.find((o) => o.value === choice)?.Icon ?? Monitor) : Monitor

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Colour theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-3 transition-colors hover:border-rule-2 hover:text-ink"
      >
        <Active size={15} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-md border border-rule bg-surface shadow-[var(--shadow-lift)]"
          style={{ animation: 'fade-in .18s ease-out' }}
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={choice === value}
              onClick={() => {
                select(value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[0.8125rem] transition-colors',
                choice === value ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-surface-2',
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
