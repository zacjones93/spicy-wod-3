# spicy wod App Structure & Features

## Overview

spicy wod is a brutalist-style workout tracking app focused on CrossFit-style workouts (WODs), movements, and results logging. It is built with react-router for routing, drizzle orm for database access (Cloudflare SQLite), and zod for schema validation. The UI is component-driven, with a focus on usability and clarity.

## Main Features

- **Authentication**: Managing signup, login, and logout flows with session management.
- **Workouts**:
  - Listing all workouts with search and filter (by name, scheme, movements).
  - Creating new workouts, associating them with movements and schemes.
  - Viewing workout details, including description, scheme, and associated movements.
  - Editing existing workouts.
  - Logging results for a workout (score, scale, notes, multiple set support).
  - Viewing a logbook of all results for a workout, with ability to delete entries.
- **Movements**:
  - Listing all movements.
  - Viewing movement details, including type (strength, gymnastic, monostructural).
  - Seeing all workouts featuring a movement.
- **Results Logging**:
  - Logging results for different workout schemes (time, reps, rounds-reps, etc.).
  - Supporting multiple sets per result.
  - Linking results to users and workouts.
- **User Experience**:
  - Implementing a brutalist, no-rounded-edges UI.
  - Ensuring responsive design with a grid-based workout display.
  - Adapting header navigation based on authentication state.

## Directory Structure (Next.js App Router)

- `app/` - Main application folder using Next.js App Router.
  - `(auth)/` - Route group for authentication pages (e.g., login, signup).
    - `login/page.tsx`
    - `signup/page.tsx`
  - `(main)/` - Route group for main application authenticated routes.
    - `dashboard/page.tsx`
    - `workouts/`
      - `page.tsx` - List workouts.
      - `[id]/page.tsx` - View specific workout.
      - `new/page.tsx` - Create new workout.
    - `movements/`
      - `page.tsx`
      - `[id]/page.tsx`
    - `log/` - For logging results.
      - `page.tsx`
  - `api/` - API routes (e.g., `api/workouts/route.ts`).
  - `layout.tsx` - Root layout.
  - `page.tsx` - Home page.
- `components/` - Shared UI components.
  - `ui/` - Primitive UI components (Button, Input, etc., from shadcn/ui).
  - `forms/` - Reusable form components.
  - `specific-feature/` - Components related to a specific feature.
- `lib/` - Utility functions, database client, authentication helpers.
  - `db.ts` - Drizzle ORM client and schema.
  - `auth.ts` - Authentication configuration and functions.
  - `utils.ts` - General utility functions.
- `schemas/` - Zod schemas for validation.
- `public/` - Static assets (images, fonts, etc.).
- `db/`, `drizzle/` - Database migration files and Drizzle Kit config.

## Proposed User Stories
- "as a gym owner, I want to manage coaches"
- "as a gym owner, I want to program and schedule workouts"
- "as a coach I want to see the schedule" 
"as a gym member I want to see the workout schedule"

## Data Model (Simplified)

- **User**: id, email, joinedAt, hashedPassword, passwordSalt, etc.
- **Movement**: id, name, type (strength, gymnastic, monostructural).
- **Tag**: id, name (unique).
- **Workout**: id, name, description, scheme, createdAt, repsPerRound, roundsToScore, userId, sugarId, tiebreakScheme, secondaryScheme.
  - Related to `users` (many-to-one).
  - Related to `tags` (many-to-many via `workoutTags`).
  - Related to `movements` (many-to-many via `workoutMovements`).
- **WorkoutTag**: id, workoutId, tagId (junction table).
- **WorkoutMovement**: id, workoutId, movementId (junction table).
- **Result (Consolidated)**: id, userId, date, workoutId (optional), movementId (optional), type (wod, strength, monostructural), notes.
  - WOD specific: scale, wodScore.
  - Strength specific: setCount.
  - Monostructural specific: distance, time.
  - Related to `users`, `workouts`, `movements`.
- **Set (Unified)**: id, resultId, setNumber.
  - Generic set data: reps, weight, status (pass/fail), distance, time, score (for WOD sets).
  - Related to `results`.

