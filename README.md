# Conditional Options Shopify App

A custom Shopify app that enables conditional product option logic. Create dynamic option flows where subsequent options filter based on previous selections.

## Example Use Case

**Shirt Store:**
- When "Crewneck" is selected → Only show "Youth" sizes
- When "Youth" is selected → Only show "Gildan" brand
- When "Gildan" is selected → Only show available Gildan colors

## Features

- 📋 Create reusable option templates
- 🔀 Define conditional logic rules
- 🏷️ Assign templates to multiple products
- 🎨 Storefront widget with dynamic filtering
- 💾 PostgreSQL database for reliable storage

## Tech Stack

- **Backend:** Remix + Shopify App Bridge
- **Database:** PostgreSQL (Railway)
- **Frontend:** Shopify Polaris
- **Deployment:** Railway

---

## Setup Instructions

### 1. Prerequisites

- Shopify Partner Account
- Railway Account (with PostgreSQL database)
- Node.js 18+ installed locally

### 2. Create Shopify App

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Click "Apps" → "Create app" → "Create app manually"
3. Enter app name: "Conditional Options"
4. Click "Create app"
5. Note your **API key** and **API secret**

### 3. Setup Railway Database

1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy the `DATABASE_URL` from database settings

### 4. Clone and Configure

```bash
# Navigate to the app directory
cd conditional-options-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Update `.env` with:
```
SHOPIFY_API_KEY=your_api_key_from_step_2
SHOPIFY_API_SECRET=your_api_secret_from_step_2
DATABASE_URL=your_railway_postgres_url
SHOPIFY_APP_URL=https://your-app.railway.app  # Will update after deployment
SCOPES=write_products,read_products,write_metaobjects,read_metaobjects
```

### 5. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### 6. Deploy to Railway

#### Option A: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy
railway up
```

#### Option B: GitHub Integration

1. Push code to GitHub
2. In Railway, connect your GitHub repo
3. Railway will auto-deploy

### 7. Configure Shopify App URLs

After deployment, get your Railway URL (e.g., `https://your-app.railway.app`)

1. Go back to Shopify Partner Dashboard
2. Open your app settings
3. Under "App URL", enter: `https://your-app.railway.app`
4. Under "Allowed redirection URL(s)", add:
   - `https://your-app.railway.app/auth/callback`
   - `https://your-app.railway.app/auth/shopify/callback`
   - `https://your-app.railway.app/api/auth/callback`
5. Save

Update your `.env` and redeploy:
```bash
SHOPIFY_APP_URL=https://your-app.railway.app
railway up
```

### 8. Install App on Your Store

1. In Shopify Partner Dashboard, click your app
2. Click "Select store" → Choose your development store
3. Click "Install app"
4. Approve permissions

---

## Usage Guide

### Creating Your First Template

1. **Open the app** in your Shopify admin
2. **Click "Create Template"**
3. **Add template details:**
   - Name: "Shirt Options"
   - Description: "Conditional options for shirts"

4. **Add options:**
   
   **Option 1: Shirt Type**
   - Values: Shirt, Sweatshirt, Crewneck
   
   **Option 2: Size Type**
   - Values: Adult, Toddler, Youth
   
   **Option 3: Brand**
   - Values: B+C, Comfort Colors, Gildan
   
   **Option 4: Color**
   - Values: Black, White, Natural, Pepper

5. **Click Save**

### Setting Up Rules

1. **Click "Manage Rules"** on your template
2. **Add rules:**

   **Rule 1:**
   - When "Shirt Type" is "Crewneck"
   - Then "Size Type" shows: Adult, Youth

   **Rule 2:**
   - When "Size Type" is "Youth"
   - Then "Brand" shows: Gildan

   **Rule 3:**
   - When "Brand" is "Gildan"
   - Then "Color" shows: Black, White

3. **Add as many rules as needed**

### Assigning to Products

1. **Click "Assign Products"** in the app menu
2. **Select a template** for each product from the dropdown
3. The template is now active for that product

### Adding to Your Theme

1. **Go to your Shopify theme editor**
2. **Navigate to a product page**
3. **Click "Add section"** or "Add block"
4. **Find "Conditional Options"** under App blocks
5. **Add it** to your product page template
6. **Save**

The conditional options will now appear on your product pages!

---

## Development

### Local Development

```bash
# Run the app locally
npm run dev
```

This will start:
- Remix server at `http://localhost:8002`
- Shopify CLI tunnel for testing

### Database Management

```bash
# View database in browser
npx prisma studio

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database (careful!)
npx prisma migrate reset
```

---

## Project Structure

```
conditional-options-app/
├── app/
│   ├── routes/
│   │   ├── app._index.jsx          # Template list
│   │   ├── app.templates.$id.jsx   # Template editor
│   │   ├── app.templates.$id.rules.jsx  # Rules manager
│   │   ├── app.products.jsx        # Product assignment
│   │   └── api.template.jsx        # Storefront API
│   ├── shopify.server.js           # Shopify config
│   └── db.server.js                # Database client
├── extensions/
│   └── conditional-options/
│       └── blocks/
│           └── conditional-options.liquid  # Storefront widget
├── prisma/
│   └── schema.prisma               # Database schema
└── package.json
```

---

## Troubleshooting

### App won't install
- Check that redirect URLs match exactly in Partner Dashboard
- Verify SHOPIFY_APP_URL in .env matches your Railway URL

### Database errors
- Run `npx prisma generate` after any schema changes
- Check DATABASE_URL is correct
- Run `npx prisma db push` to sync schema

### Options not showing on storefront
- Ensure you've added the app block to your theme
- Check that a template is assigned to the product
- Verify product ID in browser console

### Rules not working
- Confirm rules are saved in the Rules manager
- Check browser console for JavaScript errors
- Ensure option values match exactly

---

## Support

For issues or questions:
1. Check the Shopify App documentation: https://shopify.dev/docs/apps
2. Review Prisma docs: https://www.prisma.io/docs
3. Check Railway docs: https://docs.railway.app

---

## License

MIT License - Customize this app as needed for your store.
