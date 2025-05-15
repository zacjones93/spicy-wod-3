import { type movements, type workouts, type tags } from "@/server/db/schema";

// Base Workout type from schema
export type Workout = typeof workouts.$inferSelect;

// Movement type from schema
export type Movement = typeof movements.$inferSelect;

// Tag type from schema
export type Tag = typeof tags.$inferSelect;

// Extended workout type that includes relations for tags and movements
export interface WorkoutWithRelations extends Workout {
  tags: Tag[]; // Or string[] if only names are needed, but objects are better for flexibility
  movements: Movement[];
} 