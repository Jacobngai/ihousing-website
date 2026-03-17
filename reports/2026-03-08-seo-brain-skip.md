# SEO Brain - iHousing
**Date:** 2026-03-08 07:45 AM (GMT+8)
**Status:** SKIP (GSC Permission Issue)

---

## Issue

Service account `gsc-seo-automation@alittlebetter-4fe58.iam.gserviceaccount.com` lacks permission for `sc-domain:ihousing.my`.

**Error:** `User does not have sufficient permission for site 'sc-domain:ihousing.my'`

## Action Required

Add the service account as a user to iHousing's Search Console property:
1. Go to https://search.google.com/search-console
2. Select ihousing.my property
3. Settings → Users and permissions
4. Add user: `gsc-seo-automation@alittlebetter-4fe58.iam.gserviceaccount.com`
5. Permission level: Full

## Active Experiments

| ID | Page | Check Date |
|----|------|------------|
| IH-EXP-083 | /en/blog/agoda-melaka-homestay-guide/ | Mar 11 |

---

**Reported to:** #ihousing Discord
