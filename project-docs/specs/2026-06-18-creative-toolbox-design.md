# Creative Toolbox — Design Spec

## Overview

A browser-based creative tool collection. MVP includes a **Pixel Art Editor** and a **Word Cloud Generator**, accessible via a shared homepage with light/dark theme support. Designed for viral sharing (export PNG/SVG, screenshot-friendly output).

## Tech Stack

- **Build**: Vite multi-page mode (zero-config multi-entry)
- **Runtime**: Vanilla HTML + CSS + JavaScript, no framework
- **Rendering**: Canvas API (pixel art + word cloud)
- **Deployment**: Vercel or Netlify (free tier)
- **No backend**: everything runs client-side

## Project Structure

```
creative-toolbox/
├── index.html                  # Homepage — tool card navigation
├── tools/
│   ├── pixel-art/
│   │   └── index.html          # Pixel art editor
│   └── word-cloud/
│       └── index.html          # Word cloud generator
├── shared/
│   ├── layout.css              # Shared layout, nav bar, card styles, CSS variables
│   ├── layout.js               # Shared nav injection, theme toggle
│   └── components/             # Reusable UI components (color picker, slider, etc.)
├── public/
│   └── favicon.svg
├── package.json
└── vite.config.js
```

## Routing

Vite multi-page resolves directory URLs automatically:

| URL | Page |
|-----|------|
| `/` | Homepage |
| `/tools/pixel-art/` | Pixel Art Editor |
| `/tools/word-cloud/` | Word Cloud Generator |

No client-side router needed.

## Shared Layer

### layout.css

- CSS custom properties for theming (`--bg`, `--text`, `--primary`, `--card-bg`, etc.)
- `[data-theme="light"]` and `[data-theme="dark"]` variable sets
- Nav bar styles (fixed top, logo left, nav links center, theme toggle right)
- Tool card grid styles for homepage
- Button, slider, input base styles

### layout.js

- Injects the shared `<nav>` into every page by reading a `<template id="shared-nav">` element and inserting it at the top of `<body>` on DOMContentLoaded
- Theme toggle button: toggles `data-theme` on `<html>`, persists to `localStorage`
- On page load: reads `localStorage` for saved theme, falls back to system preference (`prefers-color-scheme`)

## Homepage (`index.html`)

- Hero section: project name + tagline
- Tool card grid (2 columns on mobile, 3 on desktop)
- Each card: icon emoji + tool name + one-line description + "Open" button
- Cards link to `/tools/pixel-art/` and `/tools/word-cloud/`

## Pixel Art Editor (`tools/pixel-art/index.html`)

### Canvas Grid

- Default grid size: **16×16**
- Size switcher: 8×8 / 16×16 / 32×32 (radio buttons or segmented control)
- Each cell is a clickable/draggable square rendered on Canvas
- Grid lines: toggle on/off (checkbox), default on while editing
- Cell size auto-calculates to fill available space (max 512px total canvas)

### Drawing Tools

- **Pen**: click or drag to fill cell with selected color
- **Eraser**: click or drag to clear cell (back to transparent/white)
- **Paint Bucket**: flood-fill connected same-color cells
- Active tool indicated by highlighted button

### Color Palette

- 20 preset colors in a grid (classic pixel art palette — vibrant, high contrast)
- One custom color picker (`<input type="color">`) — last slot in palette
- Selected color shown with a ring/border highlight
- Current color preview swatch (larger)

### Undo/Redo

- Operation history stack, max 20 entries
- Each entry stores the full grid state snapshot
- Undo button (Ctrl+Z), Redo button (Ctrl+Y / Ctrl+Shift+Z)
- Buttons disabled when no history available

### Clear Canvas

- "Clear" button with confirmation dialog (or undo-able — just push to history first)

### Export

- Export as PNG: render canvas at scaled resolution (e.g., 16×16 grid → 512×512 pixels), nearest-neighbor scaling for crisp edges
- Grid lines hidden during export render
- Download triggered via `<a download>` on a blob URL

## Word Cloud Generator (`tools/word-cloud/index.html`)

### Text Input

- Large textarea for pasting or typing text
- "Use example" button fills with preset Chinese or English sample text
- Word count display: "N unique words extracted"

### Word Extraction

- **English**: split by whitespace/punctuation, remove stop words (the, a, is, etc.)
- **Chinese**: segment by punctuation/whitespace first, then apply a simple bigram extraction (every consecutive 2-character pair). Rank by frequency, deduplicate overlapping pairs by keeping the higher-frequency one. No external dictionary needed — pure statistical extraction
- Words ranked by frequency, capped by "max words" setting

### Shape Mask

- Shape selector: Circle / Rectangle / Heart / Star
- Shape determines which pixels are eligible for word placement
- Heart and Star use precomputed boolean masks (simple geometric formulas)

### Color Scheme

- 5 preset color palettes, shown as clickable swatch strips
- Each palette has 5-8 colors; words randomly assigned colors from the active palette

### Configuration Sliders

- **Min font size**: 10–40 (default 14)
- **Max font size**: 30–100 (default 60)
- **Max words**: 10–200 (default 80)
- All sliders show current value label

### Rendering

- Canvas-based, real-time render on any setting change
- "Regenerate" button for new random layout with same settings
- Word placement uses a simple spiral/random algorithm: try placing largest words first near center, spiral outward until a non-colliding position is found

### Export

- **PNG**: raster export at 2x resolution for retina
- **SVG**: vector export with `<text>` elements, preserves editability in design tools
- Both triggered via download buttons

## Theme System

- Two themes: Light and Dark
- CSS variables driven — single `data-theme` attribute on `<html>` toggles everything
- Toggle button in shared nav bar (sun/moon icon, or text label)
- Persisted to `localStorage` key `creative-toolbox-theme`

### Dark Theme Palette

| Variable | Value |
|----------|-------|
| `--bg` | `#0f0f1a` |
| `--card-bg` | `#1a1a2e` |
| `--text` | `#e0e0e0` |
| `--text-secondary` | `#8888aa` |
| `--primary` | `#7c3aed` (violet) |
| `--primary-hover` | `#8b5cf6` |
| `--border` | `#2a2a3e` |
| `--accent` | `#06d6a0` (teal) |

### Light Theme Palette

| Variable | Value |
|----------|-------|
| `--bg` | `#fafafa` |
| `--card-bg` | `#ffffff` |
| `--text` | `#1a1a2e` |
| `--text-secondary` | `#6b7280` |
| `--primary` | `#7c3aed` |
| `--primary-hover` | `#6d28d9` |
| `--border` | `#e5e7eb` |
| `--accent` | `#10b981` |

## Non-Goals (MVP)

- User accounts / login
- Backend / database
- Gallery / sharing community
- Animation frames (pixel art)
- Custom shape upload (word cloud)
- Mobile app / PWA
- Analytics / ads
- i18n (Chinese UI only for now)

## Future Tools (Post-MVP)

- Meme/表情包 generator
- E-ink fortune teller (赛博签筒)
- ASCII art converter
- Gradient wallpaper generator
