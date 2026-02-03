# Service Worker Implementation

This project uses **Workbox** for service worker caching strategies to provide offline support and improve performance.

## Architecture

### Files Structure

```
src/
├── service-worker.ts              # Main service worker with Workbox caching
└── utils/
    └── registerServiceWorker.ts   # Service worker registration with workbox-window

public/
└── service-worker.js              # Dev-mode service worker (no caching)

scripts/
└── build-sw.js                    # Build script to compile SW for production

workbox-config.js                  # Workbox configuration (optional)
```

## Caching Strategies

### 1. **Precache** (Build Assets)
- All static assets generated during build are precached
- Uses Workbox's `precacheAndRoute()` with `__WB_MANIFEST`

### 2. **CacheFirst** (Images & Fonts)
- **Images**: Cache up to 60 images for 30 days
- **Google Fonts**: Cache up to 30 font files for 1 year
- Best for static assets that don't change often

### 3. **NetworkFirst** (API & Pages)
- **VietQR API**: Network-first with 5s timeout, fallback to cache (1 day TTL)
- **HTML Pages**: Network-first with cache fallback (7 days TTL)
- Best for dynamic content that should be fresh but work offline

### 4. **StaleWhileRevalidate** (CSS & JS)
- **Static Resources**: Serve from cache immediately, update in background
- Best for CSS/JS files that may update but need fast loading

## Development vs Production

### Development Mode
- Service worker registration is **skipped** in dev mode
- A minimal dev SW in `public/service-worker.js` is available for testing
- No caching to avoid stale content during development

### Production Mode
- Full Workbox caching strategies are enabled
- Service worker is built from `src/service-worker.ts` during `pnpm build`
- Update prompts shown when new version is available

## Build Process

1. **Build App**: `rsbuild build` compiles React app
2. **Build SW**: `node scripts/build-sw.js` compiles service worker
3. **Combined**: `pnpm build` runs both steps

## Commands

```bash
# Development (SW registration skipped)
pnpm dev

# Production build (includes SW compilation)
pnpm build

# Preview production build
pnpm preview
```

## Service Worker Lifecycle

1. **Install**: Service worker downloads and caches precache assets
2. **Activate**: Old caches are cleaned up
3. **Fetch**: Intercepts network requests and applies caching strategies
4. **Update**: Checks for updates hourly, prompts user to reload

## Update Flow

When a new version is deployed:

1. New service worker is downloaded in background
2. User sees confirmation dialog: "New version available! Click OK to update"
3. User confirms → page reloads with new version
4. User dismisses → keeps using current version until next page load

## Debugging

### Chrome DevTools
1. Open DevTools → Application → Service Workers
2. Check "Update on reload" for testing
3. Use "Unregister" to reset service worker

### Console Logs
- `[Dev SW]` - Development service worker logs
- `Service Worker loaded with Workbox` - Production service worker active

## Cache Names

- `google-fonts` - Google Fonts stylesheets and webfonts
- `images` - Image assets
- `static-resources` - CSS and JS files
- `vietqr-api` - VietQR API responses
- `pages` - HTML navigation requests
- `workbox-precache-*` - Workbox-managed precache

## Important Notes

1. **HTTPS Required**: Service workers only work on HTTPS (or localhost)
2. **Scope**: Service worker controls `/` (entire site)
3. **Cache Expiration**: Old caches are automatically cleaned up
4. **Network Timeout**: VietQR API falls back to cache after 5 seconds
5. **Dev Mode**: No caching in development to avoid confusion

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Verify HTTPS or localhost
- Check if service worker is blocked in browser settings

### Stale Content
- Open DevTools → Application → Clear Storage
- Click "Clear site data"
- Or: Unregister service worker and refresh

### Updates Not Showing
- Service worker checks for updates hourly
- Force update: DevTools → Application → Service Workers → Update
- Or: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

## Performance Impact

### Initial Load
- Precache download: ~200-500KB (depends on assets)
- One-time cost on first visit

### Subsequent Loads
- Instant load from cache for static assets
- API responses served from cache when offline
- Background updates keep content fresh

### Offline Support
- Full app functionality when offline (except live API data)
- Cached API responses available
- Forms can be submitted when connection restored

## Security

- Service worker served with `Service-Worker-Allowed: /` header
- Only caches same-origin requests
- HTTPS enforced in production
- Cache cleared on version updates

## Resources

- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Caching Strategies](https://web.dev/offline-cookbook/)
