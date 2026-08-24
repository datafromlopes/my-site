/// <reference types="vite/client" />

declare module '*.md' {
  export const slug: string
  export const frontmatter: Record<string, unknown>
  export const html: string
  export const toc: { id: string; text: string; depth: number }[]
  export const readingTime: number
  export const excerpt: string
  export const searchText: string
  const mod: {
    slug: string
    frontmatter: Record<string, unknown>
    html: string
    toc: { id: string; text: string; depth: number }[]
    readingTime: number
    excerpt: string
    searchText: string
  }
  export default mod
}

/** Injected by vite.config.ts — the day the bundle was built (YYYY-MM-DD). */
declare const __BUILD_DATE__: string
