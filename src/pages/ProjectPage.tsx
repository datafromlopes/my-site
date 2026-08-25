import { useParams } from 'react-router'
import { ArticleNav } from '@/components/ArticleNav'
import { ArrowUpRight, GitHub } from '@/components/Icons'
import { PathCrumb } from '@/components/PathCrumb'
import { Prose } from '@/components/Prose'
import { Toc } from '@/components/Toc'
import { Button, Container, LiveBadge, Pill, Tag } from '@/components/ui'
import { findProject, projects } from '@/lib/content'
import { duration, formatMonth } from '@/lib/format'
import { NotFound } from './NotFound'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? findProject(slug) : undefined

  if (!project) return <NotFound />

  const index = projects.findIndex((p) => p.slug === project.slug)
  const previous = projects[index - 1]
  const next = projects[index + 1]

  return (
    <article>
      <Container className="pt-12">
        <PathCrumb segments={[{ label: 'projects', href: '/projects' }, { label: project.slug }]} />

        <header className="mt-8 border-b border-rule pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            {project.orgUrl ? (
              <a href={project.orgUrl} target="_blank" rel="noopener noreferrer">
                <Pill tone="accent">
                  {project.org} <ArrowUpRight size={10} />
                </Pill>
              </a>
            ) : (
              <Pill tone="accent">{project.org}</Pill>
            )}
            {project.status === 'ongoing' ? <LiveBadge>Ongoing</LiveBadge> : <Pill>Delivered</Pill>}
            <span className="font-mono text-[0.6875rem] text-ink-4">
              {formatMonth(project.start)} — {formatMonth(project.end)} ·{' '}
              {duration(project.start, project.end)}
            </span>
          </div>

          <h1 className="display max-w-3xl text-[clamp(2rem,4.8vw,3.25rem)] text-ink">{project.title}</h1>

          {project.subtitle ? (
            <p className="mt-4 max-w-2xl text-[1.125rem] italic leading-relaxed text-ink-3">
              {project.subtitle}
            </p>
          ) : null}

          {project.role ? (
            <p className="mt-5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-4">
              {project.role}
            </p>
          ) : null}

          {project.repo ? (
            <div className="no-print mt-8">
              <Button href={project.repo} variant="outline">
                <GitHub size={14} /> Source
              </Button>
            </div>
          ) : null}
        </header>
      </Container>

      <Container className="pt-10">
        {/* Metrics */}
        {project.metrics.length ? (
          <dl className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule lg:grid-cols-4">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-surface px-5 py-6">
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
                  {metric.label}
                </dt>
                <dd className="mt-2 font-mono text-[1.375rem] leading-none text-ink tabular-nums">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="min-w-0 max-w-[46rem]">
            {project.tldr ? (
              <p className="mb-10 border-l-2 border-accent pl-5 text-[1.125rem] leading-relaxed text-ink-2">
                {project.tldr}
              </p>
            ) : null}

            <div className="card px-6 py-8 sm:px-9 sm:py-10">
              <Prose html={project.html} />
            </div>

            <div className="mt-14 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2">
              <div>
                <p className="label mb-3">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <Tag key={item} hash={false}>
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <p className="label mb-3">Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Tag key={tag} to={`/projects?tag=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <ArticleNav
              previous={previous ? { href: previous.href, title: previous.title } : undefined}
              next={next ? { href: next.href, title: next.title } : undefined}
              label="More systems"
            />
          </div>

          <Toc entries={project.toc} />
        </div>
      </Container>
    </article>
  )
}
