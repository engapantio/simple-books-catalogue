// Namespaced keys so we don't step on other scripts sharing this origin.

const FAVORITES_KEY = 'tl_favorites';
const THEME_KEY = 'tl_theme';

export function getFavorites() {
  // Bad JSON (hand-edited storage, etc.) -> empty list.
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function addFavorite(book) {
  const list = getFavorites();
  if (!list.find(b => b.key === book.key)) {
    list.push(book);
    saveFavorites(list);
  }
  return getFavorites();
}

export function removeFavorite(key) {
  const updated = getFavorites().filter(b => b.key !== key);
  saveFavorites(updated);
  return updated;
}

export function isFavorite(key) {
  return getFavorites().some(b => b.key === key);
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
