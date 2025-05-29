import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./app/server/db/schema.ts",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.CF_ACCOUNT_ID,
		databaseId: process.env.DB_REMOTE_DATABASE_ID,
		token: process.env.CF_USER_API_TOKEN,
	},
});
