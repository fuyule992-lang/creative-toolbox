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
  const chineseOnly = [...text].filter(isChineseChar).join('');

  const bigrams = {};
  for (let i = 0; i < chineseOnly.length - 1; i++) {
    const bigram = chineseOnly.slice(i, i + 2);
    bigrams[bigram] = (bigrams[bigram] || 0) + 1;
  }

  const singles = {};
  for (const ch of chineseOnly) {
    if (!STOP_WORDS_CN.has(ch)) {
      singles[ch] = (singles[ch] || 0) + 1;
    }
  }

  const result = {};
  for (const [word, count] of Object.entries(bigrams)) {
    if (!STOP_WORDS_CN.has(word) && word.length >= 2) {
      result[word] = count;
    }
  }
  for (const [word, count] of Object.entries(singles)) {
    result[word] = Math.max(result[word] || 0, count);
  }

  return Object.entries(result)
    .filter(([, c]) => c >= 2)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

function updateWordList() {
  const words = extractWords(textInput.value);
  wordCountEl.textContent = words.length > 0 ? `${words.length} 个词` : '';
  return words;
}

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
      const hx = dx * 1.2;
      const hy = dy * 1.2 - 0.1;
      const v = Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * hy * hy * hy;
      return v <= 0.05;
    }
    case 'star': {
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const outerR = 0.95;
      const innerR = 0.4;
      const points = 5;
      const sector = (angle + Math.PI / 2) % (2 * Math.PI / points);
      const t = sector / (2 * Math.PI / points);
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
    for (let step = 0; step < 2000; step++) {
      const angle = step * 0.15;
      const r = (step / 2000) * maxRadius * 1.1;
      const x = cx + r * Math.cos(angle) - ww / 2;
      const y = cy + r * Math.sin(angle) + wh / 3;

      const centerX = x + ww / 2;
      const centerY = y - wh / 3;
      if (!isInShape(centerX, centerY, cx, cy, maxRadius)) continue;
      if (x < 0 || x + ww > canvas.width || y - wh + 4 < 0 || y + 4 > canvas.height) continue;

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
          y: y - wh,
          size: word.size,
          width: ww,
          height: wh,
          color: PALETTES[activePalette][placed.length % PALETTES[activePalette].length],
        });
        placed_success = true;
        break;
      }
    }
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
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const placed = placeWords(limited);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  for (const pw of placed) {
    ctx.fillStyle = pw.color;
    ctx.font = `bold ${pw.size}px sans-serif`;
    ctx.fillText(pw.text, pw.x, pw.y);
  }
}

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

// === Text input auto-render ===
textInput.addEventListener('input', () => {
  updateWordList();
  renderWordCloud();
});

// === Example button ===
btnExample.addEventListener('click', () => {
  textInput.value = EXAMPLE_TEXT;
  updateWordList();
  renderWordCloud();
});

// === Export PNG ===
document.getElementById('btn-export-png').addEventListener('click', () => {
  const scale = 2;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.scale(scale, scale);

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

// === Initial render ===
function renderPlaceholder() {
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#aaa';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('输入文字开始生成词云', canvas.width / 2, canvas.height / 2);
}
renderPlaceholder();
