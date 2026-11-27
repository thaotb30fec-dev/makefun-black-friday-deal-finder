# Black Friday Deal Finder

A static deal-finder site of **44 real Black Friday / Cyber Monday 2026 deals**,
each one checked on 27 November 2026 at its store or in a named deals source.
Searchable and filterable by category, store and minimum discount, with an
honest "is it really a deal" verdict on every deal.

Entry for the make.fun bounty
**"Build the best real Black Friday deal finder"**
(`black-friday-deal-finder-01`, $250 prize).

## What it does

- Lists 44 deals across 12 categories (TV & streaming, laptops, tablets &
  e-readers, audio, smart home, wearables, gaming, kitchen, home & vacuums,
  PC parts, toys, gift cards).
- Every deal shows: product, store, sale price, usual price, discount %,
  money saved, a verdict, and a short note saying why the verdict is honest.
- Verdict tiers: **Lowest ever** (only where a named source says so),
  **Deep cut** (50%+ off), **Strong deal** (40–49%), **Good deal** (25–39%),
  **Modest saving** (15–24%), **Small cut** (under 15%).
- Search box, store filter, minimum-discount filter, sort (biggest discount,
  biggest saving, lowest price, A–Z), and category chips — all kept in the
  URL hash, so a filtered view is shareable.
- Deal detail pages (`#/deal/<id>`) with the full facts table, the verdict
  with its reason, a link to the store, and same-product comparisons across
  stores where they exist (e.g. MacBook Air M5: Amazon $989 vs Best Buy
  $1,049; AirPods Pro 3: Amazon $149 vs Target $149.99).
- Works from static files with **no network requests**: no CDN, no fonts,
  no images, no analytics. First load is 7 files, ~11 KB gzip.

## How the deals were verified

All 44 deals were found and checked on **27 November 2026** (checked time
`2026-11-27T12:50:00Z` on every deal) from named sources: BeeBulletin /
Best Buy's Black Friday release (17 Nov), 9to5Toys (20–23 Nov), TradingView /
Benzinga (27 Nov), TechResearchOnline, Tom's Guide, Gizmodo, Inksight
(26 Nov), Product Bible (checked on Amazon 19 Nov), DealNews (26 Nov),
Redmond Pie (27 Nov), The Bargain Boy (26 Nov), Home Automation Weekly
(24 Nov), TrendThread (27 Nov), Nintendo.com. Each deal records its `source`
and a `note` in `app/data.js`.

Honest caveats are kept in the data, not hidden: e.g. the Shark AI Ultra's
list price overstates the saving (typical price ~$449.99, real saving ~$190),
and the Switch 2 bundle is only 9% off but is the only Switch 2 discount
this year. Store links are store search URLs (the pattern the competition
starter uses) — they open the store's search for that exact product.

Prices are a snapshot of 27 Nov 2026. Deals change; a price shown here may
no longer be live after Black Friday weekend.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
# or: python3 -m http.server 8080 -d app
```

No build step, no dependencies. Open http://localhost:8080 in a browser.

## Build the submission output

`main.ts` is the entrypoint the grader runs (Node 22). It copies `app/` and
`screenshots/` into the output directory and writes `dossier.json`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`vendor/makefun-frontend.ts` is copied unchanged from the competition kit
(it builds the dossier). `serve.ts` is a small static server used only for
taking the screenshots; it is not part of the app.

## Screenshots

`screenshots/` holds 4 real browser renders of the running site:

1. `1-home-desktop.jpg` — home, desktop 1280×800 (44 deals)
2. `2-filtered-desktop.jpg` — Audio, 40%+ off, desktop (5 deals)
3. `3-deal-desktop.jpg` — AirPods Pro 3 detail, desktop
4. `4-home-phone.jpg` — home, phone 390×844

All are ≤256 KiB, long side ≤1280, short side ≥360, as the brief requires.

## Files

| File | What it is |
| --- | --- |
| `main.ts` | Grader entrypoint: copies app/ + screenshots/, writes dossier.json |
| `serve.ts` | Static dev server on :8080 (for screenshots) |
| `shots.json` | The 4 screenshot definitions (URL, viewport, file) |
| `app/index.html` | Static shell: header, filter bar, `#app`, footer |
| `app/style.css` | All styling (navy + amber, system fonts, phone layout) |
| `app/main.js` | Hash router (`#/` list, `#/deal/<id>` detail) |
| `app/views.js` | List + detail rendering |
| `app/filters.js` | Filter/sort + hash read/write |
| `app/verdict.js` | Verdict → CSS class / rank |
| `app/data.js` | The 44 verified deals + store/category metadata |
| `vendor/makefun-frontend.ts` | Kit file, unchanged (dossier builder) |
| `screenshots/` | 4 real renders (see above) |
| `LICENSE` | MIT |
| `.makefun/owner.json` | Payout wallet claim |

## Submission

1. Create a public GitHub repo (e.g. `makefun-black-friday-deal-finder`)
   and push these files to `main` (main.ts at the root, LICENSE at the root).
2. Build the transcript bundle with the competition kit CLI (the bounty
   requires a bundle). This repo's sessions are the subagent session that
   built the entry plus its parent session; the parent agent has the exact
   bundle command from the earlier "thankful" entry.
3. Pre-submit check, from the kit directory:
   `node cli/makefun.mjs check --kit . --repo <repo> --transcripts <bundle>`
4. Submit on https://make.fun/bounty/black-friday-deal-finder-01 — the
   entry is signed with the payout wallet in `.makefun/owner.json`
   (EpJcTtez8XYZ36tbKz27ByaXn17v4HWT26ugf1564fF5). **The wallet signature
   is the one step that needs the wallet owner: the site asks the wallet
   to sign the entry message; without that approval the entry cannot be
   submitted.**

## License

MIT — see `LICENSE`.
