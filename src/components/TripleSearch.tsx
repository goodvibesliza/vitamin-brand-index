import React, { useMemo, useState, useEffect } from "react";
import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import SearchBar from "./SearchBar";
import ResultBlockBrand from "./ResultBlockBrand";
import ResultBlockProduct from "./ResultBlockProduct";

// lightweight Plausible helper
function track(event: string, props: any) {
  try {
    (window as any).plausible?.(event, { props });
  } catch {}
}

/** Data shapes (match your JSON keys we actually use here) */
type Brand = {
  brand: string;
  slug: string;
  certification?: string[];
  ingredient_philosophy?: string | null;
  ownership_transparency?: string | null;
  recalls_notices?: string | null;
  sources?: string[];
};

type Product = {
  name: string;
  slug: string;
  aliases?: string[];
  top_brands?: string[];
};

/** Fuse options */
const brandFuseOptions: IFuseOptions<Brand> = {
  threshold: 0.33,
  includeScore: false,
  keys: [
    { name: "brand", weight: 0.7 },
    { name: "certification", weight: 0.2 },
    { name: "ingredient_philosophy", weight: 0.1 },
  ],
};

const productFuseOptions: IFuseOptions<Product> = {
  threshold: 0.33,
  includeScore: false,
  keys: [
    { name: "name", weight: 0.8 },
    { name: "aliases", weight: 0.2 },
  ],
};

function safeRegexFromQuery(raw: string): RegExp | null {
  const q = raw.trim();
  if (!q) return null;
  try {
    // allow matching with optional hyphen/space variations (women-owned => women[-\s]?owned)
    const pattern = q.replace(/[-\s]+/g, "[-\\s]?");
    return new RegExp(pattern, "i");
  } catch {
    return null;
  }
}

/** Turn arbitrary text into a URL-friendly slug */
function toSlug(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // drop punctuation
    .replace(/\s+/g, "-") // spaces -> hyphen
    .replace(/-+/g, "-");
}

