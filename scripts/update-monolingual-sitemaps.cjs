const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repos = [
  {
    name: 'ihousing-zh',
    lang: 'zh',
    url: 'https://github.com/Jacobngai/ihousing-zh.git',
    configFile: 'temp/astro-zh.config.mjs',
    siteUrl: 'https://www.ihousing.biz'
  },
  {
    name: 'ihousing-ms',
    lang: 'ms',
    url: 'https://github.com/Jacobngai/ihousing-ms.git',
    configFile: 'temp/astro-ms.config.mjs',
    siteUrl: 'https://www.ihousing.me'
  },
  {
    name: 'ihousing-en',
    lang: 'en',
    url: 'https://github.com/Jacobngai/ihousing-en.git',
    configFile: 'temp/astro-en.config.mjs',
    siteUrl: 'https://www.ihousing.net'
  },
];

console.log('🗺️  Updating sitemap configs for 3 monolingual repos...\n');

repos.forEach((repo, index) => {
  console.log(`\n${index + 1}. Processing ${repo.name} (${repo.lang.toUpperCase()})`);
  console.log(`   Site URL: ${repo.siteUrl}`);

  // Clone repo
  const repoDir = `./temp-${repo.name}`;
  console.log(`   Cloning ${repo.name}...`);
  execSync(`git clone ${repo.url} ${repoDir}`, { stdio: 'inherit' });

  // Copy updated config
  console.log(`   Updating astro.config.mjs...`);
  const sourceConfig = path.resolve(repo.configFile);
  const targetConfig = path.join(repoDir, 'astro.config.mjs');
  fs.copyFileSync(sourceConfig, targetConfig);

  // Commit changes
  console.log(`   Committing sitemap update...`);
  execSync(`cd ${repoDir} && git add astro.config.mjs`, { stdio: 'inherit' });
  execSync(`cd ${repoDir} && git commit -m "feat: Update sitemap for single-language site (${repo.lang.toUpperCase()} only)

- Configure sitemap to only include /${repo.lang}/ pages
- Filter out other language prefixes (/en/, /ms/, /zh/)
- Set single locale: ${repo.lang}
- Update SITE_URL to ${repo.siteUrl}

This ensures Google receives language-specific sitemap for each site,
preventing duplicate content issues across the 3 domains."`,
    { stdio: 'inherit' }
  );

  // Push to GitHub
  console.log(`   Pushing to GitHub...`);
  execSync(`cd ${repoDir} && git push origin master`, { stdio: 'inherit' });

  console.log(`   ✅ ${repo.name} sitemap updated!`);

  // Cleanup
  execSync(`rm -rf ${repoDir}`, { stdio: 'inherit' });
});

console.log('\n' + '='.repeat(70));
console.log('✅ All sitemaps updated successfully!');
console.log('='.repeat(70));
console.log('\n📋 Sitemap Details:');
console.log('  • ihousing-zh: 290 Chinese blog posts');
console.log('  • ihousing-ms: 276 Malay blog posts');
console.log('  • ihousing-en: 373 English blog posts');
console.log('\n📝 Each sitemap now includes ONLY that language\'s content.');
console.log('\n🌐 Sitemap URLs after deployment:');
console.log('  • https://www.ihousing.biz/sitemap.xml (Chinese)');
console.log('  • https://www.ihousing.me/sitemap.xml (Malay)');
console.log('  • https://www.ihousing.net/sitemap.xml (English)');
console.log('\n📋 Next: Submit each sitemap to Google Search Console separately.');
