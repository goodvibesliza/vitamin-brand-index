/**
 * Maps brand data fields to their corresponding guides.
 * Used to link from brand detail pages to relevant educational content.
 */

/**
 * Type definition for a guide entry in the map
 */
export type GuideEntry = {
  /** Human-readable label for the guide */
  label: string;
  /** URL slug for the guide */
  slug: string;
};

/**
 * Type definition for the entire guides map
 */
export type GuidesMap = {
  [key: string]: GuideEntry;
};

/**
 * Lookup object mapping brand data fields to their corresponding guides
 */
export const guidesMap: GuidesMap = {
  ownership: {
    label: "Brand Ownership & Transparency",
    slug: "ownership"

  },
  manufacturing_locations: {
    label: "Manufacturing Location",
    slug: "manufacturing-location"
  },
  in_house_testing: {
    label: "In-House Testing Benefits",
    slug: "in-house-testing"
  },
  made_in_usa: {
    label: "Made in USA Claims",
    slug: "made-in-usa"
  },
  certifications: {
    label: "Certifications Explained",
    slug: "certifications"
  },
  sourcing: {
    label: "Ingredient Sourcing",
    slug: "sourcing"
  },
  proprietary_blends: {
    label: "Understanding Proprietary Blends",
    slug: "proprietary-blends"
  },
  /**
   * No dedicated guide yet; point to the manufacturing-location guide
   * because self-manufacturing relates closely to where products are made.
   */
  self_manufactured: {
    label: "Self-Manufactured",
    slug: "self-manufactured"
  },
  clinical_evidence: {
    label: "Clinical Evidence",
    slug: "clinical-evidence"
  },
  sustainability: {
    label: "Sustainability",
    slug: "sustainability"
  },
  recalls_notices: {
    label: "Product Recalls & Safety Notices",
    slug: "recalls-notices"
  }
};

export default guidesMap;
