"use client";

import {
	ArrowLeft,
	Clock,
	Dumbbell,
	Edit,
	ListChecks,
	Tag,
} from "lucide-react";
import Link from "next/link";
import type { WorkoutResult, WorkoutWithTagsAndMovements, Set } from "@/types";
import { Suspense } from "react";
import { SetDetails } from "./set-details";

// Define a new type for results with their sets
export type WorkoutResultWithSets = WorkoutResult & { sets: Set[] | null };

export default function WorkoutDetailClient({
	userId,
	workout,
	workoutId,
	resultsWithSets, // Changed from results and resultSetDetails
}: {
	userId: string;
	workout: WorkoutWithTagsAndMovements;
	workoutId: string;
	resultsWithSets: WorkoutResultWithSets[]; // Use the new type
}) {
	if (!workout) return <div>Loading...</div>;

	const canEditWorkout = userId === workout.userId;

	// Helper to format date
	const formatDate = (timestamp: number | Date | null) => {
		if (!timestamp) return "N/A";
		return new Date(timestamp).toLocaleDateString();
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href="/workouts" className="btn-outline p-2">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1>{workout.name}</h1>
				</div>
				{canEditWorkout && (
					<Link
						href={`/workouts/${workoutId}/edit`}
						className="btn flex items-center gap-2"
					>
						<>
							<Edit className="h-5 w-5" />
							Edit Workout
						</>
					</Link>
				)}
			</div>

			<div className="border-2 border-black mb-6">
				{/* Workout Details Section */}
				<div className="p-6 border-b-2 border-black">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h2 className="mb-4">DESCRIPTION</h2>
							<p className="text-lg mb-6 whitespace-pre-wrap">
								{workout.description}
							</p>
						</div>

						<div>
							<div className="flex items-center gap-2 my-4">
								<Clock className="h-5 w-5" />
								<h3>SCHEME</h3>
							</div>
							<div className="border-2 border-black p-4 mb-6 w-fit">
								<p className="text-lg font-bold uppercase w-fit">
									{workout.scheme}
								</p>
							</div>
							<div className="flex items-center gap-2 mb-4">
								<Dumbbell className="h-5 w-5" />
								<h3>MOVEMENTS</h3>
							</div>
							<div className="space-y-4">
								{(workout.movements || []).map((movement: any) => (
									<div key={movement.id} className="border-2 border-black p-4">
										<div className="flex justify-between items-center">
											<p className="text-lg font-bold">{movement.name}</p>
											<span className="px-2 py-1 text-xs font-bold bg-black text-white uppercase">
												{movement.type}
											</span>
										</div>
									</div>
								))}
							</div>

							{workout.tags && workout.tags.length > 0 && (
								<>
									<div className="flex items-center gap-2 my-4">
										<Tag className="h-5 w-5" />
										<h3>TAGS</h3>
									</div>
									<div className="flex flex-wrap gap-2 mb-6">
										{(workout.tags || []).map((tag: any) => (
											<span
												key={tag.id || tag}
												className="inline-block px-3 py-1 border-2 border-black"
											>
												{tag.name || tag}
											</span>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Results Section */}
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-2">
							<ListChecks className="h-5 w-5" />
							<h2>WORKOUT RESULTS</h2>
						</div>
						<Link
							href={`/log/new?workoutId=${workoutId}&redirectUrl=/workouts/${workoutId}`}
							className="btn"
						>
							Log Result
						</Link>
					</div>
					{resultsWithSets && resultsWithSets.length > 0 ? (
						<div className="space-y-4">
							{resultsWithSets.map((result) => (
								<div key={result.id} className="border-2 border-black">
									<div className="p-4">
										<div className="flex justify-between items-center mb-2">
											<p className="text-lg font-bold">
												{formatDate(result.date)}
											</p>
											{result.scale && (
												<span className="px-2 py-1 text-xs font-bold bg-gray-200 text-black uppercase">
													{result.scale}
												</span>
											)}
										</div>
										{result.wodScore && (
											<p className="text-xl mb-1">{result.wodScore}</p>
										)}
										{result.notes && (
											<p className="text-sm text-gray-600">
												Notes: {result.notes}
											</p>
										)}
									</div>
									{workout.roundsToScore &&
										workout.roundsToScore > 1 &&
										result.sets && <SetDetails sets={result.sets} />}
								</div>
							))}
						</div>
					) : (
						<div className="text-gray-500">No results logged yet.</div>
					)}
				</div>
			</div>
		</div>
	);
}
