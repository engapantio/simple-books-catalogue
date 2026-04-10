/**
 * favorites.js
 * Manages the Favorites sidebar panel.
 * Coordinates between storage.js and ui.js.
 */

import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from './storage.js';
import { favoriteItemHTML } from './ui.js';

/**
 * Re-render the full favorites list inside the sidebar.
 * Call on page load and after every add / remove.
 *
 * @param {{ list: HTMLElement, count: HTMLElement, empty: HTMLElement, badge: HTMLElement }} DOM element references.
 * @param {Function} [onRemoved] Optional callback(key) fired after a book is removed.

 */
export function renderFavorites(refs, onRemoved) {
  const { list, count, empty, badge } = refs;
  const favorites = getFavorites();
  const n = favorites.length;

  // Update labels and mobile badge
  count.textContent = `${n} book${n !== 1 ? 's' : ''} saved`;
  if (badge) badge.textContent = String(n);

  if (n === 0) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  // Build all items as a single HTML string and inject at once —
  // minimises reflows compared to appending one element at a time.
  list.innerHTML = favorites.map(favoriteItemHTML).join('');

  list.querySelectorAll('.fav-item__heart').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      removeFavorite(key);
      renderFavorites(refs, onRemoved);
      onRemoved?.(key);
    });
  });
}

/**
 * Toggle a book's favorite status (add if absent, remove if present).
 *
 * @param {Object}  Book doc object (must have `key` field).
 * @param {Object}   Same shape as renderFavorites refs.
 * @param {Function} Called with the book key to sync grid buttons.
 * @returns {boolean}  true = now a favorite.
 */
export function toggleFavorite(book, refs, onSync) {
  const wasFav = isFavorite(book.key);

  wasFav ? removeFavorite(book.key) : addFavorite(book);

  renderFavorites(refs, onSync);
  onSync?.(book.key);

  return !wasFav;
}
