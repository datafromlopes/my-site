import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/format'

type Example = {
  predicate: string
  family: string
  question: string
  sql: string[]
}

/** The three spatial predicate families the AtlasSQL-BR dataset is built around. */
const EXAMPLES: Example[] = [
  {
    predicate: 'ST_Within',
    family: 'containment',
    question: 'Quais escolas estão dentro do município de Campinas?',
    sql: [
      'SELECT e.nome, e.matriculas',
      'FROM escolas AS e',
      'JOIN municipios AS m',
      '  ON ST_Within(e.geom, m.geom)',
      "WHERE m.nome = 'Campinas';",
    ],
  },
  {
    predicate: 'ST_DWithin',
    family: 'buffer',
    question: 'Liste os museus num raio de 2 km da Avenida Paulista.',
    sql: [
      'SELECT mu.nome',
      'FROM museus AS mu, vias AS v',
      "WHERE v.nome = 'Avenida Paulista'",
      '  AND ST_DWithin(mu.geom, v.geom, 2000);',
    ],
  },
  {
    predicate: 'ST_Touches',
    family: 'adjacency',
    question: 'Quais bairros fazem divisa com o distrito da Liberdade?',
    sql: [
      'SELECT b.nome',
      'FROM bairros AS b',
      'JOIN distritos AS d',
      '  ON ST_Touches(b.geom, d.geom)',
      "WHERE d.nome = 'Liberdade';",
    ],
  },
]

const KEYWORDS = /\b(SELECT|FROM|JOIN|ON|WHERE|AND|OR|AS|ORDER\s+BY|GROUP\s+BY|LIMIT|COUNT|DISTINCT)\b/g
const SPATIAL = /\b(ST_[A-Za-z]+)\b/g
const STRING = /'[^']*'/g
const NUMBER = /\b\d+\b/g

/**
 * Small SQL tokeniser. A full highlighter would be overkill for four fixed
 * queries, and this way the spatial functions — the point of the whole example —
 * get their own colour.
 */
function highlight(line: string) {
  type Piece = { text: string; kind: string }
  const marks: { start: number; end: number; kind: string }[] = []

  const scan = (re: RegExp, kind: string) => {
    re.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(line))) {
      if (marks.some((k) => m!.index < k.end && k.start < m!.index + m![0].length)) continue
      marks.push({ start: m.index, end: m.index + m[0].length, kind })
    }
  }

  scan(STRING, 'string')
  scan(SPATIAL, 'spatial')
  scan(KEYWORDS, 'keyword')
  scan(NUMBER, 'number')
  marks.sort((a, b) => a.start - b.start)

  const pieces: Piece[] = []
  let cursor = 0
  for (const mark of marks) {
    if (mark.start > cursor) pieces.push({ text: line.slice(cursor, mark.start), kind: 'plain' })
    pieces.push({ text: line.slice(mark.start, mark.end), kind: mark.kind })
    cursor = mark.end
  }
  if (cursor < line.length) pieces.push({ text: line.slice(cursor), kind: 'plain' })
  return pieces
}

const TONE: Record<string, string> = {
  keyword: 'text-accent',
  spatial: 'text-mark font-medium',
  string: 'text-ok',
  number: 'text-ok',
  plain: 'text-ink-2',
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Animated illustration of the MSc work: a Brazilian Portuguese question typed
 * out, then the spatial SQL it compiles to.
 *
 * Initial state renders the first example complete, so the prerendered HTML and
 * anyone without JavaScript sees real content instead of an empty shell.
 */
export function TextToSql() {
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(EXAMPLES[0].question.length)
  const [lines, setLines] = useState(EXAMPLES[0].sql.length)
  const [animate, setAnimate] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const example = EXAMPLES[index]
  const done = typed >= example.question.length && lines >= example.sql.length

  useEffect(() => {
    if (!prefersReducedMotion()) setAnimate(true)
  }, [])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (!animate) return

    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))

    setTyped(0)
    setLines(0)

    const charStep = 26
    const question = EXAMPLES[index].question
    for (let i = 1; i <= question.length; i += 1) at(i * charStep, () => setTyped(i))

    const afterQuestion = question.length * charStep + 420
    const sql = EXAMPLES[index].sql
    for (let i = 1; i <= sql.length; i += 1) at(afterQuestion + i * 130, () => setLines(i))

    at(afterQuestion + sql.length * 130 + 3600, () => setIndex((v) => (v + 1) % EXAMPLES.length))

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [index, animate])

  const visibleSql = useMemo(() => example.sql.slice(0, lines), [example, lines])

  // The beat between a finished question and the first line of SQL.
  const pending = animate && typed >= example.question.length && lines === 0

  const select = (next: number) => {
    setIndex(next)
    if (!animate) {
      setTyped(EXAMPLES[next].question.length)
      setLines(EXAMPLES[next].sql.length)
    }
  }

  return (
    <div className="card overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface-2 px-4 py-2.5 font-mono text-[0.6875rem]">
        <span className="flex items-center gap-2 text-ink-3">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-rule-2" />
            <span className="h-2 w-2 rounded-full bg-rule-2" />
            <span className="h-2 w-2 rounded-full bg-rule-2" />
          </span>
          <span className="ml-1 uppercase tracking-[0.08em]">geo text-to-sql</span>
        </span>
        <span className="text-ink-4">pt-br → postgis</span>
      </div>

      {/* Question */}
      <div className="px-4 py-4 sm:px-5">
        <p className="mb-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-4">
          natural language
        </p>
        <p className="min-h-[3rem] font-mono text-[0.8125rem] leading-relaxed text-ink sm:text-[0.875rem]">
          <span className="text-accent">❯ </span>
          {example.question.slice(0, typed)}
          {typed < example.question.length ? <span className="caret" aria-hidden="true" /> : null}
        </p>
      </div>

      {/* Compiled SQL */}
      <div className="border-t border-rule bg-sunken px-4 py-4 sm:px-5">
        <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-4">
          executable sql
        </p>
        <pre className="min-h-[7.5rem] overflow-x-auto font-mono text-[0.8125rem] leading-relaxed">
          <code>
            {pending ? <span className="block animate-pulse text-ink-4">-- compiling…</span> : null}
            {visibleSql.map((line, i) => (
              <span key={i} className="block">
                {highlight(line).map((piece, j) => (
                  <span key={j} className={TONE[piece.kind]}>
                    {piece.text}
                  </span>
                ))}
              </span>
            ))}
          </code>
        </pre>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 border-t border-rule bg-surface-2 px-4 py-2.5 font-mono text-[0.6875rem]">
        <span className="flex items-center gap-2">
          <span className={cn('h-1.5 w-1.5 rounded-full', done ? 'bg-ok' : 'bg-rule-2')} />
          <span className="text-mark">{example.predicate}</span>
          <span className="text-ink-4">· {example.family}</span>
        </span>

        <span className="flex items-center gap-1.5">
          {EXAMPLES.map((item, i) => (
            <button
              key={item.predicate}
              type="button"
              onClick={() => select(i)}
              aria-label={`Show the ${item.family} example`}
              aria-current={i === index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-5 bg-accent' : 'w-1.5 bg-rule-2 hover:bg-ink-4',
              )}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
