export const site = {
  url: 'https://www.datafromlopes.com',
  name: 'Diego Lopes',
  initials: 'DL',
  role: 'Lead Data Engineer & NLP Researcher',
  shortBio:
    'Lead Data Engineer and MSc researcher at IME-USP, working where large-scale distributed systems meet language models.',
  location: 'São Paulo, Brazil',
  timezone: 'America/Sao_Paulo',
  careerStart: '2018-08-01',
  email: 'diego.oliveiralopes@ime.usp.br',
  description:
    'Diego Lopes — Lead Data Engineer and MSc researcher in Computer Science at IME-USP. Distributed data platforms, text-to-SQL and natural language interfaces for databases.',
  keywords: [
    'Diego Lopes',
    'data engineering',
    'text-to-SQL',
    'natural language interfaces for databases',
    'distributed systems',
    'Apache Cassandra',
    'NLP',
    'IME-USP',
    'geospatial SQL',
  ],
} as const

export const nav = [
  { label: 'About', href: '/', short: '01' },
  { label: 'Research', href: '/research', short: '02' },
  { label: 'Projects', href: '/projects', short: '03' },
  { label: 'Writing', href: '/writing', short: '04' },
  { label: 'CV', href: '/cv', short: '05' },
] as const

export type SocialLink = {
  id: string
  label: string
  href: string
  handle: string
  group: 'network' | 'academic'
  /** Brand colour, applied on hover so the icon row has some life. */
  brand: string
}

export const socials: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/datafromlopes',
    handle: '/in/datafromlopes',
    group: 'network',
    brand: '#0a66c2',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/datafromlopes',
    handle: '@datafromlopes',
    group: 'network',
    brand: '#8b5cf6',
  },
  {
    id: 'huggingface',
    label: 'Hugging Face',
    href: 'https://huggingface.co/datafromlopes',
    handle: '@datafromlopes',
    group: 'network',
    brand: '#ff9d00',
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    href: 'https://bsky.app/profile/datafromlopes.com',
    handle: '@datafromlopes.com',
    group: 'network',
    brand: '#0285ff',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/datafromlopes',
    handle: '@datafromlopes',
    group: 'network',
    brand: '#71767b',
  },
  {
    id: 'orcid',
    label: 'ORCID',
    href: 'https://orcid.org/0000-0002-5130-3728',
    handle: '0000-0002-5130-3728',
    group: 'academic',
    brand: '#a6ce39',
  },
  {
    id: 'lattes',
    label: 'Lattes',
    href: 'http://lattes.cnpq.br/4604428550643092',
    handle: '4604428550643092',
    group: 'academic',
    brand: '#0056a6',
  },
  {
    id: 'email',
    label: 'Academic e-mail',
    href: 'mailto:diego.oliveiralopes@ime.usp.br',
    handle: 'diego.oliveiralopes@ime.usp.br',
    group: 'academic',
    brand: '#dc2626',
  },
]

export const newsletter = {
  account: '2139800',
  form: '0ZWAxD',
  endpoint: '/api/subscribe',
} as const
