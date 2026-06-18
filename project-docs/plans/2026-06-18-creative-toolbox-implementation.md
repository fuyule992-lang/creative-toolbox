# Creative Toolbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based creative toolbox with Pixel Art Editor + Word Cloud Generator, vanilla JS + Vite multi-page.

**Architecture:** Vite multi-page mode serves three HTML entry points (homepage, pixel-art, word-cloud). Shared CSS variables drive light/dark theming; shared JS injects nav bar and theme toggle. Each tool is self-contained in its own directory with a single JS file handling all Canvas-based logic.

**Tech Stack:** Vite 5.x, vanilla HTML/CSS/JS, Canvas API, zero runtime dependencies

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Project metadata, Vite dev dependency |
| `vite.config.js` | Multi-page input config |
| `index.html` | Homepage — hero + tool cards |
| `shared/layout.css` | CSS variables, nav bar, card grid, button/slider/input base styles |
| `shared/layout.js` | Nav template injection, theme toggle, localStorage persistence |
| `tools/pixel-art/index.html` | Pixel art editor shell + UI markup |
| `tools/pixel-art/pixel-art.js` | Grid state, canvas rendering, drawing tools, undo/redo, flood fill, export |
| `tools/word-cloud/index.html` | Word cloud generator shell + UI markup |
| `tools/word-cloud/word-cloud.js` | Word extraction (EN+CN), spiral placement, shape masks, canvas/SVG export |
| `public/favicon.svg` | Site favicon |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `public/favicon.svg`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "creative-toolbox",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'pixel-art': resolve(__dirname, 'tools/pixel-art/index.html'),
        'word-cloud': resolve(__dirname, 'tools/word-cloud/index.html'),
      },
    },
  },
});
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
.DS_Store
```

- [ ] **Step 4: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y="80" font-size="80">🎨</text>
</svg>
```

- [ ] **Step 5: Install dependencies**

Run: `cd creative-toolbox && npm install`
Expected: `vite` installed in `node_modules/`

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Vite multi-page project"
```

---

### Task 2: Shared CSS — Theme Variables & Base Styles

**Files:**
- Create: `shared/layout.css`

- [ ] **Step 1: Create shared/layout.css with CSS reset + variables**

```css
/* === CSS Reset === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* === Theme Variables === */
:root {
  --font: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --radius: 8px;
  --transition: 0.2s ease;
}

[data-theme="dark"] {
  --bg: #0f0f1a;
  --card-bg: #1a1a2e;
  --text: #e0e0e0;
  --text-secondary: #8888aa;
  --primary: #7c3aed;
  --primary-hover: #8b5cf6;
  --border: #2a2a3e;
  --accent: #06d6a0;
  --danger: #ef4444;
  --canvas-bg: #ffffff;
}

[data-theme="light"] {
  --bg: #fafafa;
  --card-bg: #ffffff;
  --text: #1a1a2e;
  --text-secondary: #6b7280;
  --primary: #7c3aed;
  --primary-hover: #6d28d9;
  --border: #e5e7eb;
  --accent: #10b981;
  --danger: #ef4444;
  --canvas-bg: #ffffff;
}

/* === Base === */
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
}

/* === Shared Nav === */
.shared-nav {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.shared-nav .logo {
  font-weight: 700;
  font-size: 18px;
  color: var(--primary);
  text-decoration: none;
  white-space: nowrap;
}

.shared-nav .nav-links {
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: center;
}

.shared-nav .nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--transition);
}

.shared-nav .nav-links a:hover,
.shared-nav .nav-links a.active {
  color: var(--primary);
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 16px;
  transition: background var(--transition);
  white-space: nowrap;
}

.theme-toggle:hover {
  background: var(--border);
}

/* === Homepage === */
.page-wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px;
}

.hero {
  text-align: center;
  margin-bottom: 48px;
}

.hero h1 {
  font-size: 36px;
  margin-bottom: 8px;
}

.hero p {
  color: var(--text-secondary);
  font-size: 16px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.tool-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  text-align: center;
  transition: transform var(--transition), box-shadow var(--transition);
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.tool-card .icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.tool-card h3 {
  margin-bottom: 8px;
}

.tool-card p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

/* === Shared Button Styles === */
.btn {
  display: inline-block;
  padding: 8px 20px;
  border: none;
  border-radius: var(--radius);
  font-size: 14px;
  font-family: var(--font);
  cursor: pointer;
  transition: background var(--transition), opacity var(--transition);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.btn-outline:hover {
  background: var(--border);
}

.btn-danger {
  background: transparent;
  border: 1px solid var(--danger);
  color: var(--danger);
}

.btn-danger:hover {
  background: var(--danger);
  color: #fff;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.active {
  background: var(--primary);
  color: #fff;
}

/* === Shared Input Styles === */
input[type="range"] {
  width: 100%;
  accent-color: var(--primary);
}

input[type="color"] {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card-bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
}

/* === Tool Page Layout === */
.tool-page {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 57px);
}

.tool-page .canvas-area {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-page .sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}

.sidebar-section h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

/* === Controls === */
.tool-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.color-swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 3px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color var(--transition);
}

