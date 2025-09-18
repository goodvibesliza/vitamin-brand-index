// Documentation-only mapping so devs know what we cover today.
// This file has no runtime cost (tree-shaken if unused).
export const NOTION_TO_JSON_MAPPING = [
  // Covered today (rendered on brand page)
  { notion: "Name", json: "brand" },
  { notion: "Slug (formula)", json: "slug" },
  { notion: "Parent company", json: "parent_company" },
  { notion: "Year founded", json: "year_founded" },
  { notion: "HQ", json: "hq" },
  { notion: "Manufacturing Locations", json: "manufacturing_locations[]" },
  { notion: "Certifications", json: "certifications[]" },
  { notion: "Ingredient Philosophy", json: "ingredient_philosophy" },
  { notion: "Proprietary Blends (Yes/Limited/None)", json: "proprietary_blends" },
  { notion: "Top Products", json: "top_products[]" },
  { notion: "Ownership Transparency (Low/Medium/High)", json: "ownership_transparency" },
  { notion: "Recalls/Notices", json: "recalls_notices" },
  { notion: "Verification Status", json: "verification_status" },
  { notion: "Verification Date", json: "last_verified" },
  { notion: "Latest Update", json: "last_updated" },
  // Sources can be stored either as plain URL strings or objects:
  //   { url: "https://brand.com", title: "Official site" }
  { notion: "Sources", json: "sources[]" },

  // Not in JSON yet — we show non-blocking placeholders on the page
  { notion: "Allergen-free", json: "(planned)" },
  { notion: "Assembled in", json: "(planned)" },
  { notion: "Ingredient Sourcing", json: "(planned)" },
  { notion: "Glass or Plastic?", json: "(planned)" },
  { notion: "In-house testing lab", json: "(planned)" },
  { notion: "Made in USA?", json: "(planned)" },
  { notion: "Product Categories", json: "(planned)" },
  { notion: "Products (format types)", json: "(planned)" },
  { notion: "Non-Profit Partners", json: "(planned)" },
  { notion: "Sustainability", json: "(planned)" },
  { notion: "Unique Offering", json: "(planned)" },
  { notion: "Verified By", json: "(planned)" },
  { notion: "Status of Entry", json: "(planned)" },
  { notion: "Freshness / Verified Badge / Rollups", json: "(planned)" },
  { notion: "Woman Owned?", json: "(planned)" },
];
