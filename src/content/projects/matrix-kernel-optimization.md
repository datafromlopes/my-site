---
title: Dense Matrix Multiplication, Seven Ways
subtitle: Taking a naive triple loop to a 10× speedup by respecting the memory hierarchy
date: 2024-11-20
start: '2024-08'
end: '2024-11'
status: shipped
featured: false
order: 2
org: IME-USP
orgType: academic
orgUrl: https://www.ime.usp.br
role: Coursework — Introduction to Parallel and Distributed Computing
cover: /media/projects/matrix-multiplication.png
repo: https://github.com/datafromlopes/matrix_multiply_optimizer
tldr: Seven progressively optimised matrix multiplication kernels in C, benchmarked against each other — 10×+ end-to-end speedup on 2048×2048 matrices.
stack:
  - C
  - GCC
  - AVX / SSE intrinsics
  - Linux perf
tags:
  - high-performance computing
  - computer architecture
  - SIMD
  - cache optimisation
metrics:
  - value: '10×+'
    label: End-to-end speedup
  - value: '7'
    label: Kernel variants
  - value: '2048²'
    label: Largest benchmark
---

## The exercise

Matrix multiplication is three nested loops and a single arithmetic operation. It is also the
clearest demonstration available that on modern hardware, *how* you touch memory matters more than
how many operations you perform.

This project implements seven kernels in C, each one a single deliberate change from the last, and
benchmarks them against each other. The point is not the final number — it is being able to
attribute the number to a specific architectural cause.

![Matrix multiplication kernel structure](/media/projects/matrix-multiplication.png)

## The seven steps

**1 — Row-major layout.** Match C's memory model so row traversal is sequential, maximising
spatial locality and minimising cache line misses.

**2 — Loop reordering (IJK → IKJ).** The same arithmetic in a different order. Writing to the
result matrix in write order and reading the second operand sequentially turns a cache-hostile
access pattern into a cache-friendly one — the single highest-leverage change in the sequence.

**3 — Compiler optimisation.** `-O3 -march=native -ftree-vectorize` enables auto-vectorisation,
loop unrolling and architecture-specific instruction selection. Free performance, but only once
the access pattern deserves it.

**4 — SIMD vectorisation.** Explicit AVX/SSE intrinsics to perform arithmetic on multiple elements
per instruction, using the vector units the auto-vectoriser could not fully exploit.

**5 — Cache blocking (tiling).** Partition the matrices into sub-blocks sized to fit in L1/L2, so
each loaded tile is reused before eviction. Block sizes tuned to the cache geometry — typically
32×32 or 64×64.

**6 — Recursive decomposition.** Strassen-style quadrant subdivision, which improves cache
behaviour for large matrices and opens the door to asymptotic reduction.

**7 — Combined.** Everything above, together.

## Results

![Benchmark across kernel variants and matrix sizes](/media/projects/benchmark.png)

| Kernel | Change | Effect |
| --- | --- | --- |
| `exe_1` | Naive IJK | Baseline |
| `exe_2` | Row-major + IKJ reorder | ~2–3× |
| `exe_3` | `-O3` | Further 1.5–2× |
| `exe_5` | SIMD vectorisation | 3–4× over scalar |
| `exe_6` | Cache blocking | Best for N > 1024 |
| `exe_7` | Combined | **10×+ on 2048×2048** |

The shape of the curve is the finding: naive implementations degrade sharply once the working set
exceeds cache capacity, while the blocked variants scale close to linearly. The performance cliff
is not in the algorithm — it is in the memory system, and it is visible in the data.

## Why it matters

Every technique here is load-bearing in production numerical software. BLAS and LAPACK are built
on blocked, vectorised kernels; every deep learning framework spends most of its time inside one.
Understanding *why* a GEMM is fast is the difference between using a library and knowing what it
costs you.
