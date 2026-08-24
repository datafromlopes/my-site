import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { searchIndex, type SearchDoc } from '@/lib/content'
import { cn } from '@/lib/format'
import { useScrollLock } from '@/lib/hooks'
import { Command, Document, Hash, Quote, Search, Sparkle } from './Icons'

const KIND_META: Record<SearchDoc['kind'], { label: string; Icon: typeof Search }> = {
  page: { label: 'Pages', Icon: Command },
  paper: { label: 'Research', Icon: Quote },
  project: { label: 'Projects', Icon: Sparkle },
  post: { label: 'Writing', Icon: Document },
}

const ORDER: SearchDoc['kind'][] = ['page', 'paper', 'project', 'post']

/**
 * Ranks a document against the query. Title matches dominate, then metadata,
 * then body text — so typing "cassandra" surfaces the project, not the essay
 * that mentions it once.
 */
function score(doc: SearchDoc, query: string): number {
  const q = query.toLowerCase().trim()
  if (!q) return 1

  const terms = q.split(/\s+/)
  const title = doc.title.toLowerCase()
  const meta = doc.meta.toLowerCase()
  const body = doc.body.toLowerCase()

  let total = 0
  for (const term of terms) {
    let best = 0
    if (title.startsWith(term)) best = 120
    else if (title.includes(term)) best = 80
    else if (meta.includes(term)) best = 40
    else if (body.includes(term)) best = 16
    else if (fuzzy(title, term)) best = 8
    if (!best) return 0
    total += best
  }
  return total
}

/** Subsequence match — lets "csndra" still find "Cassandra". */
function fuzzy(haystack: string, needle: string): boolean {
  let i = 0
  for (const char of haystack) {
    if (char === needle[i]) i += 1
    if (i === needle.length) return true
  }
  return false
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useScrollLock(open)

  const results = useMemo(() => {
    const scored = searchIndex
      .map((doc) => ({ doc, value: score(doc, query) }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value || a.doc.title.localeCompare(b.doc.title))
      .slice(0, 12)
      .map((entry) => entry.doc)

    return ORDER.map((kind) => ({ kind, items: scored.filter((d) => d.kind === kind) })).filter(
      (g) => g.items.length,
    )
  }, [query])

  const flat = useMemo(() => results.flatMap((group) => group.items), [results])

  useEffect(() => setCursor(0), [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setCursor(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setCursor((c) => (flat.length ? (c + 1) % flat.length : 0))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setCursor((c) => (flat.length ? (c - 1 + flat.length) % flat.length : 0))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const target = flat[cursor]
        if (target) {
          navigate(target.href)
          onClose()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, flat, cursor, navigate, onClose])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  if (!open) return null

  let running = -1

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search this site"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-ink/25 backdrop-blur-[3px] dark:bg-black/60"
        style={{ animation: 'fade-in .2s ease-out' }}
      />

      <div
        className="relative w-full max-w-xl overflow-hidden rounded-lg border border-rule bg-surface shadow-[var(--shadow-lift)]"
        style={{ animation: 'reveal-up .32s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search size={16} className="shrink-0 text-ink-4" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, systems, writing…"
            className="w-full bg-transparent py-4 text-[0.9375rem] text-ink outline-none placeholder:text-ink-4"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="shrink-0 rounded border border-rule px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-4">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[54vh] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <p className="px-3 py-10 text-center font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-4">
              Nothing matches “{query}”
            </p>
          ) : (
            results.map((group) => {
              const { label, Icon } = KIND_META[group.kind]
              return (
                <div key={group.kind} className="mb-1">
                  <div className="label px-3 py-2 text-[0.625rem]">{label}</div>
                  {group.items.map((doc) => {
                    running += 1
                    const active = running === cursor
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        data-active={active}
                        onMouseEnter={() => setCursor(flat.indexOf(doc))}
                        onClick={() => {
                          navigate(doc.href)
                          onClose()
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                          active ? 'bg-accent-soft' : 'hover:bg-surface-2',
                        )}
                      >
                        <Icon size={14} className={cn('shrink-0', active ? 'text-accent' : 'text-ink-4')} />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'block truncate text-[0.875rem]',
                              active ? 'text-accent' : 'text-ink',
                            )}
                          >
                            {doc.title}
                          </span>
                          <span className="block truncate font-mono text-[0.6875rem] text-ink-4">
                            {doc.meta}
                          </span>
                        </span>
                        {active ? <Hash size={12} className="shrink-0 text-accent" /> : null}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-rule px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
          <span className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
          </span>
          <span>
            {flat.length} result{flat.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  )
}
