// @ts-nocheck
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Enable React islands
  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Bundle all CSS into a single file to avoid per-page chunks like _slug_.css
      cssCodeSplit: false,
    },
  },
});