#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const rootDir = join(__dirname, "..");
const swSrcPath = join(rootDir, "src", "service-worker.ts");
const swDistPath = join(rootDir, "dist", "service-worker.js");

try {
	// Read the TypeScript source
	let content = readFileSync(swSrcPath, "utf-8");

	// Step 1: Remove entire lines that are TypeScript-only
	content = content.split("\n").filter((line) => {
		const trimmed = line.trim();
		// Skip type definitions, imports, decorators, and reference comments
		if (trimmed.match(/^(type|interface|import|export|declare|\/\/\/)/)) return false;
		return true;
	}).join("\n");

	// Step 2: Remove type annotations more carefully
	// Remove return type annotations after closing parenthesis: ): Type {
	content = content.replace(/\):\s*[A-Za-z<>|&\s\[\]{}.\w]*\s*\{/g, ") {");
	
	// Remove return type annotations after closing parenthesis with arrow: ): Type =>
	content = content.replace(/\):\s*[A-Za-z<>|&\s\[\]{}.\w]*\s*=>/g, ") =>");
	
	// Remove parameter type annotations but be careful
	// Match : followed by type name and then comma or closing paren
	content = content.replace(/:\s*(?:CacheStrategy|CacheConfig|ExtendableEvent|FetchEvent|ExtendableMessageEvent|ServiceWorkerGlobalScope|Request|URL|Promise|Response|string|null|number|boolean)\b/g, "");
	
	// Remove generic types like <...>
	content = content.replace(/<[^>]+>/g, "");
	
	// Remove "as" type casts
	content = content.replace(/\s+as\s+(?:unknown\s+as\s+)?\w+/g, "");

	// Ensure the code is clean
	content = content.trim();

	// Write the cleaned JavaScript
	writeFileSync(swDistPath, content, "utf-8");

	console.log("✅ Service worker built successfully at dist/service-worker.js");
} catch (error) {
	console.error("❌ Error building service worker:", error.message);
	process.exit(1);
}
