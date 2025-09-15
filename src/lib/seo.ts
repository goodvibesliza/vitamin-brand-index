export function seoTags({
  title,
  description,
  canonical,
  ogImage = "/og.jpg",
}: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}) {
  return /* html */ `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
  `;
}
