"use server";

import { getDbAsync } from "../db";
import { workouts, tags, movements, workoutTags, workoutMovements, results } from "../db/schema";
import { eq, inArray, desc, and, gte, lte } from "drizzle-orm";
import { auth } from "@/auth"; // Added for user ID

// Define a type for results specific to today for a workout
export type WorkoutResultToday = {
  id: string;
  userId: string;
  date: Date;
  workoutId: string | null;
  type: "wod" | "strength" | "monostructural";
  notes: string | null;
  scale: "rx" | "scaled" | "rx+" | null;
  wodScore: string | null;
  // Add other relevant fields from the 'results' table if needed for display
  // e.g., setCount, distance, time, though wodScore is primary for WODs
};

// Fetch all workouts with tags, movements, and today's results for the current user
export async function getAllWorkouts() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn("[getAllWorkouts] No user ID found in session. Cannot fetch results.");
    // Optionally, still return workouts without results, or handle as an error
    // For now, proceed to fetch workouts but results will be empty.
  }

  const db = await getDbAsync();
  const allWorkouts = await db.select().from(workouts);
  const workoutIds = allWorkouts.map(w => w.id);

  const allTags = workoutIds.length > 0 ? await db.select().from(workoutTags).where(inArray(workoutTags.workoutId, workoutIds)) : [];
  const tagIds = allTags.map(wt => wt.tagId);
  const tagsMap = Object.fromEntries(
    workoutIds.map(id => [id, allTags.filter(wt => wt.workoutId === id).map(wt => wt.tagId)])
  );
  const tagObjsList = tagIds.length ? await db.select().from(tags).where(inArray(tags.id, tagIds)) : [];
  const tagObjMap = Object.fromEntries(tagObjsList.map(t => [t.id, t]));

  const allMovements = workoutIds.length > 0 ? await db.select().from(workoutMovements).where(inArray(workoutMovements.workoutId, workoutIds)) : [];
  const movementIds = allMovements.map(wm => wm.movementId).filter((id): id is string => id !== null);
  const movementObjsList = movementIds.length > 0 ? await db.select().from(movements).where(inArray(movements.id, movementIds)) : [];
  const movementMap = Object.fromEntries(movementObjsList.map(m => [m.id, m]));
  const movementsMap = Object.fromEntries(
    workoutIds.map(id => [
      id,
      allMovements
        .filter(wm => wm.workoutId === id && wm.movementId !== null)
        .map(wm => movementMap[wm.movementId as string])
        .filter(Boolean)
    ])
  );

  // Fetch today's WOD results for the current user
  let todaysWodResults: WorkoutResultToday[] = [];
  if (userId && workoutIds.length > 0) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const rawResults = await db
      .select({
        id: results.id,
        userId: results.userId,
        date: results.date,
        workoutId: results.workoutId,
        type: results.type,
        notes: results.notes,
        scale: results.scale,
        wodScore: results.wodScore,
      })
      .from(results)
      .where(
        and(
          eq(results.userId, userId),
          eq(results.type, "wod"),
          inArray(results.workoutId, workoutIds), // Ensure workoutId is not null and in the list
          gte(results.date, todayStart),
          lte(results.date, todayEnd)
        )
      );

    todaysWodResults = rawResults.map(r => ({
      ...r,
      // Ensure workoutId is not null before trying to use it, and provide a default or handle error
      // The current select doesn't explicitly filter out null workoutId from results table,
      // but inArray(results.workoutId, workoutIds) effectively does if workoutIds don't contain null.
      // However, r.workoutId could still be null if the DB schema allows it and it wasn't filtered.
      // For this transformation, we assume r.workoutId is valid if the query intended to link it.
      date: new Date(r.date), // Corrected: r.date is likely already a Date object
    })) as WorkoutResultToday[];

    console.log(`[getAllWorkouts] Fetched ${todaysWodResults.length} results for today for user ${userId}`);
  }

  const resultsByWorkoutId = new Map<string, WorkoutResultToday[]>();
  todaysWodResults.forEach(result => {
    if (result.workoutId) {
      const existing = resultsByWorkoutId.get(result.workoutId) || [];
      existing.push(result);
      resultsByWorkoutId.set(result.workoutId, existing);
    }
  });

  return allWorkouts.map(w => ({
    ...w,
    tags: (tagsMap[w.id] || []).map(tid => tagObjMap[tid]).filter(Boolean),
    movements: movementsMap[w.id] || [],
    resultsToday: resultsByWorkoutId.get(w.id) || [], // Add today's results
  }));
}

// Fetch a single workout by id (with tags and movements)
export async function getWorkoutById(id: string) {
  const db = await getDbAsync();
  const workout = await db.select().from(workouts).where(eq(workouts.id, id)).get();
  if (!workout) return null;

  const workoutTagRows = await db.select().from(workoutTags).where(eq(workoutTags.workoutId, id));
  const tagIds = workoutTagRows.map(wt => wt.tagId);
  const tagObjs = tagIds.length ? await db.select().from(tags).where(inArray(tags.id, tagIds)) : [];

  const workoutMovementRows = await db.select().from(workoutMovements).where(eq(workoutMovements.workoutId, id));
  const movementIds = workoutMovementRows.map(wm => wm.movementId).filter((id): id is string => id !== null);
  const movementObjs = movementIds.length ? await db.select().from(movements).where(inArray(movements.id, movementIds)) : [];

  return {
    ...workout,
    tags: tagObjs,
    movements: movementObjs,
  };
}

