import { getDbAsync } from "../db";
import { tags } from "../db/schema";

// Fetch all tags
export async function getAllTags() {
  const db = await getDbAsync();
  return db.select().from(tags);
} 