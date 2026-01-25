const { chromium } = require('playwright');

const testBlogs = [
  'http://localhost:4326/en/blog/flat-fee-airbnb-management-melaka',
  'http://localhost:4326/en/blog/self-manage-airbnb-vs-hire-company-malaysia',
  'http://localhost:4326/ms/blog/urus-airbnb-sendiri-vs-syarikat',
  'http://localhost:4326/zh/blog/ziji-jingying-minsu-haishi-tuoguan'
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('=== TESTING CONVERTED BLOG POSTS ===\n');

  for (const url of testBlogs) {
    try {
      console.log(`Testing: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      const title = await page.title();
      const contentVisible = await page.locator('.blog-content').isVisible();
      const tableCount = await page.locator('.blog-content table').count();

      console.log(`  Title: ${title.substring(0, 60)}...`);
      console.log(`  Content visible: ${contentVisible ? '✅' : '❌'}`);
      console.log(`  Tables found: ${tableCount}`);
      console.log('');
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }

  console.log('=== ALL TESTS COMPLETE ===');
  await browser.close();
})();
