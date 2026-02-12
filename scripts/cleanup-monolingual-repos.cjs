const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repos = [
  {
    name: 'ihousing-zh',
    lang: 'zh',
    keepLang: ['zh'],
    url: 'https://github.com/Jacobngai/ihousing-zh.git'
  },
  {
    name: 'ihousing-ms',
    lang: 'ms',
    keepLang: ['ms'],
    url: 'https://github.com/Jacobngai/ihousing-ms.git'
  },
  {
    name: 'ihousing-en',
    lang: 'en',
    keepLang: ['en'],
    url: 'https://github.com/Jacobngai/ihousing-en.git'
  }
];

console.log('🧹 Cleaning up monolingual repos - removing other language content...\n');

repos.forEach((repo, index) => {
  console.log(`\n${index + 1}. Processing ${repo.name}`);
  console.log(`   Keep only: /${repo.lang}/`);
  console.log(`   Remove: /en/, /ms/, /zh/`);

  // Clone repo
  const repoDir = `./temp-cleanup-${repo.name}`;
  console.log(`   Cloning ${repo.name}...`);
  execSync(`git clone ${repo.url} ${repoDir}`, { stdio: 'inherit' });

  const pagesDir = path.join(repoDir, 'src', 'pages');
  if (!fs.existsSync(pagesDir)) {
    console.log(`   ⚠️  No src/pages found, skipping...`);
    execSync(`rm -rf ${repoDir}`, { stdio: 'inherit' });
    return;
  }

  // Remove other language folders
  const allLangs = ['en', 'ms', 'zh'];
  const removeLangs = allLangs.filter(l => !repo.keepLang.includes(l));

  let removedCount = 0;

  removeLangs.forEach(lang => {
    const langPath = path.join(pagesDir, lang);

    if (fs.existsSync(langPath)) {
      console.log(`   Removing /${lang}/ folder...`);
      execSync(`rm -rf "${langPath}"`, { stdio: 'inherit' });
      removedCount++;
    } else {
      console.log(`   /${lang}/ not found (already removed)`);
    }
  });

  // Verify what's left
  console.log(`   \n📁 Remaining languages in ${repo.name}:`);
  repo.keepLang.forEach(lang => {
    const langPath = path.join(pagesDir, lang);
    if (fs.existsSync(langPath)) {
      const stats = fs.statSync(langPath);
      console.log(`      ✅ /${lang}/ exists`);
    } else {
      console.log(`      ❌ /${lang}/ MISSING!`);
    }
  });

  // Commit changes
  if (removedCount > 0) {
    console.log(`   \n   Committing cleanup...`);
    execSync(`cd ${repoDir} && git add -A`, { stdio: 'inherit' });
    execSync(`cd ${repoDir} && git commit -m "refactor: Remove other language content

- Keep only /${repo.lang}/ content
- Removed ${removeLangs.join('/')} folders
- Ensures monolingual repo contains only ${repo.lang.toUpperCase()} content

This prevents duplicate content and SEO issues across domains."`,
      { stdio: 'inherit' }
    );

    // Push to GitHub
    console.log(`   Pushing to GitHub...`);
    execSync(`cd ${repoDir} && git push origin master`, { stdio: 'inherit' });

    console.log(`   ✅ ${repo.name} cleaned up!`);
  } else {
    console.log(`   ℹ️  No changes needed for ${repo.name}`);
  }

  // Cleanup
  execSync(`rm -rf ${repoDir}`, { stdio: 'inherit' });
});

console.log('\n' + '='.repeat(70));
console.log('✅ All repos cleaned up successfully!');
console.log('='.repeat(70));
console.log('\n📋 Final Result:');
console.log('  • ihousing-zh: ONLY /zh/ content');
console.log('  • ihousing-ms: ONLY /ms/ content');
console.log('  • ihousing-en: ONLY /en/ content');
console.log('\n🌐 Next: Vercel will rebuild with correct sitemaps.');
