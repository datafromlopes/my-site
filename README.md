# datafromlopes.com

Personal site of **Diego Lopes** — Lead Data Engineer & NLP Researcher.

React 19 + TypeScript + Tailwind v4, prerendered to static HTML at build time and
served from Cloudflare Workers.

---

## How it works

Markdown under `src/content/` is compiled to HTML **at build time** (math, syntax
highlighting, numbered figures, table of contents) by a small Vite plugin. Every
route is then rendered to a real `.html` file. The browser never downloads a
markdown parser, crawlers get complete markup, and React hydrates the page for
client-side navigation, the ⌘K palette and the theme toggle.

```
npm run build
  ├── build:client   vite build            → dist/client  (assets + template)
  ├── build:server   vite build --ssr      → dist/server  (render function)
  └── prerender      node scripts/prerender.mjs
                     → one index.html per route
                     → sitemap.xml, rss.xml, robots.txt
```

A Cloudflare Worker sits in front of the static assets to 301 the URLs the old
Hugo site used, set security headers, and proxy newsletter sign-ups to MailerLite
so no third-party script runs in the page.

---

## Local development

```bash
npm install
npm run dev          # vite dev server, hot reload — http://localhost:5173
npm run build        # full production build into dist/
npm run preview      # build + run the real worker locally (wrangler dev)
npm run typecheck    # tsc over src/ and worker/
npm run format       # prettier over the whole tree
```

`npm run dev` serves a single-page app with client-side routing — fast to iterate
in, but it does not run the Worker or the prerenderer. Use `npm run preview` to
see exactly what production serves: prerendered HTML per route, the legacy 301s,
security headers and `/api/subscribe`.

---

## Deploying on Cloudflare Workers

Connect this GitHub repository in the Cloudflare dashboard
(**Workers & Pages → Create → Workers → Connect to Git**) and set:

| Field | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Everything else comes from `wrangler.toml`. Pushing to `main` builds and deploys.

To deploy by hand instead: `npm run deploy`.

### Newsletter configuration

`POST /api/subscribe` is handled by the Worker. It has two paths:

1. **Official API** — used when the `MAILERLITE_API_KEY` secret is set. Preferred:
   it returns real errors and handles "already subscribed" gracefully.
   ```bash
   npx wrangler secret put MAILERLITE_API_KEY
   # optional, to file subscribers into a specific group:
   npx wrangler secret put MAILERLITE_GROUP_ID
   ```
2. **Public form endpoint** — the fallback, using the `MAILERLITE_ACCOUNT` and
   `MAILERLITE_FORM` values in `wrangler.toml` (account `2139800`, form `0ZWAxD`).
   No secret required, so sign-ups keep working even without the API key.

---

## Adding content

Everything is markdown with YAML front matter. Drop a file in the right folder and
it appears in the listings, the sitemap, the ⌘K index and (for writing) the RSS
feed. No registration step.

### A note — `src/content/writing/<slug>.md`

```yaml
---
title: 'Title of the note'
date: 2026-08-24
updated: 2026-08-24      # optional
featured: true           # optional
cover: /media/writing/cover.png   # optional
tldr: One or two sentences shown in listings and as the meta description.
tags: [distributed systems, NLP]
---

Body in markdown.
```

### A publication — `src/content/publications/<slug>.md`

```yaml
---
title: 'Paper title'
date: 2026-10-01
year: 2026
type: conference        # conference | journal | workshop | preprint | thesis
status: accepted        # published | accepted | under-review
authors:
  - name: Diego Lopes
    me: true            # renders your name emphasised
  - name: Co Author
    url: https://…
venue: Full venue name
venueShort: ABBR 2026
publisher: …
location: City, Country
doi: 10.5753/…          # omit until assigned
pdfUrl: https://…       # omit until available
codeUrl: https://…
abstract: >-
  Full abstract.
tags: [text-to-SQL, dataset]
bibtex: |
  @inproceedings{key2026,
    …
  }
---

Optional notes, rendered under the record.
```

### A system — `src/content/projects/<slug>.md`

```yaml
---
title: Project title
subtitle: One line of context
date: 2025-12-01
start: '2024-01'
end: '2025-01'          # null for ongoing work
status: shipped         # shipped | ongoing
featured: true
order: 1                # controls listing order, ascending
org: Company or Lab
orgType: industry       # industry | academic
orgUrl: https://…
role: What you did
cover: /media/projects/cover.png
repo: https://github.com/…
tldr: The one-sentence version.
stack: [Cassandra, Python]
tags: [distributed systems]
metrics:                # four reads best in the card grid
  - value: 1.46B+
    label: Writes served
---
```

### Markdown notes

- **Display math** must use the fenced form — `$$` alone on its own line, the
  expression on the lines between. Single-line `$$x$$` renders *inline*.
  Inline math uses single dollars: `$x^2$`.
- **Images** get wrapped in a numbered `<figure>` automatically; the alt text
  becomes the caption. Reference them as `/media/...` (files live in `public/`).
- **Code blocks** are highlighted at build time with Shiki, in both themes.

---

## Structure

```
src/
  content/          markdown — writing, publications, projects
  data/             structured facts: profile, roles, education, stack
  components/       UI, all Tailwind + local tokens
  pages/            one file per route
  lib/              content registry, metadata, formatting, hooks
  styles/index.css  design tokens, prose styles, print styles
plugins/markdown.mjs  markdown → HTML at build time
scripts/prerender.mjs static rendering, sitemap, RSS
worker/index.ts       redirects, security headers, newsletter proxy
public/media/         images, self-hosted icons
```

Facts that appear in more than one place — roles, education, metrics — live in
`src/data/career.ts`, so the CV, the home page and the JSON-LD never disagree.

---

## Licence

Code under the repository licence. Written content and images © Diego Lopes.
