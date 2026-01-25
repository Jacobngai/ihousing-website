const fs = require('fs');
const path = require('path');

// Get all .astro files
const { globSync } = require('glob');
const files = globSync('src/**/*.astro', { cwd: __dirname });

let fixedCount = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Replace all relative imports with absolute @/ imports
  const newContent = content.replace(
    /from '(\.\.\/)+layouts\//g,
    "from '@/layouts/"
  ).replace(
    /from "(\.\.\/)+layouts\//g,
    'from "@/layouts/"'
  );

  // Only write if content changed
  if (newContent !== content) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    fixedCount++;
    if (fixedCount <= 10) {
      console.log(`Fixed: ${file}`);
    }
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
