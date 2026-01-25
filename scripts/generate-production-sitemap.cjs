#!/usr/bin/env node
/**
 * Production Sitemap Generator for iHousing
 *
 * This script generates proper XML sitemaps for Google Search Console submission.
 * It:
 * 1. Uses the correct production URL (https://www.ihousing.net)
 * 2. Organizes sitemaps logically (main pages, blog posts)
 * 3. Follows Google's sitemap protocol
 * 4. Creates a sitemap index file
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const PRODUCTION_URL = 'https://www.ihousing.net';
const OUTPUT_DIR = path.join(__dirname, '../dist');
const SITEMAP_DIR = path.join(OUTPUT_DIR, 'sitemaps');

// Ensure sitemap directory exists
if (!fs.existsSync(SITEMAP_DIR)) {
  fs.mkdirSync(SITEMAP_DIR, { recursive: true });
}

console.log(`🔍 Generating sitemaps for ${PRODUCTION_URL}\n`);

// ============================================
// 1. MAIN PAGES SITEMAP
// ============================================
console.log('📄 Generating main pages sitemap...');

const mainPages = [
  // Homepages
  { url: '/en/', priority: 1.0, changefreq: 'weekly' },
  { url: '/zh/', priority: 1.0, changefreq: 'weekly' },
  { url: '/ms/', priority: 1.0, changefreq: 'weekly' },

  // Core pages
  { url: '/en/about/', priority: 0.6, changefreq: 'monthly' },
  { url: '/zh/about/', priority: 0.6, changefreq: 'monthly' },
  { url: '/ms/about/', priority: 0.6, changefreq: 'monthly' },

  { url: '/en/contact/', priority: 0.8, changefreq: 'monthly' },
  { url: '/zh/contact/', priority: 0.8, changefreq: 'monthly' },
  { url: '/ms/contact/', priority: 0.8, changefreq: 'monthly' },

  // Blog index
  { url: '/en/blog/', priority: 0.7, changefreq: 'weekly' },
  { url: '/zh/blog/', priority: 0.7, changefreq: 'weekly' },
  { url: '/ms/blog/', priority: 0.7, changefreq: 'weekly' },
];

// Add all pages from src/pages
const pageFiles = globSync('src/pages/*/{index,about,contact,properties}.astro');
const enPages = globSync('src/pages/en/*.astro');
const zhPages = globSync('src/pages/zh/*.astro');
const msPages = globSync('src/pages/ms/*.astro');

// Extract URLs from page files
enPages.forEach(file => {
  const slug = file.replace('src/pages/en/', '').replace('.astro', '');
  if (slug && !slug.includes('blog/') && !mainPages.some(p => p.url === `/en/${slug}`)) {
    mainPages.push({ url: `/en/${slug}`, priority: 0.5, changefreq: 'monthly' });
  }
});

zhPages.forEach(file => {
  const slug = file.replace('src/pages/zh/', '').replace('.astro', '');
  if (slug && !slug.includes('blog/') && !mainPages.some(p => p.url === `/zh/${slug}`)) {
    mainPages.push({ url: `/zh/${slug}`, priority: 0.5, changefreq: 'monthly' });
  }
});

msPages.forEach(file => {
  const slug = file.replace('src/pages/ms/', '').replace('.astro', '');
  if (slug && !slug.includes('blog/') && !mainPages.some(p => p.url === `/ms/${slug}`)) {
    mainPages.push({ url: `/ms/${slug}`, priority: 0.5, changefreq: 'monthly' });
  }
});

// Generate main sitemap XML
const mainSitemap = generateSitemapXML(mainPages, 'main');
fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-main.xml'), mainSitemap);
console.log(`✅ Generated sitemap-main.xml with ${mainPages.length} pages\n`);

// ============================================
// 2. BLOG POSTS SITEMAP
// ============================================
console.log('📝 Generating blog posts sitemap...');

// Import blog posts registry
const blogPostsModule = require('../src/data/blog-posts.ts');
const allBlogPosts = [
  ...blogPostsModule.enBlogPosts.map(p => ({ ...p, lang: 'en' })),
  ...blogPostsModule.zhBlogPosts.map(p => ({ ...p, lang: 'zh' })),
  ...blogPostsModule.msBlogPosts.map(p => ({ ...p, lang: 'ms' })),
];

