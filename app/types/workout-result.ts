import { Prettify } from "@/lib/utils";
import { results, sets } from "@/server/db/schema";



export type WorkoutResult = typeof results.$inferSelect;

export type Set = Prettify<typeof sets.$inferSelect & { notes?: string | null }>;


export type WorkoutResultWithWorkoutName = Prettify<WorkoutResult & {
  workoutName: string | null
}>
