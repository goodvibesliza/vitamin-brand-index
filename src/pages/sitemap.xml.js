import brands from "../data/brands.json";
import products from "../data/products.json";

export async function GET() {
  const base = "https://vitaminbrandindex.com";
  const urls = [
    `${base}/`,
    `${base}/brands/`,
    `${base}/products/`,
    `${base}/blog/`,
    `${base}/for-brands/`,
    `${base}/submit/`,
    ...brands.map((b) => `${base}/brands/${b.slug}/`),
    ...products.map((p) => `${base}/products/${p.slug}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((u) => `<url><loc>${u}</loc></url>`).join("")}
  </urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
