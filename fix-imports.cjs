const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Get all .astro files
const files = globSync('src/**/*.astro', { cwd: __dirname });

let fixedCount = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Replace 4 levels up with 3 levels up
  const newContent = content.replace(
    /from '\.\.\/\.\.\/\.\.\/\.\.\/layouts\//g,
    "from '../../../layouts/"
  );

  // Only write if content changed
  if (newContent !== content) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    fixedCount++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
