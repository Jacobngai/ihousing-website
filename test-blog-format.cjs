const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to blog post...');
  await page.goto('http://localhost:4326/en/blog/flat-fee-airbnb-management-melaka', { waitUntil: 'networkidle' });

  // Take a screenshot
  await page.screenshot({ path: 'blog-post-screenshot.png', fullPage: true });
  console.log('Screenshot saved to blog-post-screenshot.png');

  // Get the rendered HTML of the blog content
  const contentHTML = await page.locator('.blog-content').innerHTML();
  console.log('=== BLOG CONTENT HTML ===');
  console.log(contentHTML.substring(0, 5000));

  // Check if tables are rendering
  const tables = await page.locator('.blog-content table').count();
  console.log(`Number of tables found: ${tables}`);

  // Get visible text from the blog content
  const visibleText = await page.locator('.blog-content').allTextContents();
  console.log('=== VISIBLE TEXT (first 2000 chars) ===');
  console.log(visibleText.join('\n').substring(0, 2000));

  // Check for any console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    }
  });

  await browser.close();
})();
