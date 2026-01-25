const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Counters
let zhFixed = 0;
let msFixed = 0;

// Translation mappings for ALL English sections
const translations = {
  zh: {
    // Headings
    "Why This Matters for Melaka Airbnb Investors": "这对马六甲Airbnb投资者为何重要",
    "Key Insights": "关键见解",
    "iHousing Advantage": "iHousing优势",
    "Performance Metrics": "绩效指标",
    "Invest with Confidence": "自信投资",
    "About the Author": "关于作者",
    "Related Articles": "相关文章",
    "Table of Contents": "目录",

    // Key Insights bullets
    "Local Market Knowledge": "本地市场知识",
    "8 years in Melaka Airbnb market": "马六甲Airbnb市场8年经验",
    "Data-Driven Results": "数据驱动结果",
    "60%+ average occupancy rate": "60%+平均入住率",
    "Proven Strategies": "经过验证的策略",
    "Tactics that deliver real revenue": "带来真实收入的策略",
    "Professional Management": "专业管理",
    "24/7 support, 5 platforms": "24/7支持，5个平台",

    // iHousing Advantage subsections
    "5-Platform Listing": "5平台listing",
    "Airbnb, Booking.com, Agoda, VRBO, Expedia - 60% more bookings than single-platform managers.": "在Airbnb、Booking.com、Agoda、VRBO、Expedia上发布 - 比单平台管理商多60%的预订。",
    "In-House Cleaning": "内部清洁团队",
    "No outsourcing markups. Consistent quality. Fast turnover.": "无外包加价。质量一致。快速周转。",
    "Transparent Pricing": "透明定价",
    "Parkland Avenue: RM200-300/month flat fee. No hidden charges.": "Parkland Avenue：RM200-300/月固定费用。无隐藏费用。",
    "24/7 Communication": "24/7沟通",
    "Response within 30 minutes. English, Malay, Chinese support.": "30分钟内响应。英语、马来语、中文支持。",

    // Table headers
    "Metric": "指标",
    "Market Average": "市场平均",
    "iHousing": "iHousing",
    "Occupancy Rate": "入住率",
    "Response Time": "响应时间",
    "Guest Rating": "客人评分",

    // Table data
    "35-45%": "35-45%",
    "60-70%": "60-70%",
    "2-4 hours": "2-4小时",
    "<30 minutes": "<30分钟",
    "4.5-4.7": "4.5-4.7",
    "4.8-5.0": "4.8-5.0",

    // Footer sections
    "iHousing provides expert guidance for your Melaka Airbnb investment.": "iHousing为您的马六甲Airbnb投资提供专业指导。",
    "WhatsApp:": "WhatsApp：",
    "8 Years Experience. 100+ Properties. 60%+ Occupancy.": "8年经验。100+房产。60%+入住率。",
    "Updated February 2026 from actual portfolio data.": "根据实际投资组合数据更新于2026年2月。",
    "Updated January 2026 from actual portfolio data.": "根据实际投资组合数据更新于2026年1月。",
  },

  ms: {
    // Headings
    "Why This Matters for Melaka Airbnb Investors": "Mengapa Ini Penting untuk Pelabur Airbnb Melaka",
    "Key Insights": "Panduan Utama",
    "iHousing Advantage": "Kelebihan iHousing",
    "Performance Metrics": "Metrik Prestasi",
    "Invest with Confidence": "Labur dengan Yakin",
    "About the Author": "Tentang Penulis",
    "Related Articles": "Artikel Berkaitan",
    "Table of Contents": "Isi Kandungan",

    // Key Insights bullets
    "Local Market Knowledge": "Pengetahuan Pasaran Tempatan",
    "8 years in Melaka Airbnb market": "8 tahun dalam pasaran Airbnb Melaka",
    "Data-Driven Results": "Keputusan Berdasarkan Data",
    "60%+ average occupancy rate": "Kadar okupansi purata 60%+",
    "Proven Strategies": "Strategi Terbukti",
    "Tactics that deliver real revenue": "Taktik yang memberikan pendapatan sebenar",
    "Professional Management": "Pengurusan Profesional",
    "24/7 support, 5 platforms": "Sokongan 24/7, 5 platform",

    // iHousing Advantage subsections
    "5-Platform Listing": "Penyenaraian 5 Platform",
    "Airbnb, Booking.com, Agoda, VRBO, Expedia - 60% more bookings than single-platform managers.": "Airbnb, Booking.com, Agoda, VRBO, Expedia - 60% lebih tempahan berbanding pengurus satu platform.",
    "In-House Cleaning": "Pembersihan Dalaman",
    "No outsourcing markups. Consistent quality. Fast turnover.": "Tiada markup外包. Kualiti konsisten. Pusingan pantas.",
    "Transparent Pricing": "Harga Telus",
    "Parkland Avenue: RM200-300/month flat fee. No hidden charges.": "Parkland Avenue: yuran rata RM200-300/bulan. Tiada caj tersembunyi.",
    "24/7 Communication": "Komunikasi 24/7",
    "Response within 30 minutes. English, Malay, Chinese support.": "Respons dalam 30 minit. Sokongan Bahasa Inggeris, Melayu, Cina.",

    // Table headers
    "Metric": "Metrik",
    "Market Average": "Purata Pasaran",
    "iHousing": "iHousing",
    "Occupancy Rate": "Kadar Okupansi",
    "Response Time": "Masa Respons",
    "Guest Rating": "Rating Tetamu",

    // Table data
    "35-45%": "35-45%",
    "60-70%": "60-70%",
    "2-4 hours": "2-4 jam",
    "<30 minutes": "<30 minit",
    "4.5-4.7": "4.5-4.7",
    "4.8-5.0": "4.8-5.0",

    // Footer sections
    "iHousing provides expert guidance for your Melaka Airbnb investment.": "iHousing menyediakan panduan pakar untuk pelaburan Airbnb Melaka anda.",
    "WhatsApp:": "WhatsApp:",
    "8 Years Experience. 100+ Properties. 60%+ Occupancy.": "8 Tahun Pengalaman. 100+ Hartanah. Okupansi 60%+.",
    "Updated February 2026 from actual portfolio data.": "Dikemaskini Februari 2026 dari data portfolio sebenar.",
    "Updated January 2026 from actual portfolio data.": "Dikemaskini Januari 2026 dari data portfolio sebenar.",
  }
};

