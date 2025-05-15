"use server";

import { getDb } from "../db";
import { workouts, tags, movements, workoutTags, workoutMovements } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

// Fetch all workouts with tags and movements
export async function getAllWorkouts() {
  const db = await getDb();
  const allWorkouts = await db.select().from(workouts);
  const workoutIds = allWorkouts.map(w => w.id);

  const allTags = await db.select().from(workoutTags).where(inArray(workoutTags.workoutId, workoutIds));
  const tagIds = allTags.map(wt => wt.tagId);
  const tagsMap = Object.fromEntries(
    workoutIds.map(id => [id, allTags.filter(wt => wt.workoutId === id).map(wt => wt.tagId)])
  );
  const tagNames = await db.select().from(tags).where(inArray(tags.id, tagIds));
  const tagNameMap = Object.fromEntries(tagNames.map(t => [t.id, t.name]));

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
    tags: (tagsMap[w.id] || []).map(tid => tagNameMap[tid]),
    movements: movementsMap[w.id] || [],
  }));
}

// Fetch a single workout by id (with tags and movements)
export async function getWorkoutById(id: string) {
  const db = await getDb();
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
export async function createWorkout({ workout, tagIds, movementIds }: { workout: any, tagIds: string[], movementIds: string[] }) {
  const db = await getDb();
  await db.insert(workouts).values(workout);
  if (tagIds.length) {
    await db.insert(workoutTags).values(tagIds.map(tagId => ({ id: crypto.randomUUID(), workoutId: workout.id, tagId })));
  }
  if (movementIds.length) {
    await db.insert(workoutMovements).values(movementIds.map(movementId => ({ id: crypto.randomUUID(), workoutId: workout.id, movementId })));
  }
}

// Update a workout (with tags and movements)
export async function updateWorkout({ id, workout, tagIds, movementIds }: { id: string, workout: any, tagIds: string[], movementIds: string[] }) {
  const db = await getDb();
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