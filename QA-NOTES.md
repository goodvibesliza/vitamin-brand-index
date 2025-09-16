# QA-NOTES.md  
60-second test plan for Vitamin Brand Index
(Use the live production site or local dev build.)

## Home hero
- [ ] H1 reads **“Vitamin Brand Index”**  
- [ ] Header / footer bars look lighter (no heavy navy); CTA buttons have good contrast and are readable

## Brand search (homepage TripleSearch)
- [ ] Search placeholder cycles real brand names every ≈ 3 s (examples: *Ritual*, *Thorne*, *NOW*)  
- [ ] Enter an **exact** brand name (case-insensitive) and press **Enter** → browser navigates to `/brands/{slug}/`  
- [ ] Enter a **non-exact** brand term and press **Enter** → browser navigates to `/brands/?q={query}`

## Brand page
- [ ] Keyword tags render (e.g., **GMP**, **Allergen-free**, **Third-party tested**, **Self-manufactured**)  
- [ ] Clicking a tag opens `/search/attributes?q={tag}` in the same tab  
- [ ] “Official website” link appears near the top when derivable; opens in a new tab and has `rel="noopener noreferrer"` (NOT `nofollow` / `sponsored`)

## Attribute search page  
Navigate to `/search/attributes?q=women-owned`
- [ ] Heading shows **Results for “women-owned”**  
- [ ] Count chips display beside **Brands** and **Products** headings  
- [ ] “Refine” input filters both sections client-side in real time  
- [ ] If either section has > 50 items, a **Show more** button reveals the remainder

## Product search (homepage TripleSearch)
- [ ] No layout regressions; blocks still in a 3-column grid  
- [ ] Links open product detail pages; aliases / top brands are visible via “More” disclosure

## Analytics (Plausible spot-check)
1. Open DevTools → Network → filter **collect**.  
2. Perform a brand search, wait ≈ 400 ms → verify a **Search** event with `{type:'brand', q, resultCount}`.  
3. On a brand page, click a tag → verify **Tag Click** event with `{tag, brand}`.

> Tip: Hard-refresh (Ctrl + F5) if styles appear broken right after deploy.
