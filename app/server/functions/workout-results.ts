import { getDbAsync } from "@/server/db";
import { results } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export type WorkoutResult = typeof results.$inferSelect;

export async function getWorkoutResultsByWorkoutAndUser(
	workoutId: string,
	userId: string,
): Promise<WorkoutResult[]> {
	const db = await getDbAsync();
	console.log(
		`Fetching workout results for workoutId: ${workoutId}, userId: ${userId}`,
	);
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
