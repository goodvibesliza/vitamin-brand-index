import React, { useMemo, useState } from "react";

type Brand = {
  brand: string; slug: string; certifications?: string[]; ingredient_philosophy?: string|null;
  ownership_transparency?: string|null; testing_qa_notes?: string|null; recalls_notices?: string|null; sources?: string[];
};
type Product = { name: string; slug: string; aliases?: string[]; top_brands?: string[]; };

import ResultBlockBrand from "./ResultBlockBrand";
import ResultBlockProduct from "./ResultBlockProduct";

function rxFrom(q:string){ try{ return new RegExp(q.trim().replace(/[-\s]+/g,"[-\\s]?"),"i"); }catch{ return null; } }

export default function AttributeResults({ query, brands, products }:{
  query: string; brands: Brand[]; products: Product[];
}) {
  /* --------------- state for client-side refine & show-more --------------- */
  const [refine, setRefine] = useState<string>("");
  const [showMoreBrands, setShowMoreBrands] = useState<boolean>(false);
  const [showMoreProducts, setShowMoreProducts] = useState<boolean>(false);

  const rx = rxFrom(query);
  const isWO = /women[-\s]?owned/i.test(query);
  const isAF = /allergen[-\s]?free/i.test(query);

  const brandMatches = useMemo(()=> {
    if(!rx && !isWO && !isAF) return [];
    return brands.filter(b=>{
      const hay=[b.brand,...(b.certifications??[]),b.ingredient_philosophy??"",b.ownership_transparency??"",b.testing_qa_notes??"",b.recalls_notices??"",...(b.sources??[])].join(" ");
      return (rx?.test(hay)) || (isWO && /women[-\s]?owned/i.test(hay)) || (isAF && /allergen[-\s]?free/i.test(hay));
    });
  },[rx,isWO,isAF,brands]);

  const productMatches = useMemo(()=> {
    if(!rx && !isWO && !isAF) return [];
    return products.filter(p=>{
      const hay=[p.name,...(p.aliases??[])].join(" ");
      return (rx?.test(hay)) || (isWO && /women[-\s]?owned/i.test(hay)) || (isAF && /allergen[-\s]?free/i.test(hay));
    });
  },[rx,isWO,isAF,products]);

  if(!query.trim()){
    return <p className="lead">Enter an attribute like <strong>women-owned</strong> or <strong>allergen-free</strong>.</p>;
  }

  /* ---------- apply refine filter ---------- */
  const refineRx = refine.trim() ? rxFrom(refine) : null;
  const filteredBrandMatches = useMemo(()=>(
    refineRx ? brandMatches.filter(b=>refineRx!.test(b.brand)) : brandMatches
  ),[refineRx, brandMatches]);
  const filteredProductMatches = useMemo(()=>(
    refineRx ? productMatches.filter(p=>refineRx!.test(p.name)) : productMatches
  ),[refineRx, productMatches]);

  /* limit to 50 unless showMore is true */
  const MAX = 50;
  const brandsToShow = showMoreBrands ? filteredBrandMatches : filteredBrandMatches.slice(0, MAX);
  const productsToShow = showMoreProducts ? filteredProductMatches : filteredProductMatches.slice(0, MAX);

  return (
    <div className="stack-lg">
      {/* refine input */}
      <input
        className="input"
        type="search"
        placeholder="Refine these results..."
        value={refine}
        onChange={(e)=>{ setRefine(e.target.value); }}
      />

      <h2>
        Brands <span className="badge">{filteredBrandMatches.length}</span>
      </h2>
      <div className="stack">
        {brandsToShow.map((b)=> <ResultBlockBrand key={b.slug} b={b} />)}
        {filteredBrandMatches.length>MAX && !showMoreBrands && (
          <button className="button button-secondary" onClick={()=>setShowMoreBrands(true)}>
            Show more
          </button>
        )}
      </div>

      <h2>
        Products <span className="badge">{filteredProductMatches.length}</span>
      </h2>
      <div className="stack">
        {productsToShow.map((p)=> <ResultBlockProduct key={p.slug} p={p} />)}
        {filteredProductMatches.length>MAX && !showMoreProducts && (
          <button className="button button-secondary" onClick={()=>setShowMoreProducts(true)}>
            Show more
          </button>
        )}
      </div>
    </div>
  );
}