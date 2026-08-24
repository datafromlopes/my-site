import { useState, type FormEvent } from 'react'
import { newsletter } from '@/data/site'
import { cn } from '@/lib/format'
import { ArrowRight, Check, Mail } from './Icons'

type State = 'idle' | 'sending' | 'done' | 'error'

/**
 * Custom subscribe form. Posts to the Worker at /api/subscribe, which talks to
 * MailerLite server-side — no third-party script, no tracking, no layout the
 * site does not control.
 */
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (state === 'sending') return

    setState('sending')
    setMessage('')

    try {
      const response = await fetch(newsletter.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string }

      if (response.ok && data.ok !== false) {
        setState('done')
        setMessage(data.message || 'Check your inbox to confirm.')
        setEmail('')
      } else {
        setState('error')
        setMessage(data.message || 'That did not go through. Try again in a moment.')
      }
    } catch {
      setState('error')
      setMessage('Network error. Try again in a moment.')
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-rule bg-surface',
        compact ? 'p-6' : 'p-7 sm:p-9',
      )}
    >
      <div className="dot-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2.5">
          <Mail size={15} className="text-accent" />
          <span className="label">Field notes</span>
        </div>

        <h3 className={cn('display text-ink', compact ? 'text-xl' : 'text-2xl sm:text-[1.75rem]')}>
          New writing, in your inbox
        </h3>

        <p className="mt-2.5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-3">
          Occasional notes on distributed systems, language models and the research that connects them. No
          cadence promises, no tracking, unsubscribe in one click.
        </p>

        {state === 'done' ? (
          <div className="mt-6 flex items-center gap-2.5 rounded-md border border-transparent bg-ok-soft px-4 py-3 text-[0.875rem] text-ok">
            <Check size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                E-mail address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                autoComplete="email"
                className={cn(
                  'w-full flex-1 rounded-md border border-rule bg-paper px-3.5 py-2.5',
                  'text-[0.9375rem] text-ink outline-none transition-colors',
                  'placeholder:text-ink-4 focus:border-accent',
                )}
              />
              <button
                type="submit"
                disabled={state === 'sending'}
                className={cn(
                  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
                  'border border-ink bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-paper',
                  'transition-colors duration-200 hover:border-accent hover:bg-accent',
                  'disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {state === 'sending' ? 'Sending…' : 'Subscribe'}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {state === 'error' ? (
              <p className="mt-3 text-[0.8125rem] text-mark" role="alert">
                {message}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  )
}
