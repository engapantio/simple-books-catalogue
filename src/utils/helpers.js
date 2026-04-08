/**
 * Debounce — delays `fn` execution until `delay` ms have passed
 * since the last call. Used for on-the-fly search to avoid an API
 * request on every keystroke.
 *
 * @param {Function} fn
 * @param {number}   delay  Milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
