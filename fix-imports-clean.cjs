const fs = require('fs');
const path = require('path');

// Get all .astro files
const { globSync } = require('glob');
const files = globSync('src/**/*.astro', { cwd: __dirname });

let fixedCount = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Normalize path to use forward slashes for matching
  const normalizedPath = file.replace(/\\/g, '/');

  // Calculate the depth from src/pages/{lang}/
  const match = normalizedPath.match(/src\/pages\/([^/]+)\/(.+)$/);

  if (match) {
    const lang = match[1]; // en, zh, or ms
    const rest = match[2]; // the rest of the path including file

    // Count directory depth: exclude the filename from the count
    // For "file.astro": 0 dirs, need 3 ../ to reach src/layouts/
    // For "blog/file.astro": 1 dir, need 4 ../ to reach src/layouts/
    // For "blog/post/file.astro": 2 dirs, need 5 ../ to reach src/layouts/
    const parts = rest.split('/').filter(p => p);
    // Don't count the filename (last part) as a directory
    const dirCount = parts.length > 0 ? parts.length - 1 : 0;
    const levelsNeeded = dirCount + 3; // 3 is base: pages/{lang}/ -> src/

    const relativePath = '../'.repeat(levelsNeeded) + 'layouts/';

    // Match ANY import statement with old path and replace with correct one
    const newContent = content.replace(
      /from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    ).replace(
      /from '\.\.\/\.\.\/\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    ).replace(
      /from '\.\.\/\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    ).replace(
      /from '\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    );

    // Only write if content changed
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      fixedCount++;
      if (fixedCount <= 10) {
        console.log(`Fixed (${parts.length} parts -> ${levelsNeeded} ../): ${file}`);
      }
    }
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
