(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://openlibrary.org`,t=`https://covers.openlibrary.org/b/id`,n=20;async function r(t){let r=t.trim();if(!r)throw Error(`Empty query`);let i=`${e}/search.json?q=${encodeURIComponent(r)}&limit=${n}&fields=key,title,author_name,first_publish_year,cover_i`,a=await fetch(i);if(!a.ok)throw Error(`API error: ${a.status}`);let o=await a.json();return Array.isArray(o.docs)?o.docs:[]}function i(e,n=`M`){return e?`${t}/${e}-${n}.jpg`:null}var a=`tl_favorites`,o=`tl_theme`;function s(){try{return JSON.parse(localStorage.getItem(a))??[]}catch{return[]}}function c(e){localStorage.setItem(a,JSON.stringify(e))}function l(e){let t=s();return t.find(t=>t.key===e.key)||(t.push(e),c(t)),s()}function u(e){let t=s().filter(t=>t.key!==e);return c(t),t}function d(e){return s().some(t=>t.key===e)}function f(){return localStorage.getItem(o)||`light`}function p(e){localStorage.setItem(o,e)}var m=`/simple-books-catalogue/assets/heart.svg`,h=`/simple-books-catalogue/assets/book.svg`;function g(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function _(){return`
    <div class="book-card__no-cover" aria-label="No cover available">
      <img src="${h}" alt="" width="36" height="36" aria-hidden="true" />
      <span>No cover</span>
    </div>`}function v(e){let t=i(e.cover_i,`M`),n=d(e.key),r=e.author_name?.slice(0,3).join(`, `)??`Unknown author`,a=e.first_publish_year??`—`,o=g(e.title),s=g(e.key);return`
    <li class="book-card" data-book-key="${s}">
      <div class="book-card__cover-wrap">
        ${t?`<img
          class="book-card__cover"
          src="${g(t)}"
          alt="Cover of ${o}"
          loading="lazy"
          width="150"
          height="225"
       />`:_()}
        <button
          class="book-card__fav-btn${n?` is-favorite`:``}"
          type="button"
          data-key="${s}"
          aria-pressed="${n}"
          aria-label="${n?`Remove from favorites`:`Add to favorites`}"
        >
          <svg
            class="heart-icon"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <use href="${m}"></use>
          </svg>
        </button>
      </div>
      <div class="book-card__info">
        <h3 class="book-card__title">${o}</h3>
        <p  class="book-card__author">${g(r)}</p>
        <p  class="book-card__year">${g(String(a))??`Unknown`}</p>
      </div>
    </li>`}function y(e){let t=i(e.cover_i,`S`),n=e.author_name?.slice(0,2).join(`, `)??`Unknown`,r=e.first_publish_year??`Unknown`,a=g(e.title),o=g(e.key);return`
    <li class="fav-item" data-book-key="${o}">
      ${t?`<img
          class="fav-item__thumb"
          src="${g(t)}"
          alt="${a}"
          loading="lazy"
          width="40"
          height="56"
       />`:`<div class="fav-item__thumb fav-item__thumb--empty"></div>`}
      <div class="fav-item__meta">
        <p class="fav-item__title">${a}</p>
        <p class="fav-item__author">${g(n)}</p>
        ${r?`<p class="fav-item__year">${r}</p>`:`Unknown`}
      </div>

          <button
          class="fav-item__remove"
          type="button"
          data-key="${o}"
          aria-pressed="true"
          aria-label="Remove &quot;${a}&quot; from favorites"
        >
          <svg
            class="heart-icon"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <use class="icon-red" href="${m}"></use>
          </svg>
        </button>
    </li>`}function b(e,t){let n=e.querySelector(`.book-card__fav-btn[data-key="${CSS.escape(t)}"]`);if(!n)return;let r=d(t);n.classList.toggle(`is-favorite`,r),n.setAttribute(`aria-pressed`,String(r)),n.setAttribute(`aria-label`,r?`Remove from favorites`:`Add to favorites`)}function x(e,t,n){e.className=`state-msg state-msg--${t}`,e.textContent=n}function S(e){e.className=`state-msg`,e.textContent=``}function C(e,t){let{list:n,count:r,empty:i,badge:a}=e,o=s(),c=o.length;if(r.textContent=`${c} book${c===1?``:`s`} saved`,a&&(a.textContent=String(c)),c===0){n.innerHTML=``,i.hidden=!1;return}i.hidden=!0,n.innerHTML=o.map(y).join(``),n.querySelectorAll(`.fav-item__remove`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.key;u(r),C(e,t),t?.(r)})})}function w(e,t,n){let r=d(e.key);return r?u(e.key):l(e),C(t,n),n?.(e.key),!r}function T(e){E(f(),e),e.addEventListener(`click`,()=>{let t=(document.documentElement.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`;E(t,e),p(t)})}function E(e,t){document.documentElement.setAttribute(`data-theme`,e);let n=t.querySelector(`.theme-btn__icon`);n&&(n.textContent=e===`dark`?`🌙`:`☀️`),t.setAttribute(`aria-label`,`Switch to ${e===`dark`?`light`:`dark`} theme`)}function D(e,t){let n=null;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}var O=document.getElementById(`searchInput`),k=document.getElementById(`searchBtn`),A=document.getElementById(`booksGrid`),j=document.getElementById(`stateMsg`),M=document.getElementById(`authorFilter`),N=document.getElementById(`authorInput`),P=document.getElementById(`favoritesList`),F=document.getElementById(`favCount`),I=document.getElementById(`favEmpty`),L=document.getElementById(`favBadge`),R=document.getElementById(`favMobileBtn`),z=document.getElementById(`favoritesSidebar`),B=document.getElementById(`themeBtn`),V={list:P,count:F,empty:I,badge:L},H=[];T(B),C(V,e=>b(A,e)),x(j,`info`,`Enter a search query to find books.`),A.addEventListener(`click`,e=>{let t=e.target.closest(`.book-card__fav-btn`);if(!t)return;e.stopPropagation();let n=t.dataset.key,r=H.find(e=>e.key===n);r&&w(r,V,e=>b(A,e))}),A.addEventListener(`error`,e=>{let t=e.target;if(!t.classList.contains(`book-card__cover`))return;let n=t.closest(`.book-card__cover-wrap`);n&&(t.remove(),n.insertAdjacentHTML(`afterbegin`,_()))},!0);async function U(e){let t=e.trim();if(!t){x(j,`info`,`Enter a search query to find books.`),A.innerHTML=``,M.hidden=!0,H=[];return}x(j,`loading`,`Loading…`),A.innerHTML=``,M.hidden=!0,H=[];try{let e=await r(t);if(H=e,e.length===0){x(j,`empty`,`Nothing found for "${t}". Try a different keyword.`);return}S(j),W(e),M.hidden=!1,N.value=``}catch(e){console.error(`Search error:`,e),x(j,`error`,`Network error. Please check your connection and try again.`)}}function W(e){A.innerHTML=e.map(v).join(``)}var G=D(e=>U(e),1e3);O.addEventListener(`input`,e=>G(e.target.value)),k.addEventListener(`click`,()=>U(O.value)),O.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),U(O.value))}),N.addEventListener(`input`,()=>{let e=N.value.trim().toLowerCase();if(!e){W(H);return}let t=H.filter(t=>t.author_name?.some(t=>t.toLowerCase().includes(e)));t.length===0?A.innerHTML=`<p class="filter-empty">
      No books by "${N.value}" in these results.
    </p>`:W(t)}),R?.addEventListener(`click`,()=>{let e=z.classList.toggle(`favorites--open`);R.setAttribute(`aria-expanded`,String(e)),R.setAttribute(`aria-label`,e?`Hide favorites`:`Show favorites`)});