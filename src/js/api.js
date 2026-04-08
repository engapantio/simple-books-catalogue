/**
 * api.js
 * All Open Library API communication.
 */

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';
const LIMIT = 20; // max results per search

/**
 * Search books by a free-text query (title / author / keyword).
 * Endpoint: GET /search.json?q={query}&fields=...
 *
 * @param {string} query
 * @returns {Promise<Array>}  Array of book doc objects from the API.
 */
export async function searchBooks(query) {
  const q = query.trim();
  if (!q) throw new Error('Empty query');

  const fields = 'key,title,author_name,first_publish_year,cover_i';
  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(q)}&limit=${LIMIT}&fields=${fields}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data.docs) ? data.docs : [];
}

/**
 * Build the URL for a book cover image.
 * @param {number|null} coverId  The cover_i field from the API.
 * @param {'S'|'M'|'L'} size
 * @returns {string|null}
 */
export function getCoverUrl(coverId, size = 'M') {
  return coverId ? `${COVERS_URL}/${coverId}-${size}.jpg` : null;
}
