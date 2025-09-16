import React, { useMemo } from "react";

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

  return (
    <div className="stack-lg">
      <h2>Brands ({brandMatches.length})</h2>
      <div className="stack">{brandMatches.map((b)=> <ResultBlockBrand key={b.slug} b={b} />)}</div>
      <h2>Products ({productMatches.length})</h2>
      <div className="stack">{productMatches.map((p)=> <ResultBlockProduct key={p.slug} p={p} />)}</div>
    </div>
  );
}