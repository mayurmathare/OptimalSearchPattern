# Optimal Binary Search Tree (Dynamic Programming)

An educational interactive web application explaining the **Optimal Binary Search Tree (OBST)** algorithm using **Dynamic Programming**, built as a Design and Analysis of Algorithms (DAA) assignment.

---

## 🌐 Live Demonstration

* **Live Website URL:** [https://mayurmathare.github.io/OptimalSearchPattern/](https://mayurmathare.github.io/OptimalSearchPattern/)
* **GitHub Repository:** [https://github.com/mayurmathare/OptimalSearchPattern](https://github.com/mayurmathare/OptimalSearchPattern)

---

## 📖 Overview

An **Optimal Binary Search Tree (OBST)** is a binary search tree arranged to minimize the total weighted search cost based on the frequency of searching each key:

$$\text{Search Cost} = \sum_{i=1}^n \text{Frequency}_i \times \text{Level}_i$$

* Root is at **Level 1**.
* Keys with higher frequencies are placed closer to the root to reduce search comparisons.

---

## 🧮 Mathematical Recurrence

$$\text{Cost}(i, j) = \min_{i \le r \le j} \Big\{ \text{Cost}(i, r - 1) + \text{Cost}(r + 1, j) \Big\} + \text{Sum}(i, j)$$

* `i`: First key
* `j`: Last key
* `r`: Candidate root (\(i \le r \le j\))
* `Sum(i, j)`: Sum of frequencies between \(i\) and \(j\)

---

## 💡 Worked Example

Given Keys: `A, B, C, D` with Frequencies: `10, 20, 5, 15`

* **Optimal Root:** `B`
* **Minimum Search Cost:** `85`

Tree Structure:
```text
        B
       / \
      A   D
         /
        C
```

Weighted Search Cost Breakdown:
* A = 10 × 2 = 20
* B = 20 × 1 = 20
* C = 5 × 3 = 15
* D = 15 × 2 = 30
* **Total = 85**

---

## ⏱️ Complexity Analysis

| Approach | Time Complexity | Space Complexity | Optimality |
| :--- | :--- | :--- | :--- |
| **Brute Force** | Exponential: $\mathcal{O}(4^n / n^{3/2})$ | $\mathcal{O}(n)$ | Guaranteed |
| **Dynamic Programming** | Polynomial: $\mathcal{O}(n^3)$ | $\mathcal{O}(n^2)$ | Guaranteed |

---

## 🛠️ Features

* **Concept & Algorithm:** Clear breakdown of BST, OBST, search frequencies, and the 10-step DP procedure.
* **Interactive Simulator:** Test custom keys and frequencies with real dynamic programming computation.
* **DP Matrix Inspector:** Interactive Cost, Root, and Weight tables with subproblem recurrence breakdown.
* **Dynamic Tree Visualizer:** Clean SVG tree diagram generated directly from the DP root table.
