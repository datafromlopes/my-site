import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ArticleNav } from '@/components/ArticleNav'
import { Clock } from '@/components/Icons'
import { Newsletter } from '@/components/Newsletter'
import { PathCrumb } from '@/components/PathCrumb'
import { Prose } from '@/components/Prose'
import { ReadingProgress } from '@/components/ReadingProgress'
import { Toc } from '@/components/Toc'
import { Container, CopyButton, Reveal, Tag } from '@/components/ui'
import { site } from '@/data/site'
import { findPost, posts } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { NotFound } from './NotFound'

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? findPost(slug) : undefined
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (post) setUrl(`${site.url}${post.href}`)
  }, [post])

  if (!post) return <NotFound />

  const index = posts.findIndex((p) => p.slug === post.slug)
  const previous = posts[index + 1]
  const next = posts[index - 1]

  return (
    <>
      <ReadingProgress />

      <article>
        <Container className="pt-12">
          <PathCrumb segments={[{ label: 'writing', href: '/writing' }, { label: post.slug }]} />

          <header className="mt-8 border-b border-rule pb-10">
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <time dateTime={post.date} className="label">
                {formatDate(post.date)}
              </time>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-4">
                <Clock size={11} /> {post.readingTime} min read
              </span>
              {post.updated && post.updated !== post.date ? (
                <span className="label">Updated {formatDate(post.updated)}</span>
              ) : null}
            </div>

            <h1 className="display max-w-3xl text-[clamp(2rem,5vw,3.25rem)] text-ink">{post.title}</h1>

            {post.tldr ? (
              <p className="mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-ink-2">{post.tldr}</p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Tag key={tag} to={`/writing?tag=${encodeURIComponent(tag)}`}>
                    {tag}
                  </Tag>
                ))}
              </div>
              <CopyButton value={url} label="Copy link" copiedLabel="Link copied" className="no-print" />
            </div>
          </header>
        </Container>

        <Container className="pt-12">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="min-w-0 max-w-[46rem]">
              <Prose html={post.html} />

              <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-4">
                  Written by {site.name}
                </p>
                <CopyButton value={url} label="Copy link" copiedLabel="Link copied" className="no-print" />
              </div>

              <ArticleNav
                previous={previous ? { href: previous.href, title: previous.title } : undefined}
                next={next ? { href: next.href, title: next.title } : undefined}
                label="More writing"
              />
            </div>

            <Toc entries={post.toc} />
          </div>
        </Container>

        <Container className="no-print pt-20">
          <Reveal>
            <Newsletter compact />
          </Reveal>
        </Container>
      </article>
    </>
  )
}
