# Task: Hook Up Workouts to the Database

## Date

2024-06-10

## Goal

Replace all hardcoded workout, tag, and movement data in the workouts pages with data fetched from the database.

---

## Steps

### 1. Review the Database Schema

- Examine the schema for `workouts`, `tags`, and `movements` tables.
- Identify relationships (e.g., many-to-many between workouts and tags/movements).
- Note the fields needed for display.

### 2. Set Up Database Access Functions

- In `app/server/db/` or `app/server/functions/`, create or update functions to:
  - Fetch all workouts (with tags and movements if needed).
  - Fetch a single workout by ID (for the edit page).
  - Fetch all tags and movements (for new/edit forms).

### 3. Update the Workouts List Page

- In `app/(main)/workouts/page.tsx`:
  - Replace hardcoded workouts with a call to the database function.
  - Use a server component or data fetching method to get data.
  - Render workouts dynamically, including tags and movements if relevant.

### 4. Update the New Workout Page

- In `app/(main)/workouts/new/`:
  - Fetch tags and movements from the database for selection in the form.
  - On form submission, insert the new workout and its relationships into the database.

### 5. Update the Edit Workout Page

- In `app/(main)/workouts/[id]/edit/`:
  - Fetch the workout by ID, including its tags and movements.
  - Populate the form with existing data.
  - On submission, update the workout and its relationships in the database.

### 6. Refactor Hardcoded Data

- Remove all hardcoded workouts, tags, and movements from the UI.
- Ensure all data is sourced from the database.

### 7. Test the Integration

- Add, edit, and view workouts to ensure data flows correctly.
- Check that tags and movements are displayed and editable as expected.

### 8. (Optional) Add Error Handling and Loading States

- Show loading indicators while fetching data.
- Display user-friendly errors if database access fails.

---

**Summary:**
All workout, tag, and movement data will be sourced from the database, making the workouts page and related forms dynamic and in sync with actual data.
