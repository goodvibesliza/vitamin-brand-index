#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as csvParse } from 'csv-parse/sync';

// Constants
const SCHEMA_FIELDS = [
  'brand', 'slug', 'parent_company', 'ownership_transparency', 'hq', 'year_founded',
  'self_manufactured', 'in_house_testing', 'made_in_usa', 'manufacturing_locations',
  'certification', 'assembled_in', 'ingredient_sourcing', 'ingredient_philosophy',
  'proprietary_blends', 'product_categories', 'product_types', 'top_products',
  'unique_offering', 'glass_or_plastic', 'woman_owned', 'vegan', 'allergen_free',
  'clinically_tested', 'sustainablity', 'non_profit_partner', 'recalls_notices',
  'sources', 'verification_status', 'last_verified'
];

const BOOLEAN_FIELDS = [
  'self_manufactured', 'in_house_testing', 'made_in_usa', 'proprietary_blends',
  'woman_owned', 'vegan', 'allergen_free', 'clinically_tested'
];

const NUMBER_FIELDS = ['year_founded'];
const ARRAY_FIELDS = [
  'manufacturing_locations', 'certification', 'product_categories',
  'product_types', 'top_products', 'sources'
];

// Helper functions for data normalization and validation
function normalizeWhitespace(str) {
  if (str === undefined || str === null) return '';
  return str.toString().trim().replace(/\s+/g, ' ');
}

function harmonizePunctuation(str) {
  if (str === undefined || str === null) return '';
  return str
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, "-");
}

function parseBoolean(value) {
  if (value === undefined || value === null || value === '') return null;
  
  const normalized = normalizeWhitespace(value).toLowerCase();
  
  if (['true', 'yes', 'y', '1'].includes(normalized)) return true;
  if (['false', 'no', 'n', '0'].includes(normalized)) return false;
  
  return null;
}

function parseArray(value) {
  if (value === undefined || value === null || value === '') return [];
  
  const normalized = harmonizePunctuation(normalizeWhitespace(value));
  const items = normalized.split(/[,;]+/).map(item => normalizeWhitespace(item)).filter(Boolean);
  
  // Deduplicate while preserving order
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.toLowerCase())) return false;
    seen.add(item.toLowerCase());
    return true;
  });
}

function parseInteger(value) {
  if (value === undefined || value === null || value === '') return null;
  
  const normalized = normalizeWhitespace(value);
  const parsed = parseInt(normalized, 10);
  
  return isNaN(parsed) ? null : parsed;
}

function validateUrl(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch (e) {
    return false;
  }
}

function normalizeUrl(url) {
  if (!validateUrl(url)) return null;
  
  try {
    const urlObj = new URL(url);
    
    // Lowercase hostname, preserve path case
    urlObj.hostname = urlObj.hostname.toLowerCase();
    
    // Remove trailing slash from any URL path
    let normalized = urlObj.toString();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    
    return normalized;
  } catch (e) {
    return null;
  }
}

function getCanonicalUrlKey(url) {
  if (!url) return '';
  return url.toLowerCase();
}

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  
  const normalized = normalizeWhitespace(dateStr);
  
  // Try different date formats
  const formats = [
    // MM/DD/YYYY
    str => {
      const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const [_, month, day, year] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return null;
    },
    // DD/MM/YYYY
    str => {
      const match = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (match) {
        const [_, day, month, year] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return null;
    },
    // YYYY-MM-DD or YYYY-MM-DDThh:mm:ssZ
    str => {
      const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(T.*)?$/);
      if (match) {
        const [_, year, month, day] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return null;
    },
    // MM-DD-YYYY
    str => {
      const match = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (match) {
        const [_, month, day, year] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return null;
    }
  ];
  
  for (const format of formats) {
    const result = format(normalized);
    if (result) return result;
  }
  
  // Try parsing with Date
  try {
    const date = new Date(normalized);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return null;
}

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    brands: null,
    sources: null,
    verifications: null,
    out: null,
    dryRun: false,
    strict: false,
    brandKey: null,
    selfTest: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--strict') {
      options.strict = true;
    } else if (arg === '--self-test') {
      options.selfTest = true;
    } else if (arg === '--brand-key' && i + 1 < args.length) {
      options.brandKey = args[++i];
    } else if (arg === '--brands' && i + 1 < args.length) {
      options.brands = args[++i];
    } else if (arg === '--sources' && i + 1 < args.length) {
      options.sources = args[++i];
    } else if (arg === '--verifications' && i + 1 < args.length) {
      options.verifications = args[++i];
    } else if (arg === '--out' && i + 1 < args.length) {
      options.out = args[++i];
    }
  }
  
  return options;
}

