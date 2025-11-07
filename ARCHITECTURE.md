# App Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR SHOPIFY STORE                       │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │   Admin Panel    │              │  Product Pages   │    │
│  │  (Embedded App)  │              │  (Storefront)    │    │
│  └────────┬─────────┘              └────────┬─────────┘    │
└───────────┼──────────────────────────────────┼─────────────┘
            │                                   │
            │ OAuth/REST API                    │ HTTPS
            │                                   │
┌───────────▼───────────────────────────────────▼─────────────┐
│              CONDITIONAL OPTIONS APP                         │
│                  (Railway Deployment)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Remix Backend                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   Admin     │  │   API       │  │   Auth      │ │  │
│  │  │   Routes    │  │   Routes    │  │   Handler   │ │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │  │
│  │         │                 │                 │        │  │
│  │         └─────────────────┼─────────────────┘        │  │
│  │                           │                          │  │
│  │                    ┌──────▼──────┐                   │  │
│  │                    │   Prisma    │                   │  │
│  │                    │    ORM      │                   │  │
│  │                    └──────┬──────┘                   │  │
│  └───────────────────────────┼──────────────────────────┘  │
└──────────────────────────────┼─────────────────────────────┘
                               │
                               │ SQL
                               │
                    ┌──────────▼──────────┐
                    │   PostgreSQL DB     │
                    │    (Railway)        │
                    │                     │
                    │  ┌──────────────┐   │
                    │  │  Templates   │   │
                    │  │   Options    │   │
                    │  │    Rules     │   │
                    │  │   Products   │   │
                    │  └──────────────┘   │
                    └─────────────────────┘
```

## Data Flow

### Admin Flow (Template Creation)

```
Merchant
   │
   ├─> Opens app in Shopify admin
   │
   ├─> Creates template
   │     ├─> Name: "Shirt Options"
   │     ├─> Options: Shirt Type, Size, Brand, Color
   │     └─> Values: Crewneck, Youth, Gildan, etc.
   │
   ├─> Adds conditional rules
   │     ├─> IF Shirt Type = "Crewneck"
   │     └─> THEN Size shows: ["Adult", "Youth"]
   │
   ├─> Assigns to products
   │     └─> Product ID → Template ID
   │
   └─> Data saved to PostgreSQL
```

### Customer Flow (Storefront)

```
Customer visits product page
         │
         ├─> Page loads
         │
         ├─> JavaScript widget initializes
         │     ├─> Gets product ID from page
         │     └─> Gets shop domain
         │
         ├─> Fetches template via API
         │     GET /api/template?shop=X&productId=Y
         │     │
         │     └─> Returns: { template, options, rulesMap }
         │
         ├─> Renders first option dropdown
         │     └─> "Shirt Type: [Shirt | Sweatshirt | Crewneck]"
         │
         ├─> Customer selects "Crewneck"
         │     │
         │     └─> Rules engine activates
         │           ├─> Checks rules for "Crewneck"
         │           ├─> Filters next option
         │           └─> Enables "Size" dropdown
         │
         ├─> Shows filtered options
         │     └─> "Size: [Adult | Youth]"  (Toddler hidden)
         │
         ├─> Customer selects "Youth"
         │     │
         │     └─> Rules engine filters again
         │           └─> "Brand: [Gildan]"  (B+C, Comfort Colors hidden)
         │
         ├─> Customer selects "Gildan"
         │     │
         │     └─> Rules engine filters colors
         │           └─> "Color: [Black | White]"  (Natural, Pepper hidden)
         │
         └─> All options selected → Ready to add to cart
```

## Database Schema

```
OptionTemplate
├─ id
├─ shop
├─ name
├─ description
│
├─> Options (1:many)
│   ├─ id
│   ├─ name  ("Shirt Type", "Size", etc.)
│   ├─ position
│   │
│   └─> OptionValues (1:many)
│       ├─ id
│       ├─ value  ("Crewneck", "Youth", etc.)
│       ├─ label  (optional display name)
│       └─ position
│
├─> Rules (1:many)
│   ├─ id
│   ├─ fromOptionId     (e.g., "Shirt Type")
│   ├─ fromValueId      (e.g., "Crewneck")
│   ├─ toOptionId       (e.g., "Size")
│   └─> allowedValues   (e.g., ["Adult", "Youth"])
│
└─> ProductTemplates (1:many)
    ├─ productId
    └─ templateId
