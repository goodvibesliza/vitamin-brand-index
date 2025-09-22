#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validation script for brand data quality
 * Fails CI if testing_qa_notes has invalid data types or empty content
 */

function main() {
  console.log('🔍 Validating brand data...');
  
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
  
  // Validation stats
  const totalBrands = brands.length;
  let brandsWithTestingNotes = 0;
  const validationErrors = [];
  
  // Validate each brand
  for (const brand of brands) {
    const slug = brand.slug;
    
    if (!slug) {
      validationErrors.push('Brand missing required "slug" field');
      continue;
    }
    
    // Check if testing_qa_notes exists
    if (brand.hasOwnProperty('testing_qa_notes')) {
      brandsWithTestingNotes++;
      
      const testingNotes = brand.testing_qa_notes;
      
      // Validation 1: Must be a string
      if (typeof testingNotes !== 'string') {
        validationErrors.push(`${slug}: testing_qa_notes must be a string, got ${typeof testingNotes}`);
        continue;
      }
      
      // Validation 2: Must not be empty or whitespace-only
      if (testingNotes.trim() === '') {
        validationErrors.push(`${slug}: testing_qa_notes cannot be empty or whitespace-only`);
        continue;
      }
    }
  }
  
  // Report results
  console.log(`📊 Validation Summary:`);
  console.log(`   Total brands: ${totalBrands}`);
  console.log(`   Brands with testing_qa_notes: ${brandsWithTestingNotes}`);
  
  if (validationErrors.length > 0) {
    console.error(`\\n❌ Validation failed with ${validationErrors.length} error(s):`);
    validationErrors.forEach(error => {
      console.error(`   • ${error}`);
    });
    process.exit(1);
  }
  
  console.log('\\n✅ All brand data validation passed!');
  process.exit(0);
}

// Run the validation
main();