console.log(`Found ${allBlogPosts.length} blog posts`);

// Split blog posts into chunks of 50,000 (Google's limit per sitemap)
const BLOG_POSTS_PER_SITEMAP = 50000;
const blogChunks = [];
for (let i = 0; i < allBlogPosts.length; i += BLOG_POSTS_PER_SITEMAP) {
  blogChunks.push(allBlogPosts.slice(i, i + BLOG_POSTS_PER_SITEMAP));
}

console.log(`Creating ${blogChunks.length} blog sitemap(s)...`);

const blogSitemaps = [];
blogChunks.forEach((chunk, index) => {
  const blogPages = chunk.map(post => ({
    url: `/${post.lang}/blog/${post.slug}/`,
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: post.date ? `${post.date}T12:00:00.000Z` : new Date().toISOString()
  }));

  const sitemapXML = generateSitemapXML(blogPages, `blog-${index + 1}`);
  const filename = `sitemap-blog-${index + 1}.xml`;
  fs.writeFileSync(path.join(SITEMAP_DIR, filename), sitemapXML);
  blogSitemaps.push(filename);
  console.log(`  ✅ ${filename} - ${blogPages.length} posts`);
});

console.log(`\n✅ Generated ${blogSitemaps.length} blog sitemaps\n`);

// ============================================
// 3. SITEMAP INDEX FILE
// ============================================
console.log('📋 Generating sitemap index...');

const allSitemaps = [
  'sitemap-main.xml',
  ...blogSitemaps
];

const sitemapIndex = generateSitemapIndex(allSitemaps);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapIndex);

console.log(`✅ Generated sitemap.xml with ${allSitemaps.length} sitemaps\n`);

// ============================================
// 4. COPY TO ROOT FOR VERCEL
// ============================================
console.log('📋 Copying sitemap.xml to root...');

// Also copy the sitemap index to the public root so it's accessible
fs.copyFileSync(
  path.join(OUTPUT_DIR, 'sitemap.xml'),
  path.join(__dirname, '../public/sitemap.xml')
);

console.log('✅ Copied sitemap.xml to public/\n');

// ============================================
// 5. VALIDATE SITEMAP
// ============================================
console.log('🔍 Validating sitemap...');

const totalUrls = mainPages.length + allBlogPosts.length;
const sitemapUrl = `${PRODUCTION_URL}/sitemap.xml`;

console.log(`
╔═══════════════════════════════════════════════════════════════
   🎉 SITEMAP GENERATION COMPLETE
╔═══════════════════════════════════════════════════════════════

📍 Production URL: ${PRODUCTION_URL}
📄 Sitemap Index: ${sitemapUrl}

📊 Sitemap Contents:
   • Main pages: ${mainPages.length}
   • Blog posts: ${allBlogPosts.length}
   • Total URLs: ${totalUrls}
   • Sitemap files: ${allSitemaps.length}

📂 Files Generated:
   • dist/sitemap.xml (sitemap index)
   • dist/sitemaps/sitemap-main.xml
   ${blogSitemaps.map(s => `   • dist/sitemaps/${s}`).join('\n')}

🔍 NEXT STEPS:

1. Deploy to Vercel
2. Verify sitemap is accessible: ${sitemapUrl}
3. Submit to Google Search Console:
   a. Go to: https://search.google.com/search-console
   b. Select property: www.ihousing.net
   c. Go to: Site Configuration > Sitemaps
   d. Add sitemap: ${sitemapUrl}
   e. Click "Submit"

📖 Google Search Console Best Practices:
   • Submit sitemap index (not individual sitemaps)
   • Monitor "Coverage" report for indexing issues
   • Check "URL Inspection" tool for specific pages
   • Resubmit sitemap after adding significant content

╔═══════════════════════════════════════════════════════════════
`);

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateSitemapXML(pages, sitemapName) {
  const urls = pages.map(page => {
    const url = page.url.startsWith('/') ? page.url : `/${page.url}`;
    const lastmod = page.lastmod || new Date().toISOString();

    return `  <url>
    <loc>${PRODUCTION_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

function generateSitemapIndex(sitemaps) {
  const sitemapRefs = sitemaps.map(sitemap => {
    return `  <sitemap>
    <loc>${PRODUCTION_URL}/sitemaps/${sitemap}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRefs}
</sitemapindex>`;
}
