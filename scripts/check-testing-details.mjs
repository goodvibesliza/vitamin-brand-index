#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate and print a human-readable coverage report for `testing_qa_notes` across brands.
 *
 * Reads ../src/data/brands.json (relative to this script), validates it is an array of brand
 * objects, and categorizes each well-formed brand (has `slug` and `brand`) into those that
 * have non-empty `testing_qa_notes` and those that do not. Prints two lists (showing up to 30
 * items each, with an ellipsis if more exist), a summary with total count and coverage percentage,
 * and a status indicator:
 *   - 🟢 Good coverage for >= 80%
 *   - 🟡 Moderate coverage for 50–79%
 *   - 🔴 Low coverage for < 50%
 *
 * Exits the process with code 1 if the file is missing, cannot be parsed as JSON, or does not
 * contain an array.
 *
 * @returns {void}
 */

function main() {
  console.log('📋 Testing Details Coverage Report\n');
  
  // Load brands.json
  const brandsPath = path.join(__dirname, '..', 'src', 'data', 'brands.json');
  
  if (!fs.existsSync(brandsPath)) {
    console.error(`❌ Error: brands.json not found at ${brandsPath}`);
    process.exit(1);
  }
  
  let brands;
  try {
    const brandsContent = fs.readFileSync(brandsPath, 'utf-8');
    brands = JSON.parse(brandsContent);
  } catch (error) {
    console.error(`❌ Error parsing brands.json: ${error.message}`);
    process.exit(1);
  }
  
  if (!Array.isArray(brands)) {
    console.error('❌ Error: brands.json must contain an array of brands');
    process.exit(1);
  }
  
  // Categorize brands
  const brandsWithTesting = [];
  const brandsMissingTesting = [];
  
  for (const brand of brands) {
    const slug = brand.slug;
    const brandName = brand.brand;
    
    if (!slug || !brandName) {
      continue; // Skip malformed brands
    }
    
    // Check if testing_qa_notes exists and has content
    const hasTestingNotes = Object.prototype.hasOwnProperty.call(brand, 'testing_qa_notes') && 
                           typeof brand.testing_qa_notes === 'string' && 
                           brand.testing_qa_notes.trim() !== '';
    
    if (hasTestingNotes) {
      brandsWithTesting.push({ slug, brand: brandName });
    } else {
      brandsMissingTesting.push({ slug, brand: brandName });
    }
  }
  
  /**
   * Format a list of brands into a human-readable, sorted bullet list with optional truncation.
   *
   * Returns a string containing up to `maxCount` lines of the form "   • slug (brand)", sorted by slug.
   * If the provided list contains more items than `maxCount`, a trailing line ("   … and N more") indicates how many were omitted.
   * This function does not mutate the input array.
   *
   * @param {{slug: string, brand: string}[]} brandList - Array of brand objects; each should include `slug` and `brand`.
   * @param {number} [maxCount=30] - Maximum number of items to include in the returned string.
   * @returns {string} The formatted brand list (possibly truncated) ready for console output.
   */
  function formatBrandList(brandList, maxCount = 30) {
    const displayCount = Math.min(brandList.length, maxCount);
    const items = brandList
      .slice() // don't mutate input
      .sort((a,b) => a.slug.localeCompare(b.slug))
      .slice(0, displayCount)
      .map(b => `   • ${b.slug} (${b.brand})`)
      .join('\n');
    
    const remaining = brandList.length - displayCount;
    const ellipsis = remaining > 0 ? `\n   … and ${remaining} more` : '';
    
    return items + ellipsis;
  }
  
  // Print report
  console.log(`🟢 Brands with testing_qa_notes (${brandsWithTesting.length}):`);
  if (brandsWithTesting.length > 0) {
    console.log(formatBrandList(brandsWithTesting));
  } else {
    console.log('   (none)');
  }
  
  console.log(`\n🟡 Brands missing testing_qa_notes (${brandsMissingTesting.length}):`);
  if (brandsMissingTesting.length > 0) {
    console.log(formatBrandList(brandsMissingTesting));
  } else {
    console.log('   (none)');
  }
  
  // Summary stats
  const totalBrands = brands.length;
  const coveragePercent = totalBrands > 0 ? Math.round((brandsWithTesting.length / totalBrands) * 100) : 0;
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total brands: ${totalBrands}`);
  console.log(`   Coverage: ${brandsWithTesting.length}/${totalBrands} (${coveragePercent}%)`);
  
  // Status indicator
  if (coveragePercent >= 80) {
    console.log(`   Status: 🟢 Good coverage`);
  } else if (coveragePercent >= 50) {
    console.log(`   Status: 🟡 Moderate coverage`);
  } else {
    console.log(`   Status: 🔴 Low coverage`);
  }
  
  console.log('\n✅ Report complete');
}

// Run the report
main();