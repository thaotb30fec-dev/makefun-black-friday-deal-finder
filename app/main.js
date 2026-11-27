// Boot and routing. Hash routes: #/ is the deal list (filters live in the
// hash query, e.g. #/?cat=Audio&min=40), #/deal/<id> is one deal's page.
// The filter bar is static HTML in index.html; this file wires it up and
// renders the list or the detail view into #app.

import { deals, CATEGORIES, STORES } from "./data.js";
import { applyFilters, blankFilters, filtersFromHash, hashForFilters } from "./filters.js";
import { renderList, renderDetail } from "./views.js";

const app = document.getElementById("app");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");
const catEl = document.getElementById("cat-chips");
const storeEl = document.getElementById("store");
const minEl = document.getElementById("min-discount");
const sortEl = document.getElementById("sort");
const countEl = document.getElementById("result-count");

let state = blankFilters();

function buildChips() {
  const cats = ["All", ...CATEGORIES];
  catEl.innerHTML = cats
    .map((c) => `<button type="button" class="chip" data-cat="${c}">${c}</button>`)
    .join("");
  catEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    syncHash();
    render();
  });
}

function buildStores() {
  storeEl.innerHTML =
    `<option>All</option>` + STORES.map((s) => `<option>${s}</option>`).join("");
}

function syncControls() {
  searchEl.value = state.q;
  storeEl.value = state.store;
  minEl.value = String(state.minDiscount);
  sortEl.value = state.sort;
  catEl.querySelectorAll(".chip").forEach((b) => {
    b.classList.toggle("active", b.dataset.cat === state.category);
  });
}

function render() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/deal/")) {
    const id = hash.slice("#/deal/".length).split("?")[0];
    const deal = deals.find((d) => d.id === id);
    document.body.classList.add("detail-page");
    app.innerHTML = deal ? renderDetail(deal) : `<div class="empty"><h2>Deal not found</h2><p><a href="#/">Back to all deals</a></p></div>`;
    window.scrollTo(0, 0);
    return;
  }
  document.body.classList.remove("detail-page");
  const list = applyFilters(deals, state);
  syncControls();
  app.innerHTML = renderList(list, deals.length);
  countEl.textContent = `${list.length} of ${deals.length} deals`;
}

function syncHash() {
  const next = hashForFilters(state);
  if (next !== (location.hash || "#/")) history.replaceState(null, "", next);
}

searchEl.addEventListener("input", () => {
  state.q = searchEl.value;
  syncHash();
  render();
});
storeEl.addEventListener("change", () => {
  state.store = storeEl.value;
  syncHash();
  render();
});
minEl.addEventListener("change", () => {
  state.minDiscount = Number(minEl.value);
  syncHash();
  render();
});
sortEl.addEventListener("change", () => {
  state.sort = sortEl.value;
  syncHash();
  render();
});

buildChips();
buildStores();

window.addEventListener("hashchange", () => {
  if ((location.hash || "#/").startsWith("#/deal/")) {
    render();
    return;
  }
  state = filtersFromHash(location.hash || "#/");
  render();
});

state = filtersFromHash(location.hash || "#/");
render();
