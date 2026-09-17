/**
 * Optimal Binary Search Tree using Dynamic Programming
 * DAA Assignment Website
 */

// Global State
let simKeys = ['A', 'B', 'C', 'D'];
let simFreqs = [10, 20, 5, 15];
let activeTab = 'cost';

let costMatrix = [];
let rootMatrix = [];
let weightMatrix = [];
let subproblems = {};
let optimalTree = null;

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupKeyCount();
  loadExampleData();
});

// Setup Navigation & Active Scroll Spy
function setupNavbar() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navList = document.getElementById('navLinks');

  if (menuBtn && navList) {
    menuBtn.addEventListener('click', () => {
      navList.classList.toggle('mobile-open');
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('mobile-open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Setup Key Count Selector
function setupKeyCount() {
  const selector = document.getElementById('keyCountSelect');
  if (selector) {
    selector.addEventListener('change', (e) => {
      const count = parseInt(e.target.value, 10);
      generateRows(count);
    });
  }
}

// Load Example Data (A:10, B:20, C:5, D:15)
function loadExampleData() {
  const selector = document.getElementById('keyCountSelect');
  if (selector) selector.value = '4';

  simKeys = ['A', 'B', 'C', 'D'];
  simFreqs = [10, 20, 5, 15];

  generateRows(4, simKeys, simFreqs);
  hideSimError();
  runSimulation();
}

// Reset Inputs to Defaults
function resetInputs() {
  loadExampleData();
}

// Generate Input Table Rows
function generateRows(count, keys = null, freqs = null) {
  const tbody = document.getElementById('simTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const keyVal = keys && keys[i] ? keys[i] : String.fromCharCode(65 + i);
    const freqVal = freqs && freqs[i] !== undefined ? freqs[i] : (i + 1) * 10;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--primary-navy); font-family: var(--font-mono);">${i + 1}</td>
      <td>
        <input type="text" class="sim-key-in" value="${keyVal}" placeholder="Key name" required>
      </td>
      <td>
        <input type="number" class="sim-freq-in" value="${freqVal}" min="1" step="any" placeholder="Frequency" required>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// Read and Validate Inputs
function getInputs() {
  const keyInputs = document.querySelectorAll('.sim-key-in');
  const freqInputs = document.querySelectorAll('.sim-freq-in');

  const keys = [];
  const freqs = [];

  for (let i = 0; i < keyInputs.length; i++) {
    const k = keyInputs[i].value.trim();
    const fStr = freqInputs[i].value.trim();

    if (!k) {
      showSimError(`Key at row ${i + 1} cannot be empty.`);
      return null;
    }

    if (fStr === '' || isNaN(fStr)) {
      showSimError(`Frequency at row ${i + 1} must be a valid number.`);
      return null;
    }

    const f = parseFloat(fStr);
    if (f <= 0) {
      showSimError(`Frequency at row ${i + 1} must be greater than zero.`);
      return null;
    }

    keys.push(k);
    freqs.push(f);
  }

  // Check unique keys
  const set = new Set(keys);
  if (set.size !== keys.length) {
    showSimError('All keys must be unique.');
    return null;
  }

  hideSimError();
  return { keys, freqs };
}

function showSimError(msg) {
  const box = document.getElementById('simErrorBox');
  if (box) {
    box.textContent = msg;
    box.style.display = 'block';
  }
}

function hideSimError() {
  const box = document.getElementById('simErrorBox');
  if (box) {
    box.style.display = 'none';
  }
}

// ==========================================================================
// CORE OPTIMAL BST DYNAMIC PROGRAMMING ALGORITHM
// ==========================================================================
function runSimulation() {
  const data = getInputs();
  if (!data) return;

  const { keys, freqs } = data;
  simKeys = keys;
  simFreqs = freqs;

  const n = keys.length;

  // Initialize DP tables (1-based indexing)
  costMatrix = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0));
  rootMatrix = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0));
  weightMatrix = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0));
  subproblems = {};

  // Base Cases: length 1
  for (let i = 1; i <= n; i++) {
    costMatrix[i][i] = freqs[i - 1];
    weightMatrix[i][i] = freqs[i - 1];
    rootMatrix[i][i] = i;

    subproblems[`${i}_${i}`] = {
      i, j: i,
      weight: freqs[i - 1],
      optimalRoot: i,
      minCost: freqs[i - 1],
      evaluations: [
        {
          rootIdx: i,
          rootKey: keys[i - 1],
          leftCost: 0,
          rightCost: 0,
          weight: freqs[i - 1],
          total: freqs[i - 1],
          isOptimal: true
        }
      ]
    };
  }

  // Subtrees of length L = 2 to n
  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;

      weightMatrix[i][j] = weightMatrix[i][j - 1] + freqs[j - 1];
      costMatrix[i][j] = Infinity;

      const evals = [];
      let bestR = i;

      for (let r = i; r <= j; r++) {
        const left = (r > i) ? costMatrix[i][r - 1] : 0;
        const right = (r < j) ? costMatrix[r + 1][j] : 0;
        const total = left + right + weightMatrix[i][j];

        evals.push({
          rootIdx: r,
          rootKey: keys[r - 1],
          leftCost: left,
          rightCost: right,
          weight: weightMatrix[i][j],
          total: total,
          isOptimal: false
        });

        if (total < costMatrix[i][j]) {
          costMatrix[i][j] = total;
          bestR = r;
        }
      }

      rootMatrix[i][j] = bestR;

      evals.forEach(ev => {
        if (ev.rootIdx === bestR) ev.isOptimal = true;
      });

      subproblems[`${i}_${j}`] = {
        i, j,
        weight: weightMatrix[i][j],
        optimalRoot: bestR,
        minCost: costMatrix[i][j],
        evaluations: evals
      };
    }
  }

  // Reconstruct tree
  optimalTree = constructSubtree(1, n, 1);

  // Render components
  renderMatrix();
  renderTree();
  inspectCell(1, n);
}

