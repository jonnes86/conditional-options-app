# Deployment Checklist ✅

Print this out and check off each step as you go!

## Pre-Deployment

- [ ] I have a Shopify Partner account
- [ ] I have a Railway account  
- [ ] I have Node.js 18+ installed
- [ ] I have Git installed

## Step 1: Shopify App Setup

- [ ] Created new app in Partner Dashboard
- [ ] Saved API Key: ________________
- [ ] Saved API Secret: ________________
- [ ] App name: "Conditional Options"

## Step 2: Database Setup

- [ ] Created PostgreSQL in Railway
- [ ] Copied DATABASE_URL: ________________

## Step 3: Code Deployment

### Option A: GitHub (Recommended)
- [ ] Pushed code to GitHub repo
- [ ] Connected repo to Railway
- [ ] Railway started deploying

### Option B: Railway CLI
- [ ] Installed Railway CLI
- [ ] Ran `railway login`
- [ ] Ran `railway init`
- [ ] Ran `railway up`

## Step 4: Environment Variables

In Railway, added all variables:
- [ ] SHOPIFY_API_KEY
- [ ] SHOPIFY_API_SECRET
- [ ] DATABASE_URL (auto-set if using Railway DB)
- [ ] SCOPES=write_products,read_products,write_metaobjects,read_metaobjects
- [ ] NODE_ENV=production

## Step 5: Get Railway URL

- [ ] Found URL in Railway settings
- [ ] My URL: https://________________.railway.app

## Step 6: Configure Shopify

In Partner Dashboard:
- [ ] Set App URL: https://your-url.railway.app
- [ ] Added redirect URLs:
  - [ ] https://your-url.railway.app/auth/callback
  - [ ] https://your-url.railway.app/auth/shopify/callback
  - [ ] https://your-url.railway.app/api/auth/callback
- [ ] Clicked Save

## Step 7: Install App

- [ ] Clicked "Select store" in Partner Dashboard
- [ ] Chose my development store
- [ ] Clicked "Install app"
- [ ] Approved permissions
- [ ] App appeared in store admin

## Step 8: First Template

- [ ] Opened app in Shopify admin
- [ ] Created first template
- [ ] Added options and values
- [ ] Clicked Save

## Step 9: Add Rules

- [ ] Clicked "Manage Rules"
- [ ] Added conditional rules
- [ ] Tested rules make sense
- [ ] Saved

## Step 10: Assign Products

- [ ] Went to "Assign Products"
- [ ] Selected template for products
- [ ] Confirmed assignments saved

## Step 11: Theme Integration

- [ ] Opened theme editor
- [ ] Went to product page
- [ ] Added "Conditional Options" block
- [ ] Positioned it correctly
- [ ] Saved theme

## Step 12: Testing

- [ ] Viewed product page on storefront
- [ ] Options appeared correctly
- [ ] Selected first option
- [ ] Second option filtered correctly
- [ ] Tested all rules
- [ ] Works on mobile

## 🎉 Launch!

- [ ] Conditional options are live
- [ ] Tested with real customer flow
- [ ] Ready to launch

---

## If Something Went Wrong

### App won't install
→ Double-check redirect URLs match exactly

### Database errors
→ Verify DATABASE_URL in Railway

### Options not showing
→ Check:
1. Template assigned to product?
2. App block added to theme?
3. Rules saved correctly?

### Still stuck?
→ Check OVERVIEW.md for detailed troubleshooting

---

## Post-Launch

- [ ] Monitor Railway logs for errors
- [ ] Test with real customers
- [ ] Gather feedback
- [ ] Customize styling if needed

**Time to completion:** 15-20 minutes

**You've got this! 💪**
