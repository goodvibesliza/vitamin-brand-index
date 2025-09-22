#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Human-readable report for testing_qa_notes coverage
 * Helps Liza spot check data after each merge
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
    const hasTestingNotes = brand.hasOwnProperty('testing_qa_notes') && 
                           typeof brand.testing_qa_notes === 'string' && 
                           brand.testing_qa_notes.trim() !== '';
    
    if (hasTestingNotes) {
      brandsWithTesting.push({ slug, brand: brandName });
    } else {
      brandsMissingTesting.push({ slug, brand: brandName });
    }
  }
  
  // Helper function to format brand list
  function formatBrandList(brandList, maxCount = 30) {
    const displayCount = Math.min(brandList.length, maxCount);
    const items = brandList
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