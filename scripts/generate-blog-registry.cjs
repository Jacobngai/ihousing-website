const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const blogDirs = [
  { lang: 'en', dir: 'src/pages/en/blog' },
  { lang: 'ms', dir: 'src/pages/ms/blog' },
  { lang: 'zh', dir: 'src/pages/zh/blog' },
];

const blogPosts = {
  en: [],
  ms: [],
  zh: [],
};

blogDirs.forEach(({ lang, dir }) => {
  const folders = globSync(`${dir}/*/index.astro`);

  folders.forEach(folderPath => {
    const content = fs.readFileSync(folderPath, 'utf-8');

    // Extract title
    const titleMatch = content.match(/const title = ["'](.+?)["']/);
    const title = titleMatch ? titleMatch[1] : 'Blog Post';

    // Extract description
    const descMatch = content.match(/const description = ["'](.+?)["']/);
    const description = descMatch ? descMatch[1] : '';

    // Extract date
    const dateMatch = content.match(/const date = ["'](\d{4}-\d{2}-\d{2})["']/);
    const date = dateMatch ? dateMatch[1] : '2026-01-01';

    // Extract category
    const catMatch = content.match(/const category = ["'](.+?)["']/);
    const category = catMatch ? catMatch[1] : 'investment';

    // Extract image
    const imgMatch = content.match(/const image = ["'](.+?)["']/);
    const image = imgMatch ? imgMatch[1] : undefined;

    // Extract slug from path - just the folder name, not the full path
    const slug = folderPath.replace(/^.*[\/\\]([^\/\\]+)[\/\\]index\.astro$/, '$1');

    blogPosts[lang].push({
      slug,
      title,
      description,
      date,
      category,
      language: lang,
      image,
    });
  });
});

// Sort by date
Object.keys(blogPosts).forEach(lang => {
  blogPosts[lang].sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Write to TypeScript file
const outputFile = path.join(__dirname, '../src/data/blog-posts.ts');
const output = `// Auto-generated blog posts registry
// Generated: ${new Date().toISOString()}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  language: string;
  image?: string;
}

export const enBlogPosts: BlogPost[] = ${JSON.stringify(blogPosts.en, null, 2)};

export const msBlogPosts: BlogPost[] = ${JSON.stringify(blogPosts.ms, null, 2)};

export const zhBlogPosts: BlogPost[] = ${JSON.stringify(blogPosts.zh, null, 2)};
`;

fs.writeFileSync(outputFile, output, 'utf-8');

console.log(`✅ Generated blog registry with ${blogPosts.en.length} EN, ${blogPosts.ms.length} MS, ${blogPosts.zh.length} ZH posts`);
