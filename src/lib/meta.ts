/**
 * Route → document metadata.
 *
 * Shared by the prerenderer (which bakes the tags into each static HTML file)
 * and by the client (which updates them on soft navigation), so a crawler and a
 * user who clicked through from the home page see exactly the same description.
 */
import { site } from '@/data/site'
import { findPost, findProject, findPublication, posts, projects, publications } from './content'
import { authorLine } from './format'

export type Meta = {
  title: string
  description: string
  canonical: string
  image: string
  type: 'website' | 'article'
  jsonLd: unknown[]
  publishedTime?: string
  modifiedTime?: string
}

const DEFAULT_IMAGE = `${site.url}/media/profile.png`

/**
 * File name of the generated social card for a route. Shared by resolveMeta and
 * scripts/og.mjs so the tag and the file on disk can never drift apart.
 */
export function ogSlug(pathname: string): string {
  const path = pathname.replace(/\/+$/, '') || '/'
  return path === '/' ? 'index' : path.slice(1).replace(/\//g, '-')
}

const ogImage = (pathname: string) => `${site.url}/og/${ogSlug(pathname)}.png`

export type OgCard = {
  /** First powerline segment — a year, a venue, whatever situates the page. */
  tag: string
  eyebrow: string
  badge?: string
  title: string
  lines: string[]
  footer?: string
}

/** What the social card for a route should say. */
export function ogCard(pathname: string): OgCard {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path.startsWith('/research/')) {
    const pub = findPublication(path.slice('/research/'.length))
    if (pub) {
      return {
        tag: String(pub.year),
        eyebrow: '~/research',
        badge: pub.status === 'published' ? 'Published' : pub.status,
        title: pub.title,
        lines: [
          authorLine(pub.authors),
          [pub.venue, pub.location, pub.pages ? `pp. ${pub.pages}` : ''].filter(Boolean).join(' · '),
        ],
        footer: pub.doi ? `doi.org/${pub.doi}` : pub.venueShort,
      }
    }
  }

  if (path.startsWith('/projects/')) {
    const project = findProject(path.slice('/projects/'.length))
    if (project) {
      return {
        tag: project.start.slice(0, 4),
        eyebrow: '~/projects',
        badge: project.status === 'ongoing' ? 'Ongoing' : 'Delivered',
        title: project.title,
        lines: [project.tldr],
        footer: project.stack.slice(0, 3).join(' · '),
      }
    }
  }

  if (path.startsWith('/posts/')) {
    const post = findPost(path.slice('/posts/'.length))
    if (post) {
      return {
        tag: post.date.slice(0, 4),
        eyebrow: '~/posts',
        title: post.title,
        lines: [post.tldr],
        footer: `${post.readingTime} min read · ${post.tags.slice(0, 2).join(' · ')}`,
      }
    }
  }

  const index: Record<string, OgCard> = {
    '/': {
      tag: 'dl',
      eyebrow: '~/',
      title: 'I build data systems that hold at scale, and study how models learn to query them.',
      lines: [`${site.role} · ${site.location}`],
      footer: 'Ollie · IME-USP',
    },
    '/research': {
      tag: 'dl',
      eyebrow: '~/research',
      title: 'Research',
      lines: ['Text-to-SQL, semantic parsing and natural language interfaces for spatial data.'],
      footer: 'MSc · IME-USP',
    },
    '/projects': {
      tag: 'dl',
      eyebrow: '~/projects',
      title: 'Projects',
      lines: ['Distributed data platforms, text-to-SQL models and high-performance computing kernels.'],
      footer: '47M writes/day · 13μs P50',
    },
    '/posts': {
      tag: 'dl',
      eyebrow: '~/posts',
      title: 'Posts',
      lines: ['Notes on distributed systems, language models and information retrieval.'],
      footer: 'Distributed systems · NLP',
    },
    '/404': {
      tag: '404',
      eyebrow: '~/',
      title: 'This page was never committed.',
      lines: ['The URL does not resolve to anything on this site.'],
      footer: 'datafromlopes.com',
    },
    '/cv': {
      tag: 'dl',
      eyebrow: '~/cv',
      title: 'Curriculum Vitae',
      lines: ['Experience, education, publications and technical competencies.'],
      footer: 'Printable PDF',
    },
  }

  return (
    index[path] ?? {
      tag: 'dl',
      eyebrow: '~/',
      title: site.name,
      lines: [site.shortBio],
      footer: site.location,
    }
  )
}

const person = {
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  url: site.url,
  image: DEFAULT_IMAGE,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  description: site.shortBio,
  address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressCountry: 'BR' },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'University of São Paulo (IME-USP)',
      url: 'https://www.ime.usp.br',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'Federal Institute of São Paulo (IFSP)',
      url: 'https://bra.ifsp.edu.br',
    },
  ],
  knowsAbout: [...site.keywords],
  sameAs: [
    'https://www.linkedin.com/in/datafromlopes',
    'https://github.com/datafromlopes',
    'https://orcid.org/0000-0002-5130-3728',
    'http://lattes.cnpq.br/4604428550643092',
    'https://huggingface.co/datafromlopes',
  ],
}

const abs = (p: string) => (p.startsWith('http') ? p : `${site.url}${p}`)

function shell(pathname: string, overrides: Partial<Meta>): Meta {
  return {
    title: site.name,
    description: site.description,
    canonical: site.url,
    image: ogImage(pathname),
    type: 'website',
    jsonLd: [],
    ...overrides,
  }
}

export function resolveMeta(pathname: string): Meta {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return shell(path, {
      title: `${site.name} — ${site.role}`,
      description: site.description,
      canonical: `${site.url}/`,
      jsonLd: [
        person,
        {
          '@type': 'WebSite',
          '@id': `${site.url}/#website`,
          url: site.url,
          name: site.name,
          description: site.description,
          publisher: { '@id': `${site.url}/#person` },
          inLanguage: 'en',
        },
      ],
    })
  }

  if (path === '/research') {
    return shell(path, {
      title: `Research — ${site.name}`,
      description:
        'Peer-reviewed publications on text-to-SQL, semantic parsing and natural language interfaces for geospatial databases.',
      canonical: `${site.url}/research`,
      jsonLd: [
        {
          '@type': 'CollectionPage',
          name: 'Research',
          url: `${site.url}/research`,
          author: { '@id': `${site.url}/#person` },
          hasPart: publications.map((p) => ({
            '@type': 'ScholarlyArticle',
            name: p.title,
            url: abs(p.href),
          })),
        },
      ],
    })
  }

  if (path === '/projects') {
    return shell(path, {
      title: `Projects — ${site.name}`,
      description:
        'Selected engineering and research systems: distributed data platforms, text-to-SQL models and high-performance computing kernels.',
      canonical: `${site.url}/projects`,
      jsonLd: [
        {
          '@type': 'CollectionPage',
          name: 'Projects',
          url: `${site.url}/projects`,
          author: { '@id': `${site.url}/#person` },
        },
      ],
    })
  }

  if (path === '/posts') {
    return shell(path, {
      title: `Posts — ${site.name}`,
      description:
        'Notes and essays on data engineering, distributed systems, NLP and the places they overlap.',
      canonical: `${site.url}/posts`,
      jsonLd: [
        {
          '@type': 'Blog',
          name: `Posts — ${site.name}`,
          url: `${site.url}/posts`,
          author: { '@id': `${site.url}/#person` },
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: abs(p.href),
            datePublished: p.date,
          })),
        },
      ],
    })
  }

  if (path === '/cv') {
    return shell(path, {
      title: `Curriculum Vitae — ${site.name}`,
      description: `Full curriculum vitae of ${site.name}: experience, education, publications and technical competencies.`,
      canonical: `${site.url}/cv`,
      jsonLd: [person],
    })
  }

  if (path.startsWith('/research/')) {
    const pub = findPublication(path.slice('/research/'.length))
    if (pub) {
      return shell(path, {
        title: `${pub.title} — ${site.name}`,
        description: pub.tldr || pub.abstract.slice(0, 200),
        canonical: abs(pub.href),
        type: 'article',
        publishedTime: pub.date,
        jsonLd: [
          {
            '@type': 'ScholarlyArticle',
            headline: pub.title,
            name: pub.title,
            abstract: pub.abstract,
            datePublished: pub.date,
            inLanguage: 'en',
            url: abs(pub.href),
            author: pub.authors.map((a) => ({
              '@type': 'Person',
              name: a.name,
              ...(a.url ? { url: a.url } : {}),
            })),
            publisher: pub.publisher ? { '@type': 'Organization', name: pub.publisher } : undefined,
            isPartOf: { '@type': 'PublicationEvent', name: pub.venue },
            keywords: pub.tags.join(', '),
            ...(pub.doi ? { identifier: `https://doi.org/${pub.doi}` } : {}),
          },
        ],
      })
    }
  }

  if (path.startsWith('/projects/')) {
    const project = findProject(path.slice('/projects/'.length))
    if (project) {
      return shell(path, {
        title: `${project.title} — ${site.name}`,
        description: project.tldr,
        canonical: abs(project.href),
        type: 'article',
        publishedTime: project.date,
        jsonLd: [
          {
            '@type': 'CreativeWork',
            name: project.title,
            description: project.tldr,
            url: abs(project.href),
            dateCreated: project.start,
            author: { '@id': `${site.url}/#person` },
            keywords: project.tags.join(', '),
          },
        ],
      })
    }
  }

  if (path.startsWith('/posts/')) {
    const post = findPost(path.slice('/posts/'.length))
    if (post) {
      return shell(path, {
        title: `${post.title} — ${site.name}`,
        description: post.tldr,
        canonical: abs(post.href),
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.updated,
        jsonLd: [
          {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.tldr,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            url: abs(post.href),
            author: { '@id': `${site.url}/#person` },
            publisher: { '@id': `${site.url}/#person` },
            keywords: post.tags.join(', '),
            wordCount: post.readingTime * 210,
            inLanguage: 'en',
          },
        ],
      })
    }
  }

  return shell(path, {
    title: `Not found — ${site.name}`,
    description: 'This page does not exist.',
    canonical: abs(path),
  })
}

/** Every path the prerenderer should emit. */
export function allRoutes(): string[] {
  return [
    '/',
    '/research',
    '/projects',
    '/posts',
    '/cv',
    '/404',
    ...publications.map((p) => p.href),
    ...projects.map((p) => p.href),
    ...posts.map((p) => p.href),
  ]
}

export { authorLine }
