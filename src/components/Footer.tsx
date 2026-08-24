import { Link } from 'react-router'
import { nav, site, socials } from '@/data/site'
import { BUILD_DATE, formatDate } from '@/lib/format'
import { iconFor, Rss } from './Icons'
import { SocialLinks } from './SocialLinks'
import { Container } from './ui'

const network = socials.filter((s) => s.group === 'network')
const academic = socials.filter((s) => s.group === 'academic')

export function Footer() {
  return (
    <footer className="no-print relative mt-28 border-t border-rule">
      <div
        className="grid-field pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />

      <Container className="relative py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <p className="display text-2xl text-ink">{site.name}</p>
            <p className="mt-2 max-w-xs text-[0.875rem] leading-relaxed text-ink-3">{site.shortBio}</p>
            <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-4">
              {site.location}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <p className="label mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-baseline gap-2.5 text-[0.875rem] text-ink-2 transition-colors hover:text-ink"
                  >
                    <span className="font-mono text-[0.625rem] text-ink-4">{item.short}</span>
                    <span className="rule-grow">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  className="group inline-flex items-baseline gap-2.5 text-[0.875rem] text-ink-2 transition-colors hover:text-ink"
                >
                  <Rss size={11} className="translate-y-px text-ink-4" />
                  <span className="rule-grow">RSS</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Elsewhere */}
          <div>
            <p className="label mb-4">Elsewhere</p>
            <SocialLinks items={network} className="mb-5" />

            <ul className="space-y-2">
              {academic.map((item) => {
                const Icon = iconFor[item.id]
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-[0.8125rem] text-ink-3 transition-colors hover:text-ink"
                    >
                      {Icon ? <Icon size={13} className="shrink-0" /> : null}
                      <span className="font-mono text-[0.6875rem]">{item.handle}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-14 flex flex-col gap-3 border-t border-rule pt-6 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-4 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {BUILD_DATE.slice(0, 4)} {site.name}
          </span>
          <span>Updated {formatDate(BUILD_DATE)}</span>
        </div>
      </Container>
    </footer>
  )
}