// Run acceptance tests
function runTests() {
  console.log('Running self-tests...');
  let passed = true;
  
  // Test boolean parsing
  const booleanTests = [
    { input: 'Yes', expected: true },
    { input: 'no', expected: false },
    { input: 'TRUE', expected: true },
    { input: '0', expected: false },
    { input: '1', expected: true },
    { input: '', expected: null },
    { input: 'maybe', expected: null }
  ];
  
  booleanTests.forEach(test => {
    const result = parseBoolean(test.input);
    if (result !== test.expected) {
      console.error(`❌ Boolean parsing failed for "${test.input}": got ${result}, expected ${test.expected}`);
      passed = false;
    }
  });
  
  // Test array splitting + dedupe
  const arrayTests = [
    { 
      input: 'Organic, Vegan ; USP Verified, Vegan', 
      expected: ['Organic', 'Vegan', 'USP Verified'] 
    },
    {
      input: 'Item1,,Item2, item1 ,Item3',
      expected: ['Item1', 'Item2', 'item1', 'Item3']
    }
  ];
  
  arrayTests.forEach(test => {
    const result = parseArray(test.input);
    const success = result.length === test.expected.length && 
      result.every((item, i) => item === test.expected[i]);
    
    if (!success) {
      console.error(`❌ Array parsing failed for "${test.input}": got ${JSON.stringify(result)}, expected ${JSON.stringify(test.expected)}`);
      passed = false;
    }
  });
  
  // Test date normalization
  const dateTests = [
    { input: '9/3/2025', expected: '2025-09-03' },
    { input: '2025-09-03T12:00:00Z', expected: '2025-09-03' },
    { input: '03-09-2025', expected: '2025-09-03' },
    { input: 'invalid date', expected: null }
  ];
  
  dateTests.forEach(test => {
    const result = parseDate(test.input);
    if (result !== test.expected) {
      console.error(`❌ Date parsing failed for "${test.input}": got ${result}, expected ${test.expected}`);
      passed = false;
    }
  });
  
  // Test URL normalization
  const urlTests = [
    { input: 'https://Example.com/', expected: 'https://example.com' },
    { input: 'http://test.org/Path/To/Resource/', expected: 'http://test.org/Path/To/Resource' },
    { input: 'not a url', expected: null }
  ];
  
  urlTests.forEach(test => {
    const result = normalizeUrl(test.input);
    if (result !== test.expected) {
      console.error(`❌ URL normalization failed for "${test.input}": got ${result}, expected ${test.expected}`);
      passed = false;
    }
  });
  
  if (passed) {
    console.log('✅ All self-tests passed');
  } else {
    console.error('❌ Some self-tests failed');
    process.exit(1);
  }
}

// Find the best column to use as brand reference
function findBrandRefKey(headers, preferredKey = null) {
  const possibleKeys = ['brand_slug', 'slug', 'brand'];
  
  // If preferred key is specified and exists, use it
  if (preferredKey && headers.includes(preferredKey)) {
    return preferredKey;
  }
  
  // Otherwise, find the first matching key
  for (const key of possibleKeys) {
    if (headers.includes(key)) {
      return key;
    }
  }
  
  // Look for any column with 'id' in the name (possible Notion relation ID)
  const idColumn = headers.find(h => /id/i.test(h) && !/slug/i.test(h));
  if (idColumn) {
    return idColumn;
  }
  
  return null;
}

