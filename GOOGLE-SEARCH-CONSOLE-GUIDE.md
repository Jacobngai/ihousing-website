# Google Search Console Sitemap Submission Guide

**Last Updated:** 2026-01-25
**Property:** www.ihousing.net
**Sitemap URL:** https://www.ihousing.net/sitemap.xml

---

## 📋 Sitemap Overview

Your sitemap has been generated with **987 URLs**:

| Content Type | URLs | Sitemap |
|--------------|------|---------|
| Main pages | 27 | sitemap-main.xml |
| Blog posts | 960 | sitemap-blog-1.xml |
| **Total** | **987** | **2 sitemaps** |

---

## ✅ Step 1: Verify Sitemap is Accessible

Before submitting to Google, verify the sitemap is accessible:

1. **Open in browser:** https://www.ihousing.net/sitemap.xml
2. **Check individual sitemaps:**
   - https://www.ihousing.net/sitemaps/sitemap-main.xml
   - https://www.ihousing.net/sitemaps/sitemap-blog-1.xml

✅ **Expected:** XML files should display in browser with proper formatting

---

## ✅ Step 2: Add Property in Google Search Console

If you haven't already added your property:

1. Go to: https://search.google.com/search-console
2. Click "Add Property"
3. Select "URL prefix" option
4. Enter: `https://www.ihousing.net`
5. Verify ownership (choose one method):
   - **HTML file upload** (easiest)
   - **Google Analytics**
   - **Google Tag Manager**
   - **DNS record**

---

## ✅ Step 3: Submit Sitemap to Google Search Console

1. **Open your property:** https://search.google.com/search-console
2. **In left sidebar, click:** "Site Configuration" → "Sitemaps"
3. **In "Add a new sitemap" field, enter:** `sitemap.xml`
4. **Click:** "Submit"

✅ **Success message should appear:** "Sitemap was submitted successfully"

---

## ✅ Step 4: Monitor Indexing Status

After submission, monitor your sitemap status:

### Where to Check:
- **Sitemaps report:** Shows submitted and indexed URLs
- **Coverage report:** Shows which pages are indexed
- **URL Inspection:** Check specific pages

### What to Expect:
- **Initial crawl:** Google typically crawls within 24-48 hours
- **Full indexing:** May take 1-2 weeks for all URLs
- **Blog posts:** Higher priority (0.7) will be indexed faster
- **Main pages:** Highest priority (1.0) indexed immediately

---

## 📊 Sitemap Priority Levels

Your sitemap uses proper SEO priorities:

| Priority | Pages | Indexing Speed |
|----------|-------|----------------|
| 1.0 | Homepages (en, zh, ms) | Immediate |
| 0.9 | For Owners section | Fast (1-2 days) |
| 0.8 | Contact pages | Fast (1-2 days) |
| 0.7 | Blog posts & blog index | Moderate (3-7 days) |
| 0.6 | About pages | Moderate (3-7 days) |
| 0.5 | Other pages | Slower (7+ days) |

---

## 🔄 Updating Sitemap

When you add new content:

### Automatic Updates:
The sitemap is automatically regenerated during build:
```bash
npm run build:sitemaps
```

### When to Regenerate:
- After adding new blog posts
- After adding new pages
- Monthly (even if no changes) to update `lastmod` dates

### Regeneration Process:
1. Run: `npm run build:sitemaps`
2. Deploy to Vercel
3. **No need to resubmit** to Google (auto-discovers changes)

---

## 🔍 Troubleshooting

### Issue: Sitemap not accessible
**Solution:** Check Vercel deployment, ensure files are in `dist/` folder

### Issue: 0 URLs indexed
**Solution:**
- Check robots.txt allows Googlebot
- Verify property is added in Search Console
- Use "URL Inspection" tool to test specific URLs

### Issue: Coverage report shows errors
**Common causes:**
- 404 errors (broken links)
- 500 errors (server errors)
- Blocked by robots.txt
- Noindex tags on pages

---

## 📈 SEO Best Practices

Your sitemap follows Google's guidelines:

✅ **Valid XML format**
✅ **Proper URL structure** (with trailing slashes)
✅ **Appropriate priorities** (homepages = 1.0)
✅ **Change frequencies** (weekly for blog, monthly for static)
✅ **Last modification dates** (helps Google know freshness)
✅ **Under size limits** (960 URLs is well below 50K limit)
✅ **Sitemap index file** (organizes multiple sitemaps)

---

## 🚀 Next Steps After Submission

1. **Submit to Bing Webmaster Tools** (optional but recommended)
   - https://www.bing.com/webmasters
   - Same sitemap: https://www.ihousing.net/sitemap.xml

2. **Monitor "Performance" report**
   - See which queries bring traffic
   - Identify opportunities

3. **Check "Links" report**
   - See who links to your site
   - Find backlink opportunities

4. **Use "URL Inspection" tool**
   - Test specific blog posts
   - Request indexing for important pages
   - Check crawling issues

---

## 📞 Need Help?

If you encounter issues:

1. **Check Google's guide:** https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
2. **Verify sitemap validity:** Use online XML validators
3. **Test sitemap accessibility:** Should return HTTP 200, not 404
4. **Check robots.txt:** Should not block sitemap.xml

---

## 📝 Quick Reference

**Sitemap URL:** https://www.ihousing.net/sitemap.xml
**Robots.txt:** https://www.ihousing.net/robots.txt
**Build command:** `npm run build:sitemaps`
**Total URLs:** 987 (27 main + 960 blog)

---

**Last verified:** 2026-01-25
**Status:** ✅ Ready for Google Search Console submission
