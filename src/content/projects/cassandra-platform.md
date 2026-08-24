---
title: High-Throughput IoT Telemetry Platform
subtitle: A Cassandra cluster built from scratch for one million connected devices
date: 2025-12-01
start: '2024-01'
end: '2025-01'
status: shipped
featured: true
order: 1
org: Pulsus
orgType: industry
orgUrl: https://pulsus.mobi
role: Senior Data Engineer — architecture and delivery
cover: /media/projects/cassandra-diagram.png
tldr: Production Apache Cassandra deployment serving 1M+ connected devices at 13μs P50 write latency and 99.99% availability, at 75% lower cost than the managed alternative.
stack:
  - Apache Cassandra 5.x
  - AWS EC2 (Graviton4)
  - Amazon S3
  - Apache Airflow 3.x
  - Python
  - Site24x7
tags:
  - distributed systems
  - NoSQL
  - data modelling
  - cost engineering
metrics:
  - value: 1.46B+
    label: Writes served
  - value: 13μs
    label: P50 write latency
  - value: '99.99%'
    label: Availability
  - value: '−75%'
    label: Operating cost
---

## The problem

A fleet of more than one million managed Android devices reports telemetry continuously. The
existing MongoDB pipelines could keep up with the volume only by scaling vertically, and the bill
had reached US$6,000 per month. Read latency was unpredictable enough that the product team had
stopped asking for real-time reports.

The requirement was not simply "faster". It was *predictable*: a write path whose tail latency does
not move when a node goes down, and a cost curve that stays flat as the fleet grows.

## The system

![Cluster topology across three availability zones](/media/projects/cassandra-diagram.png)

I architected and deployed a production Apache Cassandra cluster on AWS from scratch, growing from
8 to 12 nodes across three availability zones after six months in production.

**Topology.** Rack-aware `NetworkTopologyStrategy` with `RF=3`, one rack per availability zone.
Any single AZ can fail without losing a quorum, which is what carries the 99.99% availability
figure rather than an aspiration about it.

**Hardware.** `m8g.2xlarge` instances on AWS Graviton4 with NVMe SSDs, sustaining 20K+ IOPS per
node. The ARM instances delivered roughly 30% better price-performance than the x86 equivalents
for this workload — a decision worth making once and benefiting from every month.

**Data model.** Composite partition keys spread one million device streams evenly and prevent the
hot partitions that quietly destroy Cassandra clusters. Clustering by timestamp `DESC` matches the
access pattern — recent data first — and `TimeWindowCompactionStrategy` aligns SSTable compaction
with the temporal shape of the data instead of fighting it. TTL-based lifecycle management and
LZ4 compression balance storage cost against read amplification.

## Operations

A cluster is only as good as the day you need to restore it.

- **Hourly incremental backups to S3** using `sync`, transferring only modified SSTables. This keeps egress cost proportional to change rate rather than to dataset size.
- **Airflow DAGs** orchestrate backup scheduling and retries, so failures surface as task failures rather than as silence.
- **Site24x7 dashboards** track per-AZ latency percentiles, node availability and disk headroom.

## Results

| Dimension | Before | After |
| --- | --- | --- |
| Monthly cost | US$6,000 | US$1,500 |
| P50 write latency | milliseconds | 13μs |
| P50 read latency | variable | 380μs |
| Availability | best effort | 99.99% over 12 months |
| Reporting freshness | minutes | seconds |

Sustained throughput settled at 47M writes/day, 1.46B+ cumulative, with zero data loss across
twelve months of operation and automated point-in-time recovery from hourly snapshots.

The result the product team actually noticed: real-time reports became possible, and
time-to-insight dropped from minutes to seconds.
