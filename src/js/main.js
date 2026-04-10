/**
 * main.js — Application entry point.
 * Wires up DOM, search, author filter, favorites, theme, and mobile toggle.
 */

import '../styles/main.css';

import { searchBooks } from './api.js';
import {
  bookCardHTML,
  noCoverHTML,
  syncCardFavButton,
  showState,
  clearState,
  favoritesHeaderMarkInnerHTML,
} from './ui.js';
import { renderFavorites, toggleFavorite } from './favorites.js';
import { initTheme } from './theme.js';
import { debounce } from '../utils/helpers.js';

/* ── DOM refs ────────────────────────────────────────────────── */
const searchInput      = document.getElementById('searchInput');
const searchBtn        = document.getElementById('searchBtn');
const booksGrid        = document.getElementById('booksGrid');
const stateMsg         = document.getElementById('stateMsg');
const authorFilter     = document.getElementById('authorFilter');
const authorInput      = document.getElementById('authorInput');
const favoritesList    = document.getElementById('favoritesList');
const favCount         = document.getElementById('favCount');
const favEmpty         = document.getElementById('favEmpty');
const favBadge         = document.getElementById('favBadge');
const favMobileBtn     = document.getElementById('favMobileBtn');
const favoritesSidebar = document.getElementById('favoritesSidebar');
const themeBtn         = document.getElementById('themeBtn');
const heroWrapper      = document.querySelector('.hero .wrapper');
const searchBarGroup   = document.querySelector('.search-bar-group');
const contentLayout    = document.querySelector('.content-layout');

/* Grouped refs for the favorites panel */
const favRefs = {
  list: favoritesList,
  count: favCount,
  empty: favEmpty,
  badge: favBadge
};

/* ── State ───────────────────────────────────────────────────── */
/** Books from the last successful API call (used by author filter) */
let currentBooks = [];

/** Visible result cap by layout band: mobile 10, tablet 6, desktop 10 */
function getSearchResultsCap() {
  const w = window.innerWidth;
  if (w >= 1220) return 10;
  if (w >= 768) return 6;
  return 10;
}

/* ── Init ────────────────────────────────────────────────────── */

// Apply saved theme
initTheme(themeBtn);

/**
 * Mobile: keep favorites above the search bar in the hero.
 * Tablet/desktop: sidebar beside results inside `.content-layout`.
 */
function placeFavoritesPanel() {
  if (!favoritesSidebar || !heroWrapper || !contentLayout || !searchBarGroup) return;

  if (window.innerWidth < 768) {
    if (favoritesSidebar.parentElement !== heroWrapper) {
      heroWrapper.insertBefore(favoritesSidebar, searchBarGroup);
    }
  } else {
    if (favoritesSidebar.parentElement !== contentLayout) {
      contentLayout.appendChild(favoritesSidebar);
    }
    favoritesSidebar.classList.remove('favorites--open');
    favMobileBtn?.setAttribute('aria-expanded', 'false');
    favMobileBtn?.setAttribute('aria-label', 'Show favorites');
  }
}

placeFavoritesPanel();

const favHeaderMark = document.getElementById('favHeaderMark');
if (favHeaderMark) favHeaderMark.innerHTML = favoritesHeaderMarkInnerHTML();

// Restore favorites from localStorage
renderFavorites(favRefs, key => syncCardFavButton(booksGrid, key));

// Show hint on first load
showState(stateMsg, 'info', 'Enter a search query to find books.');

/* ── Delegated heart-button listener (set up once) ───────────── */
// Handles clicks on .book-card__fav-btn regardless of how often the
// grid is re-rendered, because the listener lives on the stable container.
booksGrid.addEventListener('click', e => {
  const favBtn =  e.target.closest('.book-card__fav-btn');
  if (!favBtn) return;

  e.stopPropagation();

  const key  = favBtn.dataset.key;
  const book = currentBooks.find(b => b.key === key);
  if (book) {
    toggleFavorite(book, favRefs, k => syncCardFavButton(booksGrid, k));
  }
});

/* ── Cover image error handler (capture phase) ───────────────── */
// 'error' does not bubble, so we use capture (third argument = true).
// When an Open Library cover image fails to load, swap it for noCoverHTML().
booksGrid.addEventListener('error', e => {
  const img = e.target;
  if (!img.classList.contains('book-card__cover')) return;

  const wrap = img.closest('.book-card__cover-wrap');
  if (wrap) {
    img.remove();
    // Insert placeholder before the heart button
    wrap.insertAdjacentHTML('afterbegin', noCoverHTML());
  }
}, true);

/* ── Search ──────────────────────────────────────────────────── */

/**
 * Fetch books from Open Library and render them.
 *
 * @param {string} query
 */
async function performSearch(query) {
  const q = query.trim();

  if (!q) {
    showState(stateMsg, 'info', 'Enter a search query to find books.');
    booksGrid.innerHTML = '';
    authorFilter.hidden = true;
    currentBooks = [];
    return;
  }

  // Loading state
  showState(stateMsg, 'loading', 'Loading…');
  booksGrid.innerHTML = '';
  authorFilter.hidden = true;
  currentBooks = [];

  try {
    const books = await searchBooks(q);
    currentBooks = books;

    if (books.length === 0) {
      showState(stateMsg, 'empty',
        `Nothing found for "${q}". Try a different keyword.`);
      return;
    }

    clearState(stateMsg);
    renderBookList(books);
    authorFilter.hidden = false;
    authorInput.value   = '';

  } catch (err) {
    console.error('Search error:', err);
    showState(stateMsg, 'error',
      'Network error. Please check your connection and try again.');
  }
}

/**
 * Build book cards for the grid (capped per mobile / tablet / desktop band).
 *
 * @param {Array} books
 */
function renderBookList(books) {
  const cap = getSearchResultsCap();
  const visible = books.slice(0, cap);
  booksGrid.innerHTML = visible.map(bookCardHTML).join('');
}

/**
 * Re-apply author filter (if any) and grid cap — used after resize crossing bands.
 */
function updateBooksGridFromState() {
  if (!currentBooks.length) return;

  const filter = authorInput.value.trim().toLowerCase();
  if (!filter) {
    renderBookList(currentBooks);
    return;
  }

  const filtered = currentBooks.filter(b =>
    b.author_name?.some(author => author.toLowerCase().includes(filter))
  );

  if (filtered.length === 0) {
    booksGrid.innerHTML = `<p class="filter-empty">
      No books by "${authorInput.value}" in these results.
    </p>`;
  } else {
    renderBookList(filtered);
  }
}

/* ── Event listeners ─────────────────────────────────────────── */

// Debounced on-the-fly search (fires 1000 ms after typing stops)
const debouncedSearch = debounce(value => performSearch(value), 1000);
searchInput.addEventListener('input', e => debouncedSearch(e.target.value));

// Find button — immediate search
searchBtn.addEventListener('click', () => performSearch(searchInput.value));

// Enter key inside search field
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performSearch(searchInput.value);
  }
});

// Author filter (client-side, no API call)
authorInput.addEventListener('input', () => updateBooksGridFromState());

const debouncedLayoutReflow = debounce(() => {
  placeFavoritesPanel();
  updateBooksGridFromState();
}, 200);
window.addEventListener('resize', debouncedLayoutReflow);

// Mobile favorites toggle
favMobileBtn?.addEventListener('click', () => {
  const open = favoritesSidebar.classList.toggle('favorites--open');
  favMobileBtn.setAttribute('aria-expanded', String(open));
  favMobileBtn.setAttribute('aria-label', open ? 'Hide favorites' : 'Show favorites');
});
