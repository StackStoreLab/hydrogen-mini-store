# Hydrogen Mini Store

A small Shopify Hydrogen (React Router 7) storefront built on Shopify's demo data (mock.shop).

## Pages
- **Home** – header with logo, navigation and cart icon (live item count), hero banner, featured products grid
- **Collection** – product grid (image, title, price) with sorting: featured, price low → high, price high → low (`?sort=`), paginated
- **Product** – image gallery, title, price, description, variant selector that updates price and image, Add to cart
- **Cart** – slide-out drawer (and `/cart` page): change quantity, remove items, subtotal, Checkout button to Shopify checkout

Fully responsive, no CSS framework (plain CSS in `app/styles/app.css`).

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```
Requires Node 18+.

## Build / deploy
```bash
npm run build                         # production build
npx shopify hydrogen deploy           # deploy to Shopify Oxygen
```

## Data source
The store reads products from **mock.shop** by default (`app/lib/context.ts`).
To connect your own Shopify store, link the project (`npx shopify hydrogen link`) and set the
environment variable `USE_MOCK_SHOP=false`.

## Project structure
```
app/
  components/   Header, Footer, ProductItem, ProductGrid, ProductGallery, ProductForm,
                SortSelect, Cart* (drawer, line items, summary), Aside (drawer shell)
  routes/       _index, collections.all, collections.$handle, collections._index,
                products.$handle, cart, cart.$lines
  lib/          context (mock.shop switch), fragments (GraphQL), sort, variants, session
  styles/       reset.css, app.css
```
