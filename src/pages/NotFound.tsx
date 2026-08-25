import { Link } from 'react-router'
import { nav } from '@/data/site'
import { Button, Container } from '@/components/ui'

export function NotFound() {
  return (
    <Container className="relative flex min-h-[70vh] flex-col justify-center py-20">
      <div
        className="grid-field pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_30%_40%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="relative max-w-xl">
        <p className="label mb-6">Error 404</p>

        <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)] text-ink">
          This page was never
          <br />
          committed.
        </h1>

        <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-2">
          The URL does not resolve to anything on this site. It may have moved when the site was rebuilt, or
          it may never have existed.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to the index</Button>
          <Button href="/posts" variant="outline">
            Read something instead
          </Button>
        </div>

        <nav className="mt-14 border-t border-rule pt-6" aria-label="Site sections">
          <p className="label mb-4">Everything here</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="group inline-flex items-baseline gap-2 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink"
                >
                  <span className="font-mono text-[0.625rem] text-ink-4">{item.short}</span>
                  <span className="rule-grow">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  )
}
