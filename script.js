/**
 * Optimal Search Pattern: Optimal Binary Search Tree using Dynamic Programming
 * Course: Design and Analysis of Algorithms (DAA)
 * Student: Mayur Mathare | Roll No: CD24023
 */

// Global State
let currentKeys = ['A', 'B', 'C', 'D'];
let currentFreqs = [10, 20, 5, 15];
let activeTableTab = 'cost';

let dpCost = [];
let dpRoot = [];
let dpWeight = [];
let subproblemDetails = {};
let constructedTree = null;

// Presets data
const PRESETS = {
  default: {
    keys: ['A', 'B', 'C', 'D'],
    freqs: [10, 20, 5, 15]
  },
  textbook3: {
    keys: ['10', '20', '30'],
    freqs: [34, 8, 50]
  },
  keys5: {
    keys: ['K1', 'K2', 'K3', 'K4', 'K5'],
    freqs: [15, 10, 5, 10, 20]
  }
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupNavbarScroll();
  setupMobileMenu();
  setupKeyCountSelector();
  loadPreset('default');
});

// Setup Sticky Navbar and Active Scroll Spy
function setupNavbarScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

// Setup Key Count Selector
function setupKeyCountSelector() {
  const selector = document.getElementById('numKeysSelect');
  if (selector) {
    selector.addEventListener('change', (e) => {
      const count = parseInt(e.target.value, 10);
      generateInputRows(count);
    });
  }
}

// Load Preset Data
function loadPreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  const count = preset.keys.length;
  const selector = document.getElementById('numKeysSelect');
  if (selector) selector.value = count;

  currentKeys = [...preset.keys];
  currentFreqs = [...preset.freqs];

  generateInputRows(count, currentKeys, currentFreqs);
  hideError();
  calculateOBST();
}

// Generate Dynamic Input Table Rows
function generateInputRows(count, keys = null, freqs = null) {
  const tbody = document.getElementById('keysTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const defaultKey = keys && keys[i] ? keys[i] : String.fromCharCode(65 + i);
    const defaultFreq = freqs && freqs[i] !== undefined ? freqs[i] : (i + 1) * 10;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--primary-navy); font-family: var(--font-mono);">${i + 1}</td>
      <td>
        <input type="text" class="key-input" id="key_${i}" value="${defaultKey}" placeholder="e.g. ${String.fromCharCode(65 + i)}" required>
      </td>
      <td>
        <input type="number" class="freq-input" id="freq_${i}" value="${defaultFreq}" min="1" step="any" placeholder="e.g. 10" required>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// Read Inputs from Table
function readInputs() {
  const keyInputs = document.querySelectorAll('.key-input');
  const freqInputs = document.querySelectorAll('.freq-input');

  const keys = [];
  const freqs = [];

  for (let i = 0; i < keyInputs.length; i++) {
    const k = keyInputs[i].value.trim();
    const fStr = freqInputs[i].value.trim();

    if (!k) {
      showError(`Key at row ${i + 1} cannot be empty.`);
      return null;
    }

    if (fStr === '' || isNaN(fStr)) {
      showError(`Frequency at row ${i + 1} must be a valid number.`);
      return null;
    }

    const f = parseFloat(fStr);
    if (f <= 0) {
      showError(`Frequency at row ${i + 1} must be strictly positive (greater than 0).`);
      return null;
    }

    keys.push(k);
    freqs.push(f);
  }

  // Check duplicate keys
  const uniqueKeys = new Set(keys);
  if (uniqueKeys.size !== keys.length) {
    showError("Duplicate keys detected. All binary search tree keys must be distinct.");
    return null;
  }

  hideError();
  return { keys, freqs };
}

// Sort Keys Ascending Helper
function sortKeysAscending() {
  const data = readInputs();
  if (!data) return;

  // Pair keys and freqs
  const pairs = data.keys.map((k, i) => ({ key: k, freq: data.freqs[i] }));

  // Sort by natural alphanumeric order
  pairs.sort((a, b) => {
    const numA = parseFloat(a.key);
    const numB = parseFloat(b.key);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: 'base' });
  });

  const sortedKeys = pairs.map(p => p.key);
  const sortedFreqs = pairs.map(p => p.freq);

  generateInputRows(sortedKeys.length, sortedKeys, sortedFreqs);
  calculateOBST();
}

// Randomize Frequencies Helper
function randomizeFrequencies() {
  const freqInputs = document.querySelectorAll('.freq-input');
  freqInputs.forEach(input => {
    input.value = Math.floor(Math.random() * 45) + 5;
  });
  calculateOBST();
}

