#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying iHousing to 3 existing Vercel projects...\n');

const projects = [
  {
    name: 'ihousing-website',
    domain: 'www.ihousing.net',
    locale: 'en',
    localeName: 'English'
  },
  {
    name: 'ihousing-ms',
    domain: 'www.ihousing.me',
    locale: 'ms',
    localeName: 'Malay'
  },
  {
    name: 'ihousing-zh',
    domain: 'www.ihousing.biz',
    locale: 'zh',
    localeName: 'Chinese'
  }
];

projects.forEach((project, index) => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${index + 1}. DEPLOYING: ${project.name} (${project.localeName})`);
  console.log(`   Domain: ${project.domain}`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    // Remove .vercel directory to unlink
    console.log('   ⚙️  Unlinking existing project...');
    const vercelDir = path.join(process.cwd(), '.vercel');
    if (fs.existsSync(vercelDir)) {
      fs.rmSync(vercelDir, { recursive: true, force: true });
    }

    // Link to the specific project
    console.log(`   🔗 Linking to project: ${project.name}...`);
    execSync(
      `vercel link --yes --scope=ngsanzen-gmailcoms-projects --project ${project.name}`,
      {
        stdio: 'inherit',
        shell: true
      }
    );

    // Set environment variables
    console.log('   🔐 Setting environment variables...');
    const envVars = [
      { key: 'DEFAULT_LOCALE', value: project.locale },
      { key: 'PUBLIC_DEFAULT_LOCALE', value: project.locale },
      { key: 'SITE_URL', value: `https://${project.domain.replace('www.', '')}` },
      { key: 'PUBLIC_SITE_URL', value: `https://${project.domain.replace('www.', '')}` }
    ];

    envVars.forEach(envVar => {
      console.log(`      • ${envVar.key}=${envVar.value}`);
      try {
        execSync(
          `echo "${envVar.value}" | vercel env add "${envVar.key}" production --yes`,
          {
            stdio: 'pipe',
            shell: true
          }
        );
        console.log(`        ✓ Added`);
      } catch (e) {
        console.log(`        (already exists or failed: ${e.message.slice(0, 50)})`);
      }
    });

    // Deploy to production
    console.log(`   🚀 Deploying to production...`);
    execSync('vercel --prod --yes', {
      stdio: 'inherit',
      shell: true
    });

    console.log(`\n   ✅ ${project.name} deployed successfully!`);
    console.log(`      🌐 ${project.domain}/sitemap.xml\n`);

  } catch (error) {
    console.error(`\n   ❌ Error deploying ${project.name}:`, error.message);
    console.error('   Continuing with next project...\n');
  }
});

console.log('\n' + '='.repeat(70));
console.log('✅ DEPLOYMENT COMPLETE!');
console.log('='.repeat(70));
console.log('\n📋 Deployment Summary:');
console.log('  1. ihousing-website → www.ihousing.net (English only /en/)');
console.log('  2. ihousing-ms → www.ihousing.me (Malay only /ms/)');
console.log('  3. ihousing-zh → www.ihousing.biz (Chinese only /zh/)');
console.log('\n🌐 Verify sitemaps:');
console.log('  • https://www.ihousing.net/sitemap.xml');
console.log('  • https://www.ihousing.me/sitemap.xml');
console.log('  • https://www.ihousing.biz/sitemap.xml');
console.log('\n📝 Next: Submit each sitemap to Google Search Console separately.');