console.log('🔧 Starting comprehensive language fix...\n');

// Find all blog posts
const blogFiles = glob.sync('src/pages/*/blog/**/index.astro');

blogFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Determine language
  let language = '';
  if (normalizedPath.includes('/zh/blog/')) {
    language = 'zh';
  } else if (normalizedPath.includes('/ms/blog/')) {
    language = 'ms';
  } else {
    return; // Skip EN posts
  }

  let modifiedContent = content;
  let hasChanges = false;

  // Apply all translations for this language
  const langTranslations = translations[language];

  for (const [english, translated] of Object.entries(langTranslations)) {
    // Escape special regex characters
    const escapedEnglish = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create regex for global replacement
    const regex = new RegExp(escapedEnglish, 'g');

    if (regex.test(modifiedContent)) {
      modifiedContent = modifiedContent.replace(regex, translated);
      hasChanges = true;
    }
  }

  // Write back if changed
  if (hasChanges) {
    fs.writeFileSync(filePath, modifiedContent, 'utf8');

    if (language === 'zh') {
      zhFixed++;
      console.log(`✅ Fixed ZH: ${filePath}`);
    } else if (language === 'ms') {
      msFixed++;
      console.log(`✅ Fixed MS: ${filePath}`);
    }
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 COMPREHENSIVE FIX SUMMARY');
console.log('='.repeat(70));
console.log(`✅ Chinese (ZH) posts fixed: ${zhFixed}`);
console.log(`✅ Malay (MS) posts fixed: ${msFixed}`);
console.log(`📝 Total posts processed: ${blogFiles.length}`);
console.log('='.repeat(70));

if (zhFixed > 0 || msFixed > 0) {
  console.log('\n✨ All English sections have been translated!');
  console.log('📋 Next: Commit changes and sync to separate repos');
}
