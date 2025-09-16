import React from "react";

type Product = { name: string; slug: string; aliases?: string[]; top_brands?: string[]; };
export default function ResultBlockProduct({ p }: { p: Product }) {
  return (
    <article className="block">
      <h3>
        <a
          className="link"
          href={`/products/${p.slug}/`}
          onClick={() => {
            try {
              (window as any).plausible?.("Result Click", {
                props: { type: "product", id: p.slug },
              });
            } catch {}
          }}
        >
          {p.name}
        </a>
      </h3>
      {/* summary chips */}
      <div style={{display:"flex",flexWrap:"wrap",gap:".3rem",marginBottom:".5rem"}}>
        {p.aliases?.length ? (
          <span className="badge">{p.aliases.length} alias{p.aliases.length>1?"es":""}</span>
        ) : null}
        {p.top_brands?.length ? (
          <span className="badge">{p.top_brands.length} top brand{p.top_brands.length>1?"s":""}</span>
        ) : null}
      </div>

      {/* collapsible details */}
      {(p.aliases?.length || p.top_brands?.length) && (
        <details>
          <summary style={{cursor:"pointer",fontWeight:600}}>More</summary>
          {p.aliases?.length ? (
            <p style={{margin:".5rem 0 0"}}>Also known as: {p.aliases.slice(0,4).join(", ")}{p.aliases!.length>4?"…":""}</p>
          ) : null}
          {p.top_brands?.length ? (
            <p style={{margin:".25rem 0 0"}}>Top brands: {p.top_brands.slice(0,5).join(", ")}{p.top_brands!.length>5?"…":""}</p>
          ) : null}
        </details>
      )}
    </article>
  );
}
