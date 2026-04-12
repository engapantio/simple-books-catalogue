(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://openlibrary.org`,t=`https://covers.openlibrary.org/b/id`,n=10;async function r(t){let r=t.trim();if(!r)throw Error(`Empty query`);let i=`${e}/search.json?q=${encodeURIComponent(r)}&limit=${n}&fields=key,title,author_name,first_publish_year,cover_i`,a=await fetch(i);if(!a.ok)throw Error(`API error: ${a.status}`);let o=await a.json();return(Array.isArray(o.docs)?o.docs:[]).slice(0,n)}function i(e,n=`M`){return e?`${t}/${e}-${n}.jpg`:null}var a=`tl_favorites`,o=`tl_theme`;function s(){try{return JSON.parse(localStorage.getItem(a))??[]}catch{return[]}}function c(e){localStorage.setItem(a,JSON.stringify(e))}function l(e){let t=s();return t.find(t=>t.key===e.key)||(t.push(e),c(t)),s()}function u(e){let t=s().filter(t=>t.key!==e);return c(t),t}function d(e){return s().some(t=>t.key===e)}function f(){return localStorage.getItem(o)||`light`}function p(e){localStorage.setItem(o,e)}var m=`/simple-books-catalogue/assets/book.svg`,h=`/simple-books-catalogue/assets/heart.svg`;function g(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function _(){return`
    <svg class="favorites-header-heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <use href="${h}#heart-outline" width="16" height="16" />
    </svg>`}function v(){return`
    <div class="book-card-no-cover" aria-label="No cover available">
      <img src="${m}" alt="" width="36" height="36" aria-hidden="true" />
      <span>No cover</span>
    </div>`}function y(e){let t=i(e.cover_i,`M`),n=d(e.key),r=e.author_name?.slice(0,3).join(`, `)??`Unknown author`,a=e.first_publish_year??`—`,o=g(e.title),s=g(e.key);return`
    <li class="book-card" data-book-key="${s}">
      <div class="book-card-cover-wrap">
        ${t?`<img
          class="book-card-cover"
          src="${g(t)}"
          alt="Cover of ${o}"
          loading="lazy"
          width="150"
          height="225"
       />`:v()}
        <button
          class="book-card-fav-btn${n?` is-favorite`:``}"
          type="button"
          data-key="${s}"
          aria-pressed="${n}"
          aria-label="${n?`Remove from favorites`:`Add to favorites`}"
        >
          <span class="book-card-fav-graphic" aria-hidden="true">
            <img class="book-card-fav-img" src="${h}" width="16" height="16" alt="" />
            <svg class="book-card-fav-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <use href="${h}#heart-filled" width="16" height="16" />
            </svg>
          </span>
        </button>
      </div>
      <div class="book-card-info">
        <h3 class="book-card-title">${o}</h3>
        <p class="book-card-author">${g(r)}</p>
        <p class="book-card-year">${g(String(a))}</p>
      </div>
    </li>`}function b(e){let t=i(e.cover_i,`S`),n=e.author_name?.slice(0,2).join(`, `)??`Unknown`,r=e.first_publish_year==null?`—`:String(e.first_publish_year),a=g(e.title),o=g(e.key);return`
    <li class="fav-item" data-book-key="${o}">
      ${t?`<img
          class="fav-item-thumb"
          src="${g(t)}"
          alt="${a}"
          loading="lazy"
          width="40"
          height="56"
       />`:`<div class="fav-item-thumb fav-item-thumb-empty"></div>`}
      <div class="fav-item-meta">
        <p class="fav-item-title">${a}</p>
        <p class="fav-item-author">${g(n)}</p>
        <p class="fav-item-year">${g(r)}</p>
      </div>

      <button
        class="fav-item-heart is-favorite"
        type="button"
        data-key="${o}"
        aria-pressed="true"
        aria-label="Remove from favorites"
      >
        <svg class="fav-item-heart-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <use href="${h}#heart-filled" width="16" height="16" />
        </svg>
      </button>
    </li>`}function x(e,t){let n=e.querySelector(`.book-card-fav-btn[data-key="${CSS.escape(t)}"]`);if(!n)return;let r=d(t);n.classList.toggle(`is-favorite`,r),n.setAttribute(`aria-pressed`,String(r)),n.setAttribute(`aria-label`,r?`Remove from favorites`:`Add to favorites`)}function S(e,t,n){e.className=`state-msg state-msg-${t}`,e.textContent=n}function C(e){e.className=`state-msg`,e.textContent=``}function w(e,t){let{list:n,count:r,empty:i,badge:a}=e,o=s(),c=o.length;if(r.textContent=`${c} book${c===1?``:`s`} saved`,a&&(a.textContent=String(c)),c===0){n.innerHTML=``,i.hidden=!1;return}i.hidden=!0,n.innerHTML=o.map(b).join(``),n.querySelectorAll(`.fav-item-heart`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.key;u(r),w(e,t),t?.(r)})})}function T(e,t,n){let r=d(e.key);return r?u(e.key):l(e),w(t,n),n?.(e.key),!r}function E(e){D(f(),e),e&&e.addEventListener(`click`,()=>{let t=(document.documentElement.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`;D(t,e),p(t)})}function D(e,t){if(document.documentElement.setAttribute(`data-theme`,e),!t)return;let n=t.querySelector(`.theme-btn-icon`);n&&(n.textContent=e===`dark`?`🌙`:`☀️`),t.setAttribute(`aria-label`,`Switch to ${e===`dark`?`light`:`dark`} theme`)}function O(e,t){let n=null;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}var k=document.getElementById(`searchInput`),A=document.getElementById(`searchBtn`),j=document.getElementById(`booksGrid`),M=document.getElementById(`stateMsg`),N=document.getElementById(`authorFilter`),P=document.getElementById(`authorInput`),F=document.getElementById(`favoritesList`),I=document.getElementById(`favCount`),L=document.getElementById(`favEmpty`),R=document.getElementById(`favBadge`),z=document.getElementById(`favMobileBtn`),B=document.getElementById(`favoritesSidebar`),V=document.getElementById(`themeBtn`),H=document.querySelector(`.hero .wrapper`),U=document.querySelector(`.search-bar-group`),W=document.querySelector(`.content-layout`),G={list:F,count:I,empty:L,badge:R},K=[];function q(){let e=window.innerWidth;return e>=1280?10:e>=768?6:10}E(V);function J(){!B||!H||!W||!U||(window.innerWidth<768?B.parentElement!==H&&H.insertBefore(B,U):(B.parentElement!==W&&W.appendChild(B),B.classList.remove(`favorites-open`),z?.setAttribute(`aria-expanded`,`false`),z?.setAttribute(`aria-label`,`Show favorites`)))}J();var Y=document.getElementById(`favHeaderMark`);Y&&(Y.innerHTML=_()),w(G,e=>x(j,e)),S(M,`info`,`Enter a search query to find books.`),j.addEventListener(`click`,e=>{let t=e.target.closest(`.book-card-fav-btn`);if(!t)return;e.stopPropagation();let n=t.dataset.key,r=K.find(e=>e.key===n);r&&T(r,G,e=>x(j,e))}),j.addEventListener(`error`,e=>{let t=e.target;if(!t.classList.contains(`book-card-cover`))return;let n=t.closest(`.book-card-cover-wrap`);n&&(t.remove(),n.insertAdjacentHTML(`afterbegin`,v()))},!0);var X=0;async function Z(e){let t=++X,n=e.trim();if(!n){S(M,`info`,`Enter a search query to find books.`),j.innerHTML=``,N.hidden=!0,K=[];return}S(M,`loading`,`Loading…`),j.innerHTML=``,N.hidden=!0,K=[];try{let e=await r(n);if(t!==X)return;if(K=e,e.length===0){S(M,`empty`,`Nothing found for "${n}". Try a different keyword.`);return}C(M),Q(e),N.hidden=!1,P.value=``}catch(e){if(t!==X)return;console.error(`Search error:`,e),S(M,`error`,`Network error. Please check your connection and try again.`)}}function ee(e){if(!e.length)return[];let t=[...e].sort((e,t)=>e.getBoundingClientRect().top-t.getBoundingClientRect().top||e.getBoundingClientRect().left-t.getBoundingClientRect().left),n=[],r=[t[0]],i=t[0].getBoundingClientRect().top;for(let e=1;e<t.length;e++){let a=t[e],o=a.getBoundingClientRect().top;Math.abs(o-i)<8?r.push(a):(n.push(r),r=[a],i=o)}return n.push(r),n}function te(e){let t=e.getBoundingClientRect().width;if(t<4)return!1;let n=e.cloneNode(!0);n.className=e.className,n.style.cssText=[`position:absolute`,`left:-9999px`,`top:0`,`width:${t}px`,`min-height:0`,`height:auto`,`max-height:none`,`display:block`,`overflow:visible`,`-webkit-line-clamp:unset`,`line-clamp:unset`,`-webkit-box-orient:unset`].join(`;`),document.body.appendChild(n);let r=n.scrollHeight;document.body.removeChild(n);let i=getComputedStyle(e),a=parseFloat(i.lineHeight);return Number.isFinite(a)||(a=parseFloat(i.fontSize)*1.3),r>a*1.45}function ne(){requestAnimationFrame(()=>{requestAnimationFrame(()=>{let e=[...j.querySelectorAll(`.book-card`)];if(e.forEach(e=>e.classList.remove(`book-card-tall-title-row`)),e.length)for(let t of ee(e))t.some(e=>{let t=e.querySelector(`.book-card-title`);return t&&te(t)})&&t.forEach(e=>e.classList.add(`book-card-tall-title-row`))})})}function Q(e){let t=q();j.innerHTML=e.slice(0,t).map(y).join(``),ne()}function $(){if(!K.length)return;let e=P.value.trim().toLowerCase();if(!e){Q(K);return}let t=K.filter(t=>t.author_name?.some(t=>t.toLowerCase().includes(e)));t.length===0?j.innerHTML=`<p class="filter-empty">No books by "${g(P.value)}" in these results.</p>`:Q(t)}var re=O(e=>Z(e),1e3);k.addEventListener(`input`,e=>re(e.target.value)),A.addEventListener(`click`,()=>Z(k.value)),k.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),Z(k.value))}),P.addEventListener(`input`,()=>$());var ie=O(()=>{J(),$()},200);window.addEventListener(`resize`,ie),z?.addEventListener(`click`,()=>{let e=B.classList.toggle(`favorites-open`);z.setAttribute(`aria-expanded`,String(e)),z.setAttribute(`aria-label`,e?`Hide favorites`:`Show favorites`)});