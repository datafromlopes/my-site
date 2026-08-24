/**
 * Vite plugin: compiles `.md` files into ES modules.
 *
 * Each module exports:
 *   frontmatter — parsed YAML front matter
 *   html        — rendered HTML (math, code highlighting and figures resolved at build time)
 *   toc         — [{ id, text, depth }] for h2/h3
 *   readingTime — minutes, rounded up
 *   excerpt     — first paragraph as plain text
 *
 * Everything runs at build time so the browser never ships a markdown parser.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypeShiki from '@shikijs/rehype'
import { visit } from 'unist-util-visit'

const WORDS_PER_MINUTE = 210

/** Collect h2/h3 headings into a flat table of contents. */
function rehypeCollectToc(toc) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return
      const id = node.properties?.id
      if (!id) return
      toc.push({ id: String(id), text: textOf(node), depth: node.tagName === 'h2' ? 2 : 3 })
    })
  }
}

/** Add a permalink anchor to every headed section. */
function rehypeHeadingAnchors() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!/^h[2-4]$/.test(node.tagName)) return
      const id = node.properties?.id
      if (!id) return
      node.properties.className = [...(node.properties.className ?? []), 'md-heading']
      node.children.unshift({
        type: 'element',
        tagName: 'a',
        properties: { href: `#${id}`, className: ['md-anchor'], 'aria-hidden': 'true', tabIndex: -1 },
        children: [{ type: 'text', value: '#' }],
      })
    })
  }
}

/**
 * Turn image-only paragraphs into numbered <figure> elements — the caption
 * convention used in papers, which is the register this site is written in.
 */
function rehypeFigures() {
  return (tree) => {
    let n = 0
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'p') return
      const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()))
      if (kids.length !== 1 || kids[0].type !== 'element' || kids[0].tagName !== 'img') return

      const img = kids[0]
      n += 1
      img.properties = { ...img.properties, loading: 'lazy', decoding: 'async' }
      const alt = String(img.properties.alt ?? '').trim()
      const caption = alt && !/\.(png|jpe?g|svg|webp|gif)$/i.test(alt) ? alt : ''

      node.tagName = 'figure'
      node.properties = { className: ['md-figure'] }
      node.children = [
        img,
        {
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['md-figure-label'] },
              children: [{ type: 'text', value: `Fig. ${n}` }],
            },
            ...(caption ? [{ type: 'text', value: ` — ${caption}` }] : []),
          ],
        },
      ]
    })
  }
}

/** External links open in a new tab and never leak the referrer window. */
function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = String(node.properties?.href ?? '')
      if (!/^https?:\/\//.test(href)) return
      node.properties.target = '_blank'
      node.properties.rel = 'noopener noreferrer'
      node.properties.className = [...(node.properties.className ?? []), 'md-external']
    })
  }
}

function textOf(node) {
  if (node.type === 'text') return node.value
  if (!node.children) return ''
  return node.children.map(textOf).join('')
}

const shikiOptions = {
  themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
  defaultColor: false,
  cssVariablePrefix: '--sh-',
  fallbackLanguage: 'text',
}

export async function renderMarkdown(source) {
  const { data: frontmatter, content } = matter(source)
  const toc = []

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeCollectToc, toc)
    .use(rehypeHeadingAnchors)
    .use(rehypeKatex, { strict: false, throwOnError: false, output: 'html' })
    .use(rehypeShiki, shikiOptions)
    .use(rehypeFigures)
    .use(rehypeExternalLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  const html = String(file)
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_`|-]/g, ' ')

  const words = plain.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.round(words / WORDS_PER_MINUTE))

  const excerpt = (
    plain
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .find((s) => s.length > 60) ?? ''
  )
    .replace(/\s+/g, ' ')
    .slice(0, 260)

  return { frontmatter, html, toc, readingTime, excerpt, words, plain: plain.replace(/\s+/g, ' ').trim() }
}

export default function markdown() {
  return {
    name: 'datafromlopes:markdown',
    enforce: 'pre',

    async transform(_code, id) {
      if (!id.endsWith('.md')) return null
      const source = await fs.readFile(id, 'utf8')
      const result = await renderMarkdown(source)
      const slug = path.basename(id, '.md')

      return {
        code: [
          `export const slug = ${JSON.stringify(slug)};`,
          `export const frontmatter = ${JSON.stringify(result.frontmatter)};`,
          `export const html = ${JSON.stringify(result.html)};`,
          `export const toc = ${JSON.stringify(result.toc)};`,
          `export const readingTime = ${result.readingTime};`,
          `export const excerpt = ${JSON.stringify(result.excerpt)};`,
          `export const searchText = ${JSON.stringify(result.plain.slice(0, 4000))};`,
          `export default { slug, frontmatter, html, toc, readingTime, excerpt, searchText };`,
        ].join('\n'),
        map: null,
      }
    },

    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.md')) return
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
