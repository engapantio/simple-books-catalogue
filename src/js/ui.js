// HTML strings for cards and the favorites list (innerHTML). Escape anything from the API or the user.

import { getCoverUrl } from './api.js';
import { isFavorite } from './storage.js';

import bookIconUrl from '../assets/book.svg';
import heartUrl from '../assets/heart.svg';

export function escapeHtml(str) {
  // Safe to drop into attributes or text nodes when building strings for innerHTML.
  return String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

export function favoritesHeaderMarkInnerHTML() {
  return `
    <svg class="favorites-header-heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <use href="${heartUrl}#heart-outline" width="16" height="16" />
    </svg>`;
}

export function noCoverHTML() {
  return `
    <div class="book-card-no-cover" aria-label="No cover available">
      <img src="${bookIconUrl}" alt="" width="36" height="36" aria-hidden="true" />
      <span>No cover</span>
    </div>`;
}

export function bookCardHTML(book) {
  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const fav      = isFavorite(book.key);
  const authors  = book.author_name?.slice(0, 3).join(', ') ?? 'Unknown author';
  const year     = book.first_publish_year ?? '—';
  const title    = escapeHtml(book.title);
  const key      = escapeHtml(book.key);

  const coverContent = coverUrl
    ? `<img
          class="book-card-cover"
          src="${escapeHtml(coverUrl)}"
          alt="Cover of ${title}"
          loading="lazy"
          width="150"
          height="225"
       />`
    : noCoverHTML();

  return `
    <li class="book-card" data-book-key="${key}">
      <div class="book-card-cover-wrap">
        ${coverContent}
        <button
          class="book-card-fav-btn${fav ? ' is-favorite' : ''}"
          type="button"
          data-key="${key}"
          aria-pressed="${fav}"
          aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"
        >
          <span class="book-card-fav-graphic" aria-hidden="true">
            <img class="book-card-fav-img" src="${heartUrl}" width="16" height="16" alt="" />
            <svg class="book-card-fav-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <use href="${heartUrl}#heart-filled" width="16" height="16" />
            </svg>
          </span>
        </button>
      </div>
      <div class="book-card-info">
        <h3 class="book-card-title">${title}</h3>
        <p class="book-card-author">${escapeHtml(authors)}</p>
        <p class="book-card-year">${escapeHtml(String(year))}</p>
      </div>
    </li>`;
}

export function favoriteItemHTML(book) {
  const thumbUrl = getCoverUrl(book.cover_i, 'S');
  const authors  = book.author_name?.slice(0, 2).join(', ') ?? 'Unknown';
  const yearStr  = book.first_publish_year == null
    ? '—'
    : String(book.first_publish_year);
  const title    = escapeHtml(book.title);
  const key      = escapeHtml(book.key);

  const thumbContent = thumbUrl
    ? `<img
          class="fav-item-thumb"
          src="${escapeHtml(thumbUrl)}"
          alt="${title}"
          loading="lazy"
          width="40"
          height="56"
       />`
    : `<div class="fav-item-thumb fav-item-thumb-empty"></div>`;

  return `
    <li class="fav-item" data-book-key="${key}">
      ${thumbContent}
      <div class="fav-item-meta">
        <p class="fav-item-title">${title}</p>
        <p class="fav-item-author">${escapeHtml(authors)}</p>
        <p class="fav-item-year">${escapeHtml(yearStr)}</p>
      </div>

      <button
        class="fav-item-heart is-favorite"
        type="button"
        data-key="${key}"
        aria-pressed="true"
        aria-label="Remove from favorites"
      >
        <svg class="fav-item-heart-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <use href="${heartUrl}#heart-filled" width="16" height="16" />
        </svg>
      </button>
    </li>`;
}

export function syncCardFavButton(grid, key) {
  // Work keys contain slashes; CSS.escape keeps the attribute selector valid.
  const btn = grid.querySelector(
    `.book-card-fav-btn[data-key="${CSS.escape(key)}"]`
  );
  if (!btn) return;

  const fav = isFavorite(key);
  btn.classList.toggle('is-favorite', fav);
  btn.setAttribute('aria-pressed', String(fav));
  btn.setAttribute('aria-label',
    fav ? 'Remove from favorites' : 'Add to favorites');
}

export function showState(el, type, message) {
  el.className   = `state-msg state-msg-${type}`;
  el.textContent = message;
}

export function clearState(el) {
  el.className   = 'state-msg';
  el.textContent = '';
}
