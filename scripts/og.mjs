/**
 * Generates one 1200x630 social card per route.
 *
 * Runs after the prerender, using the same card descriptions the meta tags are
 * built from, so the image and the <meta> can never disagree. Rendering is
 * satori (JSX-ish tree -> SVG) plus resvg-wasm (SVG -> PNG): both are pure
 * JS/WASM, so the Cloudflare build image needs no native toolchain.
 *
 * Failure here is non-fatal — a missing card costs a nicer link preview, and
 * that is not worth failing a deploy over.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import satori from 'satori'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'dist', 'client', 'og')
const serverEntry = path.join(root, 'dist', 'server', 'entry-server.js')

const C = {
  paper: '#f2f4f7',
  surface: '#ffffff',
  ink: '#0b0d10',
  ink2: '#333a44',
  ink3: '#525c68',
  ink4: '#5e6977',
  rule: '#dbe0e7',
  accent: '#1257d1',
  ok: '#0e7a43',
}

const el = (type, style, children) => ({ type, props: { style, children } })
const row = (style, children) => el('div', { display: 'flex', alignItems: 'center', ...style }, children)
const col = (style, children) => el('div', { display: 'flex', flexDirection: 'column', ...style }, children)

/** Title size steps down as the title gets longer, so it always fills the card. */
function titleSize(text) {
  const n = text.length
  if (n < 32) return 76
  if (n < 60) return 62
  if (n < 100) return 50
  if (n < 150) return 42
  return 36
}

/**
 * One powerline segment. The chevron is a CSS triangle, and it has to live
 * outside the coloured box — a wrapper with the same background would paint
 * behind the triangle and flatten it back into a rectangle.
 */
function segment(text, { bg, fg, mono = true }) {
  return row({}, [
    el(
      'div',
      {
        display: 'flex',
        alignItems: 'center',
        height: 46,
        background: bg,
        paddingLeft: 20,
        paddingRight: 14,
        fontFamily: mono ? 'JetBrains Mono' : 'Inter',
        fontSize: 22,
        color: fg,
      },
      text,
    ),
    el('div', {
      display: 'flex',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderTopWidth: 23,
      borderBottomWidth: 23,
      borderLeftWidth: 16,
      borderRightWidth: 0,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: bg,
      borderRightColor: 'transparent',
    }),
  ])
}

function card({ tag, eyebrow, badge, title, lines = [], footer }) {
  return col(
    {
      width: 1200,
      height: 630,
      background: C.paper,
      fontFamily: 'Inter',
    },
    [
      // Accent rule across the top.
      el('div', { display: 'flex', width: 1200, height: 8, background: C.accent }),

      col({ flexGrow: 1, padding: '54px 64px 46px 64px' }, [
        row({ justifyContent: 'space-between' }, [
          row({}, [
            segment(tag, { bg: C.ink, fg: C.paper }),
            el('div', { display: 'flex', marginLeft: -16 }, [
              segment(eyebrow, { bg: C.accent, fg: '#ffffff' }),
            ]),
          ]),
          badge
            ? el(
                'div',
                {
                  display: 'flex',
                  padding: '9px 18px',
                  borderRadius: 999,
                  background: '#e7f6ed',
                  color: C.ok,
                  fontFamily: 'JetBrains Mono',
                  fontSize: 20,
                },
                badge.toUpperCase(),
              )
            : el('div', { display: 'flex' }, ''),
        ]),

        col({ flexGrow: 1, justifyContent: 'center', paddingTop: 24, paddingBottom: 24 }, [
          el(
            'div',
            {
              display: 'flex',
              fontSize: titleSize(title),
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: C.ink,
            },
            title,
          ),
          ...lines.filter(Boolean).map((line, i) =>
            el(
              'div',
              {
                display: 'flex',
                marginTop: i === 0 ? 26 : 10,
                fontSize: 25,
                lineHeight: 1.4,
                color: i === 0 ? C.ink2 : C.ink3,
              },
              line,
            ),
          ),
        ]),

        el('div', { display: 'flex', width: '100%', height: 1, background: C.rule }),

        row({ justifyContent: 'space-between', paddingTop: 26 }, [
          row({ flexShrink: 1, overflow: 'hidden' }, [
            el(
              'div',
              {
                display: 'flex',
                flexShrink: 0,
                width: 42,
                height: 42,
                borderRadius: 8,
                background: C.ink,
                color: C.paper,
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono',
                fontSize: 20,
              },
              'dl',
            ),
            el(
              'div',
              { display: 'flex', marginLeft: 16, fontSize: 24, fontWeight: 600, color: C.ink },
              'Diego Lopes',
            ),
            el(
              'div',
              { display: 'flex', marginLeft: 14, fontSize: 22, color: C.ink4, whiteSpace: 'nowrap' },
              'datafromlopes.com',
            ),
          ]),
          footer
            ? el(
                'div',
                {
                  display: 'flex',
                  flexShrink: 0,
                  marginLeft: 24,
                  whiteSpace: 'nowrap',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 20,
                  color: C.ink4,
                },
                footer.length > 46 ? `${footer.slice(0, 45)}…` : footer,
              )
            : el('div', { display: 'flex' }, ''),
        ]),
      ]),
    ],
  )
}

async function main() {
  const fontDir = path.join(root, 'assets', 'fonts')
  const fonts = [
    {
      name: 'Inter',
      data: await fs.readFile(path.join(fontDir, 'Inter-Regular.woff')),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: await fs.readFile(path.join(fontDir, 'Inter-SemiBold.woff')),
      weight: 600,
      style: 'normal',
    },
    {
      name: 'JetBrains Mono',
      data: await fs.readFile(path.join(fontDir, 'JetBrainsMono-Regular.ttf')),
      weight: 400,
      style: 'normal',
    },
  ]

  await initWasm(await fs.readFile(require.resolve('@resvg/resvg-wasm/index_bg.wasm')))

  const { allRoutes, ogCard, ogSlug } = await import(pathToFileURL(serverEntry).href)
  await fs.mkdir(outDir, { recursive: true })

  let total = 0
  for (const route of allRoutes()) {
    const svg = await satori(card(ogCard(route)), { width: 1200, height: 630, fonts })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
    const file = path.join(outDir, `${ogSlug(route)}.png`)
    await fs.writeFile(file, png)
    total += png.length
    console.log(`    ${route.padEnd(34)} → og/${ogSlug(route)}.png  ${(png.length / 1024).toFixed(0)} kB`)
  }

  console.log(`\n  generated social cards (${(total / 1024).toFixed(0)} kB total)\n`)
}

main().catch((error) => {
  // A missing card degrades the link preview; it should not fail the deploy.
  console.warn('\n  social card generation skipped:', error?.message ?? error, '\n')
})
