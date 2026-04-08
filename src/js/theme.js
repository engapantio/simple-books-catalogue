/**
 * theme.js
 * Light / dark theme management.
 */

import { getSavedTheme, saveTheme } from './storage.js';

/**
 * Read saved preference, apply it immediately, then wire up the toggle.
 *
 * @param {HTMLButtonElement}  The theme toggle button.
 */
export function initTheme(btn) {
  applyTheme(getSavedTheme(), btn);

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

  const icon = btn.querySelector('.theme-btn__icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';

  btn.setAttribute(
    'aria-label',
    `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
  );
}
