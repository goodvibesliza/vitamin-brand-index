import React from "react";

type Product = { name: string; slug: string; aliases?: string[]; top_brands?: string[]; };
export default function ResultBlockProduct({ p }: { p: Product }) {
  return (
    <article className="block">
      <h3><a className="link" href={`/products/${p.slug}/`}>{p.name}</a></h3>
      {p.aliases?.length ? <p style={{margin:0}}>Also known as: {p.aliases.slice(0,4).join(", ")}{p.aliases!.length>4?"…":""}</p> : null}
      {p.top_brands?.length ? (
        <p style={{margin:".25rem 0 0"}}>Top brands: {p.top_brands.slice(0,5).join(", ")}{p.top_brands!.length>5?"…":""}</p>
      ) : null}
    </article>
  );
}
