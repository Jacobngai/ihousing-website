import { test, expect } from '@playwright/test';

const EN_PREVIEW = 'https://ihousing-website-429qex0ep-ngsanzen-gmailcoms-projects.vercel.app';
const ZH_PREVIEW = 'https://ihousing-n05cb0kik-ngsanzen-gmailcoms-projects.vercel.app';

test.describe('EN Site Navigation QA', () => {
  test('Homepage logo links correctly', async ({ page }) => {
    await page.goto(`${EN_PREVIEW}/en/`);
    const logoHref = await page.locator('header a').first().getAttribute('href');
    console.log('Homepage logo href:', logoHref);
    expect(logoHref).toContain('/en');
  });

  test('Blog page logo links correctly', async ({ page }) => {
    // First find a blog post
    await page.goto(`${EN_PREVIEW}/en/blog/`);
    
    // Click first blog post
    const blogLink = page.locator('a[href*="/blog/"]').first();
    if (await blogLink.count() > 0) {
      const href = await blogLink.getAttribute('href');
      console.log('Blog link found:', href);
      
      // Navigate to a blog post
      await page.goto(`${EN_PREVIEW}${href}`);
      await page.waitForLoadState('domcontentloaded');
      
      // Check logo link
      const logoHref = await page.locator('header a').first().getAttribute('href');
      console.log('Blog page logo href:', logoHref);
      expect(logoHref).toContain('/en');
    }
  });

  test('All nav links have /en prefix', async ({ page }) => {
    await page.goto(`${EN_PREVIEW}/en/`);
    
    const navLinks = await page.locator('header a, nav a').all();
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        console.log('Nav link:', href);
        expect(href).toMatch(/^\/(en|ms|zh)\//);
      }
    }
  });
});

test.describe('ZH Site Navigation QA', () => {
  test('Homepage loads without errors', async ({ page }) => {
    const response = await page.goto(ZH_PREVIEW);
    expect(response?.status()).toBe(200);
  });

  test('Navigation is fully in Chinese', async ({ page }) => {
    await page.goto(ZH_PREVIEW);
    
    // Check that English nav items are NOT present
    const pageContent = await page.content();
    expect(pageContent).not.toContain('>Full Management<');
    expect(pageContent).not.toContain('>Renovation<');
    expect(pageContent).not.toContain('>How It Works<');
    
    // Check Chinese items ARE present
    expect(pageContent).toContain('全托管服务');
    expect(pageContent).toContain('服务');
  });
});

test.describe('404 Check', () => {
  test('Root /en redirects correctly', async ({ page }) => {
    const response = await page.goto(`${EN_PREVIEW}/en/`);
    expect(response?.status()).toBe(200);
  });
  
  test('Root / redirects to /en/', async ({ page }) => {
    await page.goto(`${EN_PREVIEW}/`);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/en/');
  });
});
