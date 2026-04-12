// Sidebar list backed by localStorage. innerHTML wipes nodes, so we re-attach remove handlers each render.

import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from './storage.js';
import { favoriteItemHTML } from './ui.js';

export function renderFavorites(refs, onRemoved) {
  const { list, count, empty, badge } = refs;
  const favorites = getFavorites();
  const n = favorites.length;

  count.textContent = `${n} book${n !== 1 ? 's' : ''} saved`;
  if (badge) badge.textContent = String(n);

  if (n === 0) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  list.innerHTML = favorites.map(favoriteItemHTML).join('');

  list.querySelectorAll('.fav-item-heart').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      removeFavorite(key);
      renderFavorites(refs, onRemoved);
      onRemoved?.(key);
    });
  });
}

export function toggleFavorite(book, refs, onSync) {
  const wasFav = isFavorite(book.key);

  wasFav ? removeFavorite(book.key) : addFavorite(book);

  renderFavorites(refs, onSync);
  onSync?.(book.key);

  return !wasFav;
}
