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

  // Files in /blog/ folders need 4 levels up
  if (file.includes('/blog/')) {
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
  // Files directly under /en/, /zh/, /ms/ need 3 levels up
  else if (file.match(/\/pages\/(en|zh|ms)\//)) {
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
