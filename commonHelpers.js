import{S as f,i as g}from"./assets/vendor-46aac873.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const h="41875605-6b47be3c8e074a549a6d5f149",p="https://pixabay.com/api";async function y(n){const r=new URLSearchParams({key:h,q:n,image_type:"photo",orientation:"horizontal",safesearch:!0});return(await(await fetch(`${p}/?${r}`)).json()).hits}const s={searchForm:document.querySelector("form"),imagesContainer:document.querySelector(".gallery-container")},c={noImages:"Sorry, there are no images matching your search query. Please try again!",enterQuery:"Please enter a search query!"};s.searchForm.addEventListener("submit",L);async function L(n){n.preventDefault();const r=n.currentTarget,a=r.elements.input.value.trim();if(a){s.imagesContainer.innerHTML="",q();try{const o=await y(a);o.length===0?l(c.noImages):S(o)}catch{b()}finally{I(),r.reset()}}else l(c.enterQuery),s.imagesContainer.innerHTML=""}function S(n){s.imagesContainer.innerHTML="";const r=({webformatURL:o,largeImageURL:e,tags:t,likes:i,views:u,comments:d,downloads:m})=>`
  
    <li class="gallery">
      <a href="${e}">
        <img class="image-preview" src="${o}" alt="${t}">
      </a>
      <div class="image-description">
      <p>Likes ${i}</p>
      <p>Views ${u}</p>
      <p>Comments ${d}</p>
      <p>Downloads ${m}</p>
      </div>
    </li>
  
  `,a=n.map(r).join("");s.imagesContainer.insertAdjacentHTML("beforeend",a),w.refresh()}const w=new f(".gallery a",{captionsData:"alt",captionDelay:250});function b(){l(c.noImages)}function l(n,r="white",a="topRight",o="red"){g.show({message:n,messageColor:r,position:a,color:o})}function q(){document.querySelector(".loader").classList.remove("hidden")}function I(){document.querySelector(".loader").classList.add("hidden")}
//# sourceMappingURL=commonHelpers.js.map
