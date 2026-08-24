import { useMemo, useState } from 'react'
import { PublicationEntry } from '@/components/cards'
import { PageHeader, PageMeta } from '@/components/PageHeader'
import { Container, EmptyState, Reveal, SectionHead } from '@/components/ui'
import { education } from '@/data/career'
import { publications } from '@/lib/content'
import { cn } from '@/lib/format'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'conference', label: 'Conference' },
  { id: 'journal', label: 'Journal' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'preprint', label: 'Preprint' },
] as const

export function ResearchIndex() {
  const [filter, setFilter] = useState<string>('all')

  const available = useMemo(
    () => FILTERS.filter((f) => f.id === 'all' || publications.some((p) => p.type === f.id)),
    [],
  )

  const visible = useMemo(
    () => (filter === 'all' ? publications : publications.filter((p) => p.type === filter)),
    [filter],
  )

  const byYear = useMemo(() => {
    const groups = new Map<number, typeof publications>()
    for (const pub of visible) {
      groups.set(pub.year, [...(groups.get(pub.year) ?? []), pub])
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0])
  }, [visible])

  const msc = education[0]
  const years = new Set(publications.map((p) => p.year)).size

  return (
    <>
      <PageHeader
        eyebrow="research"
        title="Research"
        lede="I work on natural language interfaces for databases — specifically, getting language models to produce spatial SQL that runs correctly against real public data, in a language the field has largely ignored."
        meta={
          <>
            <PageMeta label="Publications" value={publications.length} />
            <PageMeta label="Active years" value={years} />
            <PageMeta label="Programme" value={`${msc.degree} · ${msc.institutionShort}`} />
          </>
        }
      />

      {/* Research statement */}
      <Container className="pt-16">
        <Reveal>
          <div className="grid gap-8 border-b border-rule pb-14 lg:grid-cols-[7.5rem_1fr] lg:gap-12">
            <p className="label pt-1">Statement</p>
            <div className="prose-tight max-w-2xl text-ink-2">
              <p>
                Querying a database is a specialised skill, and that skill is the barrier between public data
                and the people it was collected for. Text-to-SQL removes the barrier — in principle.
              </p>
              <p>
                In practice two gaps remain. Models handle joins and aggregations well and spatial predicates
                badly, because almost no training data contains geometry. And the resources that do exist are
                overwhelmingly English, which leaves Brazilian Portuguese — the language Brazilian public data
                is actually described in — largely unexplored.
              </p>
              <p>
                My MSc, advised by{' '}
                {msc.advisor ? (
                  <a
                    href={msc.advisor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-rule font-medium text-ink"
                  >
                    {msc.advisor.name}
                  </a>
                ) : null}{' '}
                at IME-USP, attacks both: a Brazilian Portuguese geospatial dataset, a model fine-tuned on it,
                and an evaluation that measures whether the query executes correctly rather than whether it
                looks like the reference.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Publications */}
      <Container className="pt-14">
        <Reveal>
          <SectionHead
            index="02"
            title="Publications"
            action={
              available.length > 2 ? (
                <div className="flex flex-wrap gap-1.5">
                  {available.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFilter(option.id)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors',
                        filter === option.id
                          ? 'border-accent-line bg-accent-soft text-accent'
                          : 'border-rule text-ink-4 hover:border-rule-2 hover:text-ink-2',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null
            }
          />
        </Reveal>

        {byYear.length === 0 ? (
          <EmptyState>No publications of this type yet</EmptyState>
        ) : (
          byYear.map(([year, items]) => (
            <Reveal key={year} className="mb-12">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <span className="font-mono text-[2rem] leading-none text-ink-4 tabular-nums">{year}</span>
                <span className="label">
                  {items.length} {items.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div className="border-t border-rule pt-7">
                {items.map((publication) => (
                  <PublicationEntry key={publication.slug} publication={publication} />
                ))}
              </div>
            </Reveal>
          ))
        )}
      </Container>
    </>
  )
}
