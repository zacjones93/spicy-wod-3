"use server";

import { addLog } from "@/server/functions/log";
import { fromZonedTime } from "date-fns-tz";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Define a basic Workout type. If a more specific type exists elsewhere,
// it would be better to import and use that.
interface Workout {
	id: string;
	name: string;
	scheme: string;
	roundsToScore?: number | null;
	repsPerRound?: number | null; // Added repsPerRound
	// any other relevant properties
}

// Definition for individual set data to be passed to the database function
interface SetDataForDb {
	setNumber: number;
	score?: number | null; // For numeric scores like reps, load
	time?: number | null; // For time-based scores in seconds
	roundsCompleted?: number | null; // For AMRAPs, rounds part
	repsCompleted?: number | null; // For AMRAPs, additional reps part
}

// Helper function to parse time strings (e.g., "MM:SS" or "HH:MM:SS" or just seconds) to total seconds
function parseTimeScoreToSeconds(timeStr: string): number | null {
	const trimmedTimeStr = timeStr.trim();
	if (!trimmedTimeStr) return null;

	// Check if it's just a number (already in seconds)
	if (/^\d+$/.test(trimmedTimeStr)) {
		const seconds = Number.parseInt(trimmedTimeStr, 10);
		return !Number.isNaN(seconds) ? seconds : null;
	}

	// Check for MM:SS or HH:MM:SS format
	const timeParts = trimmedTimeStr.split(":");
	if (
		timeParts.length < 2 ||
		timeParts.length > 3 ||
		timeParts.some(
			(part) =>
				!/^\d{1,2}$/.test(part) &&
				!(timeParts.indexOf(part) === 0 && /^\d+$/.test(part)),
		)
	) {
		// first part can be more than 2 digits if it's like 120:30
		if (
			!(
				timeParts.length === 2 &&
				/^\d+$/.test(timeParts[0]) &&
				/^\d{1,2}$/.test(timeParts[1]) &&
				Number.parseInt(timeParts[1], 10) < 60
			)
		) {
			if (
				!(
					timeParts.length === 3 &&
					/^\d+$/.test(timeParts[0]) &&
					/^\d{1,2}$/.test(timeParts[1]) &&
					Number.parseInt(timeParts[1], 10) < 60 &&
					/^\d{1,2}$/.test(timeParts[2]) &&
					Number.parseInt(timeParts[2], 10) < 60
				)
			) {
				console.warn(
					`[Action] Invalid time format for parsing: ${trimmedTimeStr}`,
				);
				return null;
			}
		}
	}

	let seconds = 0;
	if (timeParts.length === 2) {
		// MM:SS
		seconds =
			Number.parseInt(timeParts[0], 10) * 60 +
			Number.parseInt(timeParts[1], 10);
	} else if (timeParts.length === 3) {
		// HH:MM:SS
		seconds =
			Number.parseInt(timeParts[0], 10) * 3600 +
			Number.parseInt(timeParts[1], 10) * 60 +
			Number.parseInt(timeParts[2], 10);
	} else {
		const purelyNumeric = Number.parseInt(trimmedTimeStr, 10);
		if (!Number.isNaN(purelyNumeric)) return purelyNumeric;
		return null;
	}
	if (Number.isNaN(seconds)) return null;
	return seconds; // Added explicit return for calculated seconds
}

