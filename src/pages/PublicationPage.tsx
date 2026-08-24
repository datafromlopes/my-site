import { useParams } from 'react-router'
import { ArticleNav } from '@/components/ArticleNav'
import { ArrowUpRight, Document, GitHub } from '@/components/Icons'
import { PathCrumb } from '@/components/PathCrumb'
import { Prose } from '@/components/Prose'
import { Toc } from '@/components/Toc'
import { Button, Container, CopyButton, Pill, Reveal, Tag } from '@/components/ui'
import { findPublication, publications } from '@/lib/content'
import { citation, formatDate } from '@/lib/format'
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
    ['Date', formatDate(publication.date)],
  ]

  return (
    <article>
      <Container className="pt-12">
        <PathCrumb segments={[{ label: 'research', href: '/research' }, { label: publication.slug }]} />

        <header className="mt-8 border-b border-rule pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <Pill tone="accent">{TYPE_LABEL[publication.type] ?? publication.type}</Pill>
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
              <p className="text-[1.0625rem] leading-relaxed text-ink-2">{publication.abstract}</p>
            </section>

            {/* Bibliographic record */}
            <section className="mt-10">
              <p className="label mb-5">Record</p>
              <dl className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
                {record
                  .filter(([, value]) => Boolean(value))
                  .map(([key, value]) => (
                    <div key={key} className="bg-surface px-5 py-4">
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
                        {key}
                      </dt>
                      <dd className="mt-1 text-[0.875rem] text-ink-2">{value}</dd>
                    </div>
                  ))}
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
                <Prose html={publication.html} />
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
