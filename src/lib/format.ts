import type { Author, Publication } from './content'

export const BUILD_DATE = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : '2026-01-01'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-05-25" → "25 May 2026". Parsed as UTC so the day never shifts by timezone. */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m) return iso
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`
}

/** "2024-01" or "2024-01-01" → "Jan 2024". */
export function formatMonth(value: string | null): string {
  if (!value) return 'Present'
  const [y, m] = value.split('-').map(Number)
  if (!y) return value
  return m ? `${MONTHS[m - 1]} ${y}` : String(y)
}

function monthsBetween(start: string, end: string): number {
  const [ys, ms] = start.split('-').map(Number)
  const [ye, me] = end.split('-').map(Number)
  return (ye - ys) * 12 + ((me || 1) - (ms || 1))
}

/** "3 yr 6 mo" — the compact form used on CVs. */
export function duration(start: string, end: string | null): string {
  const total = Math.max(0, monthsBetween(start, end ?? BUILD_DATE.slice(0, 7)))
  const years = Math.floor(total / 12)
  const months = total % 12
  if (years && months) return `${years} yr ${months} mo`
  if (years) return `${years} yr`
  return `${months || 1} mo`
}

/** Whole years since a start date, as of the build. */
export function yearsSince(start: string): number {
  return Math.floor(monthsBetween(start.slice(0, 7), BUILD_DATE.slice(0, 7)) / 12)
}

export function authorLine(authors: Author[]): string {
  return authors.map((a) => a.name).join(', ')
}

/** APA-ish citation string, good enough to paste into an e-mail. */
export function citation(pub: Publication): string {
  const names = pub.authors
    .map((a) => {
      const parts = a.name.trim().split(/\s+/)
      const last = parts.pop() ?? ''
      const initials = parts.map((p) => `${p[0]}.`).join(' ')
      return initials ? `${last}, ${initials}` : last
    })
    .join(', ')

  const bits = [
    `${names} (${pub.year}).`,
    `${pub.title}.`,
    `In ${pub.venue}${pub.venueShort ? ` (${pub.venueShort})` : ''}.`,
    pub.pages ? `pp. ${pub.pages}.` : '',
    pub.publisher ? `${pub.publisher}.` : '',
    pub.doi ? `https://doi.org/${pub.doi}` : '',
  ]

  return bits.filter(Boolean).join(' ')
}

export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ')
}

/** Two-digit section numbers: 01, 02 … */
export const sectionNumber = (n: number) => String(n).padStart(2, '0')
