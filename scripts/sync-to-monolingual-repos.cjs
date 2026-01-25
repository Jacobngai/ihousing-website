const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repos = [
  { name: 'ihousing-zh', lang: 'zh', url: 'https://github.com/Jacobngai/ihousing-zh.git' },
  { name: 'ihousing-ms', lang: 'ms', url: 'https://github.com/Jacobngai/ihousing-ms.git' },
];

console.log('🔄 Syncing language fixes to separate monolingual repos...\n');

repos.forEach((repo, index) => {
  console.log(`\n${index + 1}. Processing ${repo.name} (${repo.lang.toUpperCase()})...`);

  // Clone repo
  const repoDir = `./temp-${repo.name}`;
  console.log(`   Cloning ${repo.name}...`);
  execSync(`git clone ${repo.url} ${repoDir}`, { stdio: 'inherit' });

  // Copy fixed blog posts
  console.log(`   Copying fixed ${repo.lang.toUpperCase()} blog posts...`);
  const sourceDir = `./src/pages/${repo.lang}/blog`;
  const targetDir = `${repoDir}/src/pages/${repo.lang}/blog`;

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    console.log(`   ERROR: Target directory ${targetDir} not found!`);
    return;
  }

  // Copy all blog posts
  const blogFolders = fs.readdirSync(sourceDir).filter(f => fs.statSync(path.join(sourceDir, f)).isDirectory());

  let copiedCount = 0;
  blogFolders.forEach(folder => {
    const sourceFile = path.join(sourceDir, folder, 'index.astro');
    const targetFile = path.join(targetDir, folder, 'index.astro');

    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      copiedCount++;
    }
  });

  console.log(`   Copied ${copiedCount} blog posts`);

  // Commit changes
  console.log(`   Committing changes...`);
  execSync(`cd ${repoDir} && git add -A`, { stdio: 'inherit' });
  execSync(`cd ${repoDir} && git commit -m "fix: Sync comprehensive language fixes from main repo - remove all English sections"`, { stdio: 'inherit' });

  // Push to GitHub
  console.log(`   Pushing to GitHub...`);
  execSync(`cd ${repoDir} && git push origin master`, { stdio: 'inherit' });

  console.log(`   ✅ ${repo.name} updated successfully!`);

  // Cleanup
  execSync(`rm -rf ${repoDir}`, { stdio: 'inherit' });
});

console.log('\n' + '='.repeat(70));
console.log('✅ All repos synced successfully!');
console.log('='.repeat(70));
console.log('\n📋 Next steps:');
console.log('1. Vercel will auto-deploy (if enabled) or manually deploy each repo');
console.log('2. Test the deployed sites to verify language correctness');
console.log('3. Check blog posts are 100% in target language');
