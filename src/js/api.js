// Open Library: trim fields so responses stay small; we only render these props.

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';
const LIMIT = 10;

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
  const docs = Array.isArray(data.docs) ? data.docs : [];
  return docs.slice(0, LIMIT);
}

export function getCoverUrl(coverId, size = 'M') {
  return coverId ? `${COVERS_URL}/${coverId}-${size}.jpg` : null;
}
