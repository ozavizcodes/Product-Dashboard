# Product Dashboard by Faith Abraham

A modern React SPA that lets operations users explore the products catalog from [dummyjson.com](https://dummyjson.com/products). Built with a focus on clarity of architecture, predictable data-fetching, accessibility-first UI primitives, and thoughtful UX patterns.



## Features

### Core Requirements (All Implemented)

- **Product List Page** (`/products`)
  - Pagination: 10 products per page with URL-synced state
  - Text search by product title and brand
  - Filters: Brand and Category dropdowns
  - Sorting: Newest/Oldest by `meta.createdAt`
  - Row click navigation to detail page
  - Keyboard accessible (Enter/Space to navigate)

- **Product Detail Page** (`/product/:id`)
  - Displays all core fields: title, description, price, rating, stock, brand, category, createdAt
  - Thoughtful loading states with skeleton UI
  - Error handling with retry functionality
  - Back navigation to products list

- **Data Fetching & Caching**
  - TanStack Query with 30s stale time
  - Refetch on window focus/reconnect
  - Optimistic cache updates for new products
  - `keepPreviousData` for smooth pagination

- **Accessibility**
  - Semantic HTML throughout
  - Keyboard navigation support
  - ARIA labels and roles
  - Focus-visible states
  - Skip link to main content

- **Responsiveness**
  - Mobile-first design
  - Responsive table with horizontal scroll on small screens
  - Touch-friendly interactive elements

### Stretch Goals (Implemented)

-  **Authentication System**
  - Mock login page with token storage in localStorage
  - Protected routes (`/products`, `/product/:id`)
  - Public route redirects (authenticated users can't access `/login`)
  - Logout functionality in header
  - Auth persistence across page refreshes

-  **Create Product Form** (`/products/new`)
  - Client-side validation with clear error messages
  - Form fields: title, description, price, stock, brand, category
  - Optimistic cache updates (new product appears immediately)
  - Default thumbnail images for new products
  - Accessible form controls with ARIA labels

- **Testing Infrastructure**
  - Vitest + React Testing Library setup
  - Custom test utilities with React Query and Router providers
  - Example tests for Button and FilterBar components (10 tests passing)
  - Test scripts: `npm test`, `npm run test:run`, `npm run test:ui`

##Stack & Tooling

- **React 19 + TypeScript** (Vite build)
- **React Router v6** for client-side routing
- **TanStack Query v5** for data fetching, caching, and mutations
- **Tailwind CSS 3** for styling with custom design tokens
- **Vitest + React Testing Library** for testing
- **Prettier + ESLint** with strict TypeScript config
- **Path aliases** (`@/*`) for clean imports

##  Project Structure

```
src/
 ├─ app/                 # Router + global providers
 ├─ shared/
 │   ├─ layout/          # Shell, skip link, page headers
 │   └─ ui/              # Reusable primitives (button, input, card…)
 ├─ features/
 │   ├─ auth/
 │   │   └─ routes/      # Login page
 │   └─ products/
 │        ├─ data/       # Fetch layer + TanStack Query factories
 │        ├─ components/ # Feature-specific UI (filters, pagination)
 │        ├─ routes/     # /products, /product/:id, /products/new
 │        ├─ hooks/      # URL-synced filter state
 │        ├─ constants.ts
 │        └─ types.ts
 ├─ lib/                 # Query client, auth, utilities
 └─ test/                # Test setup and utilities
```

**Architecture Pattern:** Feature-sliced design where each domain (products, auth) owns its routes, data fetching, components, and state management. Shared primitives live in `shared/` for reuse across features.

##Getting Started

```bash
# Install dependencies
npm install

# Development
npm run dev        # Start Vite dev server (localhost:5173)

# Code Quality
npm run lint       # ESLint + TypeScript rules
npm run typecheck  # TypeScript type checking
npm run format     # Prettier + Tailwind class sorting

# Testing
npm test           # Run tests in watch mode
npm run test:run   # Run tests once (CI mode)
npm run test:ui    # Run tests with UI

# Production
npm run build      # Production bundle
npm run preview    # Preview production build locally
```

## Design Decisions & Trade-offs

### Data Fetching Strategy
- **Client-side pagination**: DummyJSON only exposes ~100 products, so we fetch all at once and paginate client-side for instant UX. For larger datasets, we'd push pagination to the API.
- **Optimistic updates**: New products are added to cache immediately so they appear without waiting for API confirmation (since DummyJSON doesn't support POST).

### State Management
- **URL as source of truth**: Filter/search/sort state lives in URL params, making filtered views shareable and bookmarkable.
- **React Query for server state**: All API data managed through TanStack Query with sensible caching defaults.

### Testing Approach
- **Component-level tests**: Focus on user-facing behavior (what users see and interact with) rather than implementation details.
- **Isolated test environment**: Each test gets a fresh QueryClient to prevent state leakage between tests.

## What I'd Do Next With More Time

1. **Enhanced Product Detail Page**
   - Image gallery with keyboard navigation
   - Related products section
   - Edit/Delete actions with optimistic updates

2. **Advanced Filtering**
   - Price range slider
   - Multi-select for brands/categories
   - Save filter presets

3. **Performance Optimizations**
   - Virtual scrolling for large product lists
   - Image lazy loading with blur placeholders
   - Service worker for offline support

4. **Additional Tests**
   - Integration tests for product creation flow
   - E2E tests for critical user journeys
   - Visual regression tests

5. **Analytics & Monitoring**
   - User interaction tracking
   - Error boundary with error reporting
   - Performance metrics

## Deployment

**Live Demo:** [Add Vercel URL here after deployment]

**Build Command:** `npm run build`  
**Publish Directory:** `dist`  
**Environment Variables:** None required (public API)

**Deployment Platform:** Vercel (configured with `vercel.json` for SPA routing)

## License

This project was built as an assessment for Lotus Beta Analytics.

---

**Built with ❤️ using React, TypeScript, and modern web standards.**