// Reset Simulator
function resetSimulator() {
  loadPreset('default');
}

// Alert Message Helpers
function showError(msg) {
  const alert = document.getElementById('errorAlert');
  const text = document.getElementById('errorMessage');
  if (alert && text) {
    text.textContent = msg;
    alert.style.display = 'flex';
  }
}

function hideError() {
  const alert = document.getElementById('errorAlert');
  if (alert) {
    alert.style.display = 'none';
  }
}

// ==========================================================================
// CORE OPTIMAL BST DYNAMIC PROGRAMMING ALGORITHM
// ==========================================================================
function calculateOBST() {
  const data = readInputs();
  if (!data) return;

  const { keys, freqs } = data;
  currentKeys = keys;
  currentFreqs = freqs;

  const n = keys.length;

  // Matrices: 1-indexed (1..n)
  dpCost = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0));
  dpRoot = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0));
  dpWeight = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0));
  subproblemDetails = {};

  // Step 1: Base Cases (length 1)
  for (let i = 1; i <= n; i++) {
    dpCost[i][i] = freqs[i - 1];
    dpWeight[i][i] = freqs[i - 1];
    dpRoot[i][i] = i;

    const cellKey = `${i}_${i}`;
    subproblemDetails[cellKey] = {
      i, j: i,
      keysInRange: [keys[i - 1]],
      weight: freqs[i - 1],
      evaluations: [
        {
          rootIdx: i,
          rootKey: keys[i - 1],
          leftCost: 0,
          rightCost: 0,
          weight: freqs[i - 1],
          total: freqs[i - 1],
          isMin: true
        }
      ],
      optimalRoot: i,
      minCost: freqs[i - 1]
    };
  }

  // Step 2: Subtrees of length L = 2 to n
  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;

      dpWeight[i][j] = dpWeight[i][j - 1] + freqs[j - 1];
      dpCost[i][j] = Infinity;

      const evaluations = [];
      let bestRoot = i;

      // Evaluate candidate roots r from i to j
      for (let r = i; r <= j; r++) {
        const leftCost = (r > i) ? dpCost[i][r - 1] : 0;
        const rightCost = (r < j) ? dpCost[r + 1][j] : 0;
        const total = leftCost + rightCost + dpWeight[i][j];

        evaluations.push({
          rootIdx: r,
          rootKey: keys[r - 1],
          leftCost,
          rightCost,
          weight: dpWeight[i][j],
          total,
          isMin: false
        });

        if (total < dpCost[i][j]) {
          dpCost[i][j] = total;
          bestRoot = r;
        }
      }

      dpRoot[i][j] = bestRoot;

      // Mark the winning root
      evaluations.forEach(ev => {
        if (ev.rootIdx === bestRoot) ev.isMin = true;
      });

      const cellKey = `${i}_${j}`;
      subproblemDetails[cellKey] = {
        i, j,
        keysInRange: keys.slice(i - 1, j),
        weight: dpWeight[i][j],
        evaluations,
        optimalRoot: bestRoot,
        minCost: dpCost[i][j]
      };
    }
  }

  // Step 3: Reconstruct Binary Search Tree
  constructedTree = buildTree(1, n, 1);

  // Step 4: Render All Outputs
  renderDPTable();
  renderCalculationTrace(1, n);
  renderTreeVisualization();
  renderResultSummary();
  inspectCell(1, n);
}

// Recursively construct tree from Root Table
function buildTree(i, j, depth) {
  if (i > j) return null;

  const r = dpRoot[i][j];
  const key = currentKeys[r - 1];
  const freq = currentFreqs[r - 1];

  return {
    key,
    freq,
    depth,
    cost: depth * freq,
    rootIndex: r,
    left: buildTree(i, r - 1, depth + 1),
    right: buildTree(r + 1, j, depth + 1)
  };
}

// ==========================================================================
// DP TABLE RENDERING & INTERACTIVE INSPECTION
// ==========================================================================
function switchTableTab(tab) {
  activeTableTab = tab;

  document.getElementById('tabCostBtn').classList.toggle('active', tab === 'cost');
  document.getElementById('tabRootBtn').classList.toggle('active', tab === 'root');
  document.getElementById('tabWeightBtn').classList.toggle('active', tab === 'weight');

  renderDPTable();
}

