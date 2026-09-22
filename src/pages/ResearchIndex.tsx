import { useMemo, useState } from 'react'
import { PublicationEntry } from '@/components/cards'
import { PageHeader, PageMeta } from '@/components/PageHeader'
import { SectionRule } from '@/components/SectionRule'
import { Container, EmptyState, Reveal, SectionHead, Tag } from '@/components/ui'
import { education } from '@/data/career'
import { byId, researchKeywords } from '@/data/site'
import { ArrowUpRight, iconFor } from '@/components/Icons'
import { publications } from '@/lib/content'
import { cn } from '@/lib/format'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'conference', label: 'Conference' },
  { id: 'journal', label: 'Journal' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'preprint', label: 'Preprint' },
] as const

/** Scholarly identifiers, in the order a reviewer tends to look for them. */
const PROFILES = byId(['scholar', 'orcid', 'lattes'])

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
  const latest = publications[0]

  return (
    <>
      <PageHeader
        eyebrow="research"
        title="Research"
        lede="I work on natural language interfaces for databases — specifically, getting language models to produce spatial SQL that runs correctly against real public data, in a language the field has largely ignored."
        meta={
          <>
            <PageMeta label="Publications" value={publications.length} />
            <PageMeta label="Latest" value={latest ? latest.venueShort : '—'} />
            <PageMeta label="Programme" value={`${msc.degree} · ${msc.institutionShort}`} />
            <div className="flex w-full flex-wrap items-center gap-2 pt-2">
              <span className="label mr-1">Profiles</span>
              {PROFILES.map((profile) => {
                const Icon = iconFor[profile.id]
                return (
                  <a
                    key={profile.id}
                    href={profile.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    style={{ '--brand': profile.brand } as React.CSSProperties}
                    className="brand-hover inline-flex items-center gap-2 rounded-md border border-rule bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-ink-2 shadow-[var(--shadow-card)]"
                  >
                    {Icon ? <Icon size={14} /> : null}
                    {profile.label}
                    <ArrowUpRight size={12} className="text-ink-4" />
                  </a>
                )
              })}
            </div>
          </>
        }
      />

      {/* Research statement */}
      <Container className="pt-16">
        <Reveal>
          <div className="grid gap-8 pb-4 lg:grid-cols-[7.5rem_1fr] lg:gap-12">
            <p className="label pt-1">Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {researchKeywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </div>
          </div>

          <div className="grid gap-8 pb-4 lg:grid-cols-[7.5rem_1fr] lg:gap-12">
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
            slug="publications"
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
              <SectionRule
                rule={false}
                size="lg"
                className="mb-6"
                segments={[
                  { text: String(year), tone: 'ink' },
                  { text: `${items.length} ${items.length === 1 ? 'entry' : 'entries'}`, tone: 'muted' },
                ]}
              />

              <div className="pt-2">
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
