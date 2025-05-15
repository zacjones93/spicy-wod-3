"use server";

import { redirect } from "next/navigation";
import { addLog } from "@/server/functions/log";

// Define a basic Workout type. If a more specific type exists elsewhere,
// it would be better to import and use that.
interface Workout {
  id: string;
  name: string;
  scheme: string;
  // any other relevant properties
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

  if (!selectedWorkoutId) {
    console.error("[Action] No workout selected");
    return { error: "No workout selected. Please select a workout." };
  }

  const workout = workouts.find((w) => w.id === selectedWorkoutId);

  if (!workout) {
    console.error("[Action] Workout not found for ID:", selectedWorkoutId);
    return { error: "Selected workout not found. Please try again." };
  }

  let wodScoreValue: string;
  if (workout.scheme === "time") {
    wodScoreValue = formData.get("score") as string;
    if (!wodScoreValue) {
      return { error: "Time score is required for this workout." };
    }
  } else if (workout.scheme === "rounds-reps") {
    const roundsValue = formData.get("rounds") as string;
    const repsValue = formData.get("reps") as string;
    if (!roundsValue && !repsValue) {
      return { error: "Rounds or Reps score is required for this workout." }
    }
    wodScoreValue = `${roundsValue || 0} rounds + ${repsValue || 0} reps`;
  } else {
    // Fallback for unknown schemes or schemes that might use the generic 'score' field
    wodScoreValue = formData.get("score") as string | "N/A";
    if (!wodScoreValue && workout.scheme) {
      console.warn(
        `[Action] Workout scheme '${workout.scheme}' might not have a direct score input and no score provided. Defaulting WOD score.`
      );
      wodScoreValue = "N/A";
    } else if (!wodScoreValue) {
      // If scheme is unknown and score is also empty
      return { error: "Score is required for this workout." };
    }
  }

  console.log("[Action] Submitting log:", {
    userId,
    selectedWorkoutId,
    date: dateStr,
    scale: scaleValue,
    wodScore: wodScoreValue,
    notes: notesValue,
  });

  try {
    await addLog({
      userId,
      workoutId: selectedWorkoutId,
      date: new Date(dateStr).getTime(),
      scale: scaleValue,
      wodScore: wodScoreValue,
      notes: notesValue,
    });
    console.log("[Action] Log added successfully. Redirecting...");
  } catch (error) {
    console.error("[Action] Failed to add log:", error);
    return { error: `Failed to save log: ${error instanceof Error ? error.message : String(error)}` };
  }

  redirect("/log"); // On success, redirect
} 