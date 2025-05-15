"use server";

import { redirect } from "next/navigation";
import { addLog } from "@/server/functions/log";

// Define a basic Workout type. If a more specific type exists elsewhere,
// it would be better to import and use that.
interface Workout {
  id: string;
  name: string;
  scheme: string;
  roundsToScore?: number | null;
  // any other relevant properties
}

// Definition for individual set data to be passed to the database function
interface SetDataForDb {
  setNumber: number;
  score?: number | null; // For numeric scores like reps, load
  time?: number | null;  // For time-based scores in seconds
  // other fields from 'sets' table like reps, weight could be added if needed
}

// Helper function to parse time strings (e.g., "MM:SS" or "HH:MM:SS" or just seconds) to total seconds
function parseTimeScoreToSeconds(timeStr: string): number | null {
  const trimmedTimeStr = timeStr.trim();
  if (!trimmedTimeStr) return null;

  // Check if it's just a number (already in seconds)
  if (/^\d+$/.test(trimmedTimeStr)) {
    const seconds = parseInt(trimmedTimeStr, 10);
    return !isNaN(seconds) ? seconds : null;
  }

  // Check for MM:SS or HH:MM:SS format
  const timeParts = trimmedTimeStr.split(':');
  if (timeParts.length < 2 || timeParts.length > 3 || timeParts.some(part => !/^\d{1,2}$/.test(part) && !(timeParts.indexOf(part) === 0 && /^\d+$/.test(part)))) {
    // first part can be more than 2 digits if it's like 120:30
    if (!(timeParts.length === 2 && /^\d+$/.test(timeParts[0]) && /^\d{1,2}$/.test(timeParts[1]) && parseInt(timeParts[1], 10) < 60)) {
      if (!(timeParts.length === 3 && /^\d+$/.test(timeParts[0]) && /^\d{1,2}$/.test(timeParts[1]) && parseInt(timeParts[1], 10) < 60 && /^\d{1,2}$/.test(timeParts[2]) && parseInt(timeParts[2], 10) < 60)) {
        console.warn(`[Action] Invalid time format for parsing: ${trimmedTimeStr}`);
        return null;
      }
    }
  }


  let seconds = 0;
  if (timeParts.length === 2) { // MM:SS
    seconds = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
  } else if (timeParts.length === 3) { // HH:MM:SS
    seconds = parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
  } else {
    const purelyNumeric = parseInt(trimmedTimeStr, 10);
    if (!isNaN(purelyNumeric)) return purelyNumeric;
    return null;
  }
  if (isNaN(seconds)) return null;
  return seconds; // Added explicit return for calculated seconds
}


