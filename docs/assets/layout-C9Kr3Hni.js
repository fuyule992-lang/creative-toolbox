(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(e){if(e.ep)return;e.ep=!0;const o=s(e);fetch(e.href,o)}})();const i=`
<nav class="shared-nav">
  <a href="/" class="logo">🎨 Creative Toolbox</a>
  <div class="nav-links">
    <a href="/tools/pixel-art/">像素画板</a>
    <a href="/tools/word-cloud/">文字云</a>
  </div>
  <button class="theme-toggle" id="theme-toggle" title="切换亮色/暗色主题">🌙</button>
</nav>
`;document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("shared-nav-template");if(a){const t=a.content.cloneNode(!0);document.body.prepend(t)}else{const t=document.createElement("div");t.innerHTML=i,document.body.prepend(t.firstElementChild)}const n=window.location.pathname;document.querySelectorAll(".nav-links a").forEach(t=>{t.getAttribute("href")===n&&t.classList.add("active")});const s="creative-toolbox-theme",r=document.getElementById("theme-toggle");function e(){const t=localStorage.getItem(s);return t==="light"||t==="dark"?t:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function o(t){document.documentElement.setAttribute("data-theme",t),r&&(r.textContent=t==="dark"?"☀️":"🌙")}const c=e();o(c),r&&r.addEventListener("click",()=>{const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";o(t),localStorage.setItem(s,t)})});
