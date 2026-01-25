import { test, expect } from '@playwright/test';
import { enBlogPosts, msBlogPosts, zhBlogPosts } from '../src/data/blog-posts';

const BASE_URL = process.env.BASE_URL || 'https://www.ihousing.net';

const allPosts = [
  ...enBlogPosts.map(p => ({ ...p, lang: 'en' })),
  ...msBlogPosts.map(p => ({ ...p, lang: 'ms' })),
  ...zhBlogPosts.map(p => ({ ...p, lang: 'zh' })),
];

test.describe(`Blog Link Checker for ${BASE_URL}`, () => {
  let failedPages: Array<{ url: string; slug: string; error: string }> = [];
  let passedPages = 0;

  test.beforeAll(async () => {
    console.log(`\n🔍 Checking ${allPosts.length} blog posts...`);
  });

  test.afterAll(async () => {
    console.log(`\n\n📊 Results:`);
    console.log(`✅ Passed: ${passedPages}`);
    console.log(`❌ Failed: ${failedPages.length}`);

    if (failedPages.length > 0) {
      console.log(`\n❌ Failed Pages:`);
      failedPages.forEach(({ url, slug, error }) => {
        console.log(`  - ${url}`);
        console.log(`    Slug: ${slug}`);
        console.log(`    Error: ${error}`);
      });

      // Write results to file
      const { writeFileSync } = await import('fs');
      writeFileSync(
        'blog-check-results.json',
        JSON.stringify({
          timestamp: new Date().toISOString(),
          total: allPosts.length,
          passed: passedPages,
          failed: failedPages.length,
          failedPages,
        }, null, 2)
      );
      console.log(`\n📄 Results saved to blog-check-results.json`);
    }
  });

  // Create tests for each blog post using data-driven approach
  allPosts.forEach((post) => {
    test(`[${post.lang}] ${post.slug}`, async ({ page }) => {
      const url = `${BASE_URL}/${post.lang}/blog/${post.slug}/`;

      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      const status = response?.status() || 0;

      // Check for 404 or 500 errors
      expect(status, `Expected 200, got ${status} for ${url}`).not.toBe(404);
      expect(status, `Expected 200, got ${status} for ${url}`).not.toBe(500);

      // Check for 404 in content
      const content = await page.content();
      const hasNotFoundError = content.includes('404') || content.includes('Not Found');
      expect(hasNotFoundError, `404 content found in ${url}`).toBe(false);

      // Verify title exists
      const title = await page.title();
      expect(title.trim().length, `Empty title for ${url}`).toBeGreaterThan(0);

      // Verify blog post content exists
      const hasContent = await page.locator('main, h1, article').count() > 0;
      expect(hasContent, `No main content found in ${url}`).toBe(true);

      passedPages++;
      console.log(`✅ ${post.lang}/${post.slug}`);
    });
  });
});
