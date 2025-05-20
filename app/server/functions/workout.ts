"use server";

import { auth } from "@/auth"; // Added for user ID
import {
  type InferSelectModel,
  and,
  desc,
  eq,
  gte,
  inArray,
  lte,
  or,
} from "drizzle-orm";
import { getDbAsync } from "../db";
import {
  movements,
  results,
  tags,
  workoutMovements,
  workoutTags,
  workouts,
} from "../db/schema";

// Define inferred types
type SelectWorkout = InferSelectModel<typeof workouts>;
type SelectTag = InferSelectModel<typeof tags>;
type SelectMovement = InferSelectModel<typeof movements>;

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

// Internal helper to fetch tag objects grouped by workout ID
async function fetchTagsByWorkoutId(
  db: Awaited<ReturnType<typeof getDbAsync>>,
  workoutIds: string[],
): Promise<Map<string, SelectTag[]>> {
  if (workoutIds.length === 0) return new Map<string, SelectTag[]>();

  const allWorkoutTags = await db
    .select()
    .from(workoutTags)
    .where(inArray(workoutTags.workoutId, workoutIds));

  const tagIds = allWorkoutTags.map((wt) => wt.tagId);
  const tagObjects: SelectTag[] = tagIds.length
    ? await db.select().from(tags).where(inArray(tags.id, tagIds))
    : [];

  const tagObjLookup = new Map(tagObjects.map((t) => [t.id, t]));

  const tagsByWorkout = new Map<string, SelectTag[]>();
  for (const id of workoutIds) {
    const idsForWorkout = allWorkoutTags
      .filter((wt) => wt.workoutId === id)
      .map((wt) => wt.tagId);

    const tagObjsForWorkout = idsForWorkout
      .map((tid) => tagObjLookup.get(tid))
      .filter((tag): tag is SelectTag => Boolean(tag));

    tagsByWorkout.set(id, tagObjsForWorkout);
  }

  return tagsByWorkout;
}

// Internal helper to fetch movement objects grouped by workout ID
async function fetchMovementsByWorkoutId(
  db: Awaited<ReturnType<typeof getDbAsync>>,
  workoutIds: string[],
): Promise<Map<string, SelectMovement[]>> {
  if (workoutIds.length === 0) return new Map<string, SelectMovement[]>();

  const allWorkoutMovements = await db
    .select()
    .from(workoutMovements)
    .where(inArray(workoutMovements.workoutId, workoutIds));

  const movementIds = allWorkoutMovements
    .map((wm) => wm.movementId)
    .filter((id): id is string => id !== null);

  const movementObjects: SelectMovement[] = movementIds.length
    ? await db
      .select()
      .from(movements)
      .where(inArray(movements.id, movementIds))
    : [];

  const movementLookup = new Map(movementObjects.map((m) => [m.id, m]));

  const movementsByWorkout = new Map<string, SelectMovement[]>();
  for (const id of workoutIds) {
    const idsForWorkout = allWorkoutMovements
      .filter((wm) => wm.workoutId === id && wm.movementId !== null)
      .map((wm) => wm.movementId as string);

    const movementObjsForWorkout = idsForWorkout
      .map((mid) => movementLookup.get(mid))
      .filter((movement): movement is SelectMovement => Boolean(movement));

    movementsByWorkout.set(id, movementObjsForWorkout);
  }

  return movementsByWorkout;
}

// Internal helper to fetch today\'s WOD results grouped by workout ID for a user
async function fetchTodaysResultsByWorkoutId(
  db: Awaited<ReturnType<typeof getDbAsync>>,
  userId: string | undefined,
  workoutIds: string[],
) {
  if (!userId || workoutIds.length === 0)
    return new Map<string, WorkoutResultToday[]>();

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
        inArray(results.workoutId, workoutIds),
        gte(results.date, todayStart),
        lte(results.date, todayEnd),
      ),
    );

  const todayResults = rawResults.map((r) => ({
    ...r,
    date: new Date(r.date),
  })) as WorkoutResultToday[];

  const map = new Map<string, WorkoutResultToday[]>();
  for (const result of todayResults) {
    if (!result.workoutId) continue;
    const existing = map.get(result.workoutId) || [];
    existing.push(result);
    map.set(result.workoutId, existing);
  }

  return map;
}

