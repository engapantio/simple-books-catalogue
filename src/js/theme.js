// data-theme on <html> drives the palette in main.css; optional button updates icon + aria.

import { getSavedTheme, saveTheme } from './storage.js';

export function initTheme(btn) {
  applyTheme(getSavedTheme(), btn);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current =
      document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next, btn);
    saveTheme(next);
  });
}

function applyTheme(theme, btn) {
  document.documentElement.setAttribute('data-theme', theme);

  if (!btn) return;

  const icon = btn.querySelector('.theme-btn-icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';

  btn.setAttribute(
    'aria-label',
    `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
  );
}
