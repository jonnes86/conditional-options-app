# Quick Start Guide

Get your Conditional Options app running in 15 minutes!

## Step 1: Create Shopify App (5 min)

1. Go to https://partners.shopify.com/organizations
2. Click "Apps" → "Create app" → "Create app manually"
3. Name it "Conditional Options"
4. Save these credentials:
   - **API Key:** (copy this)
   - **API Secret:** (copy this)

## Step 2: Setup Railway Database (3 min)

1. Go to https://railway.app
2. New Project → "Provision PostgreSQL"
3. Click database → "Variables" tab
4. Copy the **DATABASE_URL**

## Step 3: Deploy to Railway (5 min)

### Option A: Using GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   cd conditional-options-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Railway:**
   - In Railway, click "New" → "GitHub Repo"
   - Select your repository
   - Railway will start deploying

3. **Add Environment Variables:**
   - Click your service → "Variables"
   - Add these variables:
     ```
     SHOPIFY_API_KEY=your_key_from_step_1
     SHOPIFY_API_SECRET=your_secret_from_step_1
     DATABASE_URL=your_postgres_url_from_step_2
     SCOPES=write_products,read_products,write_metaobjects,read_metaobjects
     NODE_ENV=production
     ```
   - Click "Deploy" to restart

4. **Get your Railway URL:**
   - Click "Settings" → "Domains"
   - Copy the generated URL (e.g., `https://your-app.up.railway.app`)

### Option B: Using Railway CLI

```bash
cd conditional-options-app
npm install -g @railway/cli
railway login
railway init
railway up
railway domain  # Get your URL
```

Add environment variables:
```bash
railway variables set SHOPIFY_API_KEY=your_key
railway variables set SHOPIFY_API_SECRET=your_secret
railway variables set DATABASE_URL=your_database_url
railway variables set SCOPES=write_products,read_products,write_metaobjects,read_metaobjects
railway variables set NODE_ENV=production
```

## Step 4: Configure Shopify App URLs (2 min)

1. Go back to Shopify Partner Dashboard
2. Open your app → "Configuration"
3. Set **App URL:** `https://your-railway-url.railway.app`
4. Set **Allowed redirect URLs:**
   ```
   https://your-railway-url.railway.app/auth/callback
   https://your-railway-url.railway.app/auth/shopify/callback
   https://your-railway-url.railway.app/api/auth/callback
   ```
5. Click "Save"

## Step 5: Install on Your Store

1. In Partner Dashboard → Your App → "Select store"
2. Choose your development store
3. Click "Install app"
4. Approve permissions

**Done! 🎉** Your app is now installed and ready to use.

---

## First-Time Setup

Once installed, here's what to do:

### 1. Create Your First Template

1. Open the app in your Shopify admin
2. Click "Create Template"
3. Add your options (e.g., Shirt Type, Size, Brand, Color)
4. Save

### 2. Add Rules

1. Click "Manage Rules" on your template
2. Create rules like:
   - When "Shirt Type" is "Crewneck" → Show "Adult, Youth" for "Size"
   - When "Size" is "Youth" → Show "Gildan" for "Brand"

### 3. Assign to Products

1. Click "Assign Products"
2. Select your template for each product

### 4. Add to Theme

1. Theme Editor → Product page
2. Add "Conditional Options" block
3. Save

**Your conditional options are now live!** 🚀

---

## Troubleshooting

### "App installation failed"
→ Check that redirect URLs match exactly (including https://)

### "Database connection error"
→ Verify DATABASE_URL is set correctly in Railway variables

### "Options not showing"
→ Make sure you've:
- Assigned a template to the product
- Added the app block to your theme
- Saved your rules

### Need help?
Check the full README.md for detailed troubleshooting steps.
