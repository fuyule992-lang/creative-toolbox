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
