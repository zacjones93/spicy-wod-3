import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

function getLocalD1DB(): string {
	try {
		const basePath = path.resolve(".wrangler");
		const dbFile = fs
			.readdirSync(basePath, { encoding: "utf-8", recursive: true })
			.find((f) => f.endsWith(".sqlite"));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err) {
		if (err instanceof Error) {
			console.log(`Error  ${err.message}`);
		}
		throw err;
	}
}
export default defineConfig({
	schema: "./app/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: getLocalD1DB(),
	},
});
