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
