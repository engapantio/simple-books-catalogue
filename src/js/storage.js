/**
 * storage.js
 * Abstracts all localStorage reads and writes.
 * Centralising storage keys prevents key collisions.
 */

const FAVORITES_KEY = 'tl_favorites'; // JSON array of book objects
const THEME_KEY = 'tl_theme'; // 'light' | 'dark'

/* ── Favorites ─────────────────────────────────────────────── */

/** @returns {Array} */
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  } catch {
    return [];
  }
}

/** @param {Array} favorites */
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/** Add a book (not if already saved). */
export function addFavorite(book) {
  const list = getFavorites();
  if (!list.find(b => b.key === book.key)) {
    list.push(book);
    saveFavorites(list);
  }
  return getFavorites();
}

/** Remove a book by its Open Library key. */
export function removeFavorite(key) {
  const updated = getFavorites().filter(b => b.key !== key);
  saveFavorites(updated);
  return updated;
}

/** @returns {boolean} */
export function isFavorite(key) {
  return getFavorites().some(b => b.key === key);
}

/* ── Theme ─────────────────────────────────────────────────── */

/** @returns {'light'|'dark'} */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

/** @param {'light'|'dark'} theme */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
