// === Base path for GitHub Pages ===
const BASE = import.meta.env.BASE_URL || '/';

// === Nav Template ===
const NAV_HTML = `
<nav class="shared-nav">
  <a href="${BASE}" class="logo">🎨 Creative Toolbox</a>
  <div class="nav-links">
    <a href="${BASE}tools/pixel-art/">像素画板</a>
    <a href="${BASE}tools/word-cloud/">文字云</a>
  </div>
  <button class="theme-toggle" id="theme-toggle" title="切换亮色/暗色主题">🌙</button>
</nav>
`;

// === Inject Nav ===
document.addEventListener('DOMContentLoaded', () => {
  const template = document.getElementById('shared-nav-template');
  if (template) {
    // Clone from template and fix base paths
    const clone = template.content.cloneNode(true);
    clone.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('/')) {
        a.setAttribute('href', BASE + href.slice(1));
      }
    });
    document.body.prepend(clone);
  } else {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = NAV_HTML;
    document.body.prepend(wrapper.firstElementChild);
  }

  // Highlight current page in nav
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.pathname === currentPath) {
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