```

## Rule Evaluation Logic

```
function getAvailableValues(toOptionId) {
  allowedValues = null  // Start with no restrictions
  
  for each previousOption:
    if previousOption has selection:
      selectedValueId = selections[previousOption.id]
      
      // Look up rule
      ruleKey = "${previousOption.id}_${selectedValueId}_${toOptionId}"
      ruleAllowedValues = rulesMap[ruleKey]
      
      if rule exists:
        if allowedValues == null:
          allowedValues = ruleAllowedValues
        else:
          // Intersect with existing restrictions
          allowedValues = allowedValues ∩ ruleAllowedValues
  
  return allowedValues  // null = no restrictions, array = allowed values
}
```

## Component Hierarchy

### Admin Interface
```
App (Polaris Provider)
├─> Home Page (Template List)
│   └─> Template Cards
│
├─> Template Editor
│   ├─> Template Name/Description
│   ├─> Options Manager
│   │   └─> Option Values Editor
│   └─> Rules Link
│
├─> Rules Manager
│   ├─> Rule Builder
│   │   ├─> From Option Selector
│   │   ├─> From Value Selector
│   │   ├─> To Option Selector
│   │   └─> Allowed Values Checkboxes
│   └─> Existing Rules List
│
└─> Product Assignment
    └─> Product List with Template Dropdowns
```

### Storefront Widget
```
ConditionalOptionsWidget
├─> Template Loader (API fetch)
├─> Options Renderer
│   └─> For each option:
│       ├─> Label
│       ├─> Select Dropdown
│       │   └─> Filtered Values
│       └─> Change Handler
├─> Rules Engine
└─> Shopify Integration
```

## Deployment Architecture

```
Development Machine
       │
       ├─> git push
       │
       ▼
   GitHub Repository
       │
       ├─> Webhook
       │
       ▼
   Railway Platform
       │
       ├─> Build (npm install, build)
       ├─> Database Migration (prisma)
       ├─> Deploy (start server)
       │
       └─> Running App
            ├─> HTTPS endpoint
            ├─> Connected to PostgreSQL
            └─> Ready for Shopify
```

## Security Flow

```
User accesses app
    │
    ├─> Shopify redirects to app with session token
    │
    ├─> App validates token with Shopify
    │
    ├─> Creates/retrieves session from database
    │
    ├─> User authenticated
    │
    └─> All requests include shop context
          └─> Database queries scoped to shop
```

## API Endpoints

### Admin (Protected)
```
GET  /app                          → Template list
GET  /app/templates/new            → New template form
GET  /app/templates/:id            → Edit template
POST /app/templates/:id            → Save template
GET  /app/templates/:id/rules      → Manage rules
POST /app/templates/:id/rules      → Add/delete rule
GET  /app/products                 → Product assignment
POST /app/products                 → Assign template
```

### Storefront (Public)
```
GET  /api/template
     ?shop=X&productId=Y           → Get template for product
```

## File Organization

```
app/
├── routes/              ← All pages and API endpoints
│   ├── app._index.jsx           (Home)
│   ├── app.templates.$id.jsx    (Editor)
│   ├── app.templates.$id.rules.jsx  (Rules)
│   ├── app.products.jsx         (Assignment)
│   └── api.template.jsx         (API)
│
├── shopify.server.js    ← Shopify authentication
└── db.server.js         ← Database connection

prisma/
└── schema.prisma        ← Database models

extensions/
└── conditional-options/
    └── blocks/
        └── conditional-options.liquid  ← Storefront widget
```

## Technology Stack

```
Frontend (Admin)
├── Remix (React framework)
├── Shopify Polaris (UI components)
└── App Bridge (Shopify integration)

Frontend (Storefront)
├── Vanilla JavaScript
├── Liquid templating
└── CSS

Backend
├── Node.js
├── Remix (server-side rendering)
├── Shopify API (REST)
└── Express (HTTP server)

Database
├── PostgreSQL
├── Prisma ORM
└── Railway hosting

Deployment
├── Railway (platform)
├── GitHub (CI/CD)
└── Environment variables
```

## Performance Optimization

```
Caching Strategy:
├── Template data: Cache in browser (5 min)
├── Rules evaluation: Client-side (instant)
└── Product data: Shopify API cache

Database Indexes:
├── shop (for multi-tenancy)
├── productId (for fast lookups)
├── templateId (for joins)
└── Composite indexes on rules

Code Splitting:
├── Admin bundle: ~200kb
├── Storefront widget: ~10kb
└── Lazy-loaded components
```

---

This architecture provides:
✅ Scalability
✅ Security  
✅ Performance
✅ Maintainability
