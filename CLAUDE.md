# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run start        # Start production server
```

TypeScript build errors are intentionally ignored in next.config.ts (incomplete DB integration in progress).

## Architecture

**Mahallemiz** is a Turkish neighborhood community platform (Next.js 16 App Router + Supabase + Capacitor).

### Route Groups

- `(main)/` — Main app: feed, marketplace, events, groups, messaging, profiles, settings
- `(auth)/` — Unauthenticated: `/giris`, `/kayit`, `/sifre-sifirla`
- `(business)/` — Business flows: `/esnaf-kayit`, `/isletme-paneli`
- `(admin)/` — Admin dashboard (content moderation, user management, etc.)
- `api/` — API routes: OG image, payment (PayTR), document verification

### Auth & Middleware

`src/middleware.ts` protects all routes except public pages. It enforces a multi-step verification funnel:
1. **Location confirmation** → redirects to `/konum-secimi`
2. **eDevlet (Turkish national ID) verification** → redirects to `/adres-dogrulama` or `/hesap-kilitli`

Supabase clients:
- `src/lib/supabase/client.ts` — browser client (client components)
- `src/lib/supabase/server.ts` — server client (Server Components, API routes)
- `src/lib/supabase/types.ts` — auto-generated DB types (do not edit manually)

### Data Fetching

- **React Query** (TanStack v5) is the caching layer, configured in `src/lib/providers.tsx` with 5-min stale time and no refetch-on-focus.
- **`src/lib/hooks/`** contains two kinds of exports — prefer the hooks in new code:
  - **React Query hooks** (`useListings`, `usePosts`, `useListingById`, `usePostById`, `useCurrentUser`, …) — use these in components for caching, loading states, and background sync.
  - **Async query utilities** (`getListings`, `createListing`, `getPosts`, `createPost`, …) — use these in mutation callbacks or one-off server-side calls.
- **Services** in `src/lib/services/` contain business logic: payment, content moderation, address verification, listing quotas, business subscriptions, review system.

### SEO & Metadata

- `src/lib/seo.ts` — centralizes all page metadata definitions; use it when adding/updating page metadata.
- `src/app/api/og/route.tsx` — dynamic OG image generation.
- `src/app/manifest.ts`, `robots.ts`, `sitemap.ts` — PWA/SEO infra.
- All pages use structured data via `src/components/shared/json-ld.tsx`.

### UI & Styling

- Tailwind CSS 4 + Shadcn/ui components in `src/components/ui/`.
- Icons: lucide-react.
- Toast notifications: `src/lib/utils/show-toast.ts` wraps the custom toast system.
- `cn()` helper from `src/lib/utils/utils.ts` (clsx + tailwind-merge).

### Maps

Leaflet + React Leaflet. Map tiles use CartoDB Voyager. Google Maps API key is optional (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).

### Mobile / PWA

Capacitor 7 bridges the web app to iOS/Android. Capacitor-specific code is gated behind `src/lib/capacitor.ts`. The `postinstall` script copies PDF.js and Capacitor assets.

### Image Handling

Allowed remote image hosts in next.config.ts: Supabase storage, Unsplash, Picsum, DiceBear. Images use AVIF/WebP with 1-year TTL.

## Environment Variables

Required:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Optional:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
RESEND_API_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

<!-- gopro-token-test-komsumapp: 2026-04-30 23:08 -->

