---
title: "Matrix Multiplication Optimization in C"
author: "Diego Lopes"
date: 2024-11-20
tags: [
  "Algorithms",
  "Computer Architecture",
  "High-Performance Computing", 
  "Optimization", 
  "Parallel Computing"
]
github: "https://github.com/datafromlopes/matrix_multiply_optimizer"
summary: "This project provides optimized implementations of matrix multiplication algorithms in C."
image: "img/matrix-multiplication.png"
---

---

### Introduction 

This project was developed on Introduction to Parallel and Distributed Computing class at IME-USP to provides optimized implementations of matrix multiplication algorithms in C, leveraging advanced techniques to achieve high performance. We explore methods like blocking, vectorization, and loop reordering to maximize matrix multiplication efficiency.

---

#### 🌟 Key Techniques

🔹 **1. Row-Major Order**

Row-major order stores data row by row in memory. This technique ensures better spatial locality during row-wise traversals, reducing memory access times and improving overall performance.

🔹 **2. Use of Optimization Flags**

Using optimization flags, such as -O3, adjusts how the compiler generates code by applying aggressive optimization techniques. This can significantly improve performance by reducing execution time and better utilizing the available hardware.

🔹 **3. Loop Reordering**

Loop reordering adjusts the order of nested loop iterations to optimize memory access patterns. This improves data locality and minimizes cache misses, making computations more efficient.

🔹 **4. Vectorization**

Vectorization leverages SIMD (Single Instruction, Multiple Data) instructions to perform parallel computations, accelerating processing on supported hardware architectures.

🔹 **5. Blocks**

The blocks technique breaks matrices into smaller sub-blocks to optimize memory hierarchy usage. This reduces cache misses and enhances performance by improving memory access patterns.

🔹 **5. Recursion**

Recursion involves breaking down a problem into smaller, self-similar subproblems. In the context of matrix multiplication, this entails recursively dividing the matrices into quadrants and multiplying the corresponding quadrants. This approach can lead to significant performance improvements, especially for larger matrices.

---
#### 🏆 Outcomes Achieved
![alt text](img/benchmark.png)
---

##### 📂 Project Structure

- `src/`: Contains the C source code with optimized algorithm implementations.
- `bin/`: Contains the executables compiled from sources.

##### 🛠️ Compilation Instructions

To compile the project, use a compiler like `gcc` with appropriate optimization flags for SIMD and other techniques:

1. `bin/exe_1`
    ```bash
    gcc -o bin/exe_1 src/mat_mul_1.c
2. `bin/exe_2`
    ```bash
    gcc -o bin/exe_2 src/mat_mul_2.c
3. `bin/exe_3`
    ```bash
    gcc -O3 -o bin/exe_3 src/mat_mul_2.c
4. `bin/exe_4`
    ```bash
    gcc -O3 -o bin/exe_4 src/mat_mul_3.c
5. `bin/exe_5`
    ```bash
    gcc -O3 -march=native -ftree-vectorize -o bin/exe_5 src/mat_mul_3.c
6. `bin/exe_6`
    ```bash
    gcc -O3 -march=native -ftree-vectorize -o bin/exe_6 src/mat_mul_4.c
7. `bin/exe_7`
    ```bash
    gcc -O3 -march=native -ftree-vectorize -o bin/exe_7 src/mat_mul_5.c

---