// Fetch all workouts with tags, movements, and today's results for the current user
export async function getAllWorkouts() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn(
      "[getAllWorkouts] No user ID found in session. Cannot fetch results.",
    );
  }

  const db = await getDbAsync();

  // Base workouts and ids
  const allWorkouts = await db
    .select()
    .from(workouts)
    .where(
      userId
        ? or(eq(workouts.scope, "public"), eq(workouts.userId, userId))
        : eq(workouts.scope, "public"),
    );
  const workoutIds = allWorkouts.map((w) => w.id);

  // Fetch related data in parallel
  const [tagsByWorkoutId, movementsByWorkoutId, resultsByWorkoutId] =
    await Promise.all([
      fetchTagsByWorkoutId(db, workoutIds),
      fetchMovementsByWorkoutId(db, workoutIds),
      fetchTodaysResultsByWorkoutId(db, userId, workoutIds),
    ]);

  // Compose final structure
  return allWorkouts.map((w) => ({
    ...w,
    tags: tagsByWorkoutId.get(w.id) || [],
    movements: movementsByWorkoutId.get(w.id) || [],
    resultsToday: resultsByWorkoutId.get(w.id) || [],
  }));
}

// Fetch a single workout by id (with tags and movements)
export async function getWorkoutById(id: string) {
  const db = await getDbAsync();
  const workout = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, id))
    .get();
  if (!workout) return null;

  const workoutTagRows = await db
    .select()
    .from(workoutTags)
    .where(eq(workoutTags.workoutId, id));
  const tagIds = workoutTagRows.map((wt) => wt.tagId);
  const tagObjs = tagIds.length
    ? await db.select().from(tags).where(inArray(tags.id, tagIds))
    : [];

  const workoutMovementRows = await db
    .select()
    .from(workoutMovements)
    .where(eq(workoutMovements.workoutId, id));
  const movementIds = workoutMovementRows
    .map((wm) => wm.movementId)
    .filter((id): id is string => id !== null);
  const movementObjs = movementIds.length
    ? await db
      .select()
      .from(movements)
      .where(inArray(movements.id, movementIds))
    : [];

  return {
    ...workout,
    tags: tagObjs,
    movements: movementObjs,
  };
}

// Insert a new workout (with tags and movements)
export async function createWorkout({
  workout,
  tagIds,
  movementIds,
  userId,
}: {
  workout: Omit<SelectWorkout, "id" | "createdAt" | "updatedAt" | "userId">;
  tagIds: string[];
  movementIds: string[];
  userId: string;
}) {
  const db = await getDbAsync();
  const workoutId = crypto.randomUUID(); // Generate ID for the new workout
  await db.insert(workouts).values({ ...workout, id: workoutId, userId });

  if (tagIds.length) {
    await db.insert(workoutTags).values(
      tagIds.map((tagId) => ({
        id: crypto.randomUUID(),
        workoutId: workoutId,
        tagId,
      })),
    );
  }
  if (movementIds.length) {
    await db.insert(workoutMovements).values(
      movementIds.map((movementId) => ({
        id: crypto.randomUUID(),
        workoutId: workoutId,
        movementId,
      })),
    );
  }
}

// Update a workout (with tags and movements)
export async function updateWorkout({
  id,
  workout,
  tagIds,
  movementIds,
}: {
  id: string;
  workout: Partial<
    Omit<SelectWorkout, "id" | "createdAt" | "updatedAt" | "userId">
  >;
  tagIds: string[];
  movementIds: string[];
}) {
  const db = await getDbAsync();
  await db.update(workouts).set(workout).where(eq(workouts.id, id));
  await db.delete(workoutTags).where(eq(workoutTags.workoutId, id));
  await db.delete(workoutMovements).where(eq(workoutMovements.workoutId, id));
  if (tagIds.length) {
    await db.insert(workoutTags).values(
      tagIds.map((tagId) => ({
        id: crypto.randomUUID(),
        workoutId: id,
        tagId,
      })),
    );
  }
  if (movementIds.length) {
    await db.insert(workoutMovements).values(
      movementIds.map((movementId) => ({
        id: crypto.randomUUID(),
        workoutId: id,
        movementId,
      })),
    );
  }
}

