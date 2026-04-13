# The Library

A lightweight book-search web application built with pure HTML, CSS and
JavaScript (ES6+), bundled with Vite.

---

## Task

[Assignment document](https://drive.google.com/file/d/1swszcMU9rF_-zRJaA2VchPuU_d7yrAbs/view)

---

## How to run the app

**Prerequisites:** Node.js ≥ 18

```bash
# 1 — Install dependencies
npm install

# 2 — Start the dev server (hot-reload)
npm run dev

# 3 — Production build  →  dist/
npm run build

# 4 — Preview the production build locally
npm run preview
```

The final build (`dist/`) contains exactly:
dist/
├── index.html
├── main.js
├── main.css
└── assets/
    ├── book.svg
    ├── heart.svg
    └── search.svg

### Deploy to GitHub Pages

Push to `main` — the included workflow
(`.github/workflows/deploy.yml`) builds and publishes `dist/`
to the `gh-pages` branch automatically.

---

## Folder structure

| Path | Contents |
|---|---|
| `index.html` | App shell — static HTML skeleton |
| `vite.config.js` | Vite build configuration |
| `src/assets/` | SVG icon files used throughout the UI |
| `src/styles/` | Single CSS file with design tokens, components and responsive rules |
| `src/js/` | Application logic split by responsibility (see below) |
| `src/utils/` | Shared utility functions (debounce, etc.) |
| `.github/workflows/` | GitHub Actions CI/CD for GH Pages deployment |

### `src/js/` modules

| File | Responsibility |
|---|---|
| `main.js` | Entry point — wires DOM, search, filters, events |
| `api.js` | Open Library `fetch` calls and cover URL builder |
| `storage.js` | All `localStorage` reads/writes (favorites + theme) |
| `ui.js` | DOM factory functions — builds cards and list items |
| `favorites.js` | Favorites panel rendering and add/remove logic |
| `theme.js` | Light/dark theme initialisation and toggle |

---

## Features

- 🔍 Search by title, author or keyword (Open Library API)
- ⚡ Debounced on-the-fly search (1000 ms) + manual Search button
- 👤 Client-side author filter on search results
- ❤️ Add / remove favorites — persisted in `localStorage`
- 🌙 Light / dark theme toggle — preference saved across sessions
- 📱 Fully responsive — mobile-first, 375 px → 1280 px+
- ♿ Accessible — semantic HTML, `aria-*` attributes, focus rings