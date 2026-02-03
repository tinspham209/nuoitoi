// Development Service Worker - Minimal functionality for testing
// In dev mode, we skip caching to avoid stale content issues

self.addEventListener("install", () => {
	console.log("[Dev SW] Service Worker installing...");
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("[Dev SW] Service Worker activating...");
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
	// In development, always fetch from network
	// Don't cache anything to avoid stale content
	event.respondWith(fetch(event.request));
});

console.log("[Dev SW] Development Service Worker loaded - No caching in dev mode");
