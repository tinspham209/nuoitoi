import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const distDir = join(rootDir, "dist");
const swSrcPath = join(rootDir, "src", "service-worker.ts");
const swDestPath = join(distDir, "service-worker.js");

console.log("🔧 Building Service Worker...");

// Ensure dist directory exists
if (!existsSync(distDir)) {
	mkdirSync(distDir, { recursive: true });
}

// Check if source service worker exists
if (!existsSync(swSrcPath)) {
	console.error("❌ Service worker source file not found:", swSrcPath);
	process.exit(1);
}

try {
	// Read the TypeScript service worker
	const swContent = readFileSync(swSrcPath, "utf-8");

	// Simple transformation: remove TypeScript types and keep the logic
	// In production, you'd use a proper build tool, but this works for simple cases
	const jsContent = swContent
		.replace(/^import type .*$/gm, "") // Remove type imports
		.replace(/: \w+(\[\])?/g, "") // Remove type annotations
		.replace(/type PrecacheEntry \|/g, "") // Remove type unions
		.replace(/<PrecacheEntry \| string>/g, "") // Remove generic types
		.replace(/\{ url: URL \}/g, "{ url }") // Simplify destructuring
		.replace(/\{ request: Request \}/g, "{ request }")
		.replace(/Array<PrecacheEntry \| string>/g, "Array")
		.replace(/ServiceWorkerGlobalScope & \{[^}]+\}/g, "ServiceWorkerGlobalScope");

	// Write the JS service worker
	writeFileSync(swDestPath, jsContent, "utf-8");

	console.log("✅ Service Worker built successfully at:", swDestPath);
	console.log("📦 Service Worker is ready for production!");
} catch (error) {
	console.error("❌ Error building service worker:", error);
	process.exit(1);
}