function renderDPTable() {
  const container = document.getElementById('matrixContainer');
  if (!container || !dpCost.length) return;

  const n = currentKeys.length;
  let html = `<table class="dp-matrix"><thead><tr><th>i \\ j</th>`;

  for (let j = 1; j <= n; j++) {
    html += `<th>${j}<br><span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">(${currentKeys[j - 1]})</span></th>`;
  }
  html += `</tr></thead><tbody>`;

  for (let i = 1; i <= n; i++) {
    html += `<tr><th>${i}<br><span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">(${currentKeys[i - 1]})</span></th>`;

    for (let j = 1; j <= n; j++) {
      if (j < i) {
        html += `<td class="empty-cell">-</td>`;
      } else {
        let val = '';
        let cellClass = '';

        if (activeTableTab === 'cost') {
          val = dpCost[i][j];
          if (i === j) cellClass = 'diagonal-base';
          if (i === 1 && j === n) cellClass = 'optimal-final';
        } else if (activeTableTab === 'root') {
          const rootIdx = dpRoot[i][j];
          val = `${currentKeys[rootIdx - 1]} (${rootIdx})`;
          if (i === j) cellClass = 'diagonal-base';
          if (i === 1 && j === n) cellClass = 'optimal-final';
        } else if (activeTableTab === 'weight') {
          val = dpWeight[i][j];
          if (i === j) cellClass = 'diagonal-base';
        }

        html += `<td class="${cellClass}" onclick="inspectCell(${i}, ${j})" title="Subproblem (${i}, ${j})">${val}</td>`;
      }
    }
    html += `</tr>`;
  }

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// Subproblem Inspector Panel
function inspectCell(i, j) {
  const title = document.getElementById('inspectorTitle');
  const content = document.getElementById('inspectorContent');
  const cellKey = `${i}_${j}`;
  const detail = subproblemDetails[cellKey];

  if (!detail) return;

  title.textContent = `Subproblem Range [${i} .. ${j}]: Keys { ${detail.keysInRange.join(', ')} }`;

  let html = `
    <div style="margin-bottom: 12px; font-size: 0.92rem;">
      <span><strong>Cumulative Frequency Weight W(${i}, ${j}):</strong> ${detail.weight}</span>
      <span style="margin-left: 20px;"><strong>Optimal Subproblem Root:</strong> Key ${currentKeys[detail.optimalRoot - 1]} (Index ${detail.optimalRoot})</span>
      <span style="margin-left: 20px;"><strong>Minimum Cost C(${i}, ${j}):</strong> ${detail.minCost}</span>
    </div>
    <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 8px;">
      Evaluating Recurrence: <code>Cost = C(${i}, r-1) + C(r+1, ${j}) + W(${i}, ${j})</code>
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
  `;

  detail.evaluations.forEach(ev => {
    const isChosen = ev.isMin ? 'selected-root' : '';
    const badge = ev.isMin ? '<span style="background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; margin-left: 8px;">MINIMUM ROOT</span>' : '';

    html += `
      <div class="calc-root-eval ${isChosen}">
        Candidate Root <strong>${ev.rootKey} (r = ${ev.rootIdx})</strong>:
        Left C(${i}, ${ev.rootIdx - 1}) = ${ev.leftCost} +
        Right C(${ev.rootIdx + 1}, ${j}) = ${ev.rightCost} +
        Weight W(${i}, ${j}) = ${ev.weight}
        &rarr; <strong>Total Cost = ${ev.total}</strong>
        ${badge}
      </div>
    `;
  });

  html += `</div>`;
  content.innerHTML = html;
}

// ==========================================================================
// CALCULATION EXPLANATION
// ==========================================================================
function renderCalculationTrace(start, end) {
  const container = document.getElementById('calculationTraceContainer');
  if (!container || !subproblemDetails[`${start}_${end}`]) return;

  const finalDetail = subproblemDetails[`${start}_${end}`];
  const n = currentKeys.length;

  let html = `
    <div class="calc-step-card">
      <h5>
        <span>Full Problem Tree: Cost(1, ${n}) for Keys [${currentKeys.join(', ')}]</span>
        <span style="color: var(--primary-blue);">Weight Sum: ${finalDetail.weight}</span>
      </h5>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 10px;">
        To determine the overall optimal tree root, every key from <strong>1 to ${n}</strong> is tested as a candidate root:
      </p>
  `;

  finalDetail.evaluations.forEach(ev => {
    const isSelected = ev.isMin ? 'selected-root' : '';
    const label = ev.isMin ? ' &mdash; <strong>OPTIMAL GLOBAL ROOT</strong>' : '';

    html += `
      <div class="calc-root-eval ${isSelected}">
        &bull; Candidate Root <strong>${ev.rootKey}</strong>:
        C(1, ${ev.rootIdx - 1}) [${ev.leftCost}] +
        C(${ev.rootIdx + 1}, ${n}) [${ev.rightCost}] +
        Sum(1, ${n}) [${ev.weight}] =
        <strong>${ev.total}</strong>
        ${label}
      </div>
    `;
  });

  html += `
      <div style="margin-top: 12px; font-size: 0.92rem; color: var(--text-primary);">
        <strong>Conclusion:</strong> Root <strong>${currentKeys[finalDetail.optimalRoot - 1]}</strong> yields the minimal cost of <strong>${finalDetail.minCost}</strong>.
      </div>
    </div>
  `;

  // Add a sample 2-node subtree step if n >= 2
  if (n >= 2 && subproblemDetails['1_2']) {
    const l2Detail = subproblemDetails['1_2'];
    html += `
      <div class="calc-step-card">
        <h5>
          <span>Subproblem Length 2: Cost(1, 2) for Keys [${currentKeys[0]}, ${currentKeys[1]}]</span>
          <span style="color: var(--primary-blue);">Weight: ${l2Detail.weight}</span>
        </h5>
        <div style="display: flex; flex-direction: column; gap: 6px;">
    `;

    l2Detail.evaluations.forEach(ev => {
      const isSelected = ev.isMin ? 'selected-root' : '';
      html += `
        <div class="calc-root-eval ${isSelected}">
          &bull; Root <strong>${ev.rootKey}</strong>: Left [${ev.leftCost}] + Right [${ev.rightCost}] + Weight [${ev.weight}] = <strong>${ev.total}</strong>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// ==========================================================================
// SVG TREE VISUALIZATION
// ==========================================================================
function renderTreeVisualization() {
  const svg = document.getElementById('bstSvgCanvas');
  if (!svg || !constructedTree) return;

  const width = 820;
  const height = 440;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = '';

  // Calculate coordinates recursively
  const nodeRadius = 24;
  const levelHeight = 85;
  const initialY = 55;

  // Compute total depth of tree
  function getTreeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  }

  const treeHeight = getTreeHeight(constructedTree);

  // Position nodes based on in-order coordinate spacing
  let inOrderIndex = 0;
  function assignCoordinates(node, depth = 1) {
    if (!node) return;
    assignCoordinates(node.left, depth + 1);

    node.x = 80 + inOrderIndex * ((width - 160) / (currentKeys.length - 1 || 1));
    node.y = initialY + (depth - 1) * levelHeight;
    inOrderIndex++;

    assignCoordinates(node.right, depth + 1);
  }

  inOrderIndex = 0;
  assignCoordinates(constructedTree);

  // Draw Branches First (so lines are behind circles)
  function drawBranches(node) {
    if (!node) return;

    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      line.setAttribute('class', 'tree-branch-line');
      svg.appendChild(line);

      // Label L
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (node.x + node.left.x) / 2 - 8);
      label.setAttribute('y', (node.y + node.left.y) / 2);
      label.setAttribute('class', 'tree-branch-label');
      label.textContent = 'L';
      svg.appendChild(label);

      drawBranches(node.left);
    }

    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      line.setAttribute('class', 'tree-branch-line');
      svg.appendChild(line);

      // Label R
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (node.x + node.right.x) / 2 + 10);
      label.setAttribute('y', (node.y + node.right.y) / 2);
      label.setAttribute('class', 'tree-branch-label');
      label.textContent = 'R';
      svg.appendChild(label);

      drawBranches(node.right);
    }
  }

  drawBranches(constructedTree);

  // Draw Nodes
  function drawNodes(node) {
    if (!node) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = 'pointer';

    // Tooltip
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Key: ${node.key} | Frequency: ${node.freq} | Level/Depth: ${node.depth} | Search Cost Contribution: ${node.depth} * ${node.freq} = ${node.cost}`;
    g.appendChild(title);

    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('class', 'tree-node-circle');
    g.appendChild(circle);

    // Key Name Text
    const textKey = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textKey.setAttribute('x', node.x);
    textKey.setAttribute('y', node.y - 3);
    textKey.setAttribute('class', 'tree-node-text-key');
    textKey.textContent = node.key;
    g.appendChild(textKey);

    // Frequency Text
    const textFreq = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textFreq.setAttribute('x', node.x);
    textFreq.setAttribute('y', node.y + 13);
    textFreq.setAttribute('class', 'tree-node-text-freq');
    textFreq.textContent = `f:${node.freq}`;
    g.appendChild(textFreq);

    // Level Tag above node
    const textLevel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textLevel.setAttribute('x', node.x);
    textLevel.setAttribute('y', node.y - 29);
    textLevel.setAttribute('font-size', '10px');
    textLevel.setAttribute('fill', '#64748b');
    textLevel.setAttribute('text-anchor', 'middle');
    textLevel.setAttribute('font-family', 'var(--font-mono)');
    textLevel.textContent = `d=${node.depth}`;
    g.appendChild(textLevel);

    svg.appendChild(g);

    drawNodes(node.left);
    drawNodes(node.right);
  }

  drawNodes(constructedTree);

  // Update Tree Stats Cards
  const n = currentKeys.length;
  const minCost = dpCost[1][n];
  const optimalRoot = currentKeys[dpRoot[1][n] - 1];
  const sumFreq = currentFreqs.reduce((a, b) => a + b, 0);

  document.getElementById('statTreeRoot').textContent = optimalRoot;
  document.getElementById('statTreeCost').textContent = minCost;
  document.getElementById('statTreeHeight').textContent = treeHeight;
  document.getElementById('statTreeSumFreq').textContent = sumFreq;
}

// ==========================================================================
// RESULT SUMMARY & DIRECT COST FORMULA VERIFICATION
// ==========================================================================
function renderResultSummary() {
  const n = currentKeys.length;
  const minCost = dpCost[1][n];
  const optimalRoot = currentKeys[dpRoot[1][n] - 1];

  document.getElementById('resMinCost').textContent = minCost;
  document.getElementById('resOptimalRoot').textContent = optimalRoot;
  document.getElementById('resNumKeys').textContent = n;

  // Collect all nodes to verify: sum(depth * freq) == minCost
  const nodeList = [];
  function collectNodes(node) {
    if (!node) return;
    nodeList.push(node);
    collectNodes(node.left);
    collectNodes(node.right);
  }
  collectNodes(constructedTree);

  // Sort nodes in key order for neat display
  nodeList.sort((a, b) => a.key.localeCompare(b.key));

  let verifiedSum = 0;
  let breakdownText = '';

  nodeList.forEach((node, idx) => {
    verifiedSum += node.cost;
    const isLast = idx === nodeList.length - 1;
    breakdownText += `[Key ${node.key}: depth ${node.depth} &times; freq ${node.freq} = ${node.cost}]${isLast ? '' : ' + '}`;
  });

  breakdownText += ` &rarr; <strong>Total Search Cost = ${verifiedSum}</strong>`;

  const isVerified = (verifiedSum === minCost);
  document.getElementById('resVerification').textContent = isVerified ? 'Verified ✓' : 'Discrepancy';
  document.getElementById('resVerification').style.color = isVerified ? 'var(--success-color)' : 'var(--danger-color)';

  document.getElementById('costVerificationList').innerHTML = `
    <div>${breakdownText}</div>
    <div style="margin-top: 6px; font-size: 0.82rem; color: var(--success-color);">
      ✓ Matches the DP Cost Matrix C[1][${n}] = <strong>${minCost}</strong> exactly.
    </div>
  `;
}

// ==========================================================================
// DISCUSSION QUESTIONS ACCORDION
// ==========================================================================
function toggleAccordion(headerElement) {
  const item = headerElement.parentElement;
  const body = item.querySelector('.accordion-body');
  const isActive = item.classList.contains('active');

  // Close other open accordions for clean UX
  document.querySelectorAll('.accordion-item').forEach(otherItem => {
    otherItem.classList.remove('active');
    const otherBody = otherItem.querySelector('.accordion-body');
    if (otherBody) otherBody.style.maxHeight = null;
  });

  if (!isActive) {
    item.classList.add('active');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

// Copy Pseudocode to Clipboard
function copyPseudocode() {
  const codeBlock = document.getElementById('pseudocodeBlock');
  const btn = document.getElementById('copyCodeBtn');
  if (!codeBlock || !btn) return;

  const text = codeBlock.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = '#10b981';
    btn.style.borderColor = '#10b981';

    setTimeout(() => {
      btn.textContent = original;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }).catch(() => {
    alert('Failed to copy. Please select and copy manually.');
  });
}
