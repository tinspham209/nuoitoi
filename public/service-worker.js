// Service Worker - Standalone implementation without external dependencies
// Caching strategies for PWA functionality

// Constants for cache names
const CACHE_VERSION = "v1";
const CACHE_NAMES = {
	PRECACHE: `precache-${CACHE_VERSION}`,
	GOOGLE_FONTS: "google-fonts",
	IMAGES: "images",
	STATIC_RESOURCES: "static-resources",
	VIETQR_API: "vietqr-api",
	PAGES: "pages",
};

const CACHE_WHITELIST = Object.values(CACHE_NAMES);

// Helper function to check if URL should be cached
function shouldCacheResponse(request, url) {
	// Google Fonts
	if (
		url.origin === "https://fonts.googleapis.com" ||
		url.origin === "https://fonts.gstatic.com"
	) {
		return { cache: CACHE_NAMES.GOOGLE_FONTS, strategy: "cache" };
	}

	// Images
	if (request.destination === "image") {
		return { cache: CACHE_NAMES.IMAGES, strategy: "cache" };
	}

	// Static resources (CSS, JS)
	if (
		request.destination === "style" ||
		request.destination === "script"
	) {
		return {
			cache: CACHE_NAMES.STATIC_RESOURCES,
			strategy: "cache",
		};
	}

	// VietQR API
	if (
		url.origin === "https://api.vietqr.io" ||
		url.origin === "https://img.vietqr.io"
	) {
		return { cache: CACHE_NAMES.VIETQR_API, strategy: "network-first" };
	}

	// Navigation requests (HTML)
	if (request.mode === "navigate") {
		return { cache: CACHE_NAMES.PAGES, strategy: "network-first" };
	}

	return null;
}

// Network first strategy with fallback to cache
async function networkFirst(request, cacheName) {
	const cache = await caches.open(cacheName);

	try {
		const networkResponse = await Promise.race([
			fetch(request),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Network timeout")), 5000),
			),
		]);

		// Cache successful responses
		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch {
		// Fall back to cache if network fails
		const cachedResponse = await cache.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}

		// If no cache and network failed, throw error
		throw new Error("Network request failed and no cached response");
	}
}

// Cache first strategy with network fallback
async function cacheFirst(request, cacheName) {
	const cache = await caches.open(cacheName);
	const cachedResponse = await cache.match(request);

	if (cachedResponse) {
		return cachedResponse;
	}

	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch {
		throw new Error("Network request failed");
	}
}

// Install event
self.addEventListener("install", () => {
	console.log("[SW] Service Worker installing...");
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	console.log("[SW] Service Worker activating...");

	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (
						!CACHE_WHITELIST.includes(cacheName) &&
						!cacheName.startsWith("workbox-precache")
					) {
						console.log("[SW] Deleting old cache:", cacheName);
						return caches.delete(cacheName);
					}
					return Promise.resolve();
				}),
			);
		}),
	);

	self.clients.claim();
});

// Fetch event - routing and caching logic
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== "GET") {
		return;
	}

	const cacheConfig = shouldCacheResponse(request, url);

	if (!cacheConfig) {
		// No caching strategy defined, let it through
		return;
	}

	const { cache: cacheName, strategy } = cacheConfig;

	if (strategy === "cache") {
		event.respondWith(
			cacheFirst(request, cacheName).catch(() => {
				// Return offline page or minimal response
				return new Response("Offline - resource not available", {
					status: 503,
					statusText: "Service Unavailable",
				});
			}),
		);
	} else if (strategy === "network-first") {
		event.respondWith(
			networkFirst(request, cacheName).catch(() => {
				// Return offline page or minimal response
				return new Response("Offline - resource not available", {
					status: 503,
					statusText: "Service Unavailable",
				});
			}),
		);
	}
});

// Handle skip waiting message from client
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

console.log("[SW] Service Worker loaded and ready!");
