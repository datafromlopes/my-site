/**
 * Static prerender.
 *
 * Renders every route with the SSR bundle, injects the result into the client
 * HTML template, and writes one file per route. The output is a plain static
 * site that React hydrates on load — crawlers get real markup, users get client
 * routing after the first paint.
 *
 * Also emits sitemap.xml, rss.xml and robots.txt.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = path.join(root, 'dist', 'client')
const serverEntry = path.join(root, 'dist', 'server', 'entry-server.js')

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** Rewrite root-relative asset paths in article HTML to absolute URLs for feed readers. */
const absolutise = (html, base) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${base}/`)

function outputPathFor(route) {
  if (route === '/') return path.join(clientDir, 'index.html')
  if (route === '/404') return path.join(clientDir, '404.html')
  return path.join(clientDir, route.replace(/^\//, ''), 'index.html')
}

async function main() {
  const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf8')

  if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
    throw new Error('index.html is missing the <!--app-html--> / <!--app-head--> markers')
  }

  // The template carries a placeholder <title> for `npm run dev`; drop it so each
  // prerendered page ends up with exactly one.
  const base = template.replace(/[ \t]*<title>[\s\S]*?<\/title>\n?/, '')

  const mod = await import(pathToFileURL(serverEntry).href)
  const { render, allRoutes, posts, publications, projects, site } = mod

  const routes = allRoutes()
  const written = []

  for (const route of routes) {
    const { html, head } = render(route)
    const page = base.replace('<!--app-head-->', head).replace('<!--app-html-->', html)

    const file = outputPathFor(route)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, page, 'utf8')
    written.push({ route, file: path.relative(clientDir, file), bytes: Buffer.byteLength(page) })
  }

  await writeSitemap(routes, site, { posts, publications, projects })
  await writeRss(posts, site)
  await writeRobots(site)

  const total = written.reduce((sum, entry) => sum + entry.bytes, 0)
  console.log(`\n  prerendered ${written.length} routes (${(total / 1024).toFixed(0)} kB of HTML)\n`)
  for (const entry of written) {
    console.log(`    ${entry.route.padEnd(34)} → ${entry.file}`)
  }
  console.log('\n    sitemap.xml · rss.xml · robots.txt\n')
}

async function writeSitemap(routes, site, content) {
  const lastmodFor = (route) => {
    const all = [...content.posts, ...content.publications, ...content.projects]
    const match = all.find((item) => item.href === route)
    return match?.updated || match?.date || undefined
  }

  const priorityFor = (route) => {
    if (route === '/') return '1.0'
    if (route.split('/').length === 2) return '0.8'
    return '0.6'
  }

  const urls = routes
    .filter((route) => route !== '/404')
    .map((route) => {
      const lastmod = lastmodFor(route)
      return [
        '  <url>',
        `    <loc>${site.url}${route === '/' ? '/' : route}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
        `    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>`,
        `    <priority>${priorityFor(route)}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  await fs.writeFile(path.join(clientDir, 'sitemap.xml'), xml, 'utf8')
}

async function writeRss(posts, site) {
  const items = posts
    .map((post) => {
      const link = `${site.url}${post.href}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.tldr || post.excerpt)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
      <content:encoded><![CDATA[${absolutise(post.html, site.url)}]]></content:encoded>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(site.name)} — Writing</title>
    <link>${site.url}/writing</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on distributed systems, language models and information retrieval.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
  await fs.writeFile(path.join(clientDir, 'rss.xml'), xml, 'utf8')
}

async function writeRobots(site) {
  const text = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`
  await fs.writeFile(path.join(clientDir, 'robots.txt'), text, 'utf8')
}

main().catch((error) => {
  console.error('\n  prerender failed:', error)
  process.exit(1)
})
