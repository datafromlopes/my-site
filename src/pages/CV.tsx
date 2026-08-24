import { Printer } from '@/components/Icons'
import { Container, Pill, Rule } from '@/components/ui'
import { awards, competencies, education, roles } from '@/data/career'
import { site, socials } from '@/data/site'
import { publications } from '@/lib/content'
import { citation, duration, formatMonth, yearsSince } from '@/lib/format'

const CONTACT = socials.filter((s) => ['linkedin', 'github', 'orcid', 'lattes'].includes(s.id))

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="print-avoid-break mt-10">
      <h2 className="mb-5 border-b border-ink-4 pb-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function CV() {
  const years = yearsSince(site.careerStart)

  return (
    <Container className="max-w-3xl py-14">
      {/* Masthead */}
      <header className="border-b-2 border-ink pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-[clamp(2rem,5vw,2.75rem)] text-ink">{site.name}</h1>
            <p className="mt-1.5 text-[1.0625rem] italic text-ink-2">{site.role}</p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 rounded-full border border-rule px-3.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:border-ink hover:text-ink"
          >
            <Printer size={13} /> Print / PDF
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[0.75rem] text-ink-3">
          <span>{site.location}</span>
          <a href={`mailto:${site.email}`} className="link-rule">
            {site.email}
          </a>
          {CONTACT.map((item) => (
            <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="link-rule">
              {item.label}
            </a>
          ))}
          <span className="text-ink-4">{site.url.replace('https://', '')}</span>
        </div>
      </header>

      {/* Profile */}
      <Section title="Profile">
        <p className="text-[1.0625rem] leading-relaxed text-ink-2">
          Data engineer with {years} years designing and operating distributed data platforms in production —
          storage engines, high-throughput ingestion and latency-sensitive serving paths — currently leading a
          data platform as Lead Data Engineer. In parallel, an MSc researcher in Computer Science at IME-USP
          working on natural language interfaces for databases, with a focus on geospatial text-to-SQL for
          Brazilian Portuguese.
        </p>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">
          The two halves reinforce each other: production experience of what data actually looks like informs
          the research, and the research sharpens how I think about the interfaces engineers build on top of
          data.
        </p>
      </Section>

      {/* Experience */}
      <Section title="Professional Experience">
        <div className="space-y-8">
          {roles.map((role) => (
            <article key={role.id} className="print-avoid-break">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[1.1875rem] text-ink">
                  {role.title} ·{' '}
                  <a href={role.companyUrl} target="_blank" rel="noopener noreferrer" className="link-rule">
                    {role.company}
                  </a>
                </h3>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-4">
                  {formatMonth(role.start)} — {formatMonth(role.end)} · {duration(role.start, role.end)}
                </span>
              </div>

              <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-4">
                {role.location}
              </p>

              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">{role.summary}</p>

              <ul className="mt-3 space-y-1.5">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                    <span className="mt-[0.6rem] h-px w-2.5 shrink-0 bg-ink-4" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-2.5 font-mono text-[0.6875rem] text-ink-4">{role.stack.join(' · ')}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="space-y-6">
          {education.map((entry) => (
            <article key={entry.id} className="print-avoid-break">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[1.1875rem] text-ink">
                  {entry.degree} in {entry.field}
                </h3>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-4">
                  {entry.start} — {entry.end ?? 'Present'}
                </span>
              </div>

              <p className="mt-1 text-[0.9375rem] text-ink-2">
                <a
                  href={entry.institutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-rule"
                >
                  {entry.institution}
                </a>
              </p>

              {entry.detail ? (
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-3">
                  <span className="font-medium text-ink-2">Research:</span> {entry.detail}
                </p>
              ) : null}

              {entry.advisor ? (
                <p className="mt-1 text-[0.9375rem] text-ink-3">
                  <span className="font-medium text-ink-2">Advisor:</span>{' '}
                  <a href={entry.advisor.url} target="_blank" rel="noopener noreferrer" className="link-rule">
                    {entry.advisor.name}
                  </a>
                </p>
              ) : null}

              {entry.status === 'in-progress' ? (
                <p className="no-print mt-2.5">
                  <Pill tone="mark">In progress</Pill>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      {/* Publications */}
      {publications.length ? (
        <Section title="Publications">
          <ol className="space-y-4">
            {publications.map((publication) => (
              <li key={publication.slug} className="print-avoid-break flex gap-3">
                <span className="mt-1 font-mono text-[0.6875rem] text-ink-4">[{publication.year}]</span>
                <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                  {citation(publication)}
                  {publication.status === 'accepted' ? (
                    <span className="ml-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mark">
                      (accepted)
                    </span>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* Competencies */}
      <Section title="Technical Competencies">
        <div className="grid gap-6 sm:grid-cols-3">
          {competencies.map((competency) => (
            <div key={competency.id} className="print-avoid-break">
              <h3 className="text-[1.0625rem] text-ink">{competency.title}</h3>
              <ul className="mt-2.5 space-y-1.5">
                {competency.items.map((item) => (
                  <li key={item} className="text-[0.8125rem] leading-snug text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Honours */}
      {awards.length ? (
        <Section title="Selected Recognition">
          <ul className="space-y-3">
            {awards.map((award) => (
              <li key={award.title} className="flex gap-3">
                <span className="mt-1 font-mono text-[0.6875rem] text-ink-4">[{award.year}]</span>
                <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                  <span className="font-medium text-ink">{award.title}</span> — {award.org}. {award.detail}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Languages */}
      <Section title="Languages">
        <p className="text-[0.9375rem] text-ink-2">
          Portuguese — native · English — professional working proficiency
        </p>
      </Section>

      <Rule className="mt-12" />
      <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-4">
        Full version at {site.url.replace('https://', '')}/cv
      </p>
    </Container>
  )
}
