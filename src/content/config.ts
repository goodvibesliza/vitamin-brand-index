import { defineCollection, z } from 'astro:content';

/**
 * We must explicitly register an (empty) `guides` collection so Astro does
 * NOT attempt to auto-generate one by scanning `src/content/guides/`.
 * Auto-generated collections re-enable front-matter parsing and surface the
 * YAML errors that we deliberately want to avoid while MDX parsing is
 * disabled.  Defining an empty, “no-validation” schema stops the auto-gen
 * and silences the warnings/errors.
 *
 * NOTE: Once MDX/front-matter parsing issues are fully resolved we can swap
 * this minimal schema for the strict one (title/slug/headingKey/summary).
 */
const guidesCollection = defineCollection({
  type: 'content',
  // Accept any front-matter fields without validation.
  // z.record(z.any()) == “object with arbitrary keys & values”
  schema: z.record(z.any()),
});

// Debug log to help trace collection registration during dev / build
if (import.meta.env?.DEV) {
  // eslint-disable-next-line no-console
  console.debug('[content] Guides collection stubbed to prevent auto-generation');
}

// Export the *stub* guides collection so Astro no longer auto-generates it
export const collections = { guides: guidesCollection };
