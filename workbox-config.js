export default {
	globDirectory: "dist/",
	globPatterns: [
		"**/*.{html,js,css,png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf,ico}",
	],
	swDest: "dist/service-worker.js",
	swSrc: "dist/service-worker-template.js",
	maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
	modifyURLPrefix: {
		"": "/",
	},
	runtimeCaching: [
		{
			urlPattern: /^https:\/\/api\.vietqr\.io\//,
			handler: "NetworkFirst",
			options: {
				cacheName: "vietqr-api",
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 24 * 60 * 60, // 1 day
				},
				networkTimeoutSeconds: 5,
			},
		},
		{
			urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
			handler: "CacheFirst",
			options: {
				cacheName: "google-fonts-stylesheets",
				expiration: {
					maxEntries: 20,
					maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
				},
			},
		},
		{
			urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
			handler: "CacheFirst",
			options: {
				cacheName: "google-fonts-webfonts",
				expiration: {
					maxEntries: 30,
					maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
	],
	cleanupOutdatedCaches: true,
	skipWaiting: false,
	clientsClaim: true,
};