_Specific result tables (`wodResults`, `strengthResults`, `monostructuralResults`) and their corresponding set tables have been removed and consolidated into `results` and `sets`._

## Tech Stack

- next.js (app router)
- drizzle orm 
- zod (validation)
- tailwindcss (brutalist, no rounded edges)
- pnpm (package management)

## Notable UI Patterns

- Using conform/zod for all form validation.
- Implementing debounced and URL-driven filtering and searching.
- Handling all navigation and state with server components when possible
- Accessing all data via drizzle orm

## Surfacing Workout History

The application's UI will be key for surfacing workout history. Provide features like:

- **Calendar View**: Allow users to browse results by date.
- **Workout History by Name**: Enable users to search for workouts by name and see all their logged attempts.
- **Movement History**: Allow users to search for specific movements and see all workouts where they were performed and the associated results.
- **Filtering and Sorting**: Provide options to filter results by workout type, scale, date range, etc., and sort them in meaningful ways.

## Workout Schemes and result types

'time',
'time-with-cap',
'pass-fail',
'rounds-reps',
'reps',
'emom',
'load',
'calories',
'meters',
'feet',
'points',


## Full Database Schema
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Users table (no changes)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  hashedPassword: text('hashed_password').notNull(),
  passwordSalt: text('password_salt').notNull(),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: integer('password_reset_expires', { mode: 'timestamp' }),
});

// Movements table (no changes)
export const movements = sqliteTable('movements', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['strength', 'gymnastic', 'monostructural'],
  }).notNull(),
});

// Tags table (new)
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

// Workout Tags junction table (new)
export const workoutTags = sqliteTable('workout_tags', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id')
    .references(() => workouts.id)
    .notNull(),
  tagId: text('tag_id')
    .references(() => tags.id)
    .notNull(),
});

// Workouts table (with relation to tags)
export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  scheme: text('scheme', {
    enum: [
      'time',
      'time-with-cap',
      'pass-fail',
      'rounds-reps',
      'reps',
      'emom',
      'load',
      'calories',
      'meters',
      'feet',
      'points',
    ],
  }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  repsPerRound: integer('reps_per_round'),
  roundsToScore: integer('rounds_to_score').default(1),
  userId: text('user_id').references(() => users.id),
  sugarId: text('sugar_id'),
  tiebreakScheme: text('tiebreak_scheme', { enum: ['time', 'reps'] }),
  secondaryScheme: text('secondary_scheme', {
    enum: [
      'time',
      'pass-fail',
      'rounds-reps',
      'reps',
      'emom',
      'load',
      'calories',
      'meters',
      'feet',
      'points',
    ],
  }),
});

// Workout Movements junction table (no changes)
export const workoutMovements = sqliteTable('workout_movements', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').references(() => workouts.id),
  movementId: text('movement_id').references(() => movements.id),
});

// Results base table (consolidated)
export const results = sqliteTable('results', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  workoutId: text('workout_id').references(() => workouts.id), // Optional, for WOD results
  movementId: text('movement_id').references(() => movements.id), // Optional, for strength/mono results
  type: text('type', {
    enum: ['wod', 'strength', 'monostructural'],
  }).notNull(),
  notes: text('notes'),

  // WOD specific results
  scale: text('scale', { enum: ['rx', 'scaled', 'rx+'] }),
  wodScore: text('wod_score'), // e.g., "3:15", "10 rounds + 5 reps"

  // Strength specific results
  setCount: integer('set_count'),

  // Monostructural specific results
  distance: integer('distance'),
  time: integer('time'),
});

// Sets table (unified for all result types)
export const sets = sqliteTable('sets', {
  id: text('id').primaryKey(),
  resultId: text('result_id').references(() => results.id).notNull(),
  setNumber: integer('set_number').notNull(),

  // Generic set data - only one of these will typically be populated
  reps: integer('reps'),
  weight: integer('weight'),
  status: text('status', { enum: ['pass', 'fail'] }),
  distance: integer('distance'),
  time: integer('time'),
  score: integer('score'), // For sets within a WOD (e.g., rounds completed in an AMRAP)
});