// Insert a new workout (with tags and movements)
export async function createWorkout({ workout, tagIds, movementIds, userId }: { workout: any, tagIds: string[], movementIds: string[], userId: string }) {
  const db = await getDbAsync();
  await db.insert(workouts).values({ ...workout, userId });

  if (tagIds.length) {
    await db.insert(workoutTags).values(tagIds.map(tagId => ({ id: crypto.randomUUID(), workoutId: workout.id, tagId })));
  }
  if (movementIds.length) {
    await db.insert(workoutMovements).values(movementIds.map(movementId => ({ id: crypto.randomUUID(), workoutId: workout.id, movementId })));
  }
}

// Update a workout (with tags and movements)
export async function updateWorkout({ id, workout, tagIds, movementIds }: { id: string, workout: any, tagIds: string[], movementIds: string[] }) {
  const db = await getDbAsync();
  await db.update(workouts).set(workout).where(eq(workouts.id, id));
  await db.delete(workoutTags).where(eq(workoutTags.workoutId, id));
  await db.delete(workoutMovements).where(eq(workoutMovements.workoutId, id));
  if (tagIds.length) {
    await db.insert(workoutTags).values(tagIds.map(tagId => ({ id: crypto.randomUUID(), workoutId: id, tagId })));
  }
  if (movementIds.length) {
    await db.insert(workoutMovements).values(movementIds.map(movementId => ({ id: crypto.randomUUID(), workoutId: id, movementId })));
  }
}

// Fetch all workouts that include a specific movement
export async function getWorkoutsByMovementId(movementId: string) {
  console.log(`[server/functions/workout] getWorkoutsByMovementId called for movementId: ${movementId}`);
  const db = await getDbAsync();

  // Find all workout IDs associated with the given movementId
  const workoutMovementEntries = await db
    .select({ workoutId: workoutMovements.workoutId })
    .from(workoutMovements)
    .where(eq(workoutMovements.movementId, movementId));

  if (!workoutMovementEntries.length) {
    console.log(`[server/functions/workout] No workouts found for movementId: ${movementId}`);
    return [];
  }

  const workoutIds = workoutMovementEntries.map(entry => entry.workoutId).filter((id): id is string => id !== null);

  if (!workoutIds.length) {
    console.log(`[server/functions/workout] No valid workout IDs found for movementId: ${movementId}`);
    return [];
  }

  // Fetch the details for these workouts
  // This part is similar to getAllWorkouts but filtered by the workoutIds from above
  const relatedWorkouts = await db.select().from(workouts).where(inArray(workouts.id, workoutIds));

  // Fetch associated tags and movements for these workouts
  const allTags = await db.select().from(workoutTags).where(inArray(workoutTags.workoutId, workoutIds));
  const tagIds = allTags.map(wt => wt.tagId);
  const tagsMap = Object.fromEntries(
    workoutIds.map(id => [id, allTags.filter(wt => wt.workoutId === id).map(wt => wt.tagId)])
  );
  const tagObjsList = tagIds.length ? await db.select().from(tags).where(inArray(tags.id, tagIds)) : [];
  const tagObjMap = Object.fromEntries(tagObjsList.map(t => [t.id, t]));

  const allMovementsForWorkouts = await db.select().from(workoutMovements).where(inArray(workoutMovements.workoutId, workoutIds));
  const movementIdsForWorkouts = allMovementsForWorkouts.map(wm => wm.movementId).filter((id): id is string => id !== null);
  const movementObjs = movementIdsForWorkouts.length ? await db.select().from(movements).where(inArray(movements.id, movementIdsForWorkouts)) : [];
  const movementMap = Object.fromEntries(movementObjs.map(m => [m.id, m]));
  const movementsMap = Object.fromEntries(
    workoutIds.map(id => [
      id,
      allMovementsForWorkouts
        .filter(wm => wm.workoutId === id && wm.movementId !== null)
        .map(wm => movementMap[wm.movementId as string])
        .filter(Boolean)
    ])
  );

  const result = relatedWorkouts.map(w => ({
    ...w,
    tags: (tagsMap[w.id] || []).map(tid => tagObjMap[tid]).filter(Boolean),
    movements: movementsMap[w.id] || [],
  }));

  console.log(`[server/functions/workout] Found ${result.length} workouts for movementId: ${movementId}`);
  return result;
}

// Fetch the latest workout (by createdAt desc)
export async function getLatestWorkout() {
  const db = await getDbAsync();
  const latestWorkout = await db.select().from(workouts).orderBy(desc(workouts.createdAt)).limit(1).get();
  if (!latestWorkout) return null;

  const workoutTagRows = await db.select().from(workoutTags).where(eq(workoutTags.workoutId, latestWorkout.id));
  const tagIds = workoutTagRows.map(wt => wt.tagId);
  const tagObjs = tagIds.length ? await db.select().from(tags).where(inArray(tags.id, tagIds)) : [];

  const workoutMovementRows = await db.select().from(workoutMovements).where(eq(workoutMovements.workoutId, latestWorkout.id));
  const movementIds = workoutMovementRows.map(wm => wm.movementId).filter((id): id is string => id !== null);
  const movementObjs = movementIds.length ? await db.select().from(movements).where(inArray(movements.id, movementIds)) : [];

  return {
    ...latestWorkout,
    tags: tagObjs,
    movements: movementObjs,
  };
} 