.color-swatch.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.slider-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 8px;
}

.slider-row label {
  color: var(--text-secondary);
}

.slider-row span {
  font-weight: 600;
  min-width: 32px;
  text-align: right;
}
```

- [ ] **Step 2: Commit**

```bash
git add shared/layout.css
git commit -m "feat: add shared CSS with theme variables and base styles"
```

---

### Task 3: Shared JS — Nav Injection & Theme Toggle

**Files:**
- Create: `shared/layout.js`

- [ ] **Step 1: Create shared/layout.js**

```js
// === Nav Template ===
const NAV_HTML = `
<nav class="shared-nav">
  <a href="/" class="logo">🎨 Creative Toolbox</a>
  <div class="nav-links">
    <a href="/tools/pixel-art/">像素画板</a>
    <a href="/tools/word-cloud/">文字云</a>
  </div>
  <button class="theme-toggle" id="theme-toggle" title="切换亮色/暗色主题">🌙</button>
</nav>
`;

// === Inject Nav ===
document.addEventListener('DOMContentLoaded', () => {
  const template = document.getElementById('shared-nav-template');
  if (template) {
    // If using <template> element
    const clone = template.content.cloneNode(true);
    document.body.prepend(clone);
  } else {
    // Fallback: insert directly
    const wrapper = document.createElement('div');
    wrapper.innerHTML = NAV_HTML;
    document.body.prepend(wrapper.firstElementChild);
  }

  // Highlight current page in nav
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // === Theme Toggle ===
  const STORAGE_KEY = 'creative-toolbox-theme';
  const toggleBtn = document.getElementById('theme-toggle');

  function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  const theme = getTheme();
  applyTheme(theme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add shared/layout.js
git commit -m "feat: add shared JS for nav injection and theme toggle"
```

---

### Task 4: Homepage

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Creative Toolbox — 创意工具箱</title>
  <link rel="icon" href="/favicon.svg" />
  <link rel="stylesheet" href="/shared/layout.css" />
</head>
<body>
  <template id="shared-nav-template">
    <nav class="shared-nav">
      <a href="/" class="logo">🎨 Creative Toolbox</a>
      <div class="nav-links">
        <a href="/tools/pixel-art/">像素画板</a>
        <a href="/tools/word-cloud/">文字云</a>
      </div>
      <button class="theme-toggle" id="theme-toggle" title="切换主题">🌙</button>
    </nav>
  </template>

  <main class="page-wrap">
    <section class="hero">
      <h1>🛠️ Creative Toolbox</h1>
      <p>轻量创意工具集，浏览器里就能玩</p>
    </section>

    <section class="tool-grid">
      <div class="tool-card">
        <div class="icon">🎨</div>
        <h3>像素画板</h3>
        <p>在网格画布上绘制像素艺术，支持多尺寸网格和 PNG 导出</p>
        <a href="/tools/pixel-art/" class="btn btn-primary">打开工具</a>
      </div>
      <div class="tool-card">
        <div class="icon">☁️</div>
        <h3>文字云生成器</h3>
        <p>输入文字生成漂亮词云，多种形状配色，导出 PNG/SVG</p>
        <a href="/tools/word-cloud/" class="btn btn-primary">打开工具</a>
      </div>
    </section>
  </main>

  <script src="/shared/layout.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add homepage with tool cards and nav"
```

---

### Task 5: Pixel Art — HTML Shell & Canvas Rendering

**Files:**
- Create: `tools/pixel-art/index.html`
- Create: `tools/pixel-art/pixel-art.js`

- [ ] **Step 1: Create tools/pixel-art/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>像素画板 — Creative Toolbox</title>
  <link rel="icon" href="/favicon.svg" />
  <link rel="stylesheet" href="/shared/layout.css" />
  <style>
    .pixel-canvas {
      image-rendering: pixelated;
      border: 2px solid var(--border);
      border-radius: 4px;
      background: #fff;
      cursor: crosshair;
    }
    .canvas-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .grid-size-options {
      display: flex;
      gap: 4px;
    }
    .grid-size-options .btn {
      flex: 1;
      text-align: center;
    }
  </style>
</head>
<body>
  <template id="shared-nav-template">
    <nav class="shared-nav">
      <a href="/" class="logo">🎨 Creative Toolbox</a>
      <div class="nav-links">
        <a href="/tools/pixel-art/">像素画板</a>
        <a href="/tools/word-cloud/">文字云</a>
      </div>
      <button class="theme-toggle" id="theme-toggle" title="切换主题">🌙</button>
    </nav>
  </template>

  <div class="tool-page">
    <div class="canvas-area">
      <div class="canvas-wrapper">
        <canvas id="pixel-canvas" class="pixel-canvas"></canvas>
      </div>
    </div>

    <div class="sidebar">
      <!-- Drawing Tools -->
      <div class="sidebar-section">
        <h4>工具</h4>
        <div class="tool-group">
          <button class="btn btn-outline active" data-tool="pen">✏️ 铅笔</button>
          <button class="btn btn-outline" data-tool="eraser">🧹 橡皮</button>
          <button class="btn btn-outline" data-tool="bucket">🪣 填充</button>
        </div>
      </div>

      <!-- Colors -->
      <div class="sidebar-section">
        <h4>颜色</h4>
        <div class="color-grid" id="color-palette"></div>
        <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
          <input type="color" id="custom-color" value="#ff0000" />
          <span style="font-size: 13px; color: var(--text-secondary);">自定义</span>
          <div id="current-color-preview" style="
            width: 28px; height: 28px; border-radius: 4px; border: 2px solid var(--border);
            background: #000; margin-left: auto;
          "></div>
        </div>
      </div>

      <!-- Grid Settings -->
      <div class="sidebar-section">
        <h4>网格尺寸</h4>
        <div class="grid-size-options">
          <button class="btn btn-outline btn-sm" data-grid-size="8">8×8</button>
          <button class="btn btn-outline btn-sm active" data-grid-size="16">16×16</button>
          <button class="btn btn-outline btn-sm" data-grid-size="32">32×32</button>
        </div>
        <label style="display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 13px; cursor: pointer;">
          <input type="checkbox" id="show-grid" checked /> 显示网格线
        </label>
      </div>

      <!-- Actions -->
      <div class="sidebar-section">
        <h4>操作</h4>
        <div class="tool-group">
          <button class="btn btn-outline btn-sm" id="btn-undo" disabled>↩ 撤销</button>
          <button class="btn btn-outline btn-sm" id="btn-redo" disabled>↪ 重做</button>
        </div>
        <div class="tool-group" style="margin-top: 8px;">
          <button class="btn btn-outline btn-sm" id="btn-clear">🗑 清空</button>
          <button class="btn btn-primary btn-sm" id="btn-export">📥 导出 PNG</button>
        </div>
      </div>
    </div>
  </div>

  <script src="/shared/layout.js"></script>
  <script src="pixel-art.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create tools/pixel-art/pixel-art.js (canvas init + grid rendering)**

```js
// === State ===
let gridSize = 16;
let grid = [];
let cellSize = 32;
let showGrid = true;
let currentColor = '#000000';
let currentTool = 'pen';
let isDrawing = false;

const canvas = document.getElementById('pixel-canvas');

function initGrid(size) {
  gridSize = size;
  grid = Array.from({ length: size }, () => Array(size).fill(null));
  resizeCanvas();
  drawGrid();
}

function resizeCanvas() {
  const maxSize = 512;
  cellSize = Math.floor(maxSize / gridSize);
  const canvasSize = cellSize * gridSize;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.style.width = canvasSize + 'px';
  canvas.style.height = canvasSize + 'px';
}

function drawGrid() {
  const ctx = canvas.getContext('2d');
  const size = gridSize;

  // Fill white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw colored cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = grid[r][c];
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw grid lines
  if (showGrid) {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= size; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }
  }
}

// === Canvas coordinate helpers ===
function getCellFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
    return { row, col };
  }
  return null;
}

// === Bootstrap ===
initGrid(gridSize);
```

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Vite starts on localhost, visiting `/tools/pixel-art/` shows grid + sidebar

- [ ] **Step 4: Commit**

```bash
git add tools/pixel-art/
git commit -m "feat: add pixel art HTML shell and basic canvas rendering"
```

---

### Task 6: Pixel Art — Drawing Interaction

**Files:**
- Modify: `tools/pixel-art/pixel-art.js` — append drawing handlers

- [ ] **Step 1: Append drawing interaction code to pixel-art.js**

Append after the bootstrap code:

```js
// === Drawing Interaction ===
canvas.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; // left click only
  isDrawing = true;
  const cell = getCellFromEvent(e);
  if (cell) paintCell(cell.row, cell.col);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const cell = getCellFromEvent(e);
  if (cell) paintCell(cell.row, cell.col);
});

canvas.addEventListener('mouseup', () => {
  if (isDrawing) {
    isDrawing = false;
    pushHistory();
  }
});

canvas.addEventListener('mouseleave', () => {
  if (isDrawing) {
    isDrawing = false;
    pushHistory();
  }
});

// Prevent drag from triggering browser text selection
canvas.addEventListener('dragstart', (e) => e.preventDefault());

function paintCell(row, col) {
  const prevColor = grid[row][col];
  if (currentTool === 'pen') {
    if (grid[row][col] === currentColor) return; // no-op
    grid[row][col] = currentColor;
  } else if (currentTool === 'eraser') {
    if (grid[row][col] === null) return;
    grid[row][col] = null;
  } else {
    return; // bucket handled separately
  }
  drawGrid();
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/pixel-art/pixel-art.js
git commit -m "feat: add pen and eraser drawing interaction"
```

---

### Task 7: Pixel Art — Paint Bucket & Color Palette

**Files:**
- Modify: `tools/pixel-art/pixel-art.js` — append bucket + palette code

- [ ] **Step 1: Append flood fill and palette code to pixel-art.js**

```js
// === Paint Bucket (Flood Fill) ===
canvas.addEventListener('click', (e) => {
  if (currentTool !== 'bucket') return;
  const cell = getCellFromEvent(e);
  if (!cell) return;
  const { row, col } = cell;
  const targetColor = grid[row][col];
  if (targetColor === currentColor) return;

  // BFS flood fill
  const queue = [[row, col]];
  const visited = new Set();
  visited.add(`${row},${col}`);

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (grid[r][c] === targetColor) {
      grid[r][c] = currentColor;
      // 4-directional neighbors
      const neighbors = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
      for (const [nr, nc] of neighbors) {
        const key = `${nr},${nc}`;
        if (
          nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }
  drawGrid();
  pushHistory();
});

// === Color Palette ===
const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#ff8800', '#ffff00', '#88ff00',
  '#00ff00', '#00ff88', '#00ffff', '#0088ff', '#0000ff', '#8800ff',
  '#ff00ff', '#ff0088', '#964B00', '#808080', '#ffc0cb', '#87CEEB',
  '#90EE90', '#FFD700',
];

const paletteEl = document.getElementById('color-palette');
const customColorInput = document.getElementById('custom-color');
const previewEl = document.getElementById('current-color-preview');

function renderPalette() {
  paletteEl.innerHTML = '';
  PRESET_COLORS.forEach((color) => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    if (color === currentColor) swatch.classList.add('selected');
    swatch.addEventListener('click', () => selectColor(color));
    paletteEl.appendChild(swatch);
  });
}

function selectColor(color) {
  currentColor = color;
  customColorInput.value = color;
  previewEl.style.backgroundColor = color;
  renderPalette();
}

customColorInput.addEventListener('input', (e) => {
  selectColor(e.target.value);
});

// Initial render
renderPalette();
selectColor('#000000');

// === Tool Selection ===
document.querySelectorAll('[data-tool]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tool]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add tools/pixel-art/pixel-art.js
git commit -m "feat: add paint bucket, color palette, and tool selection"
```

---

### Task 8: Pixel Art — Undo/Redo, Clear, Grid Size, Grid Toggle

**Files:**
- Modify: `tools/pixel-art/pixel-art.js` — append history + controls code

- [ ] **Step 1: Append undo/redo, clear, grid controls to pixel-art.js**

```js
// === Undo/Redo History ===
const MAX_HISTORY = 20;
let historyStack = [];
let redoStack = [];

const btnUndo = document.getElementById('btn-undo');
const btnRedo = document.getElementById('btn-redo');

function pushHistory() {
  const snapshot = grid.map((row) => [...row]);
  historyStack.push(snapshot);
  if (historyStack.length > MAX_HISTORY) historyStack.shift();
  redoStack = []; // clear redo on new action
  updateHistoryButtons();
}

function updateHistoryButtons() {
  btnUndo.disabled = historyStack.length === 0;
  btnRedo.disabled = redoStack.length === 0;
}

btnUndo.addEventListener('click', () => {
  if (historyStack.length === 0) return;
  redoStack.push(grid.map((row) => [...row]));
  grid = historyStack.pop();
  drawGrid();
  updateHistoryButtons();
});

btnRedo.addEventListener('click', () => {
  if (redoStack.length === 0) return;
  historyStack.push(grid.map((row) => [...row]));
  grid = redoStack.pop();
  drawGrid();
  updateHistoryButtons();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    btnUndo.click();
  } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
    e.preventDefault();
    btnRedo.click();
  }
});

// === Clear Canvas ===
document.getElementById('btn-clear').addEventListener('click', () => {
  if (grid.every((row) => row.every((cell) => cell === null))) return; // already empty
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  drawGrid();
  pushHistory();
});

// === Grid Size Switcher ===
document.querySelectorAll('[data-grid-size]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-grid-size]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const newSize = parseInt(btn.dataset.gridSize, 10);
    if (newSize === gridSize) return;
    historyStack = [];
    redoStack = [];
    updateHistoryButtons();
    initGrid(newSize);
  });
});

// === Grid Toggle ===
document.getElementById('show-grid').addEventListener('change', (e) => {
  showGrid = e.target.checked;
  drawGrid();
});
```

- [ ] **Step 2: Commit**

```bash
git add tools/pixel-art/pixel-art.js
git commit -m "feat: add undo/redo, clear, grid size switch, and grid toggle"
```

---

### Task 9: Pixel Art — Export PNG

**Files:**
- Modify: `tools/pixel-art/pixel-art.js` — append export code

- [ ] **Step 1: Append export code to pixel-art.js**

```js
// === Export PNG ===
document.getElementById('btn-export').addEventListener('click', () => {
  // Create an offscreen canvas at scaled resolution
  const scale = Math.floor(512 / gridSize);
  const exportSize = gridSize * scale;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = exportSize;
  exportCanvas.height = exportSize;
  const ctx = exportCanvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, exportSize, exportSize);

  // Draw cells with nearest-neighbor scaling
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = grid[r][c];
        ctx.fillRect(c * scale, r * scale, scale, scale);
      }
    }
  }
  // No grid lines in export

  exportCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-art-${gridSize}x${gridSize}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add tools/pixel-art/pixel-art.js
git commit -m "feat: add pixel art PNG export with nearest-neighbor scaling"
```

---

### Task 10: Word Cloud — HTML Shell & Input UI

**Files:**
- Create: `tools/word-cloud/index.html`
- Create: `tools/word-cloud/word-cloud.js` (stub)

- [ ] **Step 1: Create tools/word-cloud/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>文字云生成器 — Creative Toolbox</title>
  <link rel="icon" href="/favicon.svg" />
  <link rel="stylesheet" href="/shared/layout.css" />
  <style>
    .wc-canvas {
      border: 2px solid var(--border);
      border-radius: 4px;
      background: #fff;
    }
    .word-cloud-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }
    .palette-strip {
      display: flex;
      gap: 3px;
      cursor: pointer;
      padding: 4px;
      border: 2px solid transparent;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .palette-strip.selected {
      border-color: var(--accent);
    }
    .palette-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    .shape-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }
  </style>
</head>
<body>
  <template id="shared-nav-template">
    <nav class="shared-nav">
      <a href="/" class="logo">🎨 Creative Toolbox</a>
      <div class="nav-links">
        <a href="/tools/pixel-art/">像素画板</a>
        <a href="/tools/word-cloud/">文字云</a>
      </div>
      <button class="theme-toggle" id="theme-toggle" title="切换主题">🌙</button>
    </nav>
  </template>

  <div class="word-cloud-layout">
    <div class="canvas-area">
      <canvas id="wc-canvas" class="wc-canvas" width="600" height="500"></canvas>
    </div>

    <div class="sidebar">
      <!-- Text Input -->
      <div class="sidebar-section">
        <h4>输入文字</h4>
        <textarea id="text-input" rows="6" placeholder="粘贴或输入文字...支持中文和英文"></textarea>
        <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center;">
          <button class="btn btn-outline btn-sm" id="btn-example">📝 示例文本</button>
          <span id="word-count" style="font-size: 12px; color: var(--text-secondary);"></span>
        </div>
      </div>

      <!-- Shape -->
      <div class="sidebar-section">
        <h4>形状</h4>
        <div class="shape-options">
          <button class="btn btn-outline btn-sm active" data-shape="circle">⭕ 圆形</button>
          <button class="btn btn-outline btn-sm" data-shape="rect">⬜ 矩形</button>
          <button class="btn btn-outline btn-sm" data-shape="heart">❤️ 心形</button>
          <button class="btn btn-outline btn-sm" data-shape="star">⭐ 星形</button>
        </div>
      </div>

      <!-- Color Scheme -->
      <div class="sidebar-section">
        <h4>配色方案</h4>
        <div id="palette-list"></div>
      </div>

      <!-- Sliders -->
      <div class="sidebar-section">
        <h4>参数</h4>
        <div class="slider-row">
          <label>最小字号</label><span id="val-min-size">14</span>
        </div>
        <input type="range" id="min-font-size" min="10" max="40" value="14" step="1" />
        <div class="slider-row">
          <label>最大字号</label><span id="val-max-size">60</span>
        </div>
        <input type="range" id="max-font-size" min="30" max="100" value="60" step="1" />
        <div class="slider-row">
          <label>词数上限</label><span id="val-max-words">80</span>
        </div>
        <input type="range" id="max-words" min="10" max="200" value="80" step="1" />
      </div>

      <!-- Actions -->
      <div class="sidebar-section">
        <h4>操作</h4>
        <div class="tool-group">
          <button class="btn btn-outline btn-sm" id="btn-regenerate">🎲 重新生成</button>
          <button class="btn btn-primary btn-sm" id="btn-export-png">📥 PNG</button>
          <button class="btn btn-primary btn-sm" id="btn-export-svg">📥 SVG</button>
        </div>
      </div>
    </div>
  </div>

  <script src="/shared/layout.js"></script>
  <script src="word-cloud.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create tools/word-cloud/word-cloud.js (stub)**

```js
// Word Cloud Generator — stub
// Full implementation in subsequent tasks

const canvas = document.getElementById('wc-canvas');
const ctx = canvas.getContext('2d');

// Placeholder render
ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#999';
ctx.font = '16px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('输入文字开始生成词云', canvas.width / 2, canvas.height / 2);
```

- [ ] **Step 3: Commit**

```bash
git add tools/word-cloud/
git commit -m "feat: add word cloud HTML shell with input UI and stub JS"
```

---

### Task 11: Word Cloud — Word Extraction Engine

**Files:**
- Modify: `tools/word-cloud/word-cloud.js` — replace stub with extraction logic

- [ ] **Step 1: Rewrite word-cloud.js with extraction engine**

```js
// === DOM refs ===
const canvas = document.getElementById('wc-canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('text-input');
const wordCountEl = document.getElementById('word-count');
const btnExample = document.getElementById('btn-example');

// === Stop words ===
const STOP_WORDS_EN = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or',
  'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every',
  'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'only', 'own', 'same', 'than', 'too', 'very', 'just', 'it', 'its',
  'he', 'she', 'they', 'them', 'their', 'his', 'her', 'my', 'your',
  'our', 'me', 'us', 'we', 'you', 'i', 'this', 'that', 'these', 'those',
  'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
]);

const STOP_WORDS_CN = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
  '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着',
  '没有', '看', '好', '自己', '这', '他', '她', '它', '们', '那', '些',
  '所', '为', '所以', '因为', '但是', '然而', '而且', '虽然', '如果',
  '可以', '还是', '这个', '那个', '这里', '那里', '怎么', '什么',
  '怎样', '为什么', '啊', '吧', '吗', '呢', '哦', '嗯', '哈', '呀',
]);

// === Example text ===
const EXAMPLE_TEXT = `春天来了，春天来了，万物复苏，大地回暖。小草从泥土里钻出来，嫩绿嫩绿的。花儿开了，红的、黄的、紫的，五颜六色，美丽极了。小鸟在树枝上唱歌，歌声清脆动听。小溪的水哗啦啦地流着，像是在欢快地奔跑。孩子们在草地上放风筝，风筝飞得很高很高。春天是一个充满希望和生机的季节，春天让人心情愉悦，春天让世界变得更加美好。我们喜欢春天，我们热爱春天，春天永远是最美的季节。`;

// === Word Extraction ===
function isChineseChar(ch) {
  return /[一-鿿]/.test(ch);
}

function extractWords(text) {
  const cleanText = text.trim();
  if (!cleanText) return [];

  // Detect if text is primarily Chinese
  const chineseChars = [...cleanText].filter(isChineseChar).length;
  const isChinese = chineseChars > cleanText.length * 0.3;

  if (isChinese) {
    return extractChineseWords(cleanText);
  } else {
    return extractEnglishWords(cleanText);
  }
}

function extractEnglishWords(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  const filtered = words.filter((w) => w.length > 1 && !STOP_WORDS_EN.has(w));
  const freq = {};
  for (const w of filtered) {
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

function extractChineseWords(text) {
  // Remove non-Chinese chars, keep only Chinese
  const chineseOnly = [...text].filter(isChineseChar).join('');

  // Bigram extraction: every consecutive 2-char pair
  const bigrams = {};
  for (let i = 0; i < chineseOnly.length - 1; i++) {
    const bigram = chineseOnly.slice(i, i + 2);
    bigrams[bigram] = (bigrams[bigram] || 0) + 1;
  }

  // Also include single chars (trimmed by stop words)
  const singles = {};
  for (const ch of chineseOnly) {
    if (!STOP_WORDS_CN.has(ch)) {
      singles[ch] = (singles[ch] || 0) + 1;
    }
  }

  // Merge bigrams and singles, deduplicate: if bigram contains single chars,
  // keep bigram if its frequency is higher
  const result = {};

  for (const [word, count] of Object.entries(bigrams)) {
    if (!STOP_WORDS_CN.has(word) && word.length >= 2) {
      result[word] = count;
    }
  }

  for (const [word, count] of Object.entries(singles)) {
    // Only add single char if no overlapping bigram is significantly more frequent
    result[word] = Math.max(result[word] || 0, count);
  }

  return Object.entries(result)
    .filter(([, c]) => c >= 2) // require at least 2 occurrences
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

// Wire up text input
function updateWordList() {
  const words = extractWords(textInput.value);
  wordCountEl.textContent = words.length > 0 ? `${words.length} 个词` : '';
  return words;
}

textInput.addEventListener('input', () => {
  updateWordList();
});

btnExample.addEventListener('click', () => {
  textInput.value = EXAMPLE_TEXT;
  updateWordList();
});

// Stub: placeholder render on canvas
function renderPlaceholder() {
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#aaa';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('输入文字后自动生成词云', canvas.width / 2, canvas.height / 2);
}

renderPlaceholder();
```

- [ ] **Step 2: Commit**

```bash
git add tools/word-cloud/word-cloud.js
git commit -m "feat: add word extraction engine with EN and CN support"
```

---

### Task 12: Word Cloud — Rendering Engine

**Files:**
- Modify: `tools/word-cloud/word-cloud.js` — append rendering logic

- [ ] **Step 1: Append canvas rendering engine to word-cloud.js**

```js
// === Rendering State ===
let currentShape = 'circle';
let activePalette = 0;
let minFontSize = 14;
let maxFontSize = 60;
let maxWords = 80;

// === Color Palettes ===
const PALETTES = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9', '#1ABC9C', '#F39C12'],
  ['#FF5E5B', '#FFFFEA', '#00CECB', '#FFED66', '#FF6B6B', '#C5E99B', '#6B5B95'],
  ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#8AB17D', '#B5838D'],
  ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF'],
];

// === Shape Masks ===
function isInShape(x, y, cx, cy, radius) {
  const dx = (x - cx) / radius;
  const dy = (y - cy) / radius;
  switch (currentShape) {
    case 'circle':
      return dx * dx + dy * dy <= 1;
    case 'rect':
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
    case 'heart': {
      // Heart formula: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      // Scale to fit better
      const hx = dx * 1.2;
      const hy = dy * 1.2 - 0.1;
      const v = Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * hy * hy * hy;
      return v <= 0.05;
    }
    case 'star': {
      // Simplified star: check polar with 5-point modulation
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const outerR = 0.95;
      const innerR = 0.4;
      const points = 5;
      const sector = (angle + Math.PI / 2) % (2 * Math.PI / points);
      const t = sector / (2 * Math.PI / points); // 0..1 within sector
      const r = innerR + (outerR - innerR) * (1 - Math.abs(t - 0.5) * 2);
      return dist <= r;
    }
    default:
      return true;
  }
}

// === Spiral Placement ===
function placeWords(wordList) {
  const placed = [];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 10;

  // Calculate font sizes
  const maxCount = wordList.length > 0 ? wordList[0].count : 1;
  const minCount = wordList.length > 0 ? wordList[wordList.length - 1].count : 1;

  const words = wordList.map((w) => ({
    text: w.word,
    size: minCount === maxCount
      ? (minFontSize + maxFontSize) / 2
      : minFontSize + ((w.count - minCount) / (maxCount - minCount)) * (maxFontSize - minFontSize),
  }));

  for (const word of words) {
    ctx.font = `bold ${word.size}px sans-serif`;
    const metrics = ctx.measureText(word.text);
    const ww = metrics.width;
    const wh = word.size;

    let placed_success = false;
    // Spiral search
    for (let step = 0; step < 2000; step++) {
      const angle = step * 0.15;
      const r = (step / 2000) * maxRadius * 1.1;
      const x = cx + r * Math.cos(angle) - ww / 2;
      const y = cy + r * Math.sin(angle) + wh / 3;

      // Check if in shape
      const centerX = x + ww / 2;
      const centerY = y - wh / 3;
      if (!isInShape(centerX, centerY, cx, cy, maxRadius)) continue;
      if (x < 0 || x + ww > canvas.width || y - wh + 4 < 0 || y + 4 > canvas.height) continue;

      // Collision check with placed words
      let collides = false;
      for (const pw of placed) {
        if (
          x < pw.x + pw.width &&
          x + ww > pw.x &&
          y - wh < pw.y &&
          y > pw.y - pw.height
        ) {
          collides = true;
          break;
        }
      }
      if (!collides) {
        placed.push({
          text: word.text,
          x,
          y: y - wh, // baseline-ish top
          size: word.size,
          width: ww,
          height: wh,
          color: PALETTES[activePalette][placed.length % PALETTES[activePalette].length],
        });
        placed_success = true;
        break;
      }
    }
    // Stop placing if we can't fit more
    if (!placed_success && placed.length > 10) break;
  }

  return placed;
}

// === Render ===
function renderWordCloud() {
  const rawWords = extractWords(textInput.value);
  if (rawWords.length === 0) {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#aaa';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('输入文字开始生成词云', canvas.width / 2, canvas.height / 2);
    return;
  }

  const limited = rawWords.slice(0, maxWords);

  // Clear
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const placed = placeWords(limited);

  // Draw words
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  for (const pw of placed) {
    ctx.fillStyle = pw.color;
    ctx.font = `bold ${pw.size}px sans-serif`;
    ctx.fillText(pw.text, pw.x, pw.y);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/word-cloud/word-cloud.js
git commit -m "feat: add word cloud spiral placement and canvas rendering"
```

---

### Task 13: Word Cloud — Shapes, Palettes, Controls Integration

**Files:**
- Modify: `tools/word-cloud/word-cloud.js` — wire up all UI controls

- [ ] **Step 1: Append UI control bindings to word-cloud.js**

```js
// === Shape Selection ===
document.querySelectorAll('[data-shape]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-shape]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentShape = btn.dataset.shape;
    renderWordCloud();
  });
});

// === Palette Selection ===
const paletteList = document.getElementById('palette-list');

function renderPalettes() {
  paletteList.innerHTML = '';
  PALETTES.forEach((palette, i) => {
    const strip = document.createElement('div');
    strip.className = 'palette-strip';
    if (i === activePalette) strip.classList.add('selected');
    palette.forEach((color) => {
      const dot = document.createElement('span');
      dot.className = 'palette-dot';
      dot.style.backgroundColor = color;
      strip.appendChild(dot);
    });
    strip.addEventListener('click', () => {
      activePalette = i;
      renderPalettes();
      renderWordCloud();
    });
    paletteList.appendChild(strip);
  });
}

renderPalettes();

// === Sliders ===
function bindSlider(id, valId, onChange) {
  const slider = document.getElementById(id);
  const valEl = document.getElementById(valId);
  slider.addEventListener('input', () => {
    valEl.textContent = slider.value;
    onChange(parseInt(slider.value, 10));
    renderWordCloud();
  });
}

bindSlider('min-font-size', 'val-min-size', (v) => { minFontSize = v; });
bindSlider('max-font-size', 'val-max-size', (v) => { maxFontSize = v; });
bindSlider('max-words', 'val-max-words', (v) => { maxWords = v; });

// === Regenerate ===
document.getElementById('btn-regenerate').addEventListener('click', () => {
  renderWordCloud();
});

// === Auto-render on text input ===
textInput.addEventListener('input', () => {
  updateWordList();
  renderWordCloud();
});

// === Load example and render ===
btnExample.addEventListener('click', () => {
  textInput.value = EXAMPLE_TEXT;
  updateWordList();
  renderWordCloud();
});
```

- [ ] **Step 2: Commit**

```bash
git add tools/word-cloud/word-cloud.js
git commit -m "feat: wire up word cloud shape, palette, and slider controls"
```

---

### Task 14: Word Cloud — Export PNG + SVG

**Files:**
- Modify: `tools/word-cloud/word-cloud.js` — append export code

- [ ] **Step 1: Append export code to word-cloud.js**

```js
// === Export PNG ===
document.getElementById('btn-export-png').addEventListener('click', () => {
  // Render at 2x for retina
  const scale = 2;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.scale(scale, scale);

  // Re-render onto export canvas
  exportCtx.fillStyle = '#ffffff';
  exportCtx.fillRect(0, 0, canvas.width, canvas.height);

  const rawWords = extractWords(textInput.value);
  const limited = rawWords.slice(0, maxWords);
  const placed = placeWords(limited);

  exportCtx.textAlign = 'left';
  exportCtx.textBaseline = 'alphabetic';
  for (const pw of placed) {
    exportCtx.fillStyle = pw.color;
    exportCtx.font = `bold ${pw.size}px sans-serif`;
    exportCtx.fillText(pw.text, pw.x, pw.y);
  }

  exportCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-cloud.png';
    a.click();
    URL.revokeObjectURL(url);
  });
});

// === Export SVG ===
document.getElementById('btn-export-svg').addEventListener('click', () => {
  const rawWords = extractWords(textInput.value);
  const limited = rawWords.slice(0, maxWords);
  const placed = placeWords(limited);

  let svgTexts = '';
  for (const pw of placed) {
    svgTexts += `  <text x="${pw.x.toFixed(1)}" y="${pw.y.toFixed(1)}" font-family="sans-serif" font-weight="bold" font-size="${pw.size}" fill="${pw.color}">${escapeXml(pw.text)}</text>\n`;
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">\n<rect width="100%" height="100%" fill="#ffffff"/>\n${svgTexts}</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'word-cloud.svg';
  a.click();
  URL.revokeObjectURL(url);
});

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/word-cloud/word-cloud.js
git commit -m "feat: add word cloud PNG and SVG export"
```

---

### Task 15: Final Integration & Smoke Test

**Files:**
- Review: all files

- [ ] **Step 1: Verify dev server and all routes**

Run: `npm run dev`

Expected:
- `/` → homepage with two tool cards, nav bar, theme toggle works
- `/tools/pixel-art/` → pixel art editor loads, canvas renders, drawing works, export downloads PNG
- `/tools/word-cloud/` → word cloud loads, example text populates, cloud renders, PNG and SVG export work
- Theme toggle switches between dark and light, persists on refresh

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: build succeeds, `dist/` contains all three HTML files with hashed assets

- [ ] **Step 3: Verify production build**

Run: `npm run preview`
Expected: all three pages render correctly from dist

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete creative toolbox MVP with pixel art and word cloud"
```
