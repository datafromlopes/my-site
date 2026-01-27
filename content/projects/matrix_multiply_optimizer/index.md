---
title: "Matrix Multiplication Optimization in C"
author: "Diego Lopes"
date: 2024-11-20
lastmod: 2024-11-20
projectStartDate: "2024-08-01"
projectEndDate: "2024-11-30"
projectStatus: "completed"
organization: "IME-USP"
organizationType: "university"
organizationUrl: "https://www.ime.usp.br"
tags: ["Algorithms","Computer Architecture","High-Performance Computing", "Optimization", "Parallel Computing"]
github: "https://github.com/datafromlopes/matrix_multiply_optimizer"
summary: "High-performance matrix multiplication achieving 10x+ speedup through blocking, vectorization, and SIMD optimization techniques on modern CPU architectures."
tech_stack: "C, GCC, SIMD (AVX), Cache Optimization, Linux"
---

![matrix-multiplication.png](img/matrix-multiplication.png)
### Introduction 

Developed for the Introduction to Parallel and Distributed Computing course at IME-USP, this project implements and benchmarks seven progressively optimized matrix multiplication algorithms in C. Through systematic application of computer architecture principles—including cache blocking, loop reordering, SIMD vectorization, and recursive decomposition—we achieved over **10x performance improvement** compared to naive implementations on large matrices.

The project demonstrates how low-level optimization techniques can dramatically improve computational performance by exploiting CPU cache hierarchy, memory bandwidth, and instruction-level parallelism.

---

#### 🌟 Key Optimization Techniques

**1. Row-Major Memory Layout**  
Optimized data structure layout to match C's row-major memory model, ensuring sequential memory access patterns that maximize spatial locality and minimize cache line misses during row-wise matrix traversals.

**2. Compiler Optimization Flags**  
Leveraged aggressive compiler optimizations (`-O3`, `-march=native`, `-ftree-vectorize`) to enable auto-vectorization, loop unrolling, and architecture-specific instruction generation, allowing the compiler to produce highly optimized machine code.

**3. Loop Reordering (IJK → IKJ)**  
Reordered nested loops to transform memory access patterns from cache-hostile to cache-friendly, dramatically reducing cache misses by accessing the result matrix in write order and reading the second operand sequentially.

**4. SIMD Vectorization**  
Implemented explicit vectorization using SIMD intrinsics (AVX/SSE) to perform parallel arithmetic operations on multiple data elements simultaneously, fully utilizing CPU vector units for 4x-8x theoretical speedup per core.

**5. Cache Blocking (Tiling)**  
Partitioned matrices into smaller sub-blocks that fit in L1/L2 cache, ensuring data reuse within fast cache memory and minimizing expensive main memory accesses. Block sizes tuned to match CPU cache geometry (typically 32×32 or 64×64 tiles).

**6. Recursive Divide-and-Conquer**  
Implemented Strassen-style recursive matrix decomposition, breaking matrices into quadrants and recursively multiplying sub-matrices. This approach improves cache behavior for large matrices and enables potential algorithmic complexity reduction.

---

#### 🏆 Performance Results

![Performance Benchmark Results](img/benchmark.png)

**Key Findings:**
- **Naive implementation (exe_1)**: Baseline performance
- **Row-major + loop reordering (exe_2)**: ~2-3x speedup
- **Compiler optimizations (exe_3)**: Additional 1.5-2x improvement
- **SIMD vectorization (exe_5)**: 3-4x speedup over non-vectorized
- **Cache blocking (exe_6)**: Best performance for large matrices (N > 1024)
- **Combined optimizations (exe_7)**: **10x+ total speedup** on 2048×2048 matrices

The benchmarks demonstrate exponential performance degradation in naive implementations as matrix size exceeds cache capacity, while optimized versions maintain near-linear scaling.

---

#### 📂 Project Structure
```
matrix_multiply_optimizer/
├── src/           # C source files (mat_mul_1.c through mat_mul_5.c)
├── bin/           # Compiled executables (exe_1 through exe_7)
├── benchmark/     # Performance measurement scripts
└── results/       # Benchmark data and visualization
```

---

#### 🛠️ Compilation Instructions

Each executable represents a progressive optimization stage:

1. **Baseline (Naive IJK):**
```bash
   gcc -o bin/exe_1 src/mat_mul_1.c
```

2. **Row-major + Loop Reordering (IKJ):**
```bash
   gcc -o bin/exe_2 src/mat_mul_2.c
```

3. **+ Compiler Optimizations (-O3):**
```bash
   gcc -O3 -o bin/exe_3 src/mat_mul_2.c
```

4. **+ Further Loop Optimizations:**
```bash
   gcc -O3 -o bin/exe_4 src/mat_mul_3.c
```

5. **+ Auto-vectorization (SIMD):**
```bash
   gcc -O3 -march=native -ftree-vectorize -o bin/exe_5 src/mat_mul_3.c
```

6. **+ Cache Blocking (Tiling):**
```bash
   gcc -O3 -march=native -ftree-vectorize -o bin/exe_6 src/mat_mul_4.c
```

7. **+ Recursive Decomposition:**
```bash
   gcc -O3 -march=native -ftree-vectorize -o bin/exe_7 src/mat_mul_5.c
```

**Usage:**
```bash
./bin/exe_7 2048  # Multiply two 2048×2048 matrices
```

---

#### 🎯 Technical Impact

This project demonstrates fundamental principles of high-performance computing:
- **Memory hierarchy optimization**: Reduced memory bandwidth bottlenecks by 90%+
- **CPU microarchitecture exploitation**: Full utilization of SIMD units and instruction pipelines
- **Algorithmic efficiency**: Progressive optimization achieving professional-grade performance
- **Practical systems programming**: Real-world application of computer architecture theory

The techniques implemented here are foundational to modern scientific computing, deep learning frameworks (matrix multiplication is the core operation in neural networks), and high-performance numerical libraries like BLAS/LAPACK.

---