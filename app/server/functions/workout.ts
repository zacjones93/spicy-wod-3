"use server";

import { getDbAsync } from "../db";
import { workouts, tags, movements, workoutTags, workoutMovements } from "../db/schema";
import { eq, inArray, desc } from "drizzle-orm";

// Fetch all workouts with tags and movements
export async function getAllWorkouts() {
  const db = await getDbAsync();
  const allWorkouts = await db.select().from(workouts);
  const workoutIds = allWorkouts.map(w => w.id);

  const allTags = await db.select().from(workoutTags).where(inArray(workoutTags.workoutId, workoutIds));
  const tagIds = allTags.map(wt => wt.tagId);
  const tagsMap = Object.fromEntries(
    workoutIds.map(id => [id, allTags.filter(wt => wt.workoutId === id).map(wt => wt.tagId)])
  );
  const tagObjsList = tagIds.length ? await db.select().from(tags).where(inArray(tags.id, tagIds)) : [];
  const tagObjMap = Object.fromEntries(tagObjsList.map(t => [t.id, t]));

  const allMovements = await db.select().from(workoutMovements).where(inArray(workoutMovements.workoutId, workoutIds));
  const movementIds = allMovements.map(wm => wm.movementId).filter((id): id is string => id !== null);
  const movementObjs = await db.select().from(movements).where(inArray(movements.id, movementIds));
  const movementMap = Object.fromEntries(movementObjs.map(m => [m.id, m]));
  const movementsMap = Object.fromEntries(
    workoutIds.map(id => [
      id,
      allMovements
        .filter(wm => wm.workoutId === id && wm.movementId !== null)
        .map(wm => movementMap[wm.movementId as string])
        .filter(Boolean)
    ])
  );

  return allWorkouts.map(w => ({
    ...w,
    tags: (tagsMap[w.id] || []).map(tid => tagObjMap[tid]).filter(Boolean),
    movements: movementsMap[w.id] || [],
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