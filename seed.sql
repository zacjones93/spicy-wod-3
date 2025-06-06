-- Seed data for workouts, movements, tags, and junction tables
-- Movements
INSERT INTO movements (id, name, type) VALUES
  ('1', 'Thrusters', 'weightlifting'),
  ('2', 'Pull-ups', 'gymnastic'),
  ('3', 'Push-ups', 'gymnastic'),
  ('4', 'Squats', 'weightlifting'),
  ('5', 'Deadlifts', 'weightlifting'),
  ('6', 'Box Jumps', 'gymnastic'),
  ('7', 'Wall Ball', 'weightlifting'),
  ('8', 'Kettlebell Swings', 'weightlifting'),
  ('9', 'Double-Unders', 'monostructural'),
  ('10', 'Run', 'monostructural'),
  ('11', 'Clean & Jerk', 'weightlifting'),
  ('12', 'Hang Power Clean', 'weightlifting'),
  ('13', 'Push Jerk', 'weightlifting');

-- Tags
INSERT INTO tags (id, name) VALUES
  ('1', 'benchmark'),
  ('2', 'gymnastics'),
  ('3', 'weightlifting'),
  ('4', 'bodyweight'),
  ('5', 'hero'),
  ('6', 'endurance'),
  ('7', 'monostructural');

-- Workouts
INSERT INTO workouts (id, name, description, scheme, created_at, scope, reps_per_round) VALUES
  ('1', 'Fran', '21-15-9 reps for time of Thrusters and Pull-ups', 'time', CURRENT_TIMESTAMP, 'public', NULL),
  ('2', 'Cindy', 'AMRAP in 20 minutes of 5 Pull-ups, 10 Push-ups, 15 Squats', 'rounds-reps', CURRENT_TIMESTAMP, 'public', 30),
  ('3', 'Grace', '30 Clean & Jerks for time', 'time', CURRENT_TIMESTAMP, 'public', NULL),
  ('4', 'Murph', 'For time: 1 mile Run, 100 Pull-ups, 200 Push-ups, 300 Squats, 1 mile Run', 'time', CURRENT_TIMESTAMP, 'public', NULL),
  ('5', 'Karen', '150 Wall Balls for time', 'time', CURRENT_TIMESTAMP, 'public', NULL),
  ('6', 'DT', '5 rounds for time of: 12 Deadlifts, 9 Hang Power Cleans, 6 Push Jerks', 'time', CURRENT_TIMESTAMP, 'public', NULL);

-- Workout Movements
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES
  ('1', '1', '1'), -- Fran: Thrusters
  ('2', '1', '2'), -- Fran: Pull-ups
  ('3', '2', '2'), -- Cindy: Pull-ups
  ('4', '2', '3'), -- Cindy: Push-ups
  ('5', '2', '4'), -- Cindy: Squats
  ('6', '3', '11'), -- Grace: Clean & Jerk
  ('7', '4', '10'), -- Murph: Run
  ('8', '4', '2'), -- Murph: Pull-ups
  ('9', '4', '3'), -- Murph: Push-ups
  ('10', '4', '4'), -- Murph: Squats
  ('11', '5', '7'), -- Karen: Wall Ball
  ('12', '6', '5'), -- DT: Deadlifts
  ('13', '6', '12'), -- DT: Hang Power Clean
  ('14', '6', '13'); -- DT: Push Jerk

-- Workout Tags
INSERT INTO workout_tags (id, workout_id, tag_id) VALUES
  ('1', '1', '1'), -- Fran: benchmark
  ('2', '1', '2'), -- Fran: gymnastics
  ('3', '1', '3'), -- Fran: weightlifting
  ('4', '2', '1'), -- Cindy: benchmark
  ('5', '2', '4'), -- Cindy: bodyweight
  ('6', '3', '1'), -- Grace: benchmark
  ('7', '3', '3'), -- Grace: weightlifting
  ('8', '4', '5'), -- Murph: hero
  ('9', '4', '4'), -- Murph: bodyweight
  ('10', '4', '6'), -- Murph: endurance
  ('11', '5', '1'), -- Karen: benchmark
  ('12', '5', '7'), -- Karen: monostructural
  ('13', '6', '5'), -- DT: hero
  ('14', '6', '3'); -- DT: weightlifting 