import type { Prettify } from "@/lib/utils";
import type { movements, tags, workouts } from "@/server/db/schema";
import type { Movement } from "./movement";
import type { Tag } from "./tag";

// Base Workout type from schema
export type Workout = typeof workouts.$inferSelect;

// Extended workout type that includes relations for tags and movements
export interface WorkoutWithTagsAndMovements extends Workout {
	tags: Tag[]; // Or string[] if only names are needed, but objects are better for flexibility
	movements: Movement[];
}

// Type for the data payload when updating a workout
export type WorkoutUpdate = Prettify<
	Pick<Workout, "name" | "description" | "scheme" | "scope"> &
		Partial<Pick<Workout, "repsPerRound" | "roundsToScore">>
>;

export type WorkoutCreate = Prettify<
	Pick<Workout, "id" | "name" | "description" | "scheme" | "scope" | "createdAt"> &
		Partial<Pick<Workout, "repsPerRound" | "roundsToScore">>
>;