export async function submitLogFormAction(
	userId: string,
	workouts: Workout[],
	formData: FormData,
): Promise<{ error?: string } | undefined> {
	const headerList = await headers();
	const timezone = headerList.get("x-vercel-ip-timezone") ?? "America/Denver";
	const selectedWorkoutId = formData.get("selectedWorkoutId") as string | null;
	const dateStr = formData.get("date") as string;
	const scaleValue = formData.get("scale") as "rx" | "scaled" | "rx+";
	const notesValue = formData.get("notes") as string;
	const redirectUrl = formData.get("redirectUrl") as string | null;

	console.log("[Action] Date:", dateStr);

	if (!selectedWorkoutId) {
		console.error("[Action] No workout selected");
		return { error: "No workout selected. Please select a workout." };
	}

	const workout = workouts.find((w) => w.id === selectedWorkoutId);

	if (!workout) {
		console.error("[Action] Workout not found for ID:", selectedWorkoutId);
		return { error: "Selected workout not found. Please try again." };
	}

	// New score parsing logic
	const parsedScoreEntries: Array<{ parts: string[] }> = [];
	let roundIdx = 0;
	// Check for scores like scores[0][0], scores[0][1], scores[1][0] etc.
	while (formData.has(`scores[${roundIdx}][0]`)) {
		const parts: string[] = [];
		let partIdx = 0;
		while (formData.has(`scores[${roundIdx}][${partIdx}]`)) {
			parts.push(
				(formData.get(`scores[${roundIdx}][${partIdx}]`) as string) || "",
			);
			partIdx++;
		}
		if (parts.length > 0) {
			parsedScoreEntries.push({ parts });
		}
		roundIdx++;
	}

	console.log(
		"[Action] Parsed Score Entries:",
		JSON.stringify(parsedScoreEntries),
	);

	// Validation: Check if at least one part of one score entry is filled if scores are expected.
	const atLeastOneScorePartFilled = parsedScoreEntries.some((entry) =>
		entry.parts.some((part) => part.trim() !== ""),
	);

	if (parsedScoreEntries.length === 0 || !atLeastOneScorePartFilled) {
		if (workout.scheme !== "N/A" && workout.scheme !== undefined) {
			// N/A scheme might not require scores
			console.error(
				"[Action] No valid score parts provided for a workout that expects scores.",
			);
			return {
				error: "At least one score input is required and must not be empty.",
			};
		}
	}

	let wodScoreSummary = "";
	const setsForDb: SetDataForDb[] = [];

	// Determine expected number of score parts based on workout type
	const isRoundsAndRepsWorkout =
		!!workout.repsPerRound && workout.repsPerRound > 0;

	for (let k = 0; k < parsedScoreEntries.length; k++) {
		const entry = parsedScoreEntries[k];
		const setNumber = k + 1; // Set numbers are 1-indexed
		const scoreParts = entry.parts;

		if (isRoundsAndRepsWorkout) {
			// Expects two parts: scoreParts[0] = rounds, scoreParts[1] = reps
			if (scoreParts.length < 2 && scoreParts[0].trim() === "") {
				// If first part (rounds) is empty, skip this set potentially or error
				// If roundsToScore is 1, and this is the only entry, and rounds is empty, this implies no score was entered.
				// The overall check for !atLeastOneScorePartFilled should catch cases where nothing is entered at all.
				// If rounds is empty but reps might be there, it's an invalid partial entry for R+R.
				if (scoreParts.every((p) => p.trim() === "")) continue; // Skip fully empty entries if somehow missed by earlier check for multi-round
				return { error: `For round ${setNumber}, rounds input is required.` };
			}

			const roundsStr = scoreParts[0] || "0"; // Default to 0 if empty, though validation should catch truly missing essential parts.
			const repsStr = scoreParts[1] || "0"; // Default to 0 for reps if not provided.

			const roundsCompleted = Number.parseInt(roundsStr, 10);
			const repsCompleted = Number.parseInt(repsStr, 10);

			if (
				Number.isNaN(roundsCompleted) ||
				(scoreParts[1] !== undefined && Number.isNaN(repsCompleted))
			) {
				return {
					error: `Invalid number for rounds or reps for set ${setNumber}. Rounds: '${roundsStr}', Reps: '${repsStr}'.`,
				};
			}
			if (roundsCompleted < 0 || repsCompleted < 0) {
				return {
					error: `Rounds and reps for set ${setNumber} cannot be negative.`,
				};
			}
			if (workout.repsPerRound && repsCompleted >= workout.repsPerRound) {
				return {
					error: `Reps for set ${setNumber} (${repsCompleted}) cannot exceed or equal reps per round (${workout.repsPerRound}). Adjust rounds or reps.`,
				};
			}

			setsForDb.push({
				setNumber,
				roundsCompleted,
				repsCompleted,
				score: null,
				time: null,
			});
			if (k > 0) wodScoreSummary += ", ";
			wodScoreSummary += `${roundsCompleted} + ${repsCompleted}`;
		} else if (workout.scheme === "time") {
			const timeStr = scoreParts[0];
			if (timeStr === undefined || timeStr.trim() === "") {
				if (parsedScoreEntries.length === 1 && !atLeastOneScorePartFilled) {
					// This case should be caught by the general empty check
				} else if (scoreParts.every((p) => p.trim() === "")) {
					continue; // Skip if this specific score entry is completely empty (e.g. for an optional round)
				}
				return { error: `Time input for set ${setNumber} is missing.` };
			}
			const timeInSeconds = parseTimeScoreToSeconds(timeStr);
			if (timeInSeconds === null) {
				return {
					error: `Invalid time format for set ${setNumber}: '${timeStr}'. Please use MM:SS or total seconds.`,
				};
			}
			setsForDb.push({ setNumber, time: timeInSeconds, score: null });
			if (k > 0) wodScoreSummary += ", ";
			wodScoreSummary += timeStr;
		} else {
			// For schemes like 'reps', 'load', 'points' (single numeric score per set)
			const scoreStr = scoreParts[0];
			if (scoreStr === undefined || scoreStr.trim() === "") {
				if (parsedScoreEntries.length === 1 && !atLeastOneScorePartFilled) {
					// Caught by general empty check
				} else if (scoreParts.every((p) => p.trim() === "")) {
					continue; // Skip if this specific score entry is completely empty
				}
				return {
					error: `Score input for set ${setNumber} is missing for scheme '${workout.scheme}'.`,
				};
			}
			const numericScore = Number.parseInt(scoreStr, 10);
			if (Number.isNaN(numericScore)) {
				return {
					error: `Score for set ${setNumber} ('${scoreStr}') must be a valid number for scheme '${workout.scheme}'.`,
				};
			}
			if (numericScore < 0) {
				return {
					error: `Score for set ${setNumber} ('${numericScore}') cannot be negative.`,
				};
			}
			setsForDb.push({ setNumber, score: numericScore, time: null });
			if (k > 0) wodScoreSummary += ", ";
			wodScoreSummary += scoreStr;
		}
	}

	// After the loop, if setsForDb is empty due to all entries being skipped (e.g. empty optional rounds),
	// and the workout expects scores, this is an error.
	if (
		setsForDb.length === 0 &&
		workout.scheme !== "N/A" &&
		workout.scheme !== undefined &&
		atLeastOneScorePartFilled
	) {
		// This condition means some parts were filled, but they didn't result in valid sets (e.g. only reps in R+R)
		// Or if all were skipped due to being empty optional rounds, but main validation passed because there WERE entries.
		// This should ideally be caught by more specific per-type validation inside the loop.
		// If atLeastOneScorePartFilled was false, it's caught earlier.
		// If it was true, but setsForDb is empty, it implies all *provided* scores were invalid or led to skips.
		console.error(
			"[Action] All provided score entries resulted in no valid sets to save, but some input was detected.",
		);
		return {
			error:
				"Valid score information is required. Please check your inputs for each round/set.",
		};
	}
	if (
		setsForDb.length === 0 &&
		workout.scheme !== "N/A" &&
		workout.scheme !== undefined &&
		!atLeastOneScorePartFilled
	) {
		// This repeats the earlier check, but is a failsafe after processing.
		console.error(
			"[Action] No score entries provided or all were empty, and workout expects scores.",
		);
		return {
			error: "At least one score input is required and must not be empty.",
		};
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

	console.log("[Action] Date in timezone:", new Date(dateStr).getTime());

	try {
		// The addLog function will need to be updated to handle this new structure,
		// creating a result and then iterating through `setsForDb` to create related set entries.
		// This typically involves a database transaction.

		// The dateStr is expected to be in "YYYY-MM-DD" format.
		// We interpret this as the start of the day (midnight) in the timezone.
		const dateInTargetTz = fromZonedTime(`${dateStr}T00:00:00`, timezone);
		const timestamp = dateInTargetTz.getTime();

		console.log(
			`[Action] Original date string: ${dateStr}, Target Timezone: ${timezone}, Timestamp: ${timestamp}`,
		);

		await addLog({
			userId,
			workoutId: selectedWorkoutId,
			date: timestamp, // Use the timezone-aware timestamp
			scale: scaleValue,
			wodScore: wodScoreSummary, // Pass the summary string
			notes: notesValue,
			sets: setsForDb, // Pass the structured set data
			type: "wod", // Explicitly set type for WOD results
		});
		console.log("[Action] Log and sets added successfully. Redirecting...");
	} catch (error) {
		console.error("[Action] Failed to add log with sets:", error);
		return {
			error: `Failed to save log: ${error instanceof Error ? error.message : String(error)}`,
		};
	}

	redirect(redirectUrl || "/log");
}
