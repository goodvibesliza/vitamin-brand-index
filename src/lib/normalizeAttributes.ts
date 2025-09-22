/**
 * Normalizes and extracts attribute keywords from brand data
 */

type Brand = {
  brand: string;
  certifications?: string[];
  ingredient_philosophy?: string | null;
  ownership_transparency?: string | null;
  /** Free-text QA/testing notes pulled from Notion CSV column testing_qa_notes. */
  testing_qa_notes?: string | null;
  proprietary_blends?: string | null;
  recalls_notices?: string | null;
  sources?: string[];
  [key: string]: any; // Allow other properties
};

// Curated list of keywords with their detection patterns
const KEYWORDS = [
  { label: 'GMP', patterns: [/\bGMP\b/i, /good\s+manufacturing\s+practice/i] },
  { label: 'Allergen-free', patterns: [/allergen[-\s]?free/i] },
  { label: 'Third-party tested', patterns: [/third[-\s]?party\s*(tested|testing)/i] },
  { label: 'Self-manufactured', patterns: [/self[-\s]?manufactur\w*/i, /in[-\s]?house\s+manufactur\w*/i] },
  { label: 'Women-owned', patterns: [/women[-\s]?owned/i] },
  { label: 'Non-GMO', patterns: [/\bnon[-\s]?gmo\b/i] },
  { label: 'Vegan', patterns: [/\bvegan\b/i] },
] as const;

/**
 * Extracts normalized attribute keywords from brand text fields
 * @param brand Brand object with text fields to scan
 * @returns Array of normalized attribute keywords
 */
export function extractKeywordsFromBrand(brand: Brand): string[] {
  // Create a Set for unique keywords
  const keywords = new Set<string>();
  
  // Build haystack from all relevant text fields
  const haystack = [
    brand.brand,
    ...(brand.certifications || []),
    brand.ingredient_philosophy || '',
    brand.ownership_transparency || '',
    brand.testing_qa_notes || '',
    brand.proprietary_blends || '',
    brand.recalls_notices || '',
    ...(brand.sources || []),
  ].join(' ');
  
  // Check each keyword pattern against the haystack
  KEYWORDS.forEach(({ label, patterns }) => {
    for (const pattern of patterns) {
      if (pattern.test(haystack)) {
        keywords.add(label);
        break; // Found a match for this keyword, move to next
      }
    }
  });
  
  return Array.from(keywords);
}
