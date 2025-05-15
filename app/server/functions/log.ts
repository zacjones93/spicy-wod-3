"use server";

import { getDb } from "../db";
import { results, workouts } from "../db/schema";
import { sql, eq, and, gte, lt, desc, getTableColumns } from "drizzle-orm";

// Fetch all logs for a user (optionally filter by month)
export async function getLogsByUser(userId: string, month?: number, year?: number) {
  if (userId === undefined) {
    console.error("[log] getLogsByUser called with undefined userId. Returning empty array.");
    return [];
  }
  const db = getDb();
  const conditions = [eq(results.userId, userId)];

  if (month !== undefined && year !== undefined) {
    // Calculate start and end timestamps for the month
    const start = new Date(year, month, 1); // Drizzle handles date objects
    const end = new Date(year, month + 1, 1);
    conditions.push(gte(results.date, start));
    conditions.push(lt(results.date, end));
    console.log(`[log] Fetching logs for user ${userId} in ${month + 1}/${year} using Drizzle`);
  } else {
    console.log(`[log] Fetching all logs for user ${userId} using Drizzle`);
  }

  const logs = await db
    .select({
      // Select all columns from results
      ...getTableColumns(results),
      // Select workout name and alias it
      workout: workouts.name,
    })
    .from(results)
    .leftJoin(workouts, eq(results.workoutId, workouts.id))
    .where(and(...conditions))
    .orderBy(desc(results.date));

  return logs;
}

// Add a new log (result)
export async function addLog({
  userId,
  workoutId,
  date,
  scale,
  wodScore,
  notes,
}: {
  userId: string;
  workoutId: string;
  date: number;
  scale: "rx" | "scaled" | "rx+";
  wodScore: string;
  notes?: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.insert(results).values({
    id,
    userId,
    workoutId,
    date: new Date(date),
    type: "wod",
    scale,
    wodScore,
    notes,
  });
  console.log(`[log] Added log ${id} for user ${userId}, workout ${workoutId}`);
  return id;
} 