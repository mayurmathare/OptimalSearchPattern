# Optimal Search Pattern — Optimal Binary Search Tree (OBST)

### Design and Analysis of Algorithms (DAA) — College Practical Submission

An interactive, academic-grade laboratory website implementing the **Optimal Binary Search Tree (OBST)** problem using **Dynamic Programming**.

Developed by **Mayur Mathare** (Roll No: **CD24023**) for the **Design and Analysis of Algorithms (DAA)** practical laboratory curriculum.

---

## 👨‍🎓 Student Submission Details

* **Student Name:** Mayur Mathare
* **Roll Number:** CD24023
* **Subject:** Design and Analysis of Algorithms (DAA)
* **Practical Topic:** Optimal Search Pattern (Optimal Binary Search Tree using Dynamic Programming)
* **Academic Year:** 2024–2025

---

## 🌐 Live Demonstration

* **Live Website URL:** [https://mayurmathare.github.io/OptimalSearchPattern/](https://mayurmathare.github.io/OptimalSearchPattern/)
* **GitHub Repository:** [https://github.com/mayurmathare/OptimalSearchPattern](https://github.com/mayurmathare/OptimalSearchPattern)

---

## 📖 Practical Overview

An **Optimal Binary Search Tree (OBST)** is a binary search tree constructed for a known set of sorted keys and their search frequencies or query probabilities, arranged so that the total expected search cost is minimized:

$$\text{Expected Cost} = \sum_{i=1}^n \text{depth}(k_i) \times \text{frequency}_i$$

Because higher frequency keys require fewer comparisons when placed closer to the root, the algorithm leverages **Dynamic Programming** to evaluate all possible subtree configurations in polynomial time.

### Practical Flow
1. **Aim** &rarr; Formal practical objective.
2. **Objectives** &rarr; 6 targeted academic outcomes.
3. **Theory** &rarr; Comprehensive BST, OBST, and DP foundations.
4. **Problem Statement** &rarr; Formal input/output constraints.
5. **Mathematical Formula** &rarr; Complete recurrence relation and parameter breakdown.
6. **Algorithm** &rarr; 11 sequential execution steps & syntax-highlighted pseudocode.
7. **Flowchart** &rarr; Clean SVG visual flowchart diagram.
8. **Interactive Simulator** &rarr; Dynamic inputs, presets, key sorting, and frequency randomizer.
9. **DP Tables** &rarr; Live Cost $C[i][j]$, Root $R[i][j]$, and Weight $W[i][j]$ matrices with cell inspection.
10. **Calculation Walkthrough** &rarr; Step-by-step root evaluation breakdown for active data.
11. **Optimal BST Visualization** &rarr; Interactive SVG tree canvas with per-node costs and levels.
12. **Result Summary** &rarr; Direct verification formula and official student declaration.
13. **Complexity Analysis** &rarr; $O(n^3)$ time derivation, $O(n^2)$ space, and Knuth's $O(n^2)$ optimization note.
14. **Real-World Applications** &rarr; Database indexing, compiler symbol tables, routing, dictionaries.
15. **Discussion / Viva Questions** &rarr; Interactive accordion covering standard university oral exam questions.
16. **Conclusion** &rarr; Practical summary and deployment instructions.

---

## 🧮 Mathematical Recurrence

For a subtree spanning keys $k_i \dots k_j$:

$$\text{Cost}(i, j) = \min_{i \le r \le j} \Big[ \text{Cost}(i, r - 1) + \text{Cost}(r + 1, j) \Big] + \text{Sum}(i, j)$$

* $i$: Starting key index
* $j$: Ending key index
* $r$: Candidate root index ($i \le r \le j$)
* $\text{Sum}(i, j) = \sum_{k=i}^j f_k$: Cumulative frequency sum
* **Base Cases:**
  * $\text{Cost}(i, i - 1) = 0$ (empty subtree)
  * $\text{Cost}(i, i) = f_i$ (single key subtree)

---

## ⏱️ Complexity Analysis

| Approach | Time Complexity | Space Complexity | Optimality Guarantee |
| :--- | :--- | :--- | :--- |
| **Brute Force** | $\mathcal{O}(4^n / n^{3/2})$ (Catalan) | $\mathcal{O}(n)$ | Guaranteed (Intractable for $n > 15$) |
| **Greedy by Frequency** | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n)$ | **Not Guaranteed** (Sub-optimal) |
| **Dynamic Programming** | $\mathcal{O}(n^3)$ | $\mathcal{O}(n^2)$ | **100% Globally Optimal** |
| **DP with Knuth's Optimization** | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | **100% Globally Optimal** |

---

## 🚀 How to Enable GitHub Pages
 
The complete code is already pushed to [github.com/mayurmathare/OptimalSearchPattern](https://github.com/mayurmathare/OptimalSearchPattern).
 
To turn on the live website:
 1. Open your repository: [https://github.com/mayurmathare/OptimalSearchPattern](https://github.com/mayurmathare/OptimalSearchPattern)
 2. Navigate to **Settings > Pages** (in the left sidebar).
 3. Under **Build and deployment > Branch**, select `main` and folder `/ (root)`.
 4. Click **Save**.
 5. Your site will be published at:
    👉 **[https://mayurmathare.github.io/OptimalSearchPattern/](https://mayurmathare.github.io/OptimalSearchPattern/)** within 1–2 minutes!

---

## 🛠️ Tech Stack

* **HTML5:** Semantic, accessible layout structured for academic review.
* **CSS3:** Responsive flexbox/grid styling using an academic dark/light blue theme, print stylesheet for practical reports.
* **Vanilla JavaScript:** Zero external libraries or runtime dependencies; 100% client-side DP engine and SVG tree generator.
