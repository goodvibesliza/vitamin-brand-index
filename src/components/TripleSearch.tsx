import React, { useMemo, useState } from "react";
import Fuse from "fuse.js";
import SearchBar from "./SearchBar";
import ResultBlockBrand from "./ResultBlockBrand";
import ResultBlockProduct from "./ResultBlockProduct";

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
const brandFuseOptions: Fuse.IFuseOptions<Brand> = {
  threshold: 0.33,
  includeScore: false,
  keys: [
    { name: "brand", weight: 0.7 },
    { name: "certification", weight: 0.2 },
    { name: "ingredient_philosophy", weight: 0.1 },
  ],
};

const productFuseOptions: Fuse.IFuseOptions<Product> = {
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

  return (
    <section className="container stack-lg" aria-label="Search blocks">
      <div className="grid-3">
        {/* Brands */}
        <div className="stack">
          <SearchBar
            label="Search brands"
            placeholder="e.g., certified, transparency, recall…"
            value={qBrand}
            onChange={setQBrand}
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
            onChange={setQProduct}
          />
          <div className="stack">
            {productResults.slice(0, 6).map((p) => (
              <ResultBlockProduct key={p.slug} p={p} />
            ))}
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
            onChange={setQAttr}
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
