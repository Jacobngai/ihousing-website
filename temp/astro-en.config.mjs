import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get __dirname equivalent for ES modules
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Single language config for ihousing-en (English only)
const DEFAULT_LOCALE = 'en';
const SITE_URL = 'https://www.ihousing.net';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
  site: SITE_URL,
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: true,
  }),
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: {
          en: 'en-MY',
        },
      },
      filter: (page) => {
        // Only include English pages (/en/)
        // Exclude root URL
        if (page === `${SITE_URL}/`) return false;

        // Exclude root language homepages (only want English)
        if (page === `${SITE_URL}/zh/` || page === `${SITE_URL}/zh`) return false;
        if (page === `${SITE_URL}/ms/` || page === `${SITE_URL}/ms`) return false;

        // Must include /en/ prefix
        if (!page.includes('/en/')) return false;

        // Exclude any other language prefixes (double check)
        if (page.includes('/zh/') || page.includes('/ms/')) return false;

        return true;
      },
      serialize: (item) => {
        // Extract actual publish date from blog post URLs
        const blogDateMatch = item.url.match(/\/blog\/(\d{4}-\d{2}-\d{2})-/);
        if (blogDateMatch) {
          item.lastmod = new Date(blogDateMatch[1] + 'T12:00:00.000Z');
        } else {
          item.lastmod = new Date();
        }

        // Priority rules for English SEO
        if (item.url.match(/\/en\/?$/)) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        else if (item.url.includes('/parkland')) {
          item.priority = 0.95;
          item.changefreq = 'weekly';
        }
        else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }
        else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }

        return item;
      },
    }),
  ],
  // No i18n routing needed for single-language site
  // Image optimization
  image: {
    domains: ['www.ihousing.com.my'],
    remotePatterns: [
      {
        protocol: 'https',
      },
    ],
  },
});