// Process CSV files and merge data
async function processFiles(options) {
  const warnings = [];
  const errors = [];
  let exitCode = 0;
  
  // Counters for summary
  const stats = {
    brandsProcessed: 0,
    brandsKept: 0,
    brandsSkipped: 0,
    sourcesProcessed: 0,
    sourcesOrphaned: 0,
    verificationsProcessed: 0,
    verificationsOrphaned: 0,
    duplicateSlugs: 0
  };
  
  // Validate required options
  if (!options.brands) {
    console.error('Error: --brands is required');
    process.exit(1);
  }
  
  if (!options.sources) {
    console.error('Error: --sources is required');
    process.exit(1);
  }
  
  if (!options.out) {
    console.error('Error: --out is required');
    process.exit(1);
  }
  
  // Read and parse CSV files
  let brandsData;
  let sourcesData;
  let verificationsData;
  
  try {
    const brandsContent = fs.readFileSync(options.brands, 'utf8');
    brandsData = csvParse(brandsContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (error) {
    console.error(`Error reading brands CSV: ${error.message}`);
    process.exit(1);
  }
  
  try {
    const sourcesContent = fs.readFileSync(options.sources, 'utf8');
    sourcesData = csvParse(sourcesContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (error) {
    console.error(`Error reading sources CSV: ${error.message}`);
    process.exit(1);
  }
  
  if (options.verifications) {
    try {
      const verificationsContent = fs.readFileSync(options.verifications, 'utf8');
      verificationsData = csvParse(verificationsContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (error) {
      console.error(`Error reading verifications CSV: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Get headers from the first row
  const brandsHeaders = Object.keys(brandsData[0] || {});
  const sourcesHeaders = Object.keys(sourcesData[0] || {});
  const verificationsHeaders = verificationsData ? Object.keys(verificationsData[0] || {}) : [];
  
  // Check for unknown columns in brands CSV
  const unknownColumns = brandsHeaders.filter(header => !SCHEMA_FIELDS.includes(header));
  if (unknownColumns.length > 0) {
    warnings.push(`Warning: Unknown columns in brands CSV will be ignored: ${unknownColumns.join(', ')}`);
  }
  
  // Find brand reference keys for joining
  const sourceBrandKey = findBrandRefKey(sourcesHeaders, options.brandKey);
  const verificationBrandKey = verificationsData ? findBrandRefKey(verificationsHeaders, options.brandKey) : null;
  
  if (!sourceBrandKey) {
    errors.push('Error: Could not find a suitable brand reference column in sources CSV');
    exitCode = 1;
  }
  
  if (options.verifications && !verificationBrandKey) {
    warnings.push('Warning: Could not find a suitable brand reference column in verifications CSV');
  }
  
  // Process brands
  const brands = [];
  const slugMap = new Map();
  const brandNameMap = new Map();
  const idMap = new Map(); // Map for ID-based lookups
  
  // Find ID columns in brands CSV
  const idColumns = brandsHeaders.filter(header => 
    /id/i.test(header) && !/slug/i.test(header)
  );
  
  for (const row of brandsData) {
    stats.brandsProcessed++;
    
    // Check required fields
    const brandName = normalizeWhitespace(row.brand || '');
    const slug = normalizeWhitespace(row.slug || '');
    
    if (!brandName || !slug) {
      errors.push(`Error: Row missing required field(s): ${!brandName ? 'brand' : 'slug'}`);
      stats.brandsSkipped++;
      continue;
    }
    
    // Check for duplicate slugs
    if (slugMap.has(slug.toLowerCase())) {
      warnings.push(`Warning: Duplicate slug "${slug}" found, skipping`);
      stats.duplicateSlugs++;
      stats.brandsSkipped++;
      continue;
    }
    
    // Create brand object with schema fields
    const brandObj = {
      sources: [] // Initialize sources array
    };
    
    for (const field of SCHEMA_FIELDS) {
      if (field === 'verification_status' || field === 'last_verified' || field === 'sources') {
        continue; // These will be handled separately
      }
      
      const value = row[field];
      
      if (value === undefined || value === '' || value === null) {
        continue; // Skip empty values
      }
      
      if (BOOLEAN_FIELDS.includes(field)) {
        const boolValue = parseBoolean(value);
        if (boolValue !== null) {
          brandObj[field] = boolValue;
        } else if (value) {
          warnings.push(`Warning: Could not parse boolean value "${value}" for field "${field}" in brand "${brandName}"`);
        }
      } else if (NUMBER_FIELDS.includes(field)) {
        const numValue = parseInteger(value);
        if (numValue !== null) {
          brandObj[field] = numValue;
        } else if (value) {
          warnings.push(`Warning: Could not parse number value "${value}" for field "${field}" in brand "${brandName}"`);
        }
      } else if (ARRAY_FIELDS.includes(field)) {
        const arrayValue = parseArray(value);
        if (arrayValue.length > 0) {
          brandObj[field] = arrayValue;
        }
      } else {
        // String fields
        brandObj[field] = harmonizePunctuation(normalizeWhitespace(value));
      }
    }
    
    // Store brand in maps for later lookup
    brands.push(brandObj);
    slugMap.set(slug.toLowerCase(), brandObj);
    brandNameMap.set(brandName.toLowerCase(), brandObj);
    
    // Store ID mappings
    for (const idColumn of idColumns) {
      const idValue = row[idColumn];
      if (idValue && idValue.trim()) {
        idMap.set(idValue.trim(), brandObj);
      }
    }
    
    stats.brandsKept++;
  }
  
  // Process sources
  for (const row of sourcesData) {
    stats.sourcesProcessed++;
    
    const brandRef = row[sourceBrandKey];
    if (!brandRef) {
      stats.sourcesOrphaned++;
      continue;
    }
    
    // Find matching brand
    let brand = slugMap.get(brandRef.toLowerCase()) || 
                brandNameMap.get(brandRef.toLowerCase()) ||
                idMap.get(brandRef.trim());
    
    if (!brand) {
      stats.sourcesOrphaned++;
      continue;
    }
    
    // Get URL
    const url = row.url;
    if (!url) {
      continue;
    }
    
    // Validate and normalize URL
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      warnings.push(`Warning: Invalid URL "${url}" for brand "${brand.brand}"`);
      continue;
    }
    
    // Create canonical key for deduplication
    const canonicalKey = getCanonicalUrlKey(normalizedUrl);
    
    // Deduplicate URLs using canonical form
    const urlKeys = brand.sources.map(getCanonicalUrlKey);
    if (!urlKeys.includes(canonicalKey)) {
      brand.sources.push(normalizedUrl);
    }
  }
  
  // Process verifications if available
  if (verificationsData && verificationBrandKey) {
    const verificationsByBrand = new Map();
    
    // Group verifications by brand and find the latest for each
    for (const row of verificationsData) {
      stats.verificationsProcessed++;
      
      const brandRef = row[verificationBrandKey];
      if (!brandRef) {
        stats.verificationsOrphaned++;
        continue;
      }
      
      const status = normalizeWhitespace(row.verification_status || '');
      const dateStr = normalizeWhitespace(row.last_verified || '');
      const date = parseDate(dateStr);
      
      // Warn on unparseable dates when a non-empty date string is present
      if (dateStr && !date) {
        warnings.push(`Warning: Could not parse date "${dateStr}" for brand reference "${brandRef}"`);
      }
      
      if (!status) continue;
      
      // Find matching brand
      const brand = slugMap.get(brandRef.toLowerCase()) || 
                    brandNameMap.get(brandRef.toLowerCase()) ||
                    idMap.get(brandRef.trim());
      
      if (!brand) {
        stats.verificationsOrphaned++;
        warnings.push(`Warning: Orphaned verification for brand reference "${brandRef}"`);
        continue;
      }
      
      if (!verificationsByBrand.has(brand)) {
        verificationsByBrand.set(brand, []);
      }
      
      verificationsByBrand.get(brand).push({ status, date });
    }
    
    // Apply verifications to brands
    for (const [brand, verifications] of verificationsByBrand.entries()) {
      // Sort by date (latest first), then take the first one
      verifications.sort((a, b) => {
        // Handle null dates
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        
        // Compare dates (latest first)
        return b.date.localeCompare(a.date);
      });
      
      const latest = verifications[0];
      
      if (latest.status) {
        brand.verification_status = latest.status;
      }
      
      if (latest.date) {
        brand.last_verified = latest.date;
      }
    }
  }
  
  // Sort brands by brand name (A-Z)
  brands.sort((a, b) => {
    return (a.brand || '').localeCompare(b.brand || '');
  });
  
  // Output results
  const output = JSON.stringify(brands, null, 2) + '\n';
  
  if (options.dryRun) {
    console.log('Dry run - would write to:', options.out);
    
    // Write to a temp file instead
    const tempFile = path.join(path.dirname(options.out), `.temp-${path.basename(options.out)}`);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(tempFile), { recursive: true });
    
    fs.writeFileSync(tempFile, output);
    console.log(`Output written to temporary file: ${tempFile}`);
  } else {
    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(options.out), { recursive: true });
    
    fs.writeFileSync(options.out, output);
    console.log(`Output written to: ${options.out}`);
  }
  
  // Print warnings and errors
  if (warnings.length > 0) {
    console.warn(warnings.join('\n'));
    if (options.strict) {
      exitCode = 1;
    }
  }
  
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    exitCode = 1;
  }
  
  // Print summary
  console.log('\nSummary:');
  console.log(`Brands processed: ${stats.brandsProcessed}`);
  console.log(`Brands kept: ${stats.brandsKept}`);
  console.log(`Brands skipped: ${stats.brandsSkipped}`);
  console.log(`Sources processed: ${stats.sourcesProcessed}`);
  console.log(`Sources orphaned: ${stats.sourcesOrphaned}`);
  if (verificationsData) {
    console.log(`Verifications processed: ${stats.verificationsProcessed}`);
    console.log(`Verifications orphaned: ${stats.verificationsOrphaned}`);
  }
  console.log(`Duplicate slugs: ${stats.duplicateSlugs}`);
  
  return exitCode;
}

// Main function
async function main() {
  const options = parseArgs();
  
  if (options.selfTest) {
    runTests();
    return 0;
  }
  
  return processFiles(options);
}

// Run the script
main().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
