import { useMemo } from 'react'
import { PostRow } from '@/components/cards'
import { Newsletter } from '@/components/Newsletter'
import { PageHeader, PageMeta } from '@/components/PageHeader'
import { Container, EmptyState, Reveal, Tag } from '@/components/ui'
import { posts } from '@/lib/content'
import { useTagFilter } from '@/lib/useTagFilter'

export function WritingIndex() {
  const { tag, select } = useTagFilter()

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const post of posts) for (const t of post.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [])

  const visible = tag ? posts.filter((p) => p.tags.includes(tag)) : posts
  const totalMinutes = posts.reduce((sum, post) => sum + post.readingTime, 0)

  return (
    <>
      <PageHeader
        eyebrow="posts"
        title="Posts"
        lede="Notes on distributed systems, language models and information retrieval — written when a topic turns out to be harder to explain than to implement."
        meta={
          <>
            <PageMeta label="Notes" value={posts.length} />
            <PageMeta label="Total read" value={`${totalMinutes} min`} />
            <PageMeta
              label="Feed"
              value={
                <a href="/rss.xml" className="link-rule">
                  RSS
                </a>
              }
            />
          </>
        }
      />

      <Container className="pt-10">
        {tags.length > 1 ? (
          <Reveal>
            <div className="mb-6 flex flex-wrap items-center gap-1.5">
              <span className="label mr-2">Filter</span>
              <Tag onClick={() => select(null)} active={tag === null}>
                all
              </Tag>
              {tags.map(([name, count]) => (
                <Tag key={name} onClick={() => select(name)} active={tag === name} count={count}>
                  {name}
                </Tag>
              ))}
            </div>
          </Reveal>
        ) : null}

        {visible.length === 0 ? (
          <EmptyState>Nothing under this tag yet</EmptyState>
        ) : (
          <Reveal>
            <div className="card divide-y divide-rule overflow-hidden">
              {visible.map((post) => (
                <PostRow key={post.slug} post={post} level={2} />
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className="pt-20">
          <Newsletter />
        </Reveal>
      </Container>
    </>
  )
}
