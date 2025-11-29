# Product Dashboard

A modern React SPA that lets operations users explore the products catalog from [dummyjson.com](https://dummyjson.com/products). The app will include a paginated inventory table, rich filtering/search, sorting, and a detail view with thoughtful loading/error UX.

This repo focuses on clarity of architecture, predictable data-fetching, and accessibility-first UI primitives so the assessment can scale if more time is granted.

## Stack & Tooling

- **React 19 + TypeScript** (Vite build)
- **React Router v6** for `/products` & `/product/:id`
- **TanStack Query** for caching, pagination, and refetch-on-focus
- **Tailwind CSS + Headless primitives** for consistent, accessible styling
- **Prettier + ESLint** with strict TS config and path aliases (`@/*`)

## Getting Started

```bash
npm install

npm run dev        # local dev server
npm run lint       # ESLint + TypeScript rules
npm run typecheck  # isolated TS diagnostics
npm run format     # Prettier + tailwind-sorted classes
npm run build      # production bundle
npm run preview    # preview build locally
```

## Project Map:The layout we’ve converged on is essentially a feature-sliced React architecture (sometimes called “feature-first” or “layered by domain”). Key traits:

```
src/
 ├─ app/                 # Router + global providers
 ├─ shared/
 │   ├─ layout/          # Shell, skip link, page headers
 │   └─ ui/              # Reusable primitives (button, input, card…)
 ├─ features/
 │   └─ products/
 │        ├─ data/       # Fetch layer + TanStack Query factories
 │        ├─ components/ # Feature-specific UI (filters, pagination)
 │        ├─ routes/     # /products and /product/:id screens
 │        ├─ hooks/      # URL-synced filter state, etc.
 │        ├─ constants.ts
 │        └─ types.ts
 └─ lib/                 # Query client + utilities (e.g., cn helper)
```

- The **products feature** ships with strongly typed fetchers (`fetchProducts`, `fetchProduct`) plus query helper factories. These plug directly into TanStack Query with stable cache keys and `keepPreviousData` pagination support.
- **UI primitives** (`Button`, `Card`, `Input`, etc.) encapsulate focus states, disabled behavior, and Tailwind tokens so pages stay lean and accessible.
- **App layout** provides skip-links, responsive shell, and consistent spacing so each page can focus on its own logic.

## Current Status

- ✅ Scaffolded project with routing, global providers, and shared design system tokens.
- ✅ Basic data fetch wired on `/products` and `/product/:id` so we can iterate on UX with real data.
- ⏳ Upcoming: full table implementation with pagination, search, filters, and sort; enriched detail screen with charts & actions; optional auth mock + form + tests.

## Next Steps & Enhancements

1. Build the paginated table UI (10 items/page) with URL-synced query params.
2. Layer in brand/category/price filters, fuzzy search, and sort by `meta.createdAt`.
3. Design empty/loading/error experiences (retry, skeletons, offline messaging).
4. Expand detail page with gallery, KPI tiles, and optional trend micro-chart.
5. Stretch: add create-product form (client-side validation), mock auth gate, and RTL coverage for critical flows.

Deployment will target Netlify once the core flows are complete, with the README updated to include environment URLs and trade-off notes.
