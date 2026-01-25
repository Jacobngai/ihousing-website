const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Counters
let zhFixed = 0;
let msFixed = 0;
let enChecked = 0;

// English boilerplate pattern (with dynamic topic capture)
const englishPattern = /<p>With 8 years managing 100\+ properties in Melaka, iHousing brings proven expertise to maximize your investment\. This comprehensive guide explores ([\w\s\-:：]+) with real data and strategies\.<\/p>/g;

// Translations
const zhTranslation = `<p>凭借在马六甲管理100+房产的8年经验，iHousing带来专业知识以最大化您的投资。本综合指南探讨了$1，提供真实数据和策略。</p>`;

const msTranslation = `<p>Dengan 8 tahun pengurusan 100+ hartanah di Melaka, iHousing membawa kepakaran terbukti untuk memaksimumkan pelaburan anda. Panduan komprehensif ini meneroka$1 dengan data sebenar dan strategi.</p>`;

console.log('🔍 Scanning for mixed language blog posts...\n');

// Find all blog posts
const blogFiles = glob.sync('src/pages/*/blog/**/index.astro');

blogFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fullPath = path.resolve(filePath);

  // Determine language from path (handle both Windows \ and Unix / separators)
  const normalizedPath = filePath.replace(/\\/g, '/');
  let language = '';
  if (normalizedPath.includes('/zh/blog/')) {
    language = 'zh';
  } else if (normalizedPath.includes('/ms/blog/')) {
    language = 'ms';
  } else if (normalizedPath.includes('/en/blog/')) {
    language = 'en';
  }

  // Check if file has the English boilerplate
  if (englishPattern.test(content)) {
    console.log(`📝 Found mixed language in: ${filePath}`);

    if (language === 'zh') {
      // Fix Chinese posts
      const fixedContent = content.replace(englishPattern, zhTranslation);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      zhFixed++;
      console.log(`   ✅ Fixed (ZH)\n`);

    } else if (language === 'ms') {
      // Fix Malay posts
      const fixedContent = content.replace(englishPattern, msTranslation);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      msFixed++;
      console.log(`   ✅ Fixed (MS)\n`);

    } else if (language === 'en') {
      // English posts - this is expected, no fix needed
      enChecked++;
      console.log(`   ✓ Correctly in English (no fix needed)\n`);
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Chinese (ZH) posts fixed: ${zhFixed}`);
console.log(`✅ Malay (MS) posts fixed: ${msFixed}`);
console.log(`✓ English (EN) posts checked: ${enChecked} (no fix needed)`);
console.log(`📝 Total files processed: ${blogFiles.length}`);
console.log('='.repeat(60));
