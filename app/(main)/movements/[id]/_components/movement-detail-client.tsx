"use client";

import type { Movement, WorkoutResult, WorkoutWithTagsAndMovements } from "@/types";
import { ListChecks, Plus } from "lucide-react";
import Link from "next/link";

interface MovementDetailClientProps {
	movement: Movement;
	workouts: WorkoutWithTagsAndMovements[];
	workoutResults: { [key: string]: WorkoutResult[] };
	userId: string;
}

// Helper to format date
const formatDate = (timestamp: number | Date | null) => {
	if (!timestamp) return "N/A";
	return new Date(timestamp).toLocaleDateString();
};

export default function MovementDetailClient({
	movement,
	workouts,
	workoutResults,
	userId, // userId might be used later for edit/delete actions on results
}: MovementDetailClientProps) {
	console.log("[MovementDetailClient] Rendering for movement:", movement.name);
	console.log("[MovementDetailClient] Associated workouts:", workouts);
	console.log("[MovementDetailClient] Workout results:", workoutResults);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">{movement.name.toUpperCase()}</h1>

			<section>
				<div className="flex items-center gap-2 mb-4">
					<ListChecks className="h-6 w-6" />
					<h2 className="text-2xl font-semibold">Workout Results</h2>
				</div>

				{workouts.length > 0 ? (
					<div className="space-y-8">
						{workouts.map((workout) => {
							const resultsForWorkout = workoutResults[workout.id] || [];
							return (
								<div key={workout.id} className="p-6 border-2 border-black">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-medium">{workout.name}</h3>
										<Link
											href={`/log/new?workoutId=${workout.id}&redirectUrl=/movements/${movement.id}`}
											className="btn btn-sm flex items-center gap-2"
										>
											<Plus className="h-4 w-4" />
											Log Result
										</Link>
									</div>
									{workout.description && (
										<p className="text-sm text-gray-700 mb-4 italic">
											{workout.description}
										</p>
									)}

									{resultsForWorkout.length > 0 ? (
										<div className="space-y-4">
											{resultsForWorkout.map((result) => (
												<div
													key={result.id}
													className="border-2 border-gray-200 p-4 rounded"
												>
													<div className="flex justify-between items-center mb-2">
														<p className="text-lg font-bold">
															{formatDate(result.date)}
														</p>
														{result.scale && (
															<span className="px-2 py-1 text-xs font-bold bg-gray-200 text-black uppercase rounded">
																{result.scale}
															</span>
														)}
													</div>
													{result.wodScore && (
														<p className="text-xl mb-1">
															{result.wodScore}
														</p>
													)}
													{result.notes && (
														<p className="text-sm text-gray-600">
															Notes: {result.notes}
														</p>
													)}
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500">
											No results logged yet for this workout.
										</p>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-gray-500">
						No workouts associated with this movement to show results for.
					</p>
				)}
			</section>
		</div>
	);
}
