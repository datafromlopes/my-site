import { useState } from 'react'
import { Link } from 'react-router'
import type { Post, Project, Publication } from '@/lib/content'
import { citation, cn, formatDate, formatMonth } from '@/lib/format'
import { ArrowUpRight, Check, Clock, Document, GitHub, Quote } from './Icons'
import { ArrowLink, CopyButton, LiveBadge, Pill, Tag } from './ui'

/* --------------------------------------------------------------- projects */

export function ProjectCard({
  project,
  index,
  level = 3,
}: {
  project: Project
  index: number
  /** 2 on index pages where the card is a top-level entry, 3 under a section heading. */
  level?: 2 | 3
}) {
  const Heading = level === 2 ? 'h2' : 'h3'

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <Link to={project.href} className="absolute inset-0 z-10" aria-label={project.title}>
        <span className="sr-only">{project.title}</span>
      </Link>

      <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface-2 px-6 py-3.5">
        <span className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-4">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="h-3 w-px bg-rule" />
          <span className="text-ink-3">{project.org}</span>
        </span>
        {project.status === 'ongoing' ? (
          <LiveBadge>Ongoing</LiveBadge>
        ) : (
          <Pill>{formatMonth(project.end)}</Pill>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Heading className="display text-[1.375rem] leading-tight text-ink transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </Heading>

        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-3">{project.tldr}</p>

        {project.metrics.length ? (
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-rule py-4">
            {project.metrics.slice(0, 4).map((metric) => (
              <div key={metric.label}>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
                  {metric.label}
                </dt>
                <dd className="mt-0.5 font-mono text-[0.9375rem] text-ink tabular-nums">{metric.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((item) => (
            <Tag key={item} hash={false}>
              {item}
            </Tag>
          ))}
          {project.stack.length > 4 ? <Tag hash={false}>+{project.stack.length - 4}</Tag> : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <ArrowLink href={project.href}>Case study</ArrowLink>
          {project.repo ? (
            <span className="relative z-20">
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source on GitHub"
                className="text-ink-4 transition-colors hover:text-ink"
              >
                <GitHub size={16} />
              </a>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/* ----------------------------------------------------------- publications */

const TYPE_LABEL: Record<Publication['type'], string> = {
  conference: 'Conference paper',
  journal: 'Journal article',
  workshop: 'Workshop paper',
  preprint: 'Preprint',
  thesis: 'Thesis',
}

export function PublicationEntry({
  publication,
  compact = false,
}: {
  publication: Publication
  compact?: boolean
}) {
  const [showBibtex, setShowBibtex] = useState(false)

  return (
    <article className="group relative border-b border-rule py-7 first:pt-0 last:border-0">
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Pill tone="accent">{TYPE_LABEL[publication.type]}</Pill>
        {publication.status === 'accepted' ? <Pill tone="mark">Accepted</Pill> : null}
        {publication.status === 'under-review' ? <Pill>Under review</Pill> : null}
        <span className="font-mono text-[0.6875rem] text-ink-4">{publication.year}</span>
      </div>

      <h3 className={cn('display text-ink', compact ? 'text-[1.25rem]' : 'text-[1.5rem] leading-snug')}>
        <Link to={publication.href} className="transition-colors duration-300 hover:text-accent">
          {publication.title}
        </Link>
      </h3>

      <p className="mt-2.5 text-[0.9375rem] text-ink-2">
        {publication.authors.map((author, i) => (
          <span key={author.name}>
            {i > 0 ? <span className="text-ink-4">, </span> : null}
            {author.me ? (
              <span className="font-semibold text-ink underline decoration-mark decoration-1 underline-offset-4">
                {author.name}
              </span>
            ) : author.url ? (
              <a
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {author.name}
              </a>
            ) : (
              author.name
            )}
          </span>
        ))}
      </p>

      <p className="mt-1.5 text-[0.875rem] text-ink-3">
        <em className="italic">{publication.venue}</em>
        {publication.venueShort ? <span className="text-ink-4"> · {publication.venueShort}</span> : null}
        {publication.location ? <span className="text-ink-4"> · {publication.location}</span> : null}
      </p>

      {!compact && publication.tldr ? (
        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-3">{publication.tldr}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <PubAction href={publication.href} internal>
          <Document size={12} /> Details
        </PubAction>
        {publication.pdfUrl ? (
          <PubAction href={publication.pdfUrl}>
            <Document size={12} /> PDF
          </PubAction>
        ) : null}
        {publication.doi ? (
          <PubAction href={`https://doi.org/${publication.doi}`}>
            <ArrowUpRight size={12} /> DOI
          </PubAction>
        ) : null}
        {publication.codeUrl ? (
          <PubAction href={publication.codeUrl}>
            <GitHub size={12} /> Code
          </PubAction>
        ) : null}
        {publication.bibtex ? (
          <button
            type="button"
            onClick={() => setShowBibtex((v) => !v)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1',
              'font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors',
              showBibtex
                ? 'border-accent-line bg-accent-soft text-accent'
                : 'border-rule bg-surface text-ink-2 hover:border-accent-line hover:bg-accent-soft hover:text-accent',
            )}
            aria-expanded={showBibtex}
          >
            <Quote size={12} /> BibTeX
          </button>
        ) : null}
      </div>

      {showBibtex && publication.bibtex ? (
        <div className="mt-4 overflow-hidden rounded-md border border-rule bg-sunken">
          <div className="flex items-center justify-between border-b border-rule px-4 py-2">
            <span className="label text-[0.625rem]">Citation</span>
            <div className="flex gap-2">
              <CopyButton value={citation(publication)} label="APA" copiedLabel="Copied" />
              <CopyButton value={publication.bibtex} label="BibTeX" copiedLabel="Copied" />
            </div>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[0.75rem] leading-relaxed text-ink-2">
            <code>{publication.bibtex}</code>
          </pre>
        </div>
      ) : null}
    </article>
  )
}

function PubAction({
  href,
  children,
  internal,
}: {
  href: string
  children: React.ReactNode
  internal?: boolean
}) {
  const className =
    'inline-flex items-center gap-1.5 rounded-md border border-rule bg-surface px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-2 transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent'

  return internal ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

/* -------------------------------------------------------------- writing */

export function PostRow({ post, level = 3 }: { post: Post; level?: 2 | 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3'

  // The title carries the link rather than the whole row, so the tags below can
  // be links of their own without nesting anchors.
  return (
    <article className="group relative px-5 py-6 transition-colors hover:bg-surface-2/60 sm:px-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
        <time
          dateTime={post.date}
          className="w-28 shrink-0 pt-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-4"
        >
          {formatDate(post.date)}
        </time>

        <div className="min-w-0 flex-1">
          <Heading className="display text-[1.25rem] leading-snug text-ink">
            <Link to={post.href} className="transition-colors duration-200 group-hover:text-accent">
              {post.title}
            </Link>
          </Heading>

          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-3">{post.tldr}</p>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-4">
              <Clock size={11} /> {post.readingTime} min
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} to={`/writing?tag=${encodeURIComponent(tag)}`}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <ArrowUpRight
          size={16}
          className="hidden shrink-0 self-start text-ink-4 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent sm:block"
        />
      </div>
    </article>
  )
}

/* --------------------------------------------------------------- status */

export function StatusRow({
  when,
  what,
  where,
  href,
  live,
}: {
  when: string
  what: string
  where: string
  href?: string
  live?: boolean
}) {
  const body = (
    <>
      <span className="w-28 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-4">
        {when}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] text-ink">{what}</span>
        <span className="mt-0.5 block text-[0.8125rem] text-ink-3">{where}</span>
      </span>
      {live ? <Check size={14} className="mt-1 shrink-0 text-ok" /> : null}
    </>
  )

  return (
    <li>
      {href ? (
        <Link
          to={href}
          className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2/60 sm:px-6"
        >
          {body}
        </Link>
      ) : (
        <div className="flex items-start gap-4 px-5 py-4 sm:px-6">{body}</div>
      )}
    </li>
  )
}