export default function TripleSearch({
  brands,
  products,
}: {
  brands: Brand[];
  products: Product[];
}) {
  const [qBrand, setQBrand] = useState<string>("");
  const [qProduct, setQProduct] = useState<string>("");
  const [qAttr, setQAttr] = useState<string>("");

  /* ---------- rotating placeholder for brand search ---------- */
  const exampleBrands = useMemo(() => {
    const preferred = ["Ritual", "Thorne", "NOW Foods", "Garden of Life", "Nature Made"];
    const found: string[] = [];
    preferred.forEach((name) => {
      const hit = brands.find((b) => b.brand.toLowerCase() === name.toLowerCase());
      if (hit) found.push(hit.brand);
    });
    // fallback: first few brands in list
    brands.forEach((b) => {
      if (found.length < 5 && !found.includes(b.brand)) found.push(b.brand);
    });
    return found.slice(0, 5);
  }, [brands]);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (exampleBrands.length < 2) return;
    const id = setInterval(
      () => setPlaceholderIndex((i) => (i + 1) % exampleBrands.length),
      3000
    );
    return () => clearInterval(id);
  }, [exampleBrands]);

  const brandPlaceholder =
    exampleBrands.length > 0
      ? `e.g., ${exampleBrands[placeholderIndex]}`
      : "Ritual, Thorne, NOW …";

  const brandFuse = useMemo(() => new Fuse(brands, brandFuseOptions), [brands]);
  const productFuse = useMemo(() => new Fuse(products, productFuseOptions), [products]);

  /** Attribute search across brands and products (women-owned, allergen-free, etc.) */
  const attrBrandMatches: Brand[] = useMemo(() => {
    const rx = safeRegexFromQuery(qAttr);
    if (!rx) return [];
    const isWomenOwned = /women[-\s]?owned/i.test(qAttr);
    const isAllergenFree = /allergen[-\s]?free/i.test(qAttr);

    return brands.filter((b) => {
      const hay = [
        b.brand,
        ...(b.certification ?? []),
        b.ingredient_philosophy ?? "",
        b.ownership_transparency ?? "",
        b.recalls_notices ?? "",
        ...(b.sources ?? []),
      ].join(" ");
      if (rx.test(hay)) return true;
      if (isWomenOwned && /women[-\s]?owned/i.test(hay)) return true;
      if (isAllergenFree && /allergen[-\s]?free/i.test(hay)) return true;
      return false;
    });
  }, [qAttr, brands]);

  const attrProductMatches: Product[] = useMemo(() => {
    const rx = safeRegexFromQuery(qAttr);
    if (!rx) return [];
    const isWomenOwned = /women[-\s]?owned/i.test(qAttr);
    const isAllergenFree = /allergen[-\s]?free/i.test(qAttr);

    return products.filter((p) => {
      const hay = [p.name, ...(p.aliases ?? [])].join(" ");
      if (rx.test(hay)) return true;
      if (isWomenOwned && /women[-\s]?owned/i.test(hay)) return true;
      if (isAllergenFree && /allergen[-\s]?free/i.test(hay)) return true;
      return false;
    });
  }, [qAttr, products]);

  const brandResults: Brand[] = useMemo(() => {
    const q = qBrand.trim();
    return q ? brandFuse.search(q).map((r) => r.item) : brands.slice(0, 6);
  }, [qBrand, brandFuse, brands]);

  const productResults: Product[] = useMemo(() => {
    const q = qProduct.trim();
    return q ? productFuse.search(q).map((r) => r.item) : products.slice(0, 6);
  }, [qProduct, productFuse, products]);

  /* ---------- submit handler for brand search ---------- */
  function handleBrandSubmit() {
    const q = qBrand.trim();
    if (!q) return;

    // Track search before navigation
    track('Search', { type: 'brand', q, resultCount: brandFuse.search(q).length });

    const slugified = toSlug(q);
    const exact =
      brands.find((b) => b.slug.toLowerCase() === slugified) ||
      brands.find((b) => b.brand.toLowerCase() === q.toLowerCase());
    if (exact) {
      window.location.href = `/brands/${exact.slug}/`;
    } else {
      window.location.href = `/brands/?q=${encodeURIComponent(q)}`;
    }
  }

  // Debounced tracking effects
  useEffect(() => { 
    const q = qBrand.trim(); 
    if(!q) return; 
    const h = setTimeout(()=>{ 
      const resultCount = brandFuse.search(q).length; 
      track('Search', { type: 'brand', q, resultCount }); 
    }, 400); 
    return ()=>clearTimeout(h); 
  }, [qBrand, brandFuse]);

  useEffect(() => { 
    const q = qProduct.trim(); 
    if(!q) return; 
    const h = setTimeout(()=>{ 
      const resultCount = productFuse.search(q).length; 
      track('Search', { type: 'product', q, resultCount }); 
    }, 400); 
    return ()=>clearTimeout(h); 
  }, [qProduct, productFuse]);

  useEffect(() => { 
    const q = qAttr.trim(); 
    if(!q) return; 
    const h = setTimeout(()=>{ 
      const resultCount = attrBrandMatches.length + attrProductMatches.length; 
      track('Search', { type: 'attribute', q, resultCount }); 
    }, 400); 
    return ()=>clearTimeout(h); 
  }, [qAttr, attrBrandMatches, attrProductMatches]);

  /** Single product to display in Products column */
  const topProduct: Product | undefined = useMemo(() => {
    const q = qProduct.trim();
    if (q) {
      return productResults[0];
    }
    return productResults[0] ?? products[0];
  }, [qProduct, productResults, products]);

  return (
    <section className="container stack-lg" aria-label="Search blocks">
      <div className="grid-3">
        {/* Brands */}
        <div className="stack">
          <SearchBar
            label="Search brands"
            placeholder={brandPlaceholder}
            value={qBrand}
            onChange={(v) => {
              setQBrand(v);
            }}
            onSubmit={handleBrandSubmit}
          />
          <div className="stack">
            {brandResults.slice(0, 6).map((b) => (
              <ResultBlockBrand key={b.slug} b={b} />
            ))}
            <a className="link" href={`/brands/?q=${encodeURIComponent(qBrand)}`}>
              View all results →
            </a>
          </div>
        </div>

        {/* Products */}
        <div className="stack">
          <SearchBar
            label="Search products"
            placeholder="e.g., magnesium glycinate, probiotic…"
            value={qProduct}
            onChange={(v) => {
              setQProduct(v);
            }}
          />
          <div className="stack">
            {topProduct && <ResultBlockProduct key={topProduct.slug} p={topProduct} />}
            <a className="link" href={`/products/?q=${encodeURIComponent(qProduct)}`}>
              View all results →
            </a>
          </div>
        </div>

        {/* Attributes / Keywords */}
        <div className="stack">
          <SearchBar
            label="Search by attribute"
            placeholder='Try "women-owned" or "allergen-free"'
            value={qAttr}
            onChange={(v) => {
              setQAttr(v);
            }}
          />
          <div className="stack">
            {qAttr.trim() ? (
              <>
                <h3>Brands</h3>
                {attrBrandMatches.slice(0, 6).map((b) => (
                  <ResultBlockBrand key={b.slug} b={b} />
                ))}
                <h3>Products</h3>
                {attrProductMatches.slice(0, 6).map((p) => (
                  <ResultBlockProduct key={p.slug} p={p} />
                ))}
              </>
            ) : (
              <p className="lead">Type an attribute above to see matches.</p>
            )}
            <a className="link" href={`/search/attributes?q=${encodeURIComponent(qAttr)}`}>
              View all results →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
