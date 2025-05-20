import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").unique(),
	hashedPassword: text("hashedPassword"),
	passwordSalt: text("passwordSalt"),
	joinedAt: integer("joinedAt", { mode: "timestamp_ms" }),
});

// Movements table (no changes)
export const movements = sqliteTable("movements", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	type: text("type", {
		enum: ["strength", "gymnastic", "monostructural"],
	}).notNull(),
});

// Tags table (new)
export const tags = sqliteTable("tags", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
});

// Workout Tags junction table (new)
export const workoutTags = sqliteTable("workout_tags", {
	id: text("id").primaryKey(),
	workoutId: text("workout_id")
		.references(() => workouts.id)
		.notNull(),
	tagId: text("tag_id")
		.references(() => tags.id)
		.notNull(),
});

// Workouts table (with relation to tags)
export const workouts = sqliteTable("workouts", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	scope: text("scope", {
		enum: ["private", "public"],
	})
		.default("private")
		.notNull(),
	scheme: text("scheme", {
		enum: [
			"time",
			"time-with-cap",
			"pass-fail",
			"rounds-reps",
			"reps",
			"emom",
			"load",
			"calories",
			"meters",
			"feet",
			"points",
		],
	}).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
	repsPerRound: integer("reps_per_round"),
	roundsToScore: integer("rounds_to_score").default(1),
	userId: text("user_id").references(() => users.id),
	sugarId: text("sugar_id"),
	tiebreakScheme: text("tiebreak_scheme", { enum: ["time", "reps"] }),
	secondaryScheme: text("secondary_scheme", {
		enum: [
			"time",
			"pass-fail",
			"rounds-reps",
			"reps",
			"emom",
			"load",
			"calories",
			"meters",
			"feet",
			"points",
		],
	}),
});

// Workout Movements junction table (no changes)
export const workoutMovements = sqliteTable("workout_movements", {
	id: text("id").primaryKey(),
	workoutId: text("workout_id").references(() => workouts.id),
	movementId: text("movement_id").references(() => movements.id),
});

// Results base table (consolidated)
export const results = sqliteTable("results", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.references(() => users.id)
		.notNull(),
	date: integer("date", { mode: "timestamp" }).notNull(),
	workoutId: text("workout_id").references(() => workouts.id), // Optional, for WOD results
	type: text("type", {
		enum: ["wod", "strength", "monostructural"],
	}).notNull(),
	notes: text("notes"),

	// WOD specific results
	scale: text("scale", { enum: ["rx", "scaled", "rx+"] }),
	wodScore: text("wod_score"), // e.g., "3:15", "10 rounds + 5 reps"

	// Strength specific results
	setCount: integer("set_count"),

	// Monostructural specific results
	distance: integer("distance"),
	time: integer("time"),
});

// Sets table (unified for all result types)
export const sets = sqliteTable("sets", {
	id: text("id").primaryKey(),
	resultId: text("result_id")
		.references(() => results.id)
		.notNull(),
	setNumber: integer("set_number").notNull(),

	// Generic set data - only one of these will typically be populated
	reps: integer("reps"),
	weight: integer("weight"),
	status: text("status", { enum: ["pass", "fail"] }),
	distance: integer("distance"),
	time: integer("time"),
	score: integer("score"), // For sets within a WOD (e.g., rounds completed in an AMRAP)
});
