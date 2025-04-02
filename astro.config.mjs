// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },

  // integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});