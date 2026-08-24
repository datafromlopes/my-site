import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { resolveMeta } from '@/lib/meta'
import { Footer } from './Footer'
import { Header } from './Header'

/** Keeps <head> in sync on soft navigation; the prerendered HTML sets it first. */
function useDocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = resolveMeta(pathname)
    document.title = meta.title

    const set = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    set('meta[name="description"]', 'content', meta.description)
    set('meta[property="og:title"]', 'content', meta.title)
    set('meta[property="og:description"]', 'content', meta.description)
    set('meta[property="og:url"]', 'content', meta.canonical)
    set('meta[property="og:image"]', 'content', meta.image)
    set('meta[property="og:type"]', 'content', meta.type)
    set('meta[name="twitter:title"]', 'content', meta.title)
    set('meta[name="twitter:description"]', 'content', meta.description)
    set('meta[name="twitter:image"]', 'content', meta.image)
    set('link[rel="canonical"]', 'href', meta.canonical)
  }, [pathname])
}

/** Top of page on route change, but never fights an in-page anchor. */
function useScrollReset() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
}

export function Layout() {
  useDocumentMeta()
  useScrollReset()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
