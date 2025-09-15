export type Brand = {
  brand: string;
  slug: string;
  parent_company?: string | null;
  year_founded?: number | null;
  hq?: string | null;
  manufacturing_locations?: string[]; // Notion: "Manufacturing Locations"
  certifications?: string[];          // Notion: "Certifications"
  ingredient_philosophy?: string | null; // Notion: "Ingredient Philosophy"
  proprietary_blends?: string | null; // Notion: "Proprietary Blends" (Yes/Limited/None)
  top_products?: string[];            // Notion: "Top Products"
  ownership_transparency?: string | null; // Notion: "Ownership Transparency" (Low/Medium/High)
  testing_qa_notes?: string | null;   // (maps to Notion’s testing concepts; free text)
  recalls_notices?: string | null;    // Notion: "Recalls/Notices"
  verification_status?: string | null; // Notion: "Verification Status"
  last_verified?: string | null;      // Notion: "Verification Date"
  sources?: string[];                 // Notion: "Sources" (relation → URLs we store as strings)
};
