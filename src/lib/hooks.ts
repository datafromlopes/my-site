import { useCallback, useEffect, useRef, useState } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'dfl-theme'

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(choice: ThemeChoice): void {
  const dark = choice === 'dark' || (choice === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>('system')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeChoice | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') setChoice(stored)
  }, [])

  useEffect(() => {
    applyTheme(choice)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => choice === 'system' && applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [choice])

  const select = useCallback((next: ThemeChoice) => {
    localStorage.setItem(STORAGE_KEY, next)
    setChoice(next)
  }, [])

  return { choice, select }
}

/**
 * Adds `is-visible` once the element scrolls into view. One observer per
 * element, disconnected after the first hit — reveals never replay.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

export function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
  }, [])

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), resetAfter)
    return () => clearTimeout(id)
  }, [copied, resetAfter])

  return { copied, copy }
}

/**
 * Tracks which heading the reader is currently under.
 *
 * Uses "last heading whose top has passed the header" rather than an
 * IntersectionObserver, because the observer approach leaves the highlight
 * stale whenever a section is taller than the viewport.
 */
export function useActiveHeading(ids: string[]): string {
  const [active, setActive] = useState('')
  const key = ids.join('|')

  useEffect(() => {
    if (!ids.length) return

    const OFFSET = 120
    let frame = 0

    const update = () => {
      frame = 0
      const positions = ids
        .map((id) => {
          const el = document.getElementById(id)
          return el ? { id, top: el.getBoundingClientRect().top } : null
        })
        .filter((entry): entry is { id: string; top: number } => entry !== null)

      if (!positions.length) return

      const passed = positions.filter((entry) => entry.top <= OFFSET)
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

      if (atBottom) setActive(positions[positions.length - 1].id)
      else setActive(passed.length ? passed[passed.length - 1].id : positions[0].id)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [key])

  return active
}

/** 0 → 1 across the scrollable height of the document. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return progress
}

export function useHasScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

/** Locks body scroll while an overlay is open. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
