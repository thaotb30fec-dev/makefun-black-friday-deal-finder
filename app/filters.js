// Filtering and sorting for the deal list. One job: take the deals and a
// filter state, return the deals to show, in order.

import { discountPct } from "./data.js";

export function blankFilters() {
  return { q: "", category: "All", store: "All", minDiscount: 0, sort: "discount" };
}

export function applyFilters(all, f) {
  const q = f.q.trim().toLowerCase();
  let out = all.filter((d) => {
    if (f.category !== "All" && d.category !== f.category) return false;
    if (f.store !== "All" && d.store !== f.store) return false;
    if (discountPct(d) < f.minDiscount) return false;
    if (q) {
      const hay = (d.title + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  out = sortDeals(out, f.sort);
  return out;
}

export function sortDeals(list, sort) {
  const copy = [...list];
  if (sort === "discount") copy.sort((a, b) => discountPct(b) - discountPct(a) || a.price - b.price);
  else if (sort === "saving") copy.sort((a, b) => b.was - b.price - (a.was - a.price));
  else if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  else if (sort === "name") copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
}

// Read filter state from the hash (e.g. #/?cat=Audio&min=40&q=headphones).
export function filtersFromHash(hash) {
  const f = blankFilters();
  const query = (hash.split("?")[1] || "").replace(/^#\/?/, "");
  const params = new URLSearchParams(query.startsWith("?") ? query : "?" + query);
  if (params.get("cat")) f.category = params.get("cat");
  if (params.get("store")) f.store = params.get("store");
  if (params.get("min")) f.minDiscount = Number(params.get("min")) || 0;
  if (params.get("q")) f.q = params.get("q");
  if (params.get("sort")) f.sort = params.get("sort");
  return f;
}

// Write filter state back to the hash so a filtered view is linkable.
export function hashForFilters(f) {
  const params = new URLSearchParams();
  if (f.category !== "All") params.set("cat", f.category);
  if (f.store !== "All") params.set("store", f.store);
  if (f.minDiscount) params.set("min", String(f.minDiscount));
  if (f.q) params.set("q", f.q);
  if (f.sort !== "discount") params.set("sort", f.sort);
  const s = params.toString();
  return s ? "#/?" + s : "#/";
}
