import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],
	html: {
		template: "./index.html",
	},
	source: {
		entry: {
			index: "./src/index.tsx",
		},

		define: {
			"process.env.VITE_VIETQR_API_URL": JSON.stringify(
				process.env.VITE_VIETQR_API_URL,
			),
		},
	},
	resolve: {
		alias: {
			"@": "./src",
		},
	},
	output: {
		target: "web",
		filename: {
			js: "[name].[contenthash].js",
			css: "[name].[contenthash].css",
		},
		copy: [
			// Copy manifest.json to dist
			{ from: "public/manifest.json", to: "manifest.json" },
		],
	},
	tools: {
		postcss: {},
	},
	server: {
		port: 5173,
		// Add headers for service worker in dev mode
		headers: {
			"Service-Worker-Allowed": "/",
		},
	},
	performance: {
		preload: true,
	},
});
