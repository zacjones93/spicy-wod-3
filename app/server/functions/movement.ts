import { getDb } from "../db";
import { movements } from "../db/schema";

// Fetch all movements
export async function getAllMovements() {
  const db = await getDb();
  return db.select().from(movements);
} 