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
