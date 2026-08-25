import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { nav, site } from '@/data/site'
import { cn } from '@/lib/format'
import { useHasScrolled, useScrollLock } from '@/lib/hooks'
import { CommandPalette } from './CommandPalette'
import { Close, Menu, Search } from './Icons'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)
  const scrolled = useHasScrolled()
  const location = useLocation()

  useScrollLock(menuOpen)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent))
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setPaletteOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (event.key === '/' && !/input|textarea/i.test((event.target as HTMLElement)?.tagName ?? '')) {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:border focus:border-rule focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'no-print sticky top-0 z-50 border-b transition-colors duration-300',
          scrolled
            ? 'border-rule bg-paper/90 backdrop-blur-xl supports-[backdrop-filter]:bg-paper/75'
            : 'border-transparent bg-paper',
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-6 px-5 sm:px-8">
          {/* Wordmark */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${site.name} — home`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded border border-ink bg-ink font-mono text-[0.8125rem] font-medium leading-none text-paper">
              dl
            </span>
            <span className="leading-tight">
              <span className="block text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">
                {site.name}
              </span>
              {/* The tagline is the first thing to go when the bar gets tight. */}
              <span className="hidden font-mono text-[0.6875rem] text-ink-3 sm:block">
                data systems &amp; NLP research
              </span>
            </span>
          </Link>

          <span className="flex-1" />

          {/* Primary navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative rounded px-2.5 py-1.5 text-[0.875rem] font-medium transition-colors duration-200',
                    isActive ? 'text-accent' : 'text-ink-3 hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-2.5 -bottom-[13px] h-[2px] origin-left rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <span className="hidden h-5 w-px bg-rule md:block" />

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex h-8 items-center gap-2 rounded border border-rule px-2.5 text-ink-3 transition-colors hover:border-rule-2 hover:text-ink"
              aria-label="Search"
            >
              <Search size={14} />
              <kbd className="hidden font-mono text-[0.6875rem] sm:block">{isMac ? '⌘' : 'Ctrl'}K</kbd>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded border border-rule text-ink-3 transition-colors hover:border-rule-2 hover:text-ink md:hidden"
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-paper md:hidden"
          style={{ animation: 'fade-in .18s ease-out' }}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <span className="font-mono text-[0.75rem] text-ink-3">menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded border border-rule text-ink-3"
              aria-label="Close menu"
            >
              <Close size={16} />
            </button>
          </div>

          <nav className="px-5 pt-4" aria-label="Mobile">
            {nav.map((item, index) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-baseline gap-4 border-b border-rule py-5 transition-colors',
                    isActive ? 'text-accent' : 'text-ink',
                  )
                }
                style={{ animation: `reveal-up .4s cubic-bezier(0.16,1,0.3,1) ${index * 40}ms backwards` }}
              >
                <span className="font-mono text-[0.75rem] text-ink-4">{item.short}</span>
                <span className="display text-[1.625rem]">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="px-5 pt-8">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setPaletteOpen(true)
              }}
              className="flex w-full items-center gap-2 rounded border border-rule px-4 py-3 text-[0.875rem] text-ink-3"
            >
              <Search size={14} /> Search everything
            </button>
          </div>
        </div>
      ) : null}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
