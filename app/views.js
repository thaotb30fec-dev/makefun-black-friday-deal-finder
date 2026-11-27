// Rendering: the deal list and the deal detail page. Pure functions from
// data to HTML strings; main.js puts them into the page.

import { deals, discountPct, money, CHECKED_LABEL } from "./data.js";
import { verdictClass } from "./verdict.js";

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function dealCard(d) {
  const pct = discountPct(d);
  return `
<article class="card">
  <div class="card-top">
    <span class="store">${esc(d.store)}</span>
    <span class="cat">${esc(d.category)}</span>
  </div>
  <h3 class="card-title"><a href="#/deal/${d.id}">${esc(d.title)}</a></h3>
  <div class="price-row">
    <span class="price">${money(d.price)}</span>
    <span class="was">${money(d.was)}</span>
    <span class="off">-${pct}%</span>
  </div>
  <div class="save-line">You save ${money(d.was - d.price)}</div>
  <div class="verdict ${verdictClass(d.verdict)}">${esc(d.verdict)}</div>
  <p class="note">${esc(d.note)}</p>
  <div class="card-foot">
    <span class="checked">Checked ${CHECKED_LABEL}</span>
    <a class="deal-link" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a>
  </div>
</article>`;
}

export function renderList(list, total) {
  if (!list.length) {
    return `<div class="empty">
      <h2>No deals match those filters</h2>
      <p>Try a wider category, a lower minimum discount, or a different search.</p>
    </div>`;
  }
  return `
<div class="count-line">${list.length} of ${total} deals &middot; sorted by biggest discount</div>
<div class="grid">
${list.map(dealCard).join("\n")}
</div>`;
}

export function renderDetail(d) {
  const pct = discountPct(d);
  const same = deals.filter((x) => x.title === d.title && x.id !== d.id);
  const alsoAt = same.length
    ? `<section class="also">
        <h2>Same product at another store</h2>
        ${same
          .map(
            (x) => `<p><a href="#/deal/${x.id}">${esc(x.store)} — ${money(x.price)}</a>
              (${money(x.was)} list, -${discountPct(x)}%)</p>`,
          )
          .join("")}
      </section>`
    : "";
  return `
<div class="detail">
  <p class="back"><a href="#/">&larr; All deals</a></p>
  <div class="detail-top">
    <span class="store">${esc(d.store)}</span>
    <span class="cat">${esc(d.category)}</span>
  </div>
  <h2 class="detail-title">${esc(d.title)}</h2>
  <div class="detail-prices">
    <div class="big-price">${money(d.price)}</div>
    <div class="big-was">Usually ${money(d.was)} &middot; <span class="off">-${pct}%</span></div>
    <div class="big-save">You save ${money(d.was - d.price)}</div>
  </div>
  <div class="verdict-box ${verdictClass(d.verdict)}">
    <strong>Verdict: ${esc(d.verdict)}</strong>
    <p>${esc(d.note)}</p>
  </div>
  <p class="detail-cta">
    <a class="cta" href="${esc(d.url)}" target="_blank" rel="noopener">View this deal at ${esc(d.store)} &rarr;</a>
  </p>
  <dl class="facts">
    <div><dt>Store</dt><dd>${esc(d.store)}</dd></div>
    <div><dt>Category</dt><dd>${esc(d.category)}</dd></div>
    <div><dt>Sale price</dt><dd>${money(d.price)}</dd></div>
    <div><dt>Usual price</dt><dd>${money(d.was)}</dd></div>
    <div><dt>Discount</dt><dd>-${pct}% (save ${money(d.was - d.price)})</dd></div>
    <div><dt>Price checked</dt><dd>${CHECKED_LABEL}, 12:50 UTC</dd></div>
    <div><dt>Where it was read</dt><dd>${esc(d.source)}</dd></div>
  </dl>
  ${alsoAt}
  <p class="fineprint">Prices move during Black Friday — check the price at checkout before you buy.</p>
</div>`;
}
