import { getAllBrands } from '../lib/data.js';

export async function GET() {
  const baseUrl = 'https://vitaminbrandindex.com';
  const currentDate = new Date().toISOString();
  
  // Get all brands for individual brand pages
  const brands = getAllBrands();
  
  // Define static routes to include
  const staticRoutes = [
    '/',
    '/brands/',
    '/attributes',
    '/privacy',
    '/for-brands',
    '/for-brands/request-edit',
    '/for-brands/submit-brand',
    '/for-brands/thanks'
  ];
  
  // Start XML content
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  // Add static routes
  for (const route of staticRoutes) {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
  </url>`;
  }
  
  // Add brand detail pages
  for (const brand of brands) {
    xml += `
  <url>
    <loc>${baseUrl}/brands/${brand.slug}/</loc>
    <lastmod>${currentDate}</lastmod>
  </url>`;
  }
  
  // Close XML
  xml += `
</urlset>`;
  
  // Return XML with proper content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
