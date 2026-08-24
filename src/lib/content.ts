/**
 * Content registry.
 *
 * Markdown under src/content is compiled to HTML at build time by the Vite
 * plugin in plugins/markdown.mjs; this module reads those compiled modules and
 * shapes them into typed collections the pages consume.
 */

export type TocEntry = { id: string; text: string; depth: number }

type RawModule = {
  slug: string
  frontmatter: Record<string, any>
  html: string
  toc: TocEntry[]
  readingTime: number
  excerpt: string
  searchText: string
}

type Base = {
  slug: string
  html: string
  toc: TocEntry[]
  readingTime: number
  excerpt: string
  searchText: string
  title: string
  date: string
  tags: string[]
  tldr: string
  featured: boolean
}

export type Author = { name: string; url?: string; me?: boolean }

export type Publication = Base & {
  href: string
  year: number
  type: 'conference' | 'journal' | 'workshop' | 'preprint' | 'thesis'
  status: 'published' | 'accepted' | 'under-review'
  authors: Author[]
  venue: string
  venueShort: string
  publisher?: string
  location?: string
  pages?: string
  doi?: string
  issn?: string
  pdfUrl?: string
  codeUrl?: string
  slidesUrl?: string
  abstract: string
  bibtex?: string
}

export type ProjectMetric = { value: string; label: string }

export type Project = Base & {
  href: string
  subtitle?: string
  start: string
  end: string | null
  status: 'ongoing' | 'shipped'
  org: string
  orgType: 'academic' | 'industry'
  orgUrl?: string
  role?: string
  cover?: string
  repo?: string
  stack: string[]
  metrics: ProjectMetric[]
  order: number
}

export type Post = Base & {
  href: string
  updated?: string
  cover?: string
}

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])
const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : value == null ? fallback : String(value)

/** Front matter dates come back as Date objects from YAML; normalise to ISO days. */
function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  }
  return ''
}

function base(mod: RawModule): Base {
  const fm = mod.frontmatter
  return {
    slug: mod.slug,
    html: mod.html,
    toc: mod.toc,
    readingTime: mod.readingTime,
    excerpt: mod.excerpt,
    searchText: mod.searchText,
    title: asString(fm.title),
    date: toISODate(fm.date),
    tags: asArray<string>(fm.tags),
    tldr: asString(fm.tldr, mod.excerpt),
    featured: fm.featured === true,
  }
}

const publicationModules = import.meta.glob<RawModule>('../content/publications/*.md', { eager: true })
const projectModules = import.meta.glob<RawModule>('../content/projects/*.md', { eager: true })
const writingModules = import.meta.glob<RawModule>('../content/writing/*.md', { eager: true })

export const publications: Publication[] = Object.values(publicationModules)
  .map((mod): Publication => {
    const fm = mod.frontmatter
    const b = base(mod)
    return {
      ...b,
      href: `/research/${b.slug}`,
      year: typeof fm.year === 'number' ? fm.year : Number(b.date.slice(0, 4)) || 0,
      type: asString(fm.type, 'conference') as Publication['type'],
      status: asString(fm.status, 'published') as Publication['status'],
      authors: asArray<Author>(fm.authors),
      venue: asString(fm.venue),
      venueShort: asString(fm.venueShort),
      publisher: asString(fm.publisher) || undefined,
      location: asString(fm.location) || undefined,
      pages: asString(fm.pages) || undefined,
      doi: asString(fm.doi) || undefined,
      issn: asString(fm.issn) || undefined,
      pdfUrl: asString(fm.pdfUrl) || undefined,
      codeUrl: asString(fm.codeUrl) || undefined,
      slidesUrl: asString(fm.slidesUrl) || undefined,
      abstract: asString(fm.abstract),
      bibtex: asString(fm.bibtex) || undefined,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const projects: Project[] = Object.values(projectModules)
  .map((mod): Project => {
    const fm = mod.frontmatter
    const b = base(mod)
    return {
      ...b,
      href: `/projects/${b.slug}`,
      subtitle: asString(fm.subtitle) || undefined,
      start: asString(fm.start),
      end: fm.end == null ? null : asString(fm.end),
      status: asString(fm.status, 'shipped') as Project['status'],
      org: asString(fm.org),
      orgType: asString(fm.orgType, 'industry') as Project['orgType'],
      orgUrl: asString(fm.orgUrl) || undefined,
      role: asString(fm.role) || undefined,
      cover: asString(fm.cover) || undefined,
      repo: asString(fm.repo) || undefined,
      stack: asArray<string>(fm.stack),
      metrics: asArray<ProjectMetric>(fm.metrics),
      order: typeof fm.order === 'number' ? fm.order : 99,
    }
  })
  .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date))

export const posts: Post[] = Object.values(writingModules)
  .map((mod): Post => {
    const fm = mod.frontmatter
    const b = base(mod)
    return {
      ...b,
      href: `/writing/${b.slug}`,
      updated: toISODate(fm.updated) || undefined,
      cover: asString(fm.cover) || undefined,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const findPublication = (slug: string) => publications.find((p) => p.slug === slug)
export const findProject = (slug: string) => projects.find((p) => p.slug === slug)
export const findPost = (slug: string) => posts.find((p) => p.slug === slug)

/** Every tag used anywhere, with counts, most-used first. */
export function tagCloud(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const item of [...publications, ...projects, ...posts]) {
    for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export type SearchDoc = {
  id: string
  title: string
  href: string
  kind: 'page' | 'paper' | 'project' | 'post'
  meta: string
  body: string
}

/** Flat index powering the ⌘K palette. Built at module load, ~one entry per page. */
export const searchIndex: SearchDoc[] = [
  {
    id: 'page-home',
    title: 'About',
    href: '/',
    kind: 'page',
    meta: 'Overview',
    body: 'home about diego lopes data engineer researcher',
  },
  {
    id: 'page-research',
    title: 'Research',
    href: '/research',
    kind: 'page',
    meta: 'Publications',
    body: 'papers publications research nlp text-to-sql',
  },
  {
    id: 'page-projects',
    title: 'Projects',
    href: '/projects',
    kind: 'page',
    meta: 'Selected work',
    body: 'projects systems engineering distributed',
  },
  {
    id: 'page-writing',
    title: 'Writing',
    href: '/writing',
    kind: 'page',
    meta: 'Notes and essays',
    body: 'blog writing notes essays articles',
  },
  {
    id: 'page-cv',
    title: 'Curriculum Vitae',
    href: '/cv',
    kind: 'page',
    meta: 'Full CV',
    body: 'cv resume curriculum vitae experience education',
  },
  ...publications.map((p) => ({
    id: `paper-${p.slug}`,
    title: p.title,
    href: p.href,
    kind: 'paper' as const,
    meta: `${p.venueShort} · ${p.year}`,
    body: `${p.abstract} ${p.tags.join(' ')} ${p.searchText}`,
  })),
  ...projects.map((p) => ({
    id: `project-${p.slug}`,
    title: p.title,
    href: p.href,
    kind: 'project' as const,
    meta: `${p.org} · ${p.start.slice(0, 4)}`,
    body: `${p.tldr} ${p.stack.join(' ')} ${p.tags.join(' ')} ${p.searchText}`,
  })),
  ...posts.map((p) => ({
    id: `post-${p.slug}`,
    title: p.title,
    href: p.href,
    kind: 'post' as const,
    meta: `${p.readingTime} min read`,
    body: `${p.tldr} ${p.tags.join(' ')} ${p.searchText}`,
  })),
]
