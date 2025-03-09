import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const env: "dev" | "prod" = import.meta.env.VITE_ENV || "dev";
console.log(`Environment: ${env}`);

createRoot(document.getElementById("root")!).render(
	env === "dev" ? (
		<StrictMode>
			<App />
		</StrictMode>
	) : (
		<App />
	)
);
