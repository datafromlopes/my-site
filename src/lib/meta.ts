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

function shell(overrides: Partial<Meta>): Meta {
  return {
    title: site.name,
    description: site.description,
    canonical: site.url,
    image: DEFAULT_IMAGE,
    type: 'website',
    jsonLd: [],
    ...overrides,
  }
}

export function resolveMeta(pathname: string): Meta {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return shell({
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
    return shell({
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
    return shell({
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

  if (path === '/writing') {
    return shell({
      title: `Writing — ${site.name}`,
      description:
        'Notes and essays on data engineering, distributed systems, NLP and the places they overlap.',
      canonical: `${site.url}/writing`,
      jsonLd: [
        {
          '@type': 'Blog',
          name: `Writing — ${site.name}`,
          url: `${site.url}/writing`,
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
    return shell({
      title: `Curriculum Vitae — ${site.name}`,
      description: `Full curriculum vitae of ${site.name}: experience, education, publications and technical competencies.`,
      canonical: `${site.url}/cv`,
      jsonLd: [person],
    })
  }

  if (path.startsWith('/research/')) {
    const pub = findPublication(path.slice('/research/'.length))
    if (pub) {
      return shell({
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
      return shell({
        title: `${project.title} — ${site.name}`,
        description: project.tldr,
        canonical: abs(project.href),
        image: project.cover ? abs(project.cover) : DEFAULT_IMAGE,
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

  if (path.startsWith('/writing/')) {
    const post = findPost(path.slice('/writing/'.length))
    if (post) {
      return shell({
        title: `${post.title} — ${site.name}`,
        description: post.tldr,
        canonical: abs(post.href),
        image: post.cover ? abs(post.cover) : DEFAULT_IMAGE,
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
            image: post.cover ? abs(post.cover) : DEFAULT_IMAGE,
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

  return shell({
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
    '/writing',
    '/cv',
    '/404',
    ...publications.map((p) => p.href),
    ...projects.map((p) => p.href),
    ...posts.map((p) => p.href),
  ]
}

export { authorLine }
