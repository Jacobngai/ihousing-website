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

  // Normalize path to use forward slashes for matching
  const normalizedPath = file.replace(/\\/g, '/');

  // Calculate the depth from src/pages/
  const match = normalizedPath.match(/src\/pages\/([^/]+)\/(.+)$/);

  if (match) {
    const lang = match[1]; // en, zh, or ms
    const rest = match[2]; // the rest of the path

    // Count the depth by counting slashes in the rest path
    // The index.astro file itself is at the end, so we count folders before it
    const depth = rest.split('/').filter(p => p).length;

    // Determine how many ../ levels needed
    // src/pages/{lang}/{rest} to src/layouts/
    // If rest is just "file.astro", depth is 1, need 3 levels (../../..)
    // If rest is "blog/file.astro", depth is 2, need 4 levels (../../../../)
    // Formula: depth + 2 = number of ../ needed
    const levelsNeeded = depth + 2;
    const relativePath = '../'.repeat(levelsNeeded) + 'layouts/';

    // Replace any incorrect import path with the correct one
    newContent = content.replace(
      /from '\.\.\/\.\.\/\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    );
    newContent = newContent.replace(
      /from '\.\.\/\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    );
    newContent = newContent.replace(
      /from '\.\.\/\.\.\/layouts\//g,
      `from '${relativePath}`
    );

    // Only write if content changed
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      fixedCount++;
      console.log(`Fixed (${depth} levels -> ${levelsNeeded} ../): ${file}`);
    }
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
