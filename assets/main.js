(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://openlibrary.org`,t=`https://covers.openlibrary.org/b/id`,n=10;async function r(t){let r=t.trim();if(!r)throw Error(`Empty query`);let i=`${e}/search.json?q=${encodeURIComponent(r)}&limit=${n}&fields=key,title,author_name,first_publish_year,cover_i`,a=await fetch(i);if(!a.ok)throw Error(`API error: ${a.status}`);let o=await a.json();return(Array.isArray(o.docs)?o.docs:[]).slice(0,n)}function i(e,n=`M`){return e?`${t}/${e}-${n}.jpg`:null}var a=`tl_favorites`,o=`tl_theme`;function s(){try{return JSON.parse(localStorage.getItem(a))??[]}catch{return[]}}function c(e){localStorage.setItem(a,JSON.stringify(e))}function l(e){let t=s();return t.find(t=>t.key===e.key)||(t.push(e),c(t)),s()}function u(e){let t=s().filter(t=>t.key!==e);return c(t),t}function d(e){return s().some(t=>t.key===e)}function f(){return localStorage.getItem(o)||`light`}function p(e){localStorage.setItem(o,e)}var m=`/simple-books-catalogue/assets/book.svg`,h=`/simple-books-catalogue/assets/heart.svg`;function g(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function _(){return`
    <svg class="favorites__header-heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <use href="${h}#heart-outline" width="16" height="16" />
    </svg>`}function v(){return`
    <div class="book-card__no-cover" aria-label="No cover available">
      <img src="${m}" alt="" width="36" height="36" aria-hidden="true" />
      <span>No cover</span>
    </div>`}function y(e){let t=i(e.cover_i,`M`),n=d(e.key),r=e.author_name?.slice(0,3).join(`, `)??`Unknown author`,a=e.first_publish_year??`—`,o=g(e.title),s=g(e.key);return`
    <li class="book-card" data-book-key="${s}">
      <div class="book-card__cover-wrap">
        ${t?`<img
          class="book-card__cover"
          src="${g(t)}"
          alt="Cover of ${o}"
          loading="lazy"
          width="150"
          height="225"
       />`:v()}
        <button
          class="book-card__fav-btn${n?` is-favorite`:``}"
          type="button"
          data-key="${s}"
          aria-pressed="${n}"
          aria-label="${n?`Remove from favorites`:`Add to favorites`}"
        >
          <span class="book-card__fav-graphic" aria-hidden="true">
            <img class="book-card__fav-img" src="${h}" width="16" height="16" alt="" />
            <svg class="book-card__fav-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <use href="${h}#heart-filled" width="16" height="16" />
            </svg>
          </span>
        </button>
      </div>
      <div class="book-card__info">
        <h3 class="book-card__title">${o}</h3>
        <p  class="book-card__author">${g(r)}</p>
        <p  class="book-card__year">${g(String(a))??`Unknown`}</p>
      </div>
    </li>`}function b(e){let t=i(e.cover_i,`S`),n=e.author_name?.slice(0,2).join(`, `)??`Unknown`,r=e.first_publish_year??`Unknown`,a=g(e.title),o=g(e.key);return`
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
        class="fav-item__heart is-favorite"
        type="button"
        data-key="${o}"
        aria-pressed="true"
        aria-label="Remove from favorites"
      >
        <svg class="fav-item__heart-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <use href="${h}#heart-filled" width="16" height="16" />
        </svg>
      </button>
    </li>`}function x(e,t){let n=e.querySelector(`.book-card__fav-btn[data-key="${CSS.escape(t)}"]`);if(!n)return;let r=d(t);n.classList.toggle(`is-favorite`,r),n.setAttribute(`aria-pressed`,String(r)),n.setAttribute(`aria-label`,r?`Remove from favorites`:`Add to favorites`)}function S(e,t,n){e.className=`state-msg state-msg--${t}`,e.textContent=n}function C(e){e.className=`state-msg`,e.textContent=``}function w(e,t){let{list:n,count:r,empty:i,badge:a}=e,o=s(),c=o.length;if(r.textContent=`${c} book${c===1?``:`s`} saved`,a&&(a.textContent=String(c)),c===0){n.innerHTML=``,i.hidden=!1;return}i.hidden=!0,n.innerHTML=o.map(b).join(``),n.querySelectorAll(`.fav-item__heart`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.key;u(r),w(e,t),t?.(r)})})}function T(e,t,n){let r=d(e.key);return r?u(e.key):l(e),w(t,n),n?.(e.key),!r}function E(e){D(f(),e),e.addEventListener(`click`,()=>{let t=(document.documentElement.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`;D(t,e),p(t)})}function D(e,t){document.documentElement.setAttribute(`data-theme`,e);let n=t.querySelector(`.theme-btn__icon`);n&&(n.textContent=e===`dark`?`🌙`:`☀️`),t.setAttribute(`aria-label`,`Switch to ${e===`dark`?`light`:`dark`} theme`)}function O(e,t){let n=null;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}var k=document.getElementById(`searchInput`),A=document.getElementById(`searchBtn`),j=document.getElementById(`booksGrid`),M=document.getElementById(`stateMsg`),N=document.getElementById(`authorFilter`),P=document.getElementById(`authorInput`),F=document.getElementById(`favoritesList`),I=document.getElementById(`favCount`),L=document.getElementById(`favEmpty`),R=document.getElementById(`favBadge`),z=document.getElementById(`favMobileBtn`),B=document.getElementById(`favoritesSidebar`),V=document.getElementById(`themeBtn`),H=document.querySelector(`.hero .wrapper`),U=document.querySelector(`.search-bar-group`),W=document.querySelector(`.content-layout`),G={list:F,count:I,empty:L,badge:R},K=[];function q(){let e=window.innerWidth;return e>=1220?10:e>=768?6:10}E(V);function J(){!B||!H||!W||!U||(window.innerWidth<768?B.parentElement!==H&&H.insertBefore(B,U):(B.parentElement!==W&&W.appendChild(B),B.classList.remove(`favorites--open`),z?.setAttribute(`aria-expanded`,`false`),z?.setAttribute(`aria-label`,`Show favorites`)))}J();var Y=document.getElementById(`favHeaderMark`);Y&&(Y.innerHTML=_()),w(G,e=>x(j,e)),S(M,`info`,`Enter a search query to find books.`),j.addEventListener(`click`,e=>{let t=e.target.closest(`.book-card__fav-btn`);if(!t)return;e.stopPropagation();let n=t.dataset.key,r=K.find(e=>e.key===n);r&&T(r,G,e=>x(j,e))}),j.addEventListener(`error`,e=>{let t=e.target;if(!t.classList.contains(`book-card__cover`))return;let n=t.closest(`.book-card__cover-wrap`);n&&(t.remove(),n.insertAdjacentHTML(`afterbegin`,v()))},!0);async function X(e){let t=e.trim();if(!t){S(M,`info`,`Enter a search query to find books.`),j.innerHTML=``,N.hidden=!0,K=[];return}S(M,`loading`,`Loading…`),j.innerHTML=``,N.hidden=!0,K=[];try{let e=await r(t);if(K=e,e.length===0){S(M,`empty`,`Nothing found for "${t}". Try a different keyword.`);return}C(M),Z(e),N.hidden=!1,P.value=``}catch(e){console.error(`Search error:`,e),S(M,`error`,`Network error. Please check your connection and try again.`)}}function Z(e){let t=q();j.innerHTML=e.slice(0,t).map(y).join(``)}function Q(){if(!K.length)return;let e=P.value.trim().toLowerCase();if(!e){Z(K);return}let t=K.filter(t=>t.author_name?.some(t=>t.toLowerCase().includes(e)));t.length===0?j.innerHTML=`<p class="filter-empty">
      No books by "${P.value}" in these results.
    </p>`:Z(t)}var $=O(e=>X(e),1e3);k.addEventListener(`input`,e=>$(e.target.value)),A.addEventListener(`click`,()=>X(k.value)),k.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),X(k.value))}),P.addEventListener(`input`,()=>Q());var ee=O(()=>{J(),Q()},200);window.addEventListener(`resize`,ee),z?.addEventListener(`click`,()=>{let e=B.classList.toggle(`favorites--open`);z.setAttribute(`aria-expanded`,String(e)),z.setAttribute(`aria-label`,e?`Hide favorites`:`Show favorites`)});