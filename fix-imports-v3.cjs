const fs = require('fs');
const path = require('path');

// Get all .astro files
const { globSync } = require('glob');
const files = globSync('src/**/*.astro', { cwd: __dirname });

let fixedCount = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  let newContent = content;

  // Files in /blog/ folders need 4 levels up
  if (file.includes('/blog/')) {
    // Fix: 3 levels -> 4 levels
    newContent = content.replace(
      /from '\.\.\/\.\.\/\.\.\/layouts\//g,
      "from '../../../../layouts/"
    );
  }
  // Files directly under /pages/en/, /pages/zh/, /pages/ms/ need 3 levels up
  else if (file.match(/\/pages\/(en|zh|ms)\/[^/]+\/index\.astro$/)) {
    // Fix: 4 levels -> 3 levels
    newContent = content.replace(
      /from '\.\.\/\.\.\/\.\.\/\.\.\/layouts\//g,
      "from '../../../layouts/"
    );
  }

  // Only write if content changed
  if (newContent !== content) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    fixedCount++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
