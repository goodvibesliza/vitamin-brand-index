export async function GET() {
  const txt = `User-agent: *
Allow: /

Sitemap: https://vitaminbrandindex.com/sitemap.xml
`;
  return new Response(txt, { headers: { "Content-Type": "text/plain" } });
}
