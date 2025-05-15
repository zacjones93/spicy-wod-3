"use client";

import { useState, useTransition } from "react";
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
	// any other relevant properties
}

export default function LogFormClient({
	workouts,
	userId,
}: {
	workouts: Workout[]; // Use the Workout interface
	userId: string;
}) {
	const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [scale, setScale] = useState<"rx" | "scaled" | "rx+">("rx");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [score, setScore] = useState("");
	const [rounds, setRounds] = useState("");
	const [reps, setReps] = useState("");
	const [notes, setNotes] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter(); // Kept for "Cancel" button or other navigation
	const [formError, setFormError] = useState<string | null>(null);

	const filteredWorkouts = workouts.filter((workout: Workout) =>
		workout.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getSelectedWorkout = () => {
		return workouts.find((w: Workout) => w.id === selectedWorkout);
	};

	// Client-side handler to call the server action
	async function handleFormSubmit(formData: FormData) {
		setFormError(null); // Clear previous errors
		if (!selectedWorkout) {
			setFormError("Please select a workout first.");
			return;
		}

		// Ensure selectedWorkoutId is on formData if not already explicitly set by a hidden field
		// (The hidden field <input type=\"hidden\" name=\"selectedWorkoutId\" value={selectedWorkout} /> handles this)
		// if (!formData.has("selectedWorkoutId") && selectedWorkout) {
		//  formData.set("selectedWorkoutId", selectedWorkout);
		// }

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
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href="/log" className="btn-outline p-2">
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
									{getSelectedWorkout()?.scheme === "time" && (
										<div>
											<label className="block font-bold uppercase mb-2">
												Time
											</label>
											<div className="flex gap-2">
												<input
													type="text"
													className="input w-20"
													placeholder="e.g. 3:21"
													value={score}
													onChange={(e) => setScore(e.target.value)}
													name="score"
												/>
											</div>
										</div>
									)}
									{getSelectedWorkout()?.scheme === "rounds-reps" && (
										<div>
											<label className="block font-bold uppercase mb-2">
												Score
											</label>
											<div className="flex gap-2 items-center">
												<input
													type="number"
													className="input w-20"
													placeholder="Rounds"
													min="0"
													value={rounds}
													onChange={(e) => setRounds(e.target.value)}
													name="rounds"
												/>
												<span>rounds +</span>
												<input
													type="number"
													className="input w-20"
													placeholder="Reps"
													min="0"
													value={reps}
													onChange={(e) => setReps(e.target.value)}
													name="reps"
												/>
												<span>reps</span>
											</div>
										</div>
									)}
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
