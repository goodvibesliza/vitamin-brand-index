export function ldWebsite({ base }: { base: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": base,
    "name": "Vitamin Brand Checklist",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": `${base}brands/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "SearchAction",
        "target": `${base}products/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "SearchAction",
        "target": `${base}search/attributes?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    ]
  };
}
