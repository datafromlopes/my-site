import { useParams } from 'react-router'
import { ArticleNav } from '@/components/ArticleNav'
import { ArrowUpRight, Database, Document, GitHub, HuggingFace } from '@/components/Icons'
import { PathCrumb } from '@/components/PathCrumb'
import { Prose } from '@/components/Prose'
import { Toc } from '@/components/Toc'
import { Button, Container, CopyButton, Pill, Reveal, Tag } from '@/components/ui'
import { findPublication, publications } from '@/lib/content'
import { citation, cn, formatDate } from '@/lib/format'
import { NotFound } from './NotFound'

const TYPE_LABEL: Record<string, string> = {
  conference: 'Conference paper',
  journal: 'Journal article',
  workshop: 'Workshop paper',
  preprint: 'Preprint',
  thesis: 'Thesis',
}

export function PublicationPage() {
  const { slug } = useParams<{ slug: string }>()
  const publication = slug ? findPublication(slug) : undefined

  if (!publication) return <NotFound />

  const index = publications.findIndex((p) => p.slug === publication.slug)
  const previous = publications[index + 1]
  const next = publications[index - 1]

  const record: [string, string | undefined][] = [
    ['Venue', publication.venue],
    ['Series', publication.venueShort],
    ['Publisher', publication.publisher],
    ['Location', publication.location],
    ['Pages', publication.pages],
    ['ISSN', publication.issn],
    ['DOI', publication.doi],
    ['Status', publication.status === 'published' ? 'Published' : publication.status],
    ['Date', formatDate(publication.date)],
  ]

  return (
    <article>
      <Container className="pt-12">
        <PathCrumb segments={[{ label: 'research', href: '/research' }, { label: publication.slug }]} />

        <header className="mt-8 border-b border-rule pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <Pill tone="accent">{TYPE_LABEL[publication.type] ?? publication.type}</Pill>
            {publication.status === 'published' ? <Pill tone="ok">Published</Pill> : null}
            {publication.status === 'accepted' ? <Pill tone="mark">Accepted</Pill> : null}
            {publication.status === 'under-review' ? <Pill>Under review</Pill> : null}
            <span className="font-mono text-[0.6875rem] text-ink-4">{publication.year}</span>
          </div>

          <h1 className="display max-w-4xl text-[clamp(1.875rem,4.4vw,3rem)] text-ink">
            {publication.title}
          </h1>

          <p className="mt-6 text-[1rem] text-ink-2">
            {publication.authors.map((author, i) => (
              <span key={author.name}>
                {i > 0 ? <span className="text-ink-4">, </span> : null}
                {author.me ? (
                  <span className="font-semibold text-ink underline decoration-mark decoration-1 underline-offset-4">
                    {author.name}
                  </span>
                ) : author.url ? (
                  <a href={author.url} target="_blank" rel="noopener noreferrer" className="link-rule">
                    {author.name}
                  </a>
                ) : (
                  author.name
                )}
              </span>
            ))}
          </p>

          <p className="mt-2 text-[0.9375rem] italic text-ink-3">
            {publication.venue}
            {publication.location ? `, ${publication.location}` : ''}
          </p>

          <div className="no-print mt-8 flex flex-wrap gap-2.5">
            {publication.pdfUrl ? (
              <Button href={publication.pdfUrl}>
                <Document size={13} /> PDF
              </Button>
            ) : null}
            {publication.doi ? (
              <Button href={`https://doi.org/${publication.doi}`} variant="outline">
                <ArrowUpRight size={13} /> DOI
              </Button>
            ) : null}
            {publication.landingUrl ? (
              <Button href={publication.landingUrl} variant="outline">
                <ArrowUpRight size={13} /> Publisher record
              </Button>
            ) : null}
            {publication.datasetUrl ? (
              <Button href={publication.datasetUrl} variant="outline">
                <Database size={13} /> Dataset
              </Button>
            ) : null}
            {publication.codeUrl ? (
              <Button href={publication.codeUrl} variant="outline">
                <GitHub size={13} /> Code
              </Button>
            ) : null}
            {publication.slidesUrl ? (
              <Button href={publication.slidesUrl} variant="outline">
                Slides
              </Button>
            ) : null}
          </div>
        </header>
      </Container>

      <Container className="pt-12">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="min-w-0 max-w-[46rem]">
            {/* Abstract, set the way a paper sets one */}
            <section className="rounded-lg border border-rule bg-surface-2 p-6 sm:p-8">
              <p className="label mb-4">Abstract</p>
              <p className="text-justified text-[1.0625rem] leading-relaxed text-ink-2">
                {publication.abstract}
              </p>
            </section>

            {/* Artifacts */}
            {publication.codeUrl || publication.datasetUrl ? (
              <section className="mt-10">
                <p className="label mb-5">Artifacts</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {publication.codeUrl ? (
                    <ArtifactCard
                      href={publication.codeUrl}
                      icon={<GitHub size={16} />}
                      kind="Code"
                      host="github.com"
                      name={publication.codeUrl.replace(/^https?:\/\/github\.com\//, '')}
                    />
                  ) : null}
                  {publication.datasetUrl ? (
                    <ArtifactCard
                      href={publication.datasetUrl}
                      icon={<HuggingFace size={16} />}
                      kind="Dataset"
                      host="huggingface.co"
                      name={publication.datasetUrl.replace(/^https?:\/\/huggingface\.co\/datasets\//, '')}
                    />
                  ) : null}
                </div>
              </section>
            ) : null}

            {/* Bibliographic record */}
            <section className="mt-10">
              <p className="label mb-5">Record</p>
              <dl className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
                {(() => {
                  const rows = record.filter(([, value]) => Boolean(value))
                  return rows.map(([key, value], i) => (
                    <div
                      key={key}
                      className={cn(
                        'bg-surface px-5 py-4',
                        // An odd row count would leave a dead cell showing the
                        // grid gap colour; let the last row span instead.
                        i === rows.length - 1 && rows.length % 2 === 1 && 'sm:col-span-2',
                      )}
                    >
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
                        {key}
                      </dt>
                      <dd className="mt-1 text-[0.875rem] text-ink-2">{value}</dd>
                    </div>
                  ))
                })()}
              </dl>
            </section>

            {/* Citation */}
            {publication.bibtex ? (
              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="label">Cite this</p>
                  <div className="no-print flex gap-2">
                    <CopyButton value={citation(publication)} label="APA" />
                    <CopyButton value={publication.bibtex} label="BibTeX" />
                  </div>
                </div>

                <p className="mb-4 border-l-2 border-mark pl-4 text-[0.9375rem] leading-relaxed text-ink-3">
                  {citation(publication)}
                </p>

                <pre className="overflow-x-auto rounded-lg border border-rule bg-sunken p-5 font-mono text-[0.75rem] leading-relaxed text-ink-2">
                  <code>{publication.bibtex}</code>
                </pre>
              </section>
            ) : null}

            {/* Author's notes */}
            {publication.html.trim() ? (
              <section className="mt-14 border-t border-rule pt-10">
                <p className="label mb-6">Notes</p>
                <div className="card px-6 py-8 sm:px-9 sm:py-10">
                  <Prose html={publication.html} />
                </div>
              </section>
            ) : null}

            <div className="mt-12 flex flex-wrap gap-1.5">
              {publication.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <ArticleNav
              previous={previous ? { href: previous.href, title: previous.title } : undefined}
              next={next ? { href: next.href, title: next.title } : undefined}
              label="More research"
            />
          </div>

          <Reveal>
            <Toc entries={publication.toc} />
          </Reveal>
        </div>
      </Container>
    </article>
  )
}

function ArtifactCard({
  href,
  icon,
  kind,
  host,
  name,
}: {
  href: string
  icon: React.ReactNode
  kind: string
  host: string
  name: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover group flex items-center gap-3.5 p-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-rule bg-surface-2 text-ink-2 transition-colors group-hover:text-accent">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-4">
          {kind} · {host}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[0.8125rem] text-ink transition-colors group-hover:text-accent">
          {name}
        </span>
      </span>
      <ArrowUpRight
        size={15}
        className="shrink-0 text-ink-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      />
    </a>
  )
}
