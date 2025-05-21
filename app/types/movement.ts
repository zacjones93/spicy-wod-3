import { movements } from "@/server/db/schema";

// Movement type from schema
export type Movement = typeof movements.$inferSelect;