/**
 * ui.js
* Every builder function returns an HTML string.
 * Callers insert the string with innerHTML / insertAdjacentHTML, then
 * wire events via delegation.
 *
 */

import { getCoverUrl } from './api.js';
import { isFavorite } from './storage.js';

import bookIconUrl from '../assets/book.svg';
import heartUrl from '../assets/heart.svg';

/* ================================================================
  HELPERS
================================================================ */

/**
 * Escape a value for safe use in both HTML text nodes and attribute values.
 * Handles &, <, >, ", ' so the result is safe in innerHTML or attr="…".
 *
 * @param {string|number|null|undefined} str
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/**
 * Favorites sidebar title icon: green stroke-only heart (`#heart-outline` uses currentColor).
 * Caller sets this on `.favorites__header-mark` once at startup.
 *
 * @returns {string}
 */
export function favoritesHeaderMarkInnerHTML() {
  return `
    <svg class="favorites__header-heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <use href="${heartUrl}#heart-outline" width="16" height="16" />
    </svg>`;
}

/* ================================================================
  NO-COVER PLACEHOLDER
================================================================ */

/**
 * Returns the HTML string for the "No cover" placeholder box.
 * Uses bookIconUrl imported above — no extra arguments needed.
 *
 * @returns {string}
 */
export function noCoverHTML() {
  return `
    <div class="book-card__no-cover" aria-label="No cover available">
      <img src="${bookIconUrl}" alt="" width="36" height="36" aria-hidden="true" />
      <span>No cover</span>
    </div>`;
}

/* ================================================================
  BOOK CARD HTML
================================================================ */

/**
 * Build the HTML string for one book card.
 * Callers append the string; event delegation in main.js handles clicks.
 *
 * @param {Object} book  — API doc: { key, title, author_name, first_publish_year, cover_i }
 * @returns {string}     — <li class="book-card"> … </li>
 */
export function bookCardHTML(book) {
  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const fav      = isFavorite(book.key);
  const authors  = book.author_name?.slice(0, 3).join(', ') ?? 'Unknown author';
  const year     = book.first_publish_year ?? '—';
  const title    = escapeHtml(book.title);
  const key      = escapeHtml(book.key);

  // Cover: real image or the no-cover placeholder
  const coverContent = coverUrl
    ? `<img
          class="book-card__cover"
          src="${escapeHtml(coverUrl)}"
          alt="Cover of ${title}"
          loading="lazy"
          width="150"
          height="225"
       />`
    : noCoverHTML();

  return `
    <li class="book-card" data-book-key="${key}">
      <div class="book-card__cover-wrap">
        ${coverContent}
        <button
          class="book-card__fav-btn${fav ? ' is-favorite' : ''}"
          type="button"
          data-key="${key}"
          aria-pressed="${fav}"
          aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"
        >
          <span class="book-card__fav-graphic" aria-hidden="true">
            <img class="book-card__fav-img" src="${heartUrl}" width="16" height="16" alt="" />
            <svg class="book-card__fav-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <use href="${heartUrl}#heart-filled" width="16" height="16" />
            </svg>
          </span>
        </button>
      </div>
      <div class="book-card__info">
        <h3 class="book-card__title">${title}</h3>
        <p  class="book-card__author">${escapeHtml(authors)}</p>
        <p  class="book-card__year">${escapeHtml(String(year)) ?? 'Unknown'}</p>
      </div>
    </li>`;
}

/* ================================================================
  FAVORITE ITEM HTML
================================================================ */

/**
 * Build the HTML string for one entry in the Favorites sidebar list.
 * Callers append the string; favorites.js binds clicks on `.fav-item__heart`.
 *
 * @param {Object} book  — Saved book object (same shape as API doc).
 * @returns {string}     — <li class="fav-item"> … </li>
 */
export function favoriteItemHTML(book) {
  const thumbUrl = getCoverUrl(book.cover_i, 'S');
  const authors  = book.author_name?.slice(0, 2).join(', ') ?? 'Unknown';
  const year     = book.first_publish_year ?? 'Unknown';
  const title    = escapeHtml(book.title);
  const key      = escapeHtml(book.key);

  const thumbContent = thumbUrl
    ? `<img
          class="fav-item__thumb"
          src="${escapeHtml(thumbUrl)}"
          alt="${title}"
          loading="lazy"
          width="40"
          height="56"
       />`
    : `<div class="fav-item__thumb fav-item__thumb--empty"></div>`;

  return `
    <li class="fav-item" data-book-key="${key}">
      ${thumbContent}
      <div class="fav-item__meta">
        <p class="fav-item__title">${title}</p>
        <p class="fav-item__author">${escapeHtml(authors)}</p>
        ${year ? `<p class="fav-item__year">${year}</p>` : 'Unknown'}
      </div>

      <button
        class="fav-item__heart is-favorite"
        type="button"
        data-key="${key}"
        aria-pressed="true"
        aria-label="Remove from favorites"
      >
        <svg class="fav-item__heart-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <use href="${heartUrl}#heart-filled" width="16" height="16" />
        </svg>
      </button>
    </li>`;
}

/* ================================================================
  CARD HEART SYNC
  Updates an existing card's fav-button state without re-rendering.
  Called after every add/remove so the grid stays in sync.
================================================================ */

/**
 * Toggle aria attributes and .is-favorite class on a card's heart button.
 * Unfavorited: gray stroke-only <img>; favorited: <use href="#heart-filled"> (CSS cross-fade).
 *
 * @param {HTMLElement} grid
 * @param {string}      key   Open Library key (e.g. "/works/OL45804W")
 */
export function syncCardFavButton(grid, key) {
  const btn = grid.querySelector(
    `.book-card__fav-btn[data-key="${CSS.escape(key)}"]`
  );
  if (!btn) return;

  const fav = isFavorite(key);
  btn.classList.toggle('is-favorite', fav);
  btn.setAttribute('aria-pressed', String(fav));
  btn.setAttribute('aria-label',
    fav ? 'Remove from favorites' : 'Add to favorites');
}

/* ================================================================
  STATE MESSAGES
================================================================ */

/** Render a status message (loading / error / empty / info) into el. */
export function showState(el, type, message) {
  el.className   = `state-msg state-msg--${type}`;
  el.textContent = message;
}

/** Clear the status area. */
export function clearState(el) {
  el.className   = 'state-msg';
  el.textContent = '';
}

