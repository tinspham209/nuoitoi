import { Workbox } from "workbox-window";

export const registerServiceWorker = () => {
	// Check if service workers are supported
	if (!("serviceWorker" in navigator)) {
		console.log("Service workers are not supported in this browser");
		return;
	}

	// Only register in production
	if (import.meta.env.MODE !== "production") {
		console.log("Service worker registration skipped in development mode");
		return;
	}

	const wb = new Workbox("/service-worker.js");

	// Add event listeners for service worker lifecycle
	wb.addEventListener("installed", (event) => {
		if (event.isUpdate) {
			console.log("New service worker installed, update available!");
			// Show update notification to user
			if (confirm("New version available! Click OK to update and reload the page.")) {
				wb.addEventListener("controlling", () => {
					window.location.reload();
				});
				wb.messageSkipWaiting();
			}
		} else {
			console.log("Service worker installed for the first time");
		}
	});

	wb.addEventListener("activated", (event) => {
		if (!event.isUpdate) {
			console.log("Service worker activated");
		}
	});

	wb.addEventListener("waiting", () => {
		console.log(
			"A new service worker is waiting to activate. Close all tabs to update.",
		);
	});

	wb.addEventListener("controlling", () => {
		console.log("Service worker is now controlling the page");
	});

	// Handle service worker errors
	wb.addEventListener("message", (event) => {
		if (event.data.type === "CACHE_UPDATED") {
			const { updatedURL } = event.data.payload;
			console.log(`A newer version of ${updatedURL} is available!`);
		}
	});

	// Register the service worker
	wb.register()
		.then((registration) => {
			console.log("Service worker registered successfully:", registration);

			// Check for updates every hour
			setInterval(
				() => {
					registration?.update();
				},
				60 * 60 * 1000,
			); // 1 hour
		})
		.catch((error) => {
			console.error("Service worker registration failed:", error);
		});
};
