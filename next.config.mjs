import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	/* config options here */
	outputFileTracingExcludes: {
		"*": [
			"./**/*.js.map",
			"./**/*.mjs.map",
			"./**/*.cjs.map"
		],
	},
};

export default nextConfig;
