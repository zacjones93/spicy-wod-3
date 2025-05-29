import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./vitest.setup.ts", // Optional: if you need setup files
		css: true, // If you need to process CSS (e.g. for Tailwind)
		deps: {
			inline: [/nuqs/], // Add nuqs here
		},
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
			"app/components/ui/DarkModeToggle.test.tsx", // Exclude this file
		],
	},
	resolve: {
		alias: {
			"@": "/app", // Match tsconfig.json paths alias
		},
	},
});
