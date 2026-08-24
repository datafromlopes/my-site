---
title: Geospatial Text-to-SQL for Brazilian Portuguese
subtitle: MSc research — translating natural language questions into executable spatial SQL
date: 2026-06-01
start: '2023-08'
end: null
status: ongoing
featured: true
order: 0
org: IME-USP
orgType: academic
orgUrl: https://www.ime.usp.br
role: MSc researcher — advised by Prof. Kelly Rosa Braghetto
cover: /media/projects/text-to-sql-cover.png
repo: https://github.com/datafromlopes/geo-nlq-to-sql
tldr: A fine-tuned language model and a purpose-built Brazilian Portuguese dataset for translating geospatial questions into SQL that actually runs.
stack:
  - Python
  - PyTorch
  - Transformers
  - PostGIS
  - LoRA / PEFT
tags:
  - text-to-SQL
  - NLP
  - geospatial
  - LLM fine-tuning
  - semantic parsing
metrics:
  - value: 'PT-BR'
    label: Target language
  - value: 'PostGIS'
    label: Execution target
  - value: '3'
    label: Predicate families
  - value: 'SBBD 26'
    label: First publication
---

## Context

Querying a database is a specialised skill, and that skill is the barrier between public data and
the people it was collected for. Text-to-SQL systems remove the barrier by generating a SQL query
from a natural language question over a relational schema — the query must be semantically
equivalent to the question, valid against the schema, and produce the result the user actually
meant.

![The text-to-SQL task over a relational schema](/media/projects/text-to-sql-schema.png)

The field has moved quickly. Two gaps have not moved with it.

**Spatial queries.** State-of-the-art models handle joins and aggregations well and spatial
predicates badly, because existing training sets contain almost no spatial data. A question like
*"which schools are inside the municipality of Campinas?"* requires `ST_Within`, a geometry column,
and an understanding that a municipality is a polygon rather than a string.

**Language.** English resources dominate to the point where Brazilian Portuguese is effectively
unexplored — despite being the language in which Brazilian public data is described, documented
and asked about.

## Objectives

This project improves access to georeferenced data of public interest by developing a fine-tuned
LLM specialised in translating natural language into geospatial SQL, together with the Brazilian
Portuguese dataset that makes such training possible.

The dataset targets the spatial operations that appear in real analysis:

1. **Containment** — is one area inside another? *"Which schools are located within the municipality of Campinas?"*
2. **Buffering** — what falls within a radius? *"List the museums within 2 km of Avenida Paulista."*
3. **Adjacency and intersection** — how do regions relate? *"Which neighbourhoods border the Liberdade district?"*

The work proceeds in three phases:

1. **Dataset curation** — build a Brazilian Portuguese corpus of geospatial questions grounded in real public schemas.
2. **Model adaptation** — fine-tune open-weight LLMs on the specialised query distribution.
3. **Evaluation** — measure execution accuracy and spatial correctness, not just string similarity to a reference query.

## Expected contributions

A fine-tuned model and a public dataset both specialised for geospatial text-to-SQL in Brazilian
Portuguese, plus something the field currently lacks: a reference point for how accurate spatial
query translation actually is, with an evaluation methodology that other languages and technical
domains can reuse.

## Status

The dataset — **AtlasSQL-BR** — has been accepted for publication at SBBD 2026. Model fine-tuning
and evaluation experiments are in progress.
