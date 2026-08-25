export type Role = {
  id: string
  title: string
  company: string
  companyUrl: string
  logo: string
  start: string
  end: string | null
  location: string
  summary: string
  highlights: string[]
  stack: string[]
}

/** Reverse-chronological, the way a CV reads. */
export const roles: Role[] = [
  {
    id: 'ollie',
    title: 'Lead Data Engineer',
    company: 'Ollie',
    companyUrl: 'https://meuollie.com.br',
    logo: '/media/companies/ollie.png',
    start: '2026-02',
    end: null,
    location: 'São Paulo, BR · Remote',
    summary:
      'Leading the data platform: architecture, technical direction and the engineering standards the team builds against.',
    highlights: [
      'Own the end-to-end architecture of the analytics and product data platform.',
      'Set technical direction across ingestion, storage, modelling and serving layers.',
      'Mentor engineers on distributed systems design and production data reliability.',
    ],
    stack: ['Python', 'Airflow', 'Iceberg', 'Trino', 'AWS'],
  },
  {
    id: 'pulsus',
    title: 'Senior Data Engineer',
    company: 'Pulsus',
    companyUrl: 'https://pulsus.mobi',
    logo: '/media/companies/pulsus.png',
    start: '2022-08',
    end: '2026-02',
    location: 'São Paulo, BR · Remote',
    summary:
      'Built and operated the telemetry backbone for a fleet of more than one million connected devices.',
    highlights: [
      'Architected a production Apache Cassandra cluster from scratch — 12 nodes, 3 availability zones, 99.99% availability.',
      'Sustained 47M writes/day (1.46B+ total) at 13μs P50 write latency from 1M+ IoT and mobile devices.',
      'Migrated every production MongoDB pipeline to Cassandra, cutting operating cost 75% (US$6,000 → US$1,500/month).',
      'Designed hourly incremental S3 backups orchestrated with Airflow, enabling point-in-time recovery with zero data loss over 12 months.',
    ],
    stack: ['Cassandra', 'Python', 'Airflow', 'AWS', 'Kafka', 'MongoDB'],
  },
  {
    id: 'act',
    title: 'Senior Data Engineer',
    company: 'ACT Digital',
    companyUrl: 'https://actdigital.com',
    logo: '/media/companies/act.png',
    start: '2022-05',
    end: '2022-08',
    location: 'São Paulo, BR · Remote',
    summary: 'Consulting engagements on batch and streaming pipelines for enterprise clients.',
    highlights: ['Delivered ingestion and transformation pipelines under client SLAs.'],
    stack: ['Spark', 'Python', 'GCP'],
  },
  {
    id: 'ciandt',
    title: 'Data Engineer',
    company: 'CI&T',
    companyUrl: 'https://ciandt.com/br/pt-br/home',
    logo: '/media/companies/ciandt.png',
    start: '2021-03',
    end: '2022-03',
    location: 'Campinas, BR · Remote',
    summary: 'Large-scale data pipelines for global enterprise clients.',
    highlights: [
      'Built distributed batch processing on Spark over multi-terabyte datasets.',
      'Implemented data quality and observability checks across critical pipelines.',
    ],
    stack: ['Spark', 'Python', 'GCP', 'BigQuery'],
  },
  {
    id: 'ey',
    title: 'Data Engineer',
    company: 'Ernst & Young',
    companyUrl: 'https://www.ey.com',
    logo: '/media/companies/ey.png',
    start: '2020-09',
    end: '2021-03',
    location: 'São Paulo, BR',
    summary: 'Data engineering for financial services and audit analytics.',
    highlights: ['Automated data acquisition and reconciliation for audit workflows.'],
    stack: ['Python', 'SQL', 'Azure'],
  },
  {
    id: 'wavy',
    title: 'Data Engineer',
    company: 'Wavy (now Sinch)',
    companyUrl: 'https://sinch.com/pt/blog/sinch-e-wavy-unem-forcas',
    logo: '/media/companies/wavy.png',
    start: '2018-08',
    end: '2020-05',
    location: 'Campinas, BR',
    summary: 'First engineering role — messaging telemetry at national carrier scale.',
    highlights: [
      'Processed high-volume messaging events across Brazilian mobile carriers.',
      'Built the reporting pipelines that operations and product teams ran on.',
    ],
    stack: ['Python', 'Kafka', 'PostgreSQL'],
  },
]

export type Education = {
  id: string
  degree: string
  field: string
  institution: string
  institutionShort: string
  institutionUrl: string
  logo: string
  start: string
  end: string | null
  status: 'in-progress' | 'completed'
  detail?: string
  advisor?: { name: string; url: string }
}

export const education: Education[] = [
  {
    id: 'usp',
    degree: 'MSc',
    field: 'Computer Science',
    institution: 'University of São Paulo — Institute of Mathematics and Statistics',
    institutionShort: 'IME-USP',
    institutionUrl: 'https://www.ime.usp.br',
    logo: '/media/universities/usp.png',
    start: '2023',
    end: null,
    status: 'in-progress',
    detail:
      'Natural language interfaces for databases: translating Brazilian Portuguese geospatial questions into executable SQL.',
    advisor: { name: 'Prof. Kelly Rosa Braghetto', url: 'https://www.ime.usp.br/~kellyrb/' },
  },
  {
    id: 'ifsp',
    degree: 'Associate Degree',
    field: 'Systems Analysis and Development',
    institution: 'Federal Institute of São Paulo',
    institutionShort: 'IFSP',
    institutionUrl: 'https://bra.ifsp.edu.br',
    logo: '/media/universities/ifsp.png',
    start: '2016',
    end: '2021',
    status: 'completed',
  },
]

export type Metric = {
  value: string
  unit?: string
  label: string
  context: string
}

/** Headline numbers from production systems — every one traceable to a project page. */
export const metrics: Metric[] = [
  { value: '1.46', unit: 'B+', label: 'Writes served', context: '47M/day sustained on Cassandra' },
  { value: '13', unit: 'μs', label: 'P50 write latency', context: 'Multi-AZ cluster, RF=3' },
  { value: '99.99', unit: '%', label: 'Availability', context: '12 months, zero data loss' },
  { value: '75', unit: '%', label: 'Cost reduction', context: 'US$6k → US$1.5k per month' },
]

export type Competency = {
  id: string
  title: string
  blurb: string
  items: string[]
  footnote: string
}

export const competencies: Competency[] = [
  {
    id: 'systems',
    title: 'Distributed Systems',
    blurb: 'Storage engines and pipelines that hold up when the traffic is real.',
    items: [
      'Distributed storage — Cassandra, PostgreSQL, Apache Iceberg',
      'High-throughput ingestion — Kafka, Spark, Trino',
      'Fault tolerance — multi-AZ topology, replication, exactly-once semantics',
      'Latency engineering — microsecond-level read/write paths',
    ],
    footnote: '47M writes/day · 13μs P50 · 99.99% availability',
  },
  {
    id: 'nlp',
    title: 'NLP Research',
    blurb: 'Making language models produce structured output you can execute.',
    items: [
      'Text-to-SQL — schema linking, execution accuracy, spatial predicates',
      'LLM adaptation — LoRA, QLoRA, PEFT',
      'Semantic parsing and constrained structured prediction',
      'Dataset construction and evaluation for Brazilian Portuguese',
    ],
    footnote: 'MSc researcher @ IME-USP · SBBD 2026',
  },
  {
    id: 'hpc',
    title: 'Performance Engineering',
    blurb: 'Reading the machine as carefully as the code.',
    items: [
      'Parallel programming — OpenMP, MPI, CUDA',
      'Memory hierarchy, cache blocking, SIMD vectorisation',
      'Profiling — roofline analysis, perf, Nsight',
      'Benchmark methodology — STREAM, NAS, HPL',
    ],
    footnote: '10×+ speedup on dense matrix kernels',
  },
]

export type StackItem = { name: string; icon: string; group: string }

/** Icons are self-hosted under /media/tech — no CDN in the critical path. */
const tech = (file: string) => `/media/tech/${file}`

export const stack: StackItem[] = [
  { name: 'Python', icon: tech('python.svg'), group: 'Languages' },
  { name: 'C / C++', icon: tech('cplusplus.svg'), group: 'Languages' },
  { name: 'Cassandra', icon: tech('cassandra.svg'), group: 'Data' },
  { name: 'PostgreSQL', icon: tech('postgresql.svg'), group: 'Data' },
  { name: 'MongoDB', icon: tech('mongodb.svg'), group: 'Data' },
  { name: 'Iceberg', icon: tech('apache-iceberg.svg'), group: 'Data' },
  { name: 'Trino', icon: tech('trino.png'), group: 'Data' },
  { name: 'Kafka', icon: tech('kafka.svg'), group: 'Pipelines' },
  { name: 'Spark', icon: tech('spark.svg'), group: 'Pipelines' },
  { name: 'Airflow', icon: tech('airflow.svg'), group: 'Pipelines' },
  { name: 'PyTorch', icon: tech('pytorch.svg'), group: 'ML' },
  { name: 'Docker', icon: tech('docker.svg'), group: 'Infra' },
  { name: 'AWS', icon: tech('aws.svg'), group: 'Infra' },
  { name: 'GCP', icon: tech('gcp.svg'), group: 'Infra' },
]

export const awards = [
  {
    title: 'Paper published at SBBD 2026',
    org: 'Brazilian Symposium on Databases',
    year: '2026',
    detail:
      'AtlasSQL-BR — a Brazilian Portuguese geospatial text-to-SQL dataset. Anais do XLI SBBD, pp. 85-98.',
  },
]
