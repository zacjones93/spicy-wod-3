"use server";

import { getDbAsync } from "../db";
import { results, workouts, sets as setsTable } from "../db/schema";
import { sql, eq, and, gte, lt, desc, getTableColumns } from "drizzle-orm";

export type LogEntry = {
  id: string;
  userId: string;
  date: Date;
  workoutId: string | null;
  type: "wod" | "strength" | "monostructural";
  notes: string | null;
  scale: "rx" | "scaled" | "rx+" | null;
  wodScore: string | null;
  setCount: number | null;
  distance: number | null;
  time: number | null;
  workoutName: string | null;
};

// Interface for structured set data, mirroring the one in actions.ts
// Ideally, this would be a shared type.
interface SetDataForDb {
  setNumber: number;
  score?: number | null;
  time?: number | null; // in seconds
  reps?: number | null;
  weight?: number | null;
  status?: 'pass' | 'fail' | null;
  distance?: number | null;
  // score is already there, but for WOD sets, it maps to sets.score
  // time is already there, maps to sets.time
}

// Fetch all logs for a user (optionally filter by month)
export async function getLogsByUser(userId: string, month?: number, year?: number): Promise<LogEntry[]> {
  if (userId === undefined) {
    console.error("[log] getLogsByUser called with undefined userId. Returning empty array.");
    return [];
  }
  const db = await getDbAsync();
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
      workoutName: workouts.name,
    })
    .from(results)
    .leftJoin(workouts, eq(results.workoutId, workouts.id))
    .where(and(...conditions))
    .orderBy(desc(results.date));

  return logs;
}

// Add a new log (result) and its associated sets
export async function addLog({
  userId,
  workoutId,
  date,
  scale,
  wodScore, // This is the summary score string
  notes,
  sets,     // Array of sets to be created
  type,     // Type of log, e.g., 'wod'
}: {
  userId: string;
  workoutId: string;
  date: number; // Expecting timestamp
  scale: "rx" | "scaled" | "rx+";
  wodScore: string;
  notes?: string;
  sets?: SetDataForDb[]; // Optional for now, but WODs will pass it
  type: "wod" | "strength" | "monostructural"; // Added type
}) {
  const db = await getDbAsync();
  const resultId = crypto.randomUUID();

  try {
    // 1. Define the first operation (mandatory for the batch structure)
    const mainResultInsertOperation = db.insert(results).values({
      id: resultId,
      userId,
      workoutId,
      date: new Date(date),
      type,
      scale,
      wodScore,
      notes,
    });
    console.log(`[log] Prepared main result insert for ${resultId} for user ${userId}, workout ${workoutId}`);

    const additionalOperations = [];

    // 2. Insert the sets if provided
    if (sets && sets.length > 0) {
      const setValues = sets.map(s => ({
        id: crypto.randomUUID(),
        resultId: resultId,
        setNumber: s.setNumber,
        score: s.score,
        time: s.time,
        reps: s.reps,
        weight: s.weight,
        status: s.status,
        distance: s.distance,
      }));

      if (setValues.length > 0) {
        additionalOperations.push(db.insert(setsTable).values(setValues));
        console.log(`[log] Prepared ${setValues.length} sets for result ${resultId}`);
      }
    }

    const operationsToBatch: [any, ...any[]] = [mainResultInsertOperation, ...additionalOperations];

    console.log(`[log] Executing batch operation for result ${resultId} with ${operationsToBatch.length} operations.`);
    // The structure [firstOp, ...otherOps] ensures TypeScript sees a non-empty array,
    // satisfying db.batch()'s type requirement.
    await db.batch([mainResultInsertOperation, ...additionalOperations]);

    console.log(`[log] Successfully batched log and associated sets for result ${resultId}`);
    return resultId;
  } catch (error) {
    console.error(`[log] Batch operation failed for addLog (resultId: ${resultId}):`, error);
    // Re-throw or handle error as appropriate for the application
    // For now, re-throwing to ensure the action can catch it.
    throw error;
  }
} 