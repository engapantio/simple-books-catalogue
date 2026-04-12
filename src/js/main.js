// Books catalogue: search, favorites, theme, and responsive favorites placement.

import '../styles/main.css';

import { searchBooks } from './api.js';
import {
  bookCardHTML,
  noCoverHTML,
  syncCardFavButton,
  showState,
  clearState,
  favoritesHeaderMarkInnerHTML,
  escapeHtml,
} from './ui.js';
import { renderFavorites, toggleFavorite } from './favorites.js';
import { initTheme } from './theme.js';
import { debounce } from '../utils/helpers.js';

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

const favRefs = {
  list: favoritesList,
  count: favCount,
  empty: favEmpty,
  badge: favBadge
};

// Last batch from Open Library; author filter only narrows this (no second request).
let currentBooks = [];

function getSearchResultsCap() {
  // Tablet (768–1279px) is tighter than desktop (1280px+), so fewer cards there.
  const w = window.innerWidth;
  if (w >= 1280) return 10;
  if (w >= 768) return 6;
  return 10;
}

initTheme(themeBtn);

function placeFavoritesPanel() {
  if (!favoritesSidebar || !heroWrapper || !contentLayout || !searchBarGroup) return;

  // One aside node: park it in the hero on small screens, next to results on wider ones.
  if (window.innerWidth < 768) {
    if (favoritesSidebar.parentElement !== heroWrapper) {
      heroWrapper.insertBefore(favoritesSidebar, searchBarGroup);
    }
  } else {
    if (favoritesSidebar.parentElement !== contentLayout) {
      contentLayout.appendChild(favoritesSidebar);
    }
    favoritesSidebar.classList.remove('favorites-open');
    favMobileBtn?.setAttribute('aria-expanded', 'false');
    favMobileBtn?.setAttribute('aria-label', 'Show favorites');
  }
}

placeFavoritesPanel();

const favHeaderMark = document.getElementById('favHeaderMark');
if (favHeaderMark) favHeaderMark.innerHTML = favoritesHeaderMarkInnerHTML();

renderFavorites(favRefs, key => syncCardFavButton(booksGrid, key));

showState(stateMsg, 'info', 'Enter a search query to find books.');

// Delegation: the grid's children are rebuilt on every search.
booksGrid.addEventListener('click', e => {
  const favBtn = e.target.closest('.book-card-fav-btn');
  if (!favBtn) return;

  e.stopPropagation();

  const key  = favBtn.dataset.key;
  const book = currentBooks.find(b => b.key === key);
  if (book) {
    toggleFavorite(book, favRefs, k => syncCardFavButton(booksGrid, k));
  }
});

// Broken cover URLs: "error" doesn't bubble, so listen on the grid with capture.
booksGrid.addEventListener('error', e => {
  const img = e.target;
  if (!img.classList.contains('book-card-cover')) return;

  const wrap = img.closest('.book-card-cover-wrap');
  if (wrap) {
    img.remove();
    wrap.insertAdjacentHTML('afterbegin', noCoverHTML());
  }
}, true);

// Each new search bumps this; if an older request finishes late, we ignore it.
let searchSeq = 0;

async function performSearch(query) {
  const mySeq = ++searchSeq;
  const q = query.trim();

  if (!q) {
    showState(stateMsg, 'info', 'Enter a search query to find books.');
    booksGrid.innerHTML = '';
    authorFilter.hidden = true;
    currentBooks = [];
    return;
  }

  showState(stateMsg, 'loading', 'Loading…');
  booksGrid.innerHTML = '';
  authorFilter.hidden = true;
  currentBooks = [];

  try {
    const books = await searchBooks(q);
    if (mySeq !== searchSeq) return;

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
    if (mySeq !== searchSeq) return;
    console.error('Search error:', err);
    showState(stateMsg, 'error',
      'Network error. Please check your connection and try again.');
  }
}

function bookCardsByVisualRow(cards) {
  if (!cards.length) return [];
  const sorted = [...cards].sort(
    (a, b) =>
      a.getBoundingClientRect().top - b.getBoundingClientRect().top ||
      a.getBoundingClientRect().left - b.getBoundingClientRect().left
  );
  const rows = [];
  let row = [sorted[0]];
  let rowTop = sorted[0].getBoundingClientRect().top;
  for (let i = 1; i < sorted.length; i++) {
    const c = sorted[i];
    const t = c.getBoundingClientRect().top;
    if (Math.abs(t - rowTop) < 8) row.push(c);
    else {
      rows.push(row);
      row = [c];
      rowTop = t;
    }
  }
  rows.push(row);
  return rows;
}

function titleNeedsTwoLines(titleEl) {
  const w = titleEl.getBoundingClientRect().width;
  if (w < 4) return false;

  const clone = titleEl.cloneNode(true);
  clone.className = titleEl.className;
  clone.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    `width:${w}px`,
    'min-height:0',
    'height:auto',
    'max-height:none',
    'display:block',
    'overflow:visible',
    '-webkit-line-clamp:unset',
    'line-clamp:unset',
    '-webkit-box-orient:unset',
  ].join(';');
  document.body.appendChild(clone);
  const fullH = clone.scrollHeight;
  document.body.removeChild(clone);

  const cs = getComputedStyle(titleEl);
  let lh = parseFloat(cs.lineHeight);
  if (!Number.isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.3;
  return fullH > lh * 1.45;
}

function syncBookCardTitleRowHeights() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const cards = [...booksGrid.querySelectorAll('.book-card')];
      cards.forEach(c => c.classList.remove('book-card-tall-title-row'));
      if (!cards.length) return;

      for (const row of bookCardsByVisualRow(cards)) {
        const anyTwo = row.some(card => {
          const t = card.querySelector('.book-card-title');
          return t && titleNeedsTwoLines(t);
        });
        if (anyTwo) row.forEach(c => c.classList.add('book-card-tall-title-row'));
      }
    });
  });
}

function renderBookList(books) {
  const cap = getSearchResultsCap();
  const visible = books.slice(0, cap);
  booksGrid.innerHTML = visible.map(bookCardHTML).join('');
  syncBookCardTitleRowHeights();
}

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
    // User-typed text ends up in HTML — escape it like any other untrusted string.
    const safe = escapeHtml(authorInput.value);
    booksGrid.innerHTML =
      `<p class="filter-empty">No books by "${safe}" in these results.</p>`;
  } else {
    renderBookList(filtered);
  }
}

// Don’t call the API on every keypress; wait until typing pauses.
const debouncedSearch = debounce(value => performSearch(value), 1000);
searchInput.addEventListener('input', e => debouncedSearch(e.target.value));

searchBtn.addEventListener('click', () => performSearch(searchInput.value));

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performSearch(searchInput.value);
  }
});

authorInput.addEventListener('input', () => updateBooksGridFromState());

// Resize can change how many cards we show or where the sidebar sits.
const debouncedLayoutReflow = debounce(() => {
  placeFavoritesPanel();
  updateBooksGridFromState();
}, 200);
window.addEventListener('resize', debouncedLayoutReflow);

favMobileBtn?.addEventListener('click', () => {
  const open = favoritesSidebar.classList.toggle('favorites-open');
  favMobileBtn.setAttribute('aria-expanded', String(open));
  favMobileBtn.setAttribute('aria-label', open ? 'Hide favorites' : 'Show favorites');
});
