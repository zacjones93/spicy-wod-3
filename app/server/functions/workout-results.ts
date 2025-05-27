import { getDbAsync } from "@/server/db";
import { results, sets } from "@/server/db/schema";
import type { Set, WorkoutResult } from "@/types";
import { and, eq } from "drizzle-orm";

export async function getWorkoutResultsByWorkoutAndUser(
	workoutId: string,
	userId: string,
): Promise<WorkoutResult[]> {
	const db = await getDbAsync();
	console.log(`Fetching workout results for workoutId: ${workoutId}, userId: ${userId}`);
	try {
		const workoutResultsData = await db
			.select()
			.from(results)
			.where(
				and(
					eq(results.workoutId, workoutId),
					eq(results.userId, userId),
					eq(results.type, "wod"),
				),
			)
			.orderBy(results.date);
		console.log(`Found ${workoutResultsData.length} results.`);
		return workoutResultsData;
	} catch (error) {
		console.error("Error fetching workout results:", error);
		return [];
	}
}

export async function getResultSetsById(resultId: string): Promise<Set[]> {
	const db = await getDbAsync();
	console.log(`Fetching sets for resultId: ${resultId}`);
	try {
		const setDetails = await db
			.select()
			.from(sets)
			.where(eq(sets.resultId, resultId))
			.orderBy(sets.setNumber);
		console.log(`Found ${setDetails.length} sets for resultId ${resultId}.`);
		return setDetails;
	} catch (error) {
		console.error(`Error fetching sets for resultId ${resultId}:`, error);
		return [];
	}
}
