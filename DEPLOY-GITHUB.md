# iHousing Website - GitHub & Vercel Setup

## Repository Created ✅

**GitHub URL:** https://github.com/Jacobngai/ihousing-website

**Status:** Pushed and ready for deployment

---

## Vercel Auto-Deployment Setup

Since the Vercel CLI has path issues with spaces in the directory, let's set up auto-deployment through the Vercel dashboard:

### Option 1: Quick Setup (Recommended)

1. **Go to Vercel:** https://vercel.com/new
2. **Import GitHub Repository:**
   - Click "Import Git Repository"
   - Search for: `ihousing-website`
   - Select: `Jacobngai/ihousing-website`
3. **Configure Project:**
   - **Project Name:** `ihousing-website`
   - **Framework Preset:** `Astro`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:** (add these)
   ```
   PUBLIC_SITE_URL=https://your-domain.com
   SITE_URL=https://your-domain.com
   ```
5. **Deploy:** Click "Deploy"

### Option 2: Using Vercel CLI (If path issues are fixed)

```bash
cd "C:\Users\walte\ing heng credit\ing-heng-credit-seo\clients\ihousing\website"

# Remove existing Vercel config
rm -rf .vercel .env.local

# Deploy to production
vercel --prod
```

---

## After Deployment

Once deployed, Vercel will automatically redeploy whenever you push to GitHub:

```bash
git add .
git commit -m "your changes"
git push origin master
```

Vercel will detect the push and automatically deploy!

---

## What's Deployed

✅ **Multi-language website** (EN, ZH, MS)
✅ **Contact form with lead tracking**
✅ **700+ properties** (accurate stats)
✅ **No 24/7 claims** (honest messaging)
✅ **Blog system** with 240+ posts
✅ **Parkland Avenue integration**
✅ **Responsive design**

---

**Next Steps:**
1. Deploy to Vercel using the dashboard
2. Test all contact forms
3. Set up custom domain (optional)
4. Enable auto-deployment (automatic with GitHub integration)
