// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import fs from "fs";
import path from "path";
import { SITE_URL } from "./src/consts";

const isDev = process.env.NODE_ENV === 'development';
const siteBase = isDev ? 'http://localhost:4321' : SITE_URL;

// Pre-read blog post dates from frontmatter at config time so serialize() can use them.
/** @type {Map<string, Date>} */
const postDates = new Map();

const blogDir = path.resolve('./src/content/blog');
for (const file of fs.readdirSync(blogDir)) {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
  const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const updatedMatch = content.match(/^updatedDate:\s*(.+)$/m);
  const pubMatch     = content.match(/^pubDate:\s*(.+)$/m);
  const date = updatedMatch ? new Date(updatedMatch[1].trim())
             : pubMatch     ? new Date(pubMatch[1].trim())
             : new Date();
  const slug = file.replace(/\.(md|mdx)$/, '');
  postDates.set(`${siteBase}/blog/${slug}/`, date);
}

// https://astro.build/config
export default defineConfig({
  site: siteBase,
  vite: {
    ssr: {
      external: ['@resvg/resvg-js'],
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const url = item.url;

        // Homepage
        if (url === `${siteBase}/`) {
          return { ...item, changefreq: /** @type {any} */ ('daily'), priority: 1.0 };
        }

        // Blog post — use real frontmatter date
        if (postDates.has(url)) {
          return {
            ...item,
            lastmod:    postDates.get(url)?.toISOString(),
            changefreq: /** @type {any} */ ('weekly'),
            priority:   0.8,
          };
        }

        // Topic pages under /blog/topics/
        if (url.includes('/blog/topics/')) {
          return { ...item, changefreq: /** @type {any} */ ('weekly'), priority: 0.6 };
        }

        // Blog index, topics index
        if (url.endsWith('/blog/') || url.endsWith('/topics/')) {
          return { ...item, changefreq: /** @type {any} */ ('weekly'), priority: 0.7 };
        }

        // Static pages (resume, contact…)
        return { ...item, changefreq: /** @type {any} */ ('monthly'), priority: 0.5 };
      },
    }),
  ],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Atkinson",
      cssVariable: "--font-atkinson",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-regular.woff"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/atkinson-bold.woff"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],
});
