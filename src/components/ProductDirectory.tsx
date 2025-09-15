import React, { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";

type Product = {
  name: string;
  slug: string;
  aliases?: string[];
  top_brands?: string[];
};

/** Heuristic category rules (no schema changes required) */
const CATEGORY_RULES: Array<{ label: string; test: RegExp }> = [
  { label: "Multivitamin", test: /(multi[ -]?vit|multivitamin)/i },
  { label: "Vitamin D", test: /\bvit(amin)?\s*d\b|cholecalciferol/i },
  { label: "Vitamin C", test: /\bvit(amin)?\s*c\b|ascorbic/i },
  { label: "B-Complex", test: /\bb[- ]?complex\b/i },
  { label: "Omega-3", test: /(omega|dha|epa|fish oil)/i },
  { label: "Probiotic", test: /(probiotic|bifido|lacto)/i },
  { label: "Magnesium", test: /(magnesium|mg glycinate|mg citrate)/i },
  { label: "Iron", test: /\biron\b|ferrous/i },
  { label: "Collagen", test: /collagen/i },
  { label: "Protein", test: /protein/i },
  { label: "Creatine", test: /creatine/i },
  { label: "Electrolyte", test: /(electrolyte|rehydration)/i },
  { label: "Prenatal", test: /prenatal/i },
];

function inferCategories(p: Product): string[] {
  const hay = [p.name, ...(p.aliases ?? [])].join(" ").toLowerCase();
  const matched = CATEGORY_RULES.filter((r) => r.test.test(hay)).map((r) => r.label);
  return matched.length ? Array.from(new Set(matched)) : ["Other"];
}

function buildCategoryIndex(products: Product[]) {
  const map = new Map<string, Set<string>>(); // category -> product slugs
  for (const p of products) {
    for (const cat of inferCategories(p)) {
      if (!map.has(cat)) map.set(cat, new Set());
      map.get(cat)!.add(p.slug);
    }
  }
  return map;
}

function uniqueCategories(index: Map<string, Set<string>>): string[] {
  return Array.from(index.keys()).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b);
  });
}
const fuseOptions: IFuseOptions<Product> = {
  includeScore: false,
  threshold: 0.3,
  keys: [
    { name: "name", weight: 0.7 },
    { name: "aliases", weight: 0.3 },
  ],
};

export default function ProductDirectory({ products }: { products: Product[] }) {
  const [query, setQuery] = useState<string>("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const categoryIndex = useMemo(() => buildCategoryIndex(products), [products]);
  const allCategories = useMemo(() => uniqueCategories(categoryIndex), [categoryIndex]);
  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const filtered = useMemo(() => {
    const base: Product[] = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : products;

    if (selectedCats.length === 0) return base;

    const selected = new Set(selectedCats);
    return base.filter((p) => inferCategories(p).some((c) => selected.has(c)));
  }, [products, fuse, query, selectedCats]);

  function toggleCat(cat: string) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function clearFilters() {
    setSelectedCats([]);
    setQuery("");
  }

  return (
    <div>
      <div className="controls" role="region" aria-label="Search and filters">
        <div className="searchbar">
          <input
            type="search"
            placeholder="Search products (name or alias)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <div className="actions">
            <span className="counts">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>
            <button className="reset" type="button" onClick={clearFilters} aria-label="Clear search and filters">
              Clear
            </button>
          </div>
        </div>

        {selectedCats.length > 0 && (
          <div aria-live="polite">
            {selectedCats.map((b) => (
              <span className="filter-badge" key={b}>{b}</span>
            ))}
          </div>
        )}

        <div className="filters">
          <fieldset className="filter-group">
            <legend>Categories</legend>
            {allCategories.map((cat) => (
              <label key={cat} style={{ display: "block", marginBottom: ".25rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat)}
                  onChange={() => toggleCat(cat)}
                  aria-checked={selectedCats.includes(cat)}
                />{" "}
                {cat}{" "}
                <span style={{ color: "#6b7280" }}>
                  ({categoryIndex.get(cat)?.size ?? 0})
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty" role="status">No products match. Try fewer filters.</div>
      ) : (
        <div className="grid" role="list">
          {filtered.map((p) => (
            <a className="card-link" href={`/products/${p.slug}/`} key={p.slug} role="listitem" aria-label={p.name}>
              <article className="card">
                <h3>{p.name}</h3>
                {p.aliases && p.aliases.length > 0 && (
                  <p>Also known as: {p.aliases.slice(0, 3).join(", ")}{p.aliases.length > 3 ? "…" : ""}</p>
                )}
                <p style={{ marginTop: ".25rem" }}>
                  {inferCategories(p).join(" • ")}
                </p>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
