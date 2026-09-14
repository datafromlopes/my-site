---
title: "In Cassandra, DELETE is a write"
description: "Nothing is removed. A marker is written, replicated, and paid for on every read until compaction is allowed to drop it, ten days later by default. Here is why the mechanism exists, what it costs, and the modelling mistakes that make it explode."
date: 2026-09-13
tags:
  - distributed systems
  - Apache Cassandra
  - storage engines
readingTime: 6 min
---

Every introduction to Cassandra says it is write-optimised. What it rarely says is that this
applies to `DELETE` too, and that the bill for those writes arrives on the read path, often as
a timeout nobody can explain.

The statement below does not remove a single byte:

```sql
DELETE FROM events WHERE device_id = 42 AND ts = '2026-09-13T10:00:00Z';
```

It appends a new record called a *tombstone*: a marker with a timestamp that says "this cell
is dead". The data it shadows stays on disk. Understanding why Cassandra chose this, and what
it charges for it, is the difference between a cluster that hums and one that pages you at 3 am.

## Why not just delete?

Take a keyspace with replication factor 3 and a client writing at `QUORUM`. One replica is
down when the delete arrives. Two replicas acknowledge, the coordinator returns success, and
the client moves on.

Now suppose the delete had physically removed the row on those two replicas. The third node
comes back a few hours later still holding the old copy. On the next read that touches it, or
on the next repair, Cassandra compares replicas and sees one node with data and two without.
It has no way to tell "this was deleted" from "these two never received the write". The
reconciliation logic does the only thing it can: it copies the row back to the other two.

The row is resurrected. Operators call it *zombie data*, and it is not a bug in the
reconciliation, it is the absence of information.

A tombstone fixes the problem by turning deletion into just another write. It carries a
timestamp, it replicates like any other mutation, hinted handoff can deliver it late, and when
the lagging node finally sees it, last-write-wins resolves the conflict in the tombstone's
favour. The old copy loses because it is older. There is nothing to reconstruct.

## The cost lands on the read path

Because a tombstone is stored, it has to be read. A partition's data is spread across several
SSTables plus the memtable. To answer a query, the coordinator merges those sources, compares
timestamps cell by cell, and drops everything that a tombstone supersedes. That filtering
happens in memory, on every read, until compaction physically removes both the tombstone and
the data it shadows.

So a partition that has been deleted from heavily is expensive to read even when it returns
almost nothing. You scan twelve thousand cells to return three.

Cassandra ships two guard rails for this in `cassandra.yaml`:

```yaml
tombstone_warn_threshold: 1000
tombstone_failure_threshold: 100000
```

Above the first, a warning is logged per read. Above the second, the read is aborted with a
`TombstoneOverwhelmingException`. Both thresholds are counted per query, within the slice of a
partition being scanned. One hundred thousand sounds like a lot until you meet the anti-pattern
in the last section.

## When does it go away?

A tombstone becomes eligible for removal only after `gc_grace_seconds`, whose default is
`864000`, ten days. Until then compaction must keep it, and the reason is the same failure
scenario from the first section: the marker has to outlive any replica that might still be
holding the old data, so that the replica gets the delete before the delete is forgotten.

That turns an operational habit into a hard requirement. Hinted handoff only covers a short
outage, three hours by default (`max_hint_window`). Anything longer depends on anti-entropy
repair, and repair must complete on every node within the `gc_grace_seconds` window. If it does
not, compaction on the healthy replicas drops the tombstone, the lagging replica still has the
row, and the next reconciliation brings it back. This time with no tombstone left to stop it.

Repair within `gc_grace_seconds` is not a best practice. It is a precondition for `DELETE`
meaning what you think it means.

You can lower `gc_grace_seconds` per table, and for TTL-only tables with no explicit deletes
people do. Just remember that you are shrinking the window in which repair is allowed to be
late.

## What counts as a tombstone

Deletes are not the only source. Every one of these produces a marker that goes through the
same lifecycle:

- Deleting a single cell, a row, a partition, or a clustering range (range tombstone).
- Writing `null` to a column. This is a delete of that cell.
- A TTL expiring. Once `ttl` elapses the cell is converted to a tombstone at compaction time.
- Inserting into a collection column with `UPDATE ... SET col = {...}`. Replacing the whole
  collection first tombstones the old one.

The granularity matters for cost. Deleting a partition writes one partition-level tombstone
that shadows everything below it. Deleting the same rows one by one writes one tombstone per
row, and the read path has to visit every one of them.

## The classic mistake

Using a Cassandra partition as a queue. Producers insert rows, consumers read the oldest rows
and delete them. Each consumed message leaves a tombstone in the same partition, at the
beginning of the clustering order, exactly where the next consumer will start scanning. After a
few hours of steady traffic the head of the partition is a wall of markers, the read has to
climb over all of them to reach the first live row, and `tombstone_failure_threshold` is hit by
the very query that is supposed to be the hot path.

If the workload needs heavy deletion, the options that work are:

- Delete whole partitions instead of rows. One marker, not thousands.
- Bucket by time in the partition key (`device_id, day`) and let old buckets expire with a TTL,
  so tombstones land in partitions nobody reads any more.
- Do not model a queue in Cassandra. Kafka exists.

The one-line summary: in Cassandra, deleting is writing a marker that only disappears ten days
later, and only if repair ran. Everything else follows from that.

## References

1. **Apache Cassandra documentation.** *Tombstones.* https://cassandra.apache.org/doc/latest/cassandra/managing/operating/compaction/tombstones.html
2. **Apache Cassandra documentation.** *cassandra.yaml configuration file* (`tombstone_warn_threshold`, `tombstone_failure_threshold`, `max_hint_window`). https://cassandra.apache.org/doc/latest/cassandra/managing/configuration/cass_yaml_file.html
3. **DataStax.** *About deletes and tombstones in Cassandra.* https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/dml/dmlAboutDeletes.html
4. **Rodriguez, A. (2016).** *About Deletes and Tombstones in Cassandra.* The Last Pickle. https://thelastpickle.com/blog/2016/07/27/about-deletes-and-tombstones.html
5. **Lakshman, A., & Malik, P. (2010).** *Cassandra: a decentralized structured storage system.* ACM SIGOPS Operating Systems Review, 44(2), 35–40.