export async function submitLogFormAction(
  userId: string,
  workouts: Workout[],
  formData: FormData
): Promise<{ error?: string } | void> {
  const selectedWorkoutId = formData.get("selectedWorkoutId") as string | null;
  const dateStr = formData.get("date") as string;
  const scaleValue = formData.get("scale") as "rx" | "scaled" | "rx+";
  const notesValue = formData.get("notes") as string;
  const redirectUrl = formData.get("redirectUrl") as string | null;

  if (!selectedWorkoutId) {
    console.error("[Action] No workout selected");
    return { error: "No workout selected. Please select a workout." };
  }

  const workout = workouts.find((w) => w.id === selectedWorkoutId);

  if (!workout) {
    console.error("[Action] Workout not found for ID:", selectedWorkoutId);
    return { error: "Selected workout not found. Please try again." };
  }

  const rawScores: string[] = [];
  let i = 0;
  while (formData.has(`scores[${i}]`)) {
    const score = formData.get(`scores[${i}]`) as string;
    // Client might send empty strings for unfilled optional rounds, filter them out unless all are empty
    // which is handled later. For now, collect all provided.
    rawScores.push(score || ""); // Keep empty strings for now to match index with setNumber
    i++;
  }

  // Filter out genuinely empty score strings if any were pushed.
  // This is important if a workout has e.g. 3 roundsToScore but user only fills 2.
  // We only want to process filled scores.
  const filledScores = rawScores.filter(s => s.trim() !== "");

  if (filledScores.length === 0 && workout.scheme !== "N/A" && workout.scheme !== undefined) {
    // If scheme is not N/A and expects scores, at least one must be provided.
    // This check might need refinement based on whether ALL roundsToScore are mandatory.
    // For now, if any score is expected, at least one non-empty score should be provided.
    return { error: "At least one score input is required and must not be empty." };
  }


  const wodScoreSummary = filledScores.join(", "); // Summary for results.wod_score
  const setsForDb: SetDataForDb[] = [];

  for (let j = 0; j < rawScores.length; j++) {
    const scoreStr = rawScores[j];
    if (scoreStr.trim() === "" && workout.roundsToScore && workout.roundsToScore > 1) {
      // If it's a multi-round workout and this particular round's score is empty, skip it.
      // Or, if specific rounds must be filled, this logic would be different.
      // For now, we allow partial score entry for multi-round WODs.
      // A null/empty score for a round means that round's score wasn't entered.
      // The database `sets` table will simply not have an entry for this `setNumber` if we skip.
      // Or, we can create a set with null score/time if the business logic requires an entry for every potential set.
      // Let's assume we only store sets for which a score was provided.
      // This means setNumbers might not be contiguous if a middle score is skipped.
      // Alternative: create set with nulls. For simplicity, I will only create sets for non-empty scores.
      // This implies `setNumber` in DB will be based on the index in `filledScores` not `rawScores`.
      // So, let's iterate `filledScores` instead.
      continue; // This loop structure will be changed below.
    }


    for (let k = 0; k < filledScores.length; k++) {
      const scoreStr = filledScores[k];
      const setNumber = k + 1; // Set numbers are 1-indexed

      if (workout.scheme === "time") {
        const timeInSeconds = parseTimeScoreToSeconds(scoreStr);
        if (timeInSeconds === null) {
          return { error: `Invalid time format for round ${setNumber}: '${scoreStr}'. Please use MM:SS or total seconds.` };
        }
        setsForDb.push({ setNumber, time: timeInSeconds, score: null });
      } else {
        // For schemes like 'reps', 'load', 'points', 'rounds-reps' (if score is total reps for that round)
        // The input type on client is 'number', but here it's a string.
        const numericScore = parseInt(scoreStr, 10);
        if (isNaN(numericScore)) {
          // This case should be less common if client input type is "number", but good to validate.
          return { error: `Score for round ${setNumber} ('${scoreStr}') must be a valid number for scheme '${workout.scheme}'.` };
        }
        setsForDb.push({ setNumber, score: numericScore, time: null });
      }
    }


    console.log("[Action] Submitting log with sets:", {
      userId,
      selectedWorkoutId,
      date: dateStr,
      scale: scaleValue,
      wodScoreSummary, // This goes to results.wod_score
      notes: notesValue,
      sets: setsForDb, // This array of sets needs to be handled by addLog
    });

    try {
      // The addLog function will need to be updated to handle this new structure,
      // creating a result and then iterating through `setsForDb` to create related set entries.
      // This typically involves a database transaction.
      await addLog({
        userId,
        workoutId: selectedWorkoutId,
        date: new Date(dateStr).getTime(), // Convert date string to timestamp
        scale: scaleValue,
        wodScore: wodScoreSummary, // Pass the summary string
        notes: notesValue,
        sets: setsForDb,         // Pass the structured set data
        type: 'wod', // Explicitly set type for WOD results
      });
      console.log("[Action] Log and sets added successfully. Redirecting...");
    } catch (error) {
      console.error("[Action] Failed to add log with sets:", error);
      return { error: `Failed to save log: ${error instanceof Error ? error.message : String(error)}` };
    }

    redirect(redirectUrl || "/log");
  } 
}