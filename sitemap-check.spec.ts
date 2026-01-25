import { test, expect } from '@playwright/test';

/**
 * Sitemap Link Checker
 *
 * This test fetches the sitemap.xml from the deployed site,
 * extracts all URLs, and checks each one for 404 errors.
 *
 * Usage:
 *   npx playwright test sitemap-check.spec.ts
 *
 * Environment:
 *   SITE_URL - The base URL to check (default: https://en.ihousing-temp.vercel.app)
 */

const SITE_URL = process.env.SITE_URL || 'https://en.ihousing-temp.vercel.app';
const SITEMAP_URL = `${SITE_URL}/sitemap-index.xml`;

interface SitemapResult {
  url: string;
  statusCode: number;
  error: string | null;
  success: boolean;
}

interface CheckResults {
  timestamp: string;
  siteUrl: string;
  totalUrls: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  errors: SitemapResult[];
  warnings: string[];
}

test.describe('Sitemap Link Checker', () => {
  let results: CheckResults;
  let allUrls: string[] = [];

  test.beforeAll(async ({ request }) => {
    console.log(`\n🔍 Checking sitemap at: ${SITEMAP_URL}\n`);

    // Fetch sitemap index
    const sitemapIndexResponse = await request.get(SITEMAP_URL);
    expect(sitemapIndexResponse.status()).toBe(200);

    const sitemapIndexText = await sitemapIndexResponse.text();

    // Extract sitemap URLs from sitemap index
    const sitemapUrlMatches = sitemapIndexText.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
    const sitemapUrls = Array.from(sitemapUrlMatches).map(m => m[1]);

    console.log(`📄 Found ${sitemapUrls.length} sitemap file(s)`);

    // Fetch each sitemap and extract URLs
    for (const sitemapUrl of sitemapUrls) {
      const sitemapResponse = await request.get(sitemapUrl);
      if (sitemapResponse.status() === 200) {
        const sitemapText = await sitemapResponse.text();
        const urlMatches = sitemapText.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
        const urls = Array.from(urlMatches).map(m => m[1]);
        allUrls.push(...urls);
      }
    }

    console.log(`📋 Total URLs found in sitemaps: ${allUrls.length}\n`);

    // Initialize results
    results = {
      timestamp: new Date().toISOString(),
      siteUrl: SITE_URL,
      totalUrls: allUrls.length,
      successCount: 0,
      failureCount: 0,
      successRate: 0,
      errors: [],
      warnings: []
    };
  });

  test('Check all sitemap URLs for 404 errors', async ({ request }) => {
    const errors: SitemapResult[] = [];
    const warnings: string[] = [];

    // Check each URL
    for (let i = 0; i < allUrls.length; i++) {
      const url = allUrls[i];
      const progress = Math.round(((i + 1) / allUrls.length) * 100);

      try {
        const response = await request.get(url, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SitemapChecker/1.0)'
          }
        });

        const statusCode = response.status();
        const success = statusCode >= 200 && statusCode < 400;

        if (!success) {
          errors.push({
            url,
            statusCode,
            error: `HTTP ${statusCode}`,
            success: false
          });

          console.log(`❌ [${i + 1}/${allUrls.length}] ${progress}% - ${statusCode}: ${url}`);
        } else {
          console.log(`✅ [${i + 1}/${allUrls.length}] ${progress}% - ${url}`);
        }

        // Check for redirect chains
        const headers = response.headers();
        if (statusCode >= 300 && statusCode < 400) {
          const location = headers['location'];
          if (location) {
            console.log(`  ↪️ Redirects to: ${location}`);
          }
        }

      } catch (error: any) {
        errors.push({
          url,
          statusCode: 0,
          error: error.message,
          success: false
        });

        console.log(`⚠️ [${i + 1}/${allUrls.length}] ${progress}% - Error: ${url}`);
        console.log(`  ${error.message}`);
      }
    }

    // Update results
    results.successCount = results.totalUrls - errors.length;
    results.failureCount = errors.length;
    results.successRate = Math.round((results.successCount / results.totalUrls) * 100);
    results.errors = errors;
    results.warnings = warnings;

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SITEMAP CHECK SUMMARY');
    console.log('='.repeat(60));
    console.log(`Site: ${SITE_URL}`);
    console.log(`Total URLs: ${results.totalUrls}`);
    console.log(`✅ Success: ${results.successCount}`);
    console.log(`❌ Errors: ${results.failureCount}`);
    console.log(`Success Rate: ${results.successRate}%`);
    console.log('='.repeat(60) + '\n');

    // Print errors if any
    if (errors.length > 0) {
      console.log('❌ BROKEN LINKS FOUND:\n');
      errors.forEach((error, idx) => {
        console.log(`${idx + 1}. ${error.url}`);
        console.log(`   Status: ${error.statusCode}`);
        if (error.error) {
          console.log(`   Error: ${error.error}`);
        }
        console.log('');
      });
      console.log('='.repeat(60) + '\n');
    }

    // Save results to JSON file
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, 'sitemap-check-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`📁 Results saved to: ${outputPath}\n`);

    // Fail test if any 404s found
    expect(errors.length).toBe(0);
  });

  test('Verify sitemap XML structure is valid', async ({ request }) => {
    // Check sitemap index
    const indexResponse = await request.get(SITEMAP_URL);
    const indexText = await indexResponse.text();

    // Verify XML structure
    expect(indexText).toContain('<?xml');
    expect(indexText).toContain('<sitemapindex');
    expect(indexText).toContain('</sitemapindex>');

    console.log('✅ Sitemap index XML structure is valid\n');
  });

  test('Check for duplicate URLs in sitemap', async () => {
    const urlSet = new Set(allUrls);
    const duplicates = allUrls.length - urlSet.size;

    if (duplicates > 0) {
      console.log(`⚠️ Found ${duplicates} duplicate URLs in sitemap`);

      // Find duplicates
      const urlCount = new Map<string, number>();
      allUrls.forEach(url => {
        urlCount.set(url, (urlCount.get(url) || 0) + 1);
      });

      const duplicatesList = Array.from(urlCount.entries())
        .filter(([, count]) => count > 1)
        .map(([url]) => url);

      results.warnings.push(`Found ${duplicates} duplicate URLs`);
      console.log('Duplicate URLs:');
      duplicatesList.forEach(url => console.log(`  - ${url}`));
    } else {
      console.log('✅ No duplicate URLs found\n');
    }

    expect(duplicates).toBe(0);
  });
});