// Fetch all workouts that include a specific movement
export async function getWorkoutsByMovementId(movementId: string) {
  console.log(
    `[server/functions/workout] getWorkoutsByMovementId called for movementId: ${movementId}`,
  );
  const db = await getDbAsync();

  // Find all workout IDs associated with the given movementId
  const workoutMovementEntries = await db
    .select({ workoutId: workoutMovements.workoutId })
    .from(workoutMovements)
    .where(eq(workoutMovements.movementId, movementId));

  if (!workoutMovementEntries.length) {
    console.log(
      `[server/functions/workout] No workouts found for movementId: ${movementId}`,
    );
    return [];
  }

  const workoutIds = workoutMovementEntries
    .map((entry) => entry.workoutId)
    .filter((id): id is string => id !== null);

  if (!workoutIds.length) {
    console.log(
      `[server/functions/workout] No valid workout IDs found for movementId: ${movementId}`,
    );
    return [];
  }

  // Fetch the details for these workouts
  // This part is similar to getAllWorkouts but filtered by the workoutIds from above
  const relatedWorkouts = await db
    .select()
    .from(workouts)
    .where(inArray(workouts.id, workoutIds));

  // Fetch associated tags and movements for these workouts
  const allTags = await db
    .select()
    .from(workoutTags)
    .where(inArray(workoutTags.workoutId, workoutIds));
  const tagIds = allTags.map((wt) => wt.tagId);
  const tagsMap = Object.fromEntries(
    workoutIds.map((id) => [
      id,
      allTags.filter((wt) => wt.workoutId === id).map((wt) => wt.tagId),
    ]),
  );
  const tagObjsList = tagIds.length
    ? await db.select().from(tags).where(inArray(tags.id, tagIds))
    : [];
  const tagObjMap = Object.fromEntries(tagObjsList.map((t) => [t.id, t]));

  const allMovementsForWorkouts = await db
    .select()
    .from(workoutMovements)
    .where(inArray(workoutMovements.workoutId, workoutIds));
  const movementIdsForWorkouts = allMovementsForWorkouts
    .map((wm) => wm.movementId)
    .filter((id): id is string => id !== null);
  const movementObjs = movementIdsForWorkouts.length
    ? await db
      .select()
      .from(movements)
      .where(inArray(movements.id, movementIdsForWorkouts))
    : [];
  const movementMap = Object.fromEntries(movementObjs.map((m) => [m.id, m]));
  const movementsMap = Object.fromEntries(
    workoutIds.map((id) => [
      id,
      allMovementsForWorkouts
        .filter((wm) => wm.workoutId === id && wm.movementId !== null)
        .map((wm) => movementMap[wm.movementId as string])
        .filter(Boolean),
    ]),
  );

  const result = relatedWorkouts.map((w) => ({
    ...w,
    tags: (tagsMap[w.id] || []).map((tid) => tagObjMap[tid]).filter(Boolean),
    movements: movementsMap[w.id] || [],
  }));

  console.log(
    `[server/functions/workout] Found ${result.length} workouts for movementId: ${movementId}`,
  );
  return result;
}

// Fetch the latest workout (by createdAt desc)
export async function getLatestWorkout() {
  const db = await getDbAsync();
  const latestWorkout = await db
    .select()
    .from(workouts)
    .orderBy(desc(workouts.createdAt))
    .limit(1)
    .get();
  if (!latestWorkout) return null;

  const workoutTagRows = await db
    .select()
    .from(workoutTags)
    .where(eq(workoutTags.workoutId, latestWorkout.id));
  const tagIds = workoutTagRows.map((wt) => wt.tagId);
  const tagObjs = tagIds.length
    ? await db.select().from(tags).where(inArray(tags.id, tagIds))
    : [];

  const workoutMovementRows = await db
    .select()
    .from(workoutMovements)
    .where(eq(workoutMovements.workoutId, latestWorkout.id));
  const movementIds = workoutMovementRows
    .map((wm) => wm.movementId)
    .filter((id): id is string => id !== null);
  const movementObjs = movementIds.length
    ? await db
      .select()
      .from(movements)
      .where(inArray(movements.id, movementIds))
    : [];

  return {
    ...latestWorkout,
    tags: tagObjs,
    movements: movementObjs,
  };
}
