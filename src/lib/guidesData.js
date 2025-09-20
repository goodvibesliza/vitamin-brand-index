/**
 * Simple hardcoded guides data to bypass content collection parsing issues
 * Plain JavaScript version for maximum compatibility
 */

// Array of guide objects
const guides = [
  {
    id: "certifications.mdx",
    slug: "certifications",
    data: {
      title: "Vitamin and Supplement Certifications Explained",
      slug: "certifications",
      headingKey: "certifications",
      summary: "Decipher the alphabet soup of seals on supplement labels - NSF, USP, GMP, organic, and more - so you can separate rigorous quality marks from marketing fluff."
    },
    // Simple render function that returns an empty component
    render: async () => ({ Content: () => null })
  },
  {
    id: "clinical-evidence.mdx",
    slug: "clinical-evidence",
    data: {
      title: "Clinical Evidence & Testing: What Really Proves a Supplement Works?",
      slug: "clinical-evidence",
      headingKey: "clinical_evidence",
      summary: "Understand the difference between ingredient research and finished-product trials, which study designs carry the most weight, and how to vet clinical claims on supplement labels."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "in-house-testing.mdx",
    slug: "in-house-testing",
    data: {
      title: "In-House Testing Benefits",
      slug: "in-house-testing",
      headingKey: "in_house_testing",
      summary: "Why running quality tests inside your own facility can raise standards and boost consumer trust."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "manufacturing-location.mdx",
    slug: "manufacturing-location",
    data: {
      title: "Choosing a Vitamin Manufacturing Location",
      slug: "manufacturing-location",
      headingKey: "manufacturing_locations",
      summary: "Key factors to consider when selecting where your vitamins are produced, from regulatory oversight to supply-chain transparency."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "made-in-usa.mdx",
    slug: "made-in-usa",
    data: {
      title: 'Decoding "Made in USA" Claims on Supplements',
      slug: "made-in-usa",
      headingKey: "made_in_usa",
      summary: 'Learn the legal definition of a "Made in USA" label, how it applies to dietary supplements, and the clues that reveal a product\'s true manufacturing origin.'
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "ownership.mdx",
    slug: "ownership",
    data: {
      title: "Brand Ownership & Transparency",
      slug: "ownership",
      headingKey: "ownership",
      summary: "Learn why knowing who truly owns a supplement brand can reveal a lot about ingredient quality, manufacturing standards, and the values guiding every bottle."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "proprietary-blends.mdx",
    slug: "proprietary-blends",
    data: {
      title: "Demystifying Proprietary Blends",
      slug: "proprietary-blends",
      headingKey: "proprietary_blends",
      summary: "Proprietary blends let supplement companies hide exact ingredient doses—here's why that matters for efficacy, transparency, and safety."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "sustainability.mdx",
    slug: "sustainability",
    data: {
      title: "Sustainability Practices in the Supplement Industry",
      slug: "sustainability",
      headingKey: "sustainability",
      summary: "From carbon-neutral factories to zero-waste packaging, learn how to tell if a supplement brand's eco claims are real or just recycled marketing."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "sourcing.mdx",
    slug: "sourcing",
    data: {
      title: "Ingredient Sourcing & Quality",
      slug: "sourcing",
      headingKey: "sourcing",
      summary: "How raw-material origins, supply-chain transparency, and ethical practices determine the potency and safety of your supplements."
    },
    render: async () => ({ Content: () => null })
  },
  {
    id: "recalls-notices.mdx",
    slug: "recalls-notices",
    data: {
      title: "Product Recalls & Safety Notices",
      slug: "recalls-notices",
      headingKey: "recalls_notices",
      summary: "Understand how supplement recalls work, what the different recall classes mean, and how a brand's recall history can guide smarter purchasing decisions."
    },
    render: async () => ({ Content: () => null })
  },
  /* ------------------------------------------------------------------
   * NEW GUIDE • Self-Manufactured
   * ------------------------------------------------------------------
   * Full MDX copy supplied by user. For now we only need the metadata
   * so the links render correctly; content rendering can be wired up
   * later once MDX parsing is restored.
   * ------------------------------------------------------------------ */
  {
    id: "self-manufactured.mdx",
    slug: "self-manufactured",
    data: {
      title: "Self-Manufactured",
      slug: "self-manufactured",
      headingKey: "self_manufactured",
      summary:
        "Most supplement brands outsource production. Discover why brands that own their own manufacturing—'self-manufactured'—offer stronger quality control, accountability, and consistency."
    },
    render: async () => ({ Content: () => null })
  }
];

// Function to get all guides (mimics getCollection)
export function getAllGuides() {
  return guides;
}

// Function to get a single guide by slug (mimics getEntry)
export function getGuideBySlug(slug) {
  return guides.find(guide => guide.data.slug === slug);
}
