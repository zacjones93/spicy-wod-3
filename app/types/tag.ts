import { tags } from "@/server/db/schema";

// Tag type from schema
export type Tag = typeof tags.$inferSelect;