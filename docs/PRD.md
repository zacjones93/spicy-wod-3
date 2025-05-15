# Product Requirements Document (PRD)

## Product: spicy wod

### Overview

spicy wod is a brutalist-style workout tracking app for CrossFit-style workouts (WODs), movements, and results logging. The app is designed for usability, clarity, and efficient workout history tracking.

---

## Goals

- Enable users to log, track, and review CrossFit-style workouts and results.
- Provide a clear, responsive, and brutalist UI for fast data entry and review.
- Support a wide range of workout schemes and movement types.
- Make workout and movement history easily accessible and filterable.

---

## Features

### Authentication

- Signup, login, and logout flows
- Session management

### Workouts

- List all workouts with search and filter (by name, scheme, movements)
- Create new workouts, associating with movements and schemes
- View workout details (description, scheme, movements)
- Edit existing workouts
- Log results for a workout (score, scale, notes, multiple set support)
- View a logbook of all results for a workout, with ability to delete entries

### Movements

- List all movements
- View movement details (type: strength, gymnastic, monostructural)
- See all workouts featuring a movement

### Results Logging

- Log results for different workout schemes (time, reps, rounds-reps, etc.)
- Support multiple sets per result
- Link results to users and workouts

### User Experience

- Brutalist, no-rounded-edges UI
- Responsive design with grid-based workout display
- Adaptive header navigation based on authentication state

### Workout History Surfacing

- Calendar view for browsing results by date
- Search workouts by name and see all logged attempts
- Search movements and see all workouts/results for that movement
- Filtering and sorting by workout type, scale, date range, etc.

---

## Data Model (Simplified)

- User: id, email, joinedAt, hashedPassword, passwordSalt, etc.
- Movement: id, name, type (strength, gymnastic, monostructural)
- Tag: id, name (unique)
- Workout: id, name, description, scheme, createdAt, repsPerRound, roundsToScore, userId, sugarId, tiebreakScheme, secondaryScheme
- WorkoutTag: id, workoutId, tagId (junction table)
- WorkoutMovement: id, workoutId, movementId (junction table)
- Result: id, userId, date, workoutId (optional), movementId (optional), type (wod, strength, monostructural), notes, scale, wodScore, setCount, distance, time
- Set: id, resultId, setNumber, reps, weight, status, distance, time, score

---

## Tech Stack

- next.js (app router)
- drizzle orm
- zod (validation)
- tailwindcss (brutalist, no rounded edges)
- pnpm (package management)

---

## UI/UX Patterns

- All form validation via conform/zod
- Debounced and URL-driven filtering/searching
- Navigation and state handled with server components when possible
- All data access via drizzle orm

---

## Out of Scope

- Social features (friends, sharing, leaderboards)
- Nutrition tracking
- Mobile app (web only for MVP)

---

## Success Metrics

- Users can log and review workouts and results without confusion
- Users can find past results by workout or movement quickly
- No major usability complaints about the brutalist UI

---

## Appendix: Full Database Schema (see NOTES.md for code)

- Users
- Movements
- Tags
- WorkoutTags
- Workouts
- WorkoutMovements
- Results
- Sets
