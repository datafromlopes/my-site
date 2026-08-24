import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { resolveMeta } from './lib/meta'
import { allRoutes } from './lib/meta'

export type RenderResult = { html: string; head: string }

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** JSON-LD is inlined; the only escaping that matters is closing the script tag. */
const jsonLdSafe = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

function headFor(url: string): string {
  const meta = resolveMeta(url)

  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}">`,
    `<link rel="canonical" href="${escape(meta.canonical)}">`,
    `<meta name="author" content="Diego Lopes">`,
    `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">`,

    `<meta property="og:type" content="${meta.type}">`,
    `<meta property="og:title" content="${escape(meta.title)}">`,
    `<meta property="og:description" content="${escape(meta.description)}">`,
    `<meta property="og:url" content="${escape(meta.canonical)}">`,
    `<meta property="og:image" content="${escape(meta.image)}">`,
    `<meta property="og:site_name" content="Diego Lopes">`,
    `<meta property="og:locale" content="en_US">`,

    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escape(meta.title)}">`,
    `<meta name="twitter:description" content="${escape(meta.description)}">`,
    `<meta name="twitter:image" content="${escape(meta.image)}">`,
    `<meta name="twitter:creator" content="@datafromlopes">`,
  ]

  if (meta.publishedTime)
    tags.push(`<meta property="article:published_time" content="${meta.publishedTime}">`)
  if (meta.modifiedTime) tags.push(`<meta property="article:modified_time" content="${meta.modifiedTime}">`)

  if (meta.jsonLd.length) {
    const graph = { '@context': 'https://schema.org', '@graph': meta.jsonLd }
    tags.push(`<script type="application/ld+json">${jsonLdSafe(graph)}</script>`)
  }

  return tags.join('\n    ')
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )

  return { html, head: headFor(url) }
}

export { allRoutes }

/** Data the prerenderer needs for sitemap.xml and rss.xml. */
export { posts, projects, publications } from './lib/content'
export { site } from './data/site'
