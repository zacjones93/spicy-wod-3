import { getDbAsync } from "../db";
import { movements } from "../db/schema";

// Fetch all movements
export async function getAllMovements() {
  const db = await getDbAsync();
  return db.select().from(movements);
} 