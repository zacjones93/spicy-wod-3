import { Prettify } from "@/lib/utils";
import { results, sets } from "@/server/db/schema";



export type WorkoutResult = typeof results.$inferSelect;

export type Set = typeof sets.$inferSelect


export type WorkoutResultWithWorkoutName = Prettify<WorkoutResult & {
	workoutName: string | null
}>
