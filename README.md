# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 🛠️ Merge Notion CSV exports ➜ `src/data/brands.json`

This project ships with a Windows-friendly CLI script that merges three Notion CSV exports—`brands.csv`, `sources.csv`, and `verifications.csv`—into a single **static-safe** `src/data/brands.json` file used by Astro + React islands.

### What the script does
1. Reads the three CSV exports.
2. Normalises & validates every field (whitespace, punctuation, booleans, arrays, dates, URLs).
3. Joins `sources` and `verifications` to each brand in priority order  
   `brand_slug → slug → brand (case-insensitive) → relation id`.
4. Generates an array of brand objects **sorted A-Z by `brand`** with **exactly** these keys:

```
brand
slug
parent_company
ownership_transparency
hq
year_founded
self_manufactured
in_house_testing
made_in_usa
manufacturing_locations
certification
assembled_in
ingredient_sourcing
ingredient_philosophy
proprietary_blends
product_categories
product_types
top_products
unique_offering
glass_or_plastic
woman_owned
vegan
allergen_free
clinically_tested
sustainablity          ← (sic)
non_profit_partner
recalls_notices
sources
verification_status
last_verified
```

### Prerequisites
• Node 18+ (ESM)  
• Install deps once:

```sh
npm install        # or pnpm install
```

### Usage

Windows PowerShell (line-continuations with `^`)

```powershell
node tools/merge-brands.mjs ^
  --brands ./exports/brands.csv ^
  --sources ./exports/sources.csv ^
  --verifications ./exports/verifications.csv ^
  --out ./src/data/brands.json
```

Unix / macOS

```sh
node tools/merge-brands.mjs \
  --brands ./exports/brands.csv \
  --sources ./exports/sources.csv \
  --verifications ./exports/verifications.csv \
  --out ./src/data/brands.json
```

### Flags
Required:  
• `--brands`  Path to brands export  
• `--sources` Path to sources export  
• `--out`     Destination JSON  

Optional:  
• `--verifications`  Path to verifications export (omit to skip)  
• `--dry-run`        Write to a temp file & print summary only  
• `--strict`         Treat **any** warning as fatal (non-zero exit)  
• `--brand-key`      Force join column (`slug`, `brand`, etc.)  
• `--self-test`      Run baked-in acceptance tests, then exit  

### Expected CSV columns
`brands.csv` — see keys above (extra columns ignored with a warning).  
`sources.csv` must contain `url` **plus** a brand reference column (`brand_slug`, `slug`, `brand`, or relation id).  
`verifications.csv` must contain `verification_status`, `last_verified`, and a brand reference column.

### Type & hygiene rules
• **Booleans**: `yes/no`, `true/false`, `1/0` → real `true | false`.  
• **Numbers**: `year_founded` → int; invalid values dropped.  
• **Arrays**: split on `,` or `;`, trim, dedupe, preserve order.  
• **Dates**: normalised to `YYYY-MM-DD`; latest wins.  
• **URLs**: http/https only, hostname lower-cased, trailing slash removed for dedupe.  
• Empty strings → field omitted.

### Summary & warnings
After running, the script prints counts of:
• brands processed / kept / skipped  
• sources processed / orphaned  
• (if applicable) verifications processed / orphaned  
• duplicate slugs  

Warnings include:
• Unknown columns (ignored)  
• Unparseable booleans / dates  
• Duplicate slugs (later rows skipped)  
• Orphaned sources / verifications with no matching brand  

Use `--strict` to fail the build on any warning.

### Troubleshooting
• **“Duplicate slug”**: Ensure each brand row has a unique `slug`.  
• **“Orphaned sources/verifications”**: Check the reference column matches a slug/brand in `brands.csv`.  
• **“Unknown columns”**: Safe to ignore, but clean your export for future runs.  
• **Self-tests fail**: Run `node tools/merge-brands.mjs --self-test` to verify local environment/parsers.  
