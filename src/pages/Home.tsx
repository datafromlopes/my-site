import { Link } from 'react-router'
import { PostRow, ProjectCard, PublicationEntry, StatusRow } from '@/components/cards'
import { ArrowUpRight, Brain, Cpu, Database } from '@/components/Icons'
import { MetricStrip } from '@/components/Metrics'
import { SocialLinks } from '@/components/SocialLinks'
import { TextToSql } from '@/components/TextToSql'
import { Newsletter } from '@/components/Newsletter'
import { ArrowLink, Button, Container, Reveal, SectionHead, Tag } from '@/components/ui'
import { competencies, education, metrics, roles, stack } from '@/data/career'
import { site, socials } from '@/data/site'
import { posts, projects, publications } from '@/lib/content'
import { duration, formatMonth, yearsSince } from '@/lib/format'

const COMPETENCY_ICONS = { systems: Database, nlp: Brain, hpc: Cpu } as const

export function Home() {
  const current = roles[0]
  const msc = education[0]
  const years = yearsSince(site.careerStart)
  const featuredProjects = projects.slice(0, 2)

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div
          className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_30%_0%,black,transparent)]"
          aria-hidden="true"
        />

        <Container className="relative pb-16 pt-12 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
            {/* Portrait and identity block — left, where the eye lands first. */}
            <div
              className="card flex max-w-[15rem] flex-col gap-4 p-3.5"
              style={{ animation: 'reveal-up .7s cubic-bezier(0.16,1,0.3,1) backwards' }}
            >
              <img
                src="/media/profile.png"
                alt="Diego Lopes"
                width={480}
                height={480}
                loading="eager"
                className="w-full rounded border border-rule object-cover"
              />

              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[0.75rem]">
                <dt className="text-ink-4">role</dt>
                <dd className="text-ink-2">{current.title}</dd>
                <dt className="text-ink-4">at</dt>
                <dd>
                  <a
                    href={current.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {current.company}
                  </a>
                </dd>
                <dt className="text-ink-4">msc</dt>
                <dd className="text-ink-2">{msc.institutionShort}</dd>
                <dt className="text-ink-4">based</dt>
                <dd className="text-ink-2">São Paulo, BR</dd>
                <dt className="text-ink-4">tz</dt>
                <dd className="text-ink-2">UTC−3</dd>
              </dl>

              <SocialLinks
                items={socials.filter((s) =>
                  ['github', 'linkedin', 'huggingface', 'x', 'orcid'].includes(s.id),
                )}
                size="sm"
              />

              <div className="border-t border-rule pt-4">
                <p className="label mb-3">Focus</p>
                <ul className="space-y-2">
                  {[
                    'Natural language interfaces for databases',
                    'Distributed storage at production scale',
                    'Performance engineering, top to bottom',
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-[0.8125rem] leading-snug text-ink-3">
                      <span className="mt-[0.45rem] h-px w-2.5 shrink-0 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Statement */}
            <div className="min-w-0">
              <p
                className="mb-6 font-mono text-[0.8125rem] text-ink-3"
                style={{ animation: 'reveal-up .7s cubic-bezier(0.16,1,0.3,1) 60ms backwards' }}
              >
                <span className="text-ink-4">$</span> whoami
              </p>

              <h1
                className="display max-w-[19ch] text-[clamp(1.875rem,3.8vw,2.75rem)] text-ink"
                style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) 100ms backwards' }}
              >
                I build data systems that hold at scale, and study how models learn to query them.
                <span className="caret" aria-hidden="true" />
              </h1>

              <p
                className="mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-2"
                style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) 170ms backwards' }}
              >
                I am <strong className="font-semibold text-ink">Diego Lopes</strong> — {years} years of
                production data engineering, currently leading a data platform, and an MSc researcher at{' '}
                <a
                  href="https://www.ime.usp.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-rule font-medium text-ink"
                >
                  IME-USP
                </a>{' '}
                working on natural language interfaces for databases.
              </p>

              <p
                className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-3"
                style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) 220ms backwards' }}
              >
                The engineering runs at the boundary of storage engines, high-throughput pipelines and
                microsecond latency. The research asks a harder question: can a model read a schema it has
                never seen and write a query that is actually correct?
              </p>

              <div
                className="mt-8 flex flex-wrap items-center gap-2.5"
                style={{ animation: 'reveal-up .75s cubic-bezier(0.16,1,0.3,1) 280ms backwards' }}
              >
                <Button href="/research">Read the research</Button>
                <Button href="/projects" variant="outline">
                  Browse projects
                </Button>
                <Button href="/cv" variant="ghost">
                  Curriculum vitae
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- metrics */}
      <Container>
        <Reveal>
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="label">Production, measured</span>
            <Link to="/projects/cassandra-platform" className="label transition-colors hover:text-accent">
              Source ↗
            </Link>
          </div>
          <MetricStrip metrics={metrics} />
        </Reveal>
      </Container>

      {/* ------------------------------------------------------ currently */}
      <Container className="pt-24">
        <Reveal>
          <SectionHead index="01" title="Currently" lede="Three things have my attention right now." />
          <ul className="card divide-y divide-rule overflow-hidden">
            <StatusRow
              when={formatMonth(current.start)}
              what={`${current.title} at ${current.company}`}
              where={current.summary}
              live
            />
            <StatusRow
              when={`${msc.start} —`}
              what={`${msc.degree} in ${msc.field}, ${msc.institutionShort}`}
              where={msc.detail ?? ''}
              href="/projects/geo-text-to-sql"
            />
            {publications[0] ? (
              <StatusRow
                when={String(publications[0].year)}
                what={`Paper accepted at ${publications[0].venueShort}`}
                where={publications[0].title}
                href={publications[0].href}
              />
            ) : null}
          </ul>
        </Reveal>
      </Container>

      {/* -------------------------------------------------------- systems */}
      <Container className="pt-24">
        <Reveal>
          <SectionHead
            index="02"
            title="Selected projects"
            lede="Work where the constraint was real — a latency budget, a cost ceiling, an SLA someone was paged for."
            action={<ArrowLink href="/projects">All work</ArrowLink>}
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 90} className="h-full">
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ------------------------------------------------------- research */}
      {publications.length ? (
        <Container className="pt-24">
          <Reveal>
            <SectionHead
              index="03"
              title="Research"
              lede="Peer-reviewed work on text-to-SQL and natural language interfaces for spatial data."
              action={<ArrowLink href="/research">All publications</ArrowLink>}
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-10">
              <div>
                {publications.slice(0, 2).map((publication) => (
                  <PublicationEntry key={publication.slug} publication={publication} />
                ))}
              </div>

              <div>
                <TextToSql />
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-3">
                  The task in one screen: a question in Brazilian Portuguese, and the spatial SQL it has to
                  compile to before anyone can trust the answer.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      ) : null}

      {/* -------------------------------------------------- competencies */}
      <Container className="pt-24">
        <Reveal>
          <SectionHead
            index="04"
            title="What I work on"
            lede="Three areas, and the places where they turn out to be the same problem."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {competencies.map((competency, index) => {
            const Icon = COMPETENCY_ICONS[competency.id as keyof typeof COMPETENCY_ICONS] ?? Database
            return (
              <Reveal key={competency.id} delay={index * 80} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-rule bg-surface-2 text-accent">
                    <Icon size={18} />
                  </div>

                  <h3 className="display text-[1.1875rem] text-ink">{competency.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-3">{competency.blurb}</p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {competency.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.8125rem] leading-snug text-ink-2">
                        <span className="mt-[0.5rem] h-px w-2.5 shrink-0 bg-ink-4" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 border-t border-rule pt-4 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-4">
                    {competency.footnote}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Stack strip */}
        <Reveal className="mt-10">
          <div className="card p-6">
            <p className="label mb-5">Daily tools</p>
            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {stack.map((item) => (
                <span key={item.name} className="group flex items-center gap-2">
                  <img
                    src={item.icon}
                    alt=""
                    width={18}
                    height={18}
                    loading="lazy"
                    className="h-[18px] w-[18px] object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 dark:brightness-110"
                  />
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3 transition-colors group-hover:text-ink">
                    {item.name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      {/* -------------------------------------------------------- writing */}
      {posts.length ? (
        <Container className="pt-24">
          <Reveal>
            <SectionHead
              index="05"
              title="Writing"
              lede="Notes on the parts worth writing down."
              action={<ArrowLink href="/writing">All notes</ArrowLink>}
            />
            <div className="card divide-y divide-rule overflow-hidden">
              {posts.slice(0, 3).map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
          </Reveal>
        </Container>
      ) : null}

      {/* ------------------------------------------------------- off duty */}
      <Container className="pt-24">
        <Reveal>
          <SectionHead index="06" title="Off duty" />
          <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1fr] md:gap-12">
            <figure className="overflow-hidden rounded-lg border border-rule bg-surface p-2.5">
              <img
                src="/media/aviation.jpeg"
                alt="Flying over Brazilian airspace"
                loading="lazy"
                className="w-full rounded-[0.3rem] object-cover"
              />
              <figcaption className="px-1 pb-0.5 pt-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-4">
                Brazilian airspace
              </figcaption>
            </figure>

            <div>
              <p className="text-[1.0625rem] leading-relaxed text-ink-2">
                When I am not designing pipelines or fine-tuning models, I fly.
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-3">
                The overlap with engineering is larger than it looks. Both reward meticulous planning and
                punish improvisation. Both require making a decision with incomplete information, on a clock,
                and then living with it. Both are mostly about what you do when the plan stops working.
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-3">
                Aviation taught me to always have a second option ready before I need it — which turns out to
                be a reasonable description of designing for failure in a distributed system.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ---------------------------------------------------- newsletter */}
      <Container className="pt-24">
        <Reveal>
          <Newsletter />
        </Reveal>
      </Container>

      {/* ----------------------------------------------------------- CTA */}
      <Container className="pt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-rule bg-surface px-6 py-14 text-center sm:px-12">
            <div className="grid-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

            <div className="relative mx-auto max-w-2xl">
              <p className="label mb-5">Get in touch</p>
              <h2 className="display text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
                Let's build what does not exist yet
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-ink-2">
                I am working toward staff and principal engineering problems at the intersection of
                large-scale systems and language model research — the kind that do not fit neatly into one job
                description.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href="https://www.linkedin.com/in/datafromlopes">
                  LinkedIn <ArrowUpRight size={13} />
                </Button>
                <Button href={`mailto:${site.email}`} variant="outline">
                  Academic e-mail
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
                {roles.slice(0, 4).map((role) => (
                  <Tag key={role.id} hash={false}>
                    {role.company} · {duration(role.start, role.end)}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
