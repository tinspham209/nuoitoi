import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import "./styles/globals.css";
import { registerServiceWorker } from "./utils/registerServiceWorker";

const rootElement = document.getElementById("root");

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}

// Register service worker after app is mounted
registerServiceWorker();
