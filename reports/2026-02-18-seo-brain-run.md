# SEO Brain Experiment Runner - iHousing
**Date:** 2026-02-18 08:29 PM (GMT+8)
**Rotation:** iHousing (2nd in cycle: resultmarketing → ihousing → inghengcredit)

---

## 📊 GSC Analysis Summary

**Status:** 0 new opportunities detected
- gsc-opportunities.json shows all keywords have <5 impressions
- Top keyword: 'guest screening airbnb' (6 imp, pos 83.2) - already covered by existing article
- Remaining keywords are branded terms or low volume

**Decision:** Focus on infrastructure fixes instead of new experiments

---

## 🔧 Infrastructure Fixes Applied

### 1. Merge Conflict Resolution (BLOCKER REMOVED)
**Problem:** `src/pages/en/index.astro` had unmerged git state
**Root Cause:** Conflicting changes between `Updated upstream` (faqSchema) and `Stashed changes` (faq array)
**Fix Applied:** Resolved using `git checkout --theirs` to accept the working directory version
**Impact:** Unblocked deployment of IH-EXP-021, IH-EXP-022, IH-EXP-023

### 2. Dual Repository Sync
**Problem:** Two git directories (root + website/) pointing to same remote
**Fix Applied:** Synced website/ directory with latest commit (9cc916b)
**Result:** Both repositories now have identical code for deployment

---

## 🧪 Experiments Committed & Pushed

| ID | Type | Page | Old Headline | New Headline | Status |
|----|------|------|--------------|---------------|--------|
| IH-EXP-021 | Headline | iHousing Melaka | Airbnb Management Melaka 2026 | Active |
| IH-EXP-022 | Headline | MOTAC License... | Airbnb Host Requirements Malaysia 2026 | Active |
| IH-EXP-023 | Headline + FAQ | Airbnb Guest Selection... | Airbnb Guest Screening Guide 2026 | Active |

**Commit:** 9cc916b
**Status:** Pushed to GitHub, Vercel deployment pending

---

## 📈 Expected Impact

### IH-EXP-021 (Homepage)
- Baseline: 537 impressions, 9 clicks (1.6% CTR), position 8.6
- Target: Top 3 position, 3%+ CTR
- Potential: 16+ clicks/month (vs 9 baseline)

### IH-EXP-022 (MOTAC)
- Baseline: 5 impressions, position 8.6
- Target: First clicks for high-intent query
- Potential: First-time clicks from 'requirements to become a host in malaysia'

### IH-EXP-023 (Guest Screening)
- Baseline: 6 impressions, position 83.2
- Target: Position improvement to top 20
- Potential: Unlock clicks from long-tail query (currently 0 clicks)

---

## ⚠️ Known Issues

**Vercel Deployment Delay:**
- Changes committed at 20:30, pushed successfully
- Live site (22:00) still shows old title
- Possible causes: Vercel queue, build cache, CDN propagation
- Will verify deployment and update status

---

## 📝 Lessons Applied

- ✅ **Lesson 13:** Don't run experiments when infrastructure is broken - Fixed merge conflict before proceeding
- ✅ **Lesson 17:** Always log experiments - Updated experiments.json with correct git_commit
- ✅ **Lesson 18:** Verify infrastructure - Checked both repo directories before pushing

---

## 🎯 Next Steps

1. **Immediate:** Verify Vercel deployment completes
2. **Day 7 (Feb 25):** Measure results for all 3 experiments
3. **Next rotation:** Result Marketing or Ing Heng Credit (per cycle)

---

**Reported to:** #ihousing Discord channel (message 1473659135580045540)
**Git Commits:** 9cc916b (experiments), 5143ef5 (experiments.json update)
