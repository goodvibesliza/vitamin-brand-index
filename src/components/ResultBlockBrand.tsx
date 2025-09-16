import React from "react";

type Brand = {
  brand: string; slug: string;
  parent_company?: string | null;
  year_founded?: number | null;
  hq?: string | null;
  manufacturing_locations?: string[];
  certification?: string[];
  ingredient_philosophy?: string | null;
  proprietary_blends?: string | null;
  top_products?: string[];
  ownership_transparency?: string | null;
  recalls_notices?: string | null;
  verification_status?: string | null;
  last_verified?: string | null;
  sources?: string[];
};

export default function ResultBlockBrand({ b }: { b: Brand }) {
  const fmt = (v: any) => Array.isArray(v) ? v.join(", ") : (v ?? "—");
  return (
    <article className="block">
      <h3><a className="link" href={`/brands/${b.slug}/`}>{b.brand}</a></h3>
      <dl className="kv">
        <dt>Parent company</dt><dd>{fmt(b.parent_company)}</dd>
        <dt>Founded</dt><dd>{fmt(b.year_founded)}</dd>
        <dt>HQ</dt><dd>{fmt(b.hq)}</dd>
        <dt>Manufacturing</dt><dd>{fmt(b.manufacturing_locations)}</dd>
        <dt>Certifications</dt><dd>{fmt(b.certification)}</dd>
        <dt>Ingredients</dt><dd>{fmt(b.ingredient_philosophy)}</dd>
        <dt>Proprietary blends</dt><dd>{fmt(b.proprietary_blends)}</dd>
        <dt>Ownership transparency</dt><dd>{fmt(b.ownership_transparency)}</dd>
        <dt>Recalls</dt><dd>{fmt(b.recalls_notices)}</dd>
        <dt>Verification</dt><dd>{fmt(b.verification_status)} (as of {fmt(b.last_verified)})</dd>
      </dl>
      {Array.isArray(b.sources) && b.sources.length > 0 && (
        <div style={{marginTop:".5rem"}}>
          {b.sources.slice(0,6).map((s,i)=>(<span className="badge" key={i}>Source {i+1}</span>))}
        </div>
      )}
    </article>
  );
}
