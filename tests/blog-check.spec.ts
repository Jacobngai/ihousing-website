import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://www.ihousing.net';

// Import blog posts registry
const blogPostsModule = require('../src/data/blog-posts.ts');

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  language: string;
  image?: string;
}

const allPosts: BlogPost[] = [
  ...blogPostsModule.enBlogPosts,
  ...blogPostsModule.msBlogPosts,
  ...blogPostsModule.zhBlogPosts,
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
      const fs = require('fs');
      fs.writeFileSync(
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

  // Create a test for each blog post
  allPosts.forEach((post) => {
    test(`${post.language}: ${post.slug}`, async ({ page }) => {
      const url = `${BASE_URL}/${post.language}/blog/${post.slug}/`;

      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        const status = response?.status() || 0;

        if (status === 404 || status === 500) {
          failedPages.push({
            url,
            slug: post.slug,
            error: `HTTP ${status}`,
          });
          throw new Error(`HTTP ${status}`);
        }

        // Check for common error indicators
        const content = await page.content();
        const hasNotFoundError = content.includes('404') || content.includes('Not Found');
        const hasError = content.includes('Error') || content.includes('error');

        if (hasNotFoundError) {
          failedPages.push({
            url,
            slug: post.slug,
            error: '404 page content detected',
          });
          throw new Error('404 page content detected');
        }

        if (hasError && status !== 200) {
          failedPages.push({
            url,
            slug: post.slug,
            error: 'Error page content detected',
          });
          throw new Error('Error page content detected');
        }

        // Verify title is present
        const title = await page.title();
        if (!title || title === '') {
          failedPages.push({
            url,
            slug: post.slug,
            error: 'Empty page title',
          });
          throw new Error('Empty page title');
        }

        // Verify blog post content exists
        const hasContent = await page.locator('main, h1, article').count() > 0;
        if (!hasContent) {
          failedPages.push({
            url,
            slug: post.slug,
            error: 'No main content found',
          });
          throw new Error('No main content found');
        }

        passedPages++;
        console.log(`✅ ${post.language}/${post.slug}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!failedPages.some(p => p.slug === post.slug)) {
          failedPages.push({
            url,
            slug: post.slug,
            error: errorMessage,
          });
        }
        throw error;
      }
    });
  });
});
