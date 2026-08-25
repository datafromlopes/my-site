/**
 * Cloudflare Worker in front of the prerendered site.
 *
 * Three jobs, in order:
 *   1. 301 the URLs the old Hugo site used, so nothing indexed breaks.
 *   2. Serve POST /api/subscribe by talking to MailerLite server-side.
 *   3. Hand everything else to the static asset binding, adding security headers.
 */

export interface Env {
  ASSETS: Fetcher
  MAILERLITE_ACCOUNT?: string
  MAILERLITE_FORM?: string
  /** Optional. Set with `wrangler secret put MAILERLITE_API_KEY` to use the official API. */
  MAILERLITE_API_KEY?: string
  /** Optional. Numeric MailerLite group id to add subscribers to. */
  MAILERLITE_GROUP_ID?: string
}

/* ------------------------------------------------------------- redirects */

/** Exact path → destination. Everything the previous Hugo build published. */
const EXACT_REDIRECTS: Record<string, string> = {
  '/articles': '/research',
  '/articles/sbbd-2026': '/research/atlassql-br',
  '/blog': '/posts',
  '/blog/tf-idf': '/posts/tf-idf',
  '/writing': '/posts',
  '/writing/tf-idf': '/posts/tf-idf',
  '/projects/geo-nlq-to-sql': '/projects/geo-text-to-sql',
  '/projects/cassandra-cluster': '/projects/cassandra-platform',
  '/projects/matrix_multiply_optimizer': '/projects/matrix-kernel-optimization',
  '/index.xml': '/rss.xml',
  '/blog/index.xml': '/rss.xml',
  '/articles/index.xml': '/rss.xml',
  '/projects/index.xml': '/rss.xml',
}

/** Prefix → destination, applied when no exact match wins. */
const PREFIX_REDIRECTS: [string, string][] = [
  ['/articles/', '/research'],
  ['/blog/', '/posts'],
  ['/writing/', '/posts'],
  ['/tags/', '/posts'],
  ['/categories/', '/posts'],
  ['/page/', '/'],
]

function redirectFor(pathname: string): string | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (EXACT_REDIRECTS[clean]) return EXACT_REDIRECTS[clean]

  for (const [prefix, target] of PREFIX_REDIRECTS) {
    if (clean.startsWith(prefix)) return target
  }

  return null
}

/* ------------------------------------------------------------ newsletter */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

async function subscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed.' }, 405)
  }

  let email = ''
  try {
    const body = (await request.json()) as { email?: unknown }
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  } catch {
    return json({ ok: false, message: 'Malformed request.' }, 400)
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, message: 'That does not look like a valid e-mail address.' }, 400)
  }

  // Preferred path: the official API, which gives real error messages.
  if (env.MAILERLITE_API_KEY) {
    try {
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          status: 'unconfirmed',
          ...(env.MAILERLITE_GROUP_ID ? { groups: [env.MAILERLITE_GROUP_ID] } : {}),
        }),
      })

      if (response.ok) {
        return json({ ok: true, message: 'Almost there — confirm the link in your inbox.' })
      }

      // 422 usually means "already subscribed", which is not a failure for the reader.
      if (response.status === 422) {
        return json({ ok: true, message: 'You are already on the list.' })
      }
    } catch {
      // fall through to the public form endpoint
    }
  }

  // Fallback: the same endpoint the MailerLite embed script posts to. No secret required.
  const account = env.MAILERLITE_ACCOUNT
  const form = env.MAILERLITE_FORM

  if (!account || !form) {
    return json({ ok: false, message: 'Subscriptions are not configured yet.' }, 503)
  }

  try {
    const payload = new URLSearchParams({ 'fields[email]': email, 'ml-submit': '1', anticsrf: 'true' })

    const response = await fetch(`https://assets.mailerlite.com/jsonp/${account}/forms/${form}/subscribe`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: payload,
    })

    const text = await response.text()
    const success = response.ok && !/"success"\s*:\s*false/.test(text)

    return success
      ? json({ ok: true, message: 'Almost there — confirm the link in your inbox.' })
      : json({ ok: false, message: 'MailerLite rejected that. Try again in a moment.' }, 502)
  } catch {
    return json({ ok: false, message: 'Could not reach the mail provider. Try again shortly.' }, 502)
  }
}

/* --------------------------------------------------------------- headers */

const SECURITY_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'SAMEORIGIN',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'content-security-policy': [
    "default-src 'self'",
    // The theme bootstrap in index.html is a small inline script.
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
}

function withHeaders(response: Response, pathname: string): Response {
  const out = new Response(response.body, response)

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    out.headers.set(key, value)
  }

  // Hashed build assets are immutable; HTML must always revalidate.
  if (/^\/assets\//.test(pathname) || /\.(woff2?|svg|png|jpe?g|webp|ico)$/.test(pathname)) {
    out.headers.set('cache-control', 'public, max-age=31536000, immutable')
  } else if (/\.(xml|txt|webmanifest)$/.test(pathname)) {
    out.headers.set('cache-control', 'public, max-age=3600')
  } else {
    out.headers.set('cache-control', 'public, max-age=0, must-revalidate')
  }

  return out
}

/* ----------------------------------------------------------------- entry */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/subscribe') {
      return subscribe(request, env)
    }

    const target = redirectFor(url.pathname)
    if (target) {
      return Response.redirect(new URL(target + url.search, url.origin).toString(), 301)
    }

    const response = await env.ASSETS.fetch(request)
    return withHeaders(response, url.pathname)
  },
} satisfies ExportedHandler<Env>
