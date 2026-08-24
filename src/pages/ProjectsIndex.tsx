import { useMemo } from 'react'
import { ProjectCard } from '@/components/cards'
import { MetricStrip } from '@/components/Metrics'
import { PageHeader, PageMeta } from '@/components/PageHeader'
import { Container, EmptyState, Reveal, Tag } from '@/components/ui'
import { metrics } from '@/data/career'
import { projects } from '@/lib/content'
import { useTagFilter } from '@/lib/useTagFilter'

export function ProjectsIndex() {
  const { tag, select } = useTagFilter()

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const project of projects) for (const t of project.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [])

  const visible = tag ? projects.filter((p) => p.tags.includes(tag)) : projects
  const ongoing = projects.filter((p) => p.status === 'ongoing').length

  return (
    <>
      <PageHeader
        eyebrow="projects"
        title="Projects"
        lede="Engineering and research work where the constraint was real — a latency budget, a cost ceiling, an SLA someone was paged for. Each entry documents the decision, not just the outcome."
        meta={
          <>
            <PageMeta label="Entries" value={projects.length} />
            <PageMeta label="Ongoing" value={ongoing} />
            <PageMeta label="Domains" value="Storage · NLP · HPC" />
          </>
        }
      />

      <Container className="pt-12">
        <Reveal>
          <MetricStrip metrics={metrics} className="mb-12" />
        </Reveal>

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
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((project, index) => (
              <Reveal key={project.slug} delay={index * 70} className="h-full">
                <ProjectCard project={project} index={index} level={2} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