// Reconstruct Tree from root table
function constructSubtree(i, j, depth) {
  if (i > j) return null;

  const r = rootMatrix[i][j];
  const key = simKeys[r - 1];
  const freq = simFreqs[r - 1];

  return {
    key,
    freq,
    depth,
    cost: depth * freq,
    left: constructSubtree(i, r - 1, depth + 1),
    right: constructSubtree(r + 1, j, depth + 1)
  };
}

// ==========================================================================
// DP TABLE DISPLAY & INSPECTION
// ==========================================================================
function switchTab(tab) {
  activeTab = tab;

  document.getElementById('btnTabCost').classList.toggle('active', tab === 'cost');
  document.getElementById('btnTabRoot').classList.toggle('active', tab === 'root');
  document.getElementById('btnTabWeight').classList.toggle('active', tab === 'weight');

  renderMatrix();
}

function renderMatrix() {
  const container = document.getElementById('matrixWrapper');
  if (!container || !costMatrix.length) return;

  const n = simKeys.length;
  let html = `<table class="matrix-table"><thead><tr><th>i \\ j</th>`;

  for (let j = 1; j <= n; j++) {
    html += `<th>${j} (${simKeys[j - 1]})</th>`;
  }
  html += `</tr></thead><tbody>`;

  for (let i = 1; i <= n; i++) {
    html += `<tr><th>${i} (${simKeys[i - 1]})</th>`;

    for (let j = 1; j <= n; j++) {
      if (j < i) {
        html += `<td class="empty-cell">-</td>`;
      } else {
        let val = '';
        let cls = '';

        if (activeTab === 'cost') {
          val = costMatrix[i][j];
          if (i === j) cls = 'base-cell';
          if (i === 1 && j === n) cls = 'optimal-final';
        } else if (activeTab === 'root') {
          const r = rootMatrix[i][j];
          val = `${simKeys[r - 1]} (${r})`;
          if (i === j) cls = 'base-cell';
          if (i === 1 && j === n) cls = 'optimal-final';
        } else if (activeTab === 'weight') {
          val = weightMatrix[i][j];
          if (i === j) cls = 'base-cell';
        }

        html += `<td class="${cls}" onclick="inspectCell(${i}, ${j})" title="Subproblem [${i}, ${j}]">${val}</td>`;
      }
    }
    html += `</tr>`;
  }

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function inspectCell(i, j) {
  const textContainer = document.getElementById('cellInfoText');
  const sp = subproblems[`${i}_${j}`];
  if (!textContainer || !sp) return;

  let html = `
    <div style="margin-bottom: 8px;">
      <strong>Range [${i} .. ${j}]</strong> for keys: <em>${simKeys.slice(i - 1, j).join(', ')}</em> |
      <strong>Sum(i, j):</strong> ${sp.weight} |
      <strong>Optimal Root:</strong> ${simKeys[sp.optimalRoot - 1]} |
      <strong>Min Cost:</strong> ${sp.minCost}
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono); font-size: 0.88rem;">
  `;

  sp.evaluations.forEach(ev => {
    const isMin = ev.isOptimal ? 'style="background: #eff6ff; font-weight: 700; color: var(--primary-navy); padding: 4px 8px; border-radius: 4px; border: 1px solid #93c5fd;"' : 'style="padding: 2px 8px;"';
    const tag = ev.isOptimal ? ' &larr; [Selected Root]' : '';

    html += `
      <div ${isMin}>
        Root ${ev.rootKey}: Left C(${i}, ${ev.rootIdx - 1}) [${ev.leftCost}] + Right C(${ev.rootIdx + 1}, ${j}) [${ev.rightCost}] + Sum [${ev.weight}] = <strong>${ev.total}</strong>${tag}
      </div>
    `;
  });

  html += `</div>`;
  textContainer.innerHTML = html;
}

// ==========================================================================
// SVG TREE VISUALIZATION
// ==========================================================================
function renderTree() {
  const svg = document.getElementById('treeSvg');
  if (!svg || !optimalTree) return;

  const width = 800;
  const height = 420;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = '';

  const nodeRadius = 22;
  const levelGap = 85;
  const topY = 55;

  function getDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  }
  const treeLevels = getDepth(optimalTree);

  // Position nodes horizontally based on in-order traversal
  let orderIndex = 0;
  function assignPos(node, level = 1) {
    if (!node) return;
    assignPos(node.left, level + 1);

    node.x = 75 + orderIndex * ((width - 150) / (simKeys.length - 1 || 1));
    node.y = topY + (level - 1) * levelGap;
    orderIndex++;

    assignPos(node.right, level + 1);
  }

  orderIndex = 0;
  assignPos(optimalTree);

  // Draw Lines
  function drawLines(node) {
    if (!node) return;

    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      line.setAttribute('class', 'tree-branch-line');
      svg.appendChild(line);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (node.x + node.left.x) / 2 - 8);
      label.setAttribute('y', (node.y + node.left.y) / 2);
      label.setAttribute('class', 'tree-branch-label');
      label.textContent = 'L';
      svg.appendChild(label);

      drawLines(node.left);
    }

    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      line.setAttribute('class', 'tree-branch-line');
      svg.appendChild(line);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (node.x + node.right.x) / 2 + 10);
      label.setAttribute('y', (node.y + node.right.y) / 2);
      label.setAttribute('class', 'tree-branch-label');
      label.textContent = 'R';
      svg.appendChild(label);

      drawLines(node.right);
    }
  }
  drawLines(optimalTree);

  // Draw Nodes
  function drawNodes(node) {
    if (!node) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Key: ${node.key} | Frequency: ${node.freq} | Level: ${node.depth} | Search Cost: ${node.depth} * ${node.freq} = ${node.cost}`;
    g.appendChild(title);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('class', 'tree-node-circle');
    g.appendChild(circle);

    const textKey = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textKey.setAttribute('x', node.x);
    textKey.setAttribute('y', node.y - 2);
    textKey.setAttribute('class', 'tree-node-text-key');
    textKey.textContent = node.key;
    g.appendChild(textKey);

    const textFreq = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textFreq.setAttribute('x', node.x);
    textFreq.setAttribute('y', node.y + 13);
    textFreq.setAttribute('class', 'tree-node-text-freq');
    textFreq.textContent = `f:${node.freq}`;
    g.appendChild(textFreq);

    const textLvl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textLvl.setAttribute('x', node.x);
    textLvl.setAttribute('y', node.y - 27);
    textLvl.setAttribute('font-size', '10px');
    textLvl.setAttribute('fill', '#64748b');
    textLvl.setAttribute('text-anchor', 'middle');
    textLvl.setAttribute('font-family', 'var(--font-mono)');
    textLvl.textContent = `lvl ${node.depth}`;
    g.appendChild(textLvl);

    svg.appendChild(g);

    drawNodes(node.left);
    drawNodes(node.right);
  }
  drawNodes(optimalTree);

  // Update Metrics
  const n = simKeys.length;
  const optRoot = simKeys[rootMatrix[1][n] - 1];
  const minCost = costMatrix[1][n];
  const totalFreq = simFreqs.reduce((a, b) => a + b, 0);

  document.getElementById('metricRoot').textContent = optRoot;
  document.getElementById('metricCost').textContent = minCost;
  document.getElementById('metricLevels').textContent = treeLevels;
  document.getElementById('metricTotalFreq').textContent = totalFreq;
}
