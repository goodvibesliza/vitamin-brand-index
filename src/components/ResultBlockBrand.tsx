import React from "react";

type Brand = {
  brand: string; slug: string;
  parent_company?: string | null;
  year_founded?: number | null;
  hq?: string | null;
  manufacturing_locations?: string[];
  certifications?: string[];
  ingredient_philosophy?: string | null;
  proprietary_blends?: string | null;
  top_products?: string[];
  ownership_transparency?: string | null;
  testing_qa_notes?: string | null;
  recalls_notices?: string | null;
  verification_status?: string | null;
  last_verified?: string | null;
  sources?: string[];
};

export default function ResultBlockBrand({ b }: { b: Brand }) {
  const fmt = (v: any) => Array.isArray(v) ? v.join(", ") : (v ?? "—");
  return (
    <article className="block">
      <h3>
        <a
          className="link"
          href={`/brands/${b.slug}/`}
          onClick={() => {
            try {
              (window as any).plausible?.("Result Click", {
                props: { type: "brand", id: b.slug },
              });
            } catch {}
          }}
        >
          {b.brand}
        </a>
      </h3>
      {/* summary chips */}
      <div style={{display:"flex",flexWrap:"wrap",gap:".3rem",marginBottom:".5rem"}}>
        {b.hq && <span className="badge">{b.hq}</span>}
        {Array.isArray(b.manufacturing_locations) && b.manufacturing_locations.length > 0 && (
          <span className="badge">
            {b.manufacturing_locations.length === 1
              ? b.manufacturing_locations[0]
              : `${b.manufacturing_locations.length} locations`}
          </span>
        )}
        {Array.isArray(b.certifications) && b.certifications.length > 0 && (
          <span className="badge">
            {b.certifications.slice(0,2).join(", ")}
            {b.certifications.length > 2 ? "…" : ""}
          </span>
        )}
        {b.verification_status && <span className="badge">{b.verification_status}</span>}
        {Array.isArray(b.top_products) && b.top_products.length > 0 && (
          <span className="badge">{b.top_products.length} products</span>
        )}
      </div>

      {/* collapsible details */}
      <details>
        <summary style={{cursor:"pointer",fontWeight:600}}>More</summary>
        <dl className="kv" style={{marginTop:".5rem"}}>
          <dt>Parent company</dt><dd>{fmt(b.parent_company)}</dd>
          <dt>Founded</dt><dd>{fmt(b.year_founded)}</dd>
          <dt>HQ</dt><dd>{fmt(b.hq)}</dd>
          <dt>Manufacturing</dt><dd>{fmt(b.manufacturing_locations)}</dd>
          <dt>Certifications</dt><dd>{fmt(b.certifications)}</dd>
          <dt>Ingredients</dt><dd>{fmt(b.ingredient_philosophy)}</dd>
          <dt>Proprietary blends</dt><dd>{fmt(b.proprietary_blends)}</dd>
          <dt>Ownership transparency</dt><dd>{fmt(b.ownership_transparency)}</dd>
          <dt>Testing / QA</dt><dd>{fmt(b.testing_qa_notes)}</dd>
          <dt>Recalls</dt><dd>{fmt(b.recalls_notices)}</dd>
          <dt>Verification</dt><dd>{fmt(b.verification_status)} (as of {fmt(b.last_verified)})</dd>
        </dl>
        {Array.isArray(b.sources) && b.sources.length > 0 && (
          <div style={{marginTop:".5rem"}}>
            {b.sources.slice(0,6).map((s,i)=>(<span className="badge" key={i}>Source {i+1}</span>))}
          </div>
        )}
      </details>
    </article>
  );
}
