"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { submitLogFormAction } from "../actions";

// Minimal Workout type matching the one in actions.ts
// Ideally, this would be a shared type imported from a central location.
interface Workout {
	id: string;
	name: string;
	scheme: string;
	roundsToScore?: number | null; // Added roundsToScore
	// any other relevant properties
}

export default function LogFormClient({
	workouts,
	userId,
	selectedWorkoutId,
	redirectUrl,
}: {
	workouts: Workout[]; // Use the Workout interface
	userId: string;
	selectedWorkoutId?: string;
	redirectUrl?: string;
}) {
	const [selectedWorkout, setSelectedWorkout] = useState<string | null>(
		selectedWorkoutId || null
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [scale, setScale] = useState<"rx" | "scaled" | "rx+">("rx");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [scores, setScores] = useState<string[]>([]); // Added scores array state
	const [notes, setNotes] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter(); // Kept for "Cancel" button or other navigation
	const [formError, setFormError] = useState<string | null>(null);
	const prevSelectedWorkoutIdRef = useRef<string | null | undefined>(undefined); // Ref to track previous workout ID for scores effect

	const filteredWorkouts = workouts.filter((workout: Workout) =>
		workout.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getSelectedWorkout = () => {
		return workouts.find((w: Workout) => w.id === selectedWorkout);
	};

	// Effect to synchronize internal selectedWorkout state with selectedWorkoutId prop
	useEffect(() => {
		const currentPropId = selectedWorkoutId || null;
		if (selectedWorkout !== currentPropId) {
			setSelectedWorkout(currentPropId);
		}
	}, [selectedWorkoutId, selectedWorkout]);

	// Update scores state when selected workout changes, preserving input during Fast Refresh
	useEffect(() => {
		const currentWorkoutData = workouts.find((w) => w.id === selectedWorkout);
		const numRounds = currentWorkoutData?.roundsToScore || 1;

		if (!selectedWorkout) {
			// No workout selected
			if (scores.length > 0) {
				setScores([]);
			}
			prevSelectedWorkoutIdRef.current = null;
			return;
		}

		// Reset scores if the selected workout ID has actually changed,
		// or if the current number of score inputs doesn't match the required rounds.
		if (
			selectedWorkout !== prevSelectedWorkoutIdRef.current ||
			scores.length !== numRounds
		) {
			setScores(Array(numRounds).fill(""));
			prevSelectedWorkoutIdRef.current = selectedWorkout;
		}
		// If selectedWorkout is same as prevRef and scores.length matches numRounds,
		// do nothing to preserve user input (e.g. during Fast Refresh).
	}, [selectedWorkout, workouts, scores.length]); // Using scores.length as dependency

	const handleScoreChange = (index: number, value: string) => {
		const newScores = [...scores];
		newScores[index] = value;
		setScores(newScores);
	};

	// Client-side handler to call the server action
	async function handleFormSubmit(formData: FormData) {
		setFormError(null); // Clear previous errors
		if (!selectedWorkout) {
			setFormError("Please select a workout first.");
			return;
		}

		// Add redirectUrl to formData if it exists
		if (redirectUrl) {
			formData.set("redirectUrl", redirectUrl);
		}

		// Add scores to formData
		scores.forEach((score, index) => {
			formData.append(`scores[${index}]`, score);
		});

		// Ensure selectedWorkoutId is on formData if not already explicitly set by a hidden field
		// (The hidden field <input type="hidden" name="selectedWorkoutId" value={selectedWorkout} /> handles this)
		if (!formData.has("selectedWorkoutId") && selectedWorkout) {
			formData.set("selectedWorkoutId", selectedWorkout);
		}

		startTransition(async () => {
			try {
				const result = await submitLogFormAction(userId, workouts, formData);
				if (result?.error) {
					console.error("Server action error:", result.error);
					setFormError(result.error);
					// If redirect happens, this part might not be reached or UI won't update before redirect.
				}
				// On successful redirect, the page will navigate away.
			} catch (error) {
				// This catch block is for unexpected errors not handled by the action returning a {error} object
				// or if the action itself throws an unhandled exception.
				console.error("Client-side error during form submission:", error);
				setFormError("An unexpected error occurred. Please try again.");
			}
		});
	}

	return (
		<form action={handleFormSubmit}>
			{selectedWorkout && (
				<input type="hidden" name="selectedWorkoutId" value={selectedWorkout} />
			)}
			{redirectUrl && (
				<input type="hidden" name="redirectUrl" value={redirectUrl} />
			)}
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href={redirectUrl || "/log"} className="btn-outline p-2">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1>LOG RESULT</h1>
				</div>
			</div>
			<div className="border-2 border-black p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h2 className="mb-4">SELECT WORKOUT</h2>
						<div className="relative mb-4">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
							<input
								type="text"
								placeholder="Search workouts..."
								className="input pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="border-2 border-black h-[400px] overflow-y-auto">
							{filteredWorkouts.length > 0 ? (
								<div className="divide-y-2 divide-black">
									{filteredWorkouts.map((workout: Workout) => (
										<div
											key={workout.id}
											className={`p-4 cursor-pointer ${
												selectedWorkout === workout.id
													? "bg-black text-white"
													: "hover:bg-gray-100"
											}`}
											onClick={() => setSelectedWorkout(workout.id)}
										>
											<div className="flex justify-between items-center">
												<h3 className="font-bold">{workout.name}</h3>
												<span className="text-sm uppercase">
													{workout.scheme}
												</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="p-4 text-center">
									<p>No workouts found</p>
								</div>
							)}
						</div>
					</div>
					<div>
						{selectedWorkout ? (
							<div>
								<h2 className="mb-4">
									LOG RESULT FOR {getSelectedWorkout()?.name}
								</h2>
								<div className="space-y-6">
									<div>
										<label className="block font-bold uppercase mb-2">
											Date
										</label>
										<input
											type="date"
											className="input"
											value={date}
											onChange={(e) => setDate(e.target.value)}
											name="date"
										/>
									</div>
									<div>
										<label className="block font-bold uppercase mb-2">
											Scale
										</label>
										<div className="flex gap-4">
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name="scale"
													value="rx"
													checked={scale === "rx"}
													onChange={() => setScale("rx")}
													className="h-5 w-5"
												/>
												<span>RX</span>
											</label>
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name="scale"
													value="rx+"
													checked={scale === "rx+"}
													onChange={() => setScale("rx+")}
													className="h-5 w-5"
												/>
												<span>RX+</span>
											</label>
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name="scale"
													value="scaled"
													checked={scale === "scaled"}
													onChange={() => setScale("scaled")}
													className="h-5 w-5"
												/>
												<span>Scaled</span>
											</label>
										</div>
									</div>
									<div>
										<label className="block font-bold uppercase mb-2">
											Score
										</label>
										{scores.map((score, index) => (
											<div key={index} className="flex gap-2 items-center mb-2">
												{getSelectedWorkout()?.roundsToScore &&
													getSelectedWorkout()!.roundsToScore! > 1 && (
														<span className="font-semibold">
															Round {index + 1}:
														</span>
													)}
												<input
													type={
														getSelectedWorkout()?.scheme === "time"
															? "text"
															: "number"
													}
													className="input w-full"
													placeholder={
														getSelectedWorkout()?.scheme === "time"
															? "e.g. 3:21"
															: "Reps/Load"
													}
													value={score}
													onChange={(e) =>
														handleScoreChange(index, e.target.value)
													}
													name={`scores[${index}]`}
													min={
														getSelectedWorkout()?.scheme !== "time"
															? "0"
															: undefined
													}
												/>
											</div>
										))}
									</div>
									<div>
										<label className="block font-bold uppercase mb-2">
											Notes
										</label>
										<textarea
											className="textarea"
											rows={4}
											placeholder="How did it feel? Any modifications?"
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											name="notes"
										></textarea>
									</div>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 p-6">
								<p className="text-center text-gray-500">
									Select a workout from the list to log a result
								</p>
							</div>
						)}
					</div>
				</div>
				{formError && (
					<div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700">
						<p>{formError}</p>
					</div>
				)}
				<div className="flex justify-end gap-4 mt-6">
					<Link href="/log" className="btn-outline">
						Cancel
					</Link>
					<button
						type="submit"
						className="btn"
						disabled={!selectedWorkout || isPending}
					>
						{isPending ? "Saving..." : "Save Result"}
					</button>
				</div>
			</div>
		</form>
	);
}
