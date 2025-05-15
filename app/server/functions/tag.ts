import { getDb } from "../db";
import { tags } from "../db/schema";

// Fetch all tags
export async function getAllTags() {
  const db = await getDb();
  return db.select().from(tags);
} 