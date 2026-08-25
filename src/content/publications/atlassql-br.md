---
title: 'AtlasSQL-BR: A Brazilian Portuguese Geospatial Text-to-SQL Dataset with Spatial Hierarchies'
date: 2026-10-01
year: 2026
type: conference
status: published
featured: true
authors:
  - name: Diego O. Lopes
    me: true
  - name: Kelly R. Braghetto
    url: https://www.ime.usp.br/~kellyrb/
venue: Anais do XLI Simpósio Brasileiro de Banco de Dados
venueShort: SBBD 2026
publisher: Sociedade Brasileira de Computação (SBC)
location: São Carlos, SP, Brazil
pages: '85-98'
issn: '2763-8979'
doi: 10.5753/sbbd.2026.249149
pdfUrl: https://sol.sbc.org.br/index.php/sbbd/article/view/43962/43725
landingUrl: https://sol.sbc.org.br/index.php/sbbd/article/view/43962
codeUrl: https://github.com/datafromlopes/atlas-sql-br
datasetUrl: https://huggingface.co/datasets/datafromlopes/atlas-sql-br
tldr: A real-world geospatial text-to-SQL benchmark in Brazilian Portuguese, built on school census data and official geographic boundary hierarchies.
abstract: >-
  The Text-to-SQL task, which translates natural language into SQL queries, democratizes database
  access by enabling non-experts to query and analyze data effectively. While the field has seen
  significant progress, state-of-the-art models still fall short in processing geospatial queries
  due to a lack of diverse spatial data in existing training sets. This issue is compounded by the
  overwhelming dominance of English-language resources, leaving languages like Brazilian Portuguese
  largely underexplored. To bridge these gaps, we introduce AtlasSQL-BR, a novel, real-world
  geospatial Text-to-SQL dataset in Brazilian Portuguese. Built upon school census data and
  geographic boundary hierarchies, this dataset provides a robust benchmark for geospatial queries.
tags:
  - text-to-SQL
  - semantic parsing
  - geospatial databases
  - dataset
  - NLP
bibtex: |
  @inproceedings{lopes2026atlassql,
    author    = {Lopes, Diego O. and Braghetto, Kelly R.},
    title     = {AtlasSQL-BR: A Brazilian Portuguese Geospatial Text-to-SQL
                 Dataset with Spatial Hierarchies},
    booktitle = {Anais do XLI Simp\'osio Brasileiro de Banco de Dados (SBBD 2026)},
    year      = {2026},
    pages     = {85--98},
    address   = {S\~ao Carlos, SP, Brasil},
    publisher = {Sociedade Brasileira de Computa\c{c}\~ao},
    issn      = {2763-8979},
    doi       = {10.5753/sbbd.2026.249149},
    url       = {https://doi.org/10.5753/sbbd.2026.249149}
  }
---

## Why this dataset exists

Text-to-SQL benchmarks are overwhelmingly English, and overwhelmingly non-spatial. Both gaps
matter for the same reason: the queries people actually want to ask of public data in Brazil are
in Portuguese, and they are frequently about *where*.

*Which schools sit inside the municipality of Campinas? Which neighbourhoods border Liberdade?
How many museums are within two kilometres of Avenida Paulista?* Each of these is a spatial
predicate — containment, adjacency, buffering — and each is invisible to a model trained on
Spider or WikiSQL.

## What is in it

AtlasSQL-BR pairs Brazilian Portuguese questions with executable SQL over two real sources:

- **School census data**, which carries the attributes people care about — enrolment, staffing, infrastructure.
- **Official geographic boundary hierarchies**, which supply the nesting that makes spatial reasoning non-trivial: country → state → mesoregion → microregion → municipality → district.

The hierarchy is the interesting part. A question like *"schools in the São Paulo metropolitan
region"* requires the model to resolve an administrative concept into a set of geometries before
a single spatial operator is applied.

## Next steps

- Extend coverage to buffer and distance-based predicates over point-of-interest data.
- Report baselines for open-weight models fine-tuned with LoRA against closed-model prompting.
- Release the evaluation harness alongside the dataset.
