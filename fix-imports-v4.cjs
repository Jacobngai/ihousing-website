const fs = require('fs');
const path = require('path');

// Get all .astro files
const { globSync } = require('glob');
const files = globSync('src/**/*.astro', { cwd: __dirname });

let fixedBlog = 0;
let fixedDirect = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  let newContent = content;

  // Normalize path to use forward slashes for matching
  const normalizedPath = file.replace(/\\/g, '/');

  // Files in /blog/ folders need 4 levels up
  if (normalizedPath.includes('/blog/')) {
    // Fix: 3 levels -> 4 levels
    newContent = content.replace(
      /from '\.\.\/\.\.\/\.\.\/layouts\//g,
      "from '../../../../layouts/"
    );
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      fixedBlog++;
      console.log(`Fixed (blog): ${file}`);
    }
  }
  // Files directly under /pages/en/, /pages/zh/, /pages/ms/ (but not in blog, compare, etc)
  else if (normalizedPath.match(/\/pages\/(en|zh|ms)\/[^/]+\/index\.astro$/)) {
    // Fix: 4 levels -> 3 levels
    newContent = content.replace(
      /from '\.\.\/\.\.\/\.\.\/\.\.\/layouts\//g,
      "from '../../../layouts/"
    );
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      fixedDirect++;
      console.log(`Fixed (direct): ${file}`);
    }
  }
});

console.log(`\n✅ Fixed blog files (4 levels): ${fixedBlog}`);
console.log(`✅ Fixed direct files (3 levels): ${fixedDirect}`);
console.log(`✅ Total fixed: ${fixedBlog + fixedDirect}`);
