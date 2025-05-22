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
					<Link
						href="/workouts"
						className="btn-outline dark:border-dark-border dark:text-dark-foreground dark:hover:bg-dark-accent dark:hover:text-dark-accent-foreground p-2"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1>{workout.name}</h1>
				</div>
				{canEditWorkout && (
					<Link
						href={`/workouts/${workoutId}/edit`}
						className="btn dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90 dark:border-dark-border flex items-center gap-2"
					>
						<>
							<Edit className="h-5 w-5" />
							Edit Workout
						</>
					</Link>
				)}
			</div>

			<div className="border-2 border-black dark:border-dark-border mb-6">
				{/* Workout Details Section */}
				<div className="p-6 border-b-2 border-black dark:border-dark-border">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h2 className="mb-4">DESCRIPTION</h2>
							<p className="text-lg mb-6 whitespace-pre-wrap text-foreground dark:text-dark-foreground">
								{workout.description}
							</p>
						</div>

						<div>
							<div className="flex items-center gap-2 my-4">
								<Clock className="h-5 w-5" />
								<h3>SCHEME</h3>
							</div>
							<div className="border-2 border-black dark:border-dark-border p-4 mb-6 w-fit">
								<p className="text-lg font-bold uppercase w-fit text-foreground dark:text-dark-foreground">
									{workout.scheme}
								</p>
							</div>
							<div className="flex items-center gap-2 mb-4">
								<Dumbbell className="h-5 w-5" />
								<h3>MOVEMENTS</h3>
							</div>
							<div className="space-y-4">
								{(workout.movements || []).map((movement: any) => (
									<div
										key={movement.id}
										className="border-2 border-black dark:border-dark-border p-4"
									>
										<div className="flex justify-between items-center">
											<p className="text-lg font-bold text-foreground dark:text-dark-foreground">
												{movement.name}
											</p>
											<span className="px-2 py-1 text-xs font-bold bg-black text-white dark:bg-dark-foreground dark:text-dark-background uppercase">
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
												className="inline-block px-3 py-1 border-2 border-black dark:border-dark-border text-foreground dark:text-dark-foreground"
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
							className="btn dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90 dark:border-dark-border"
						>
							Log Result
						</Link>
					</div>
					{resultsWithSets && resultsWithSets.length > 0 ? (
						<div className="space-y-4">
							{resultsWithSets.map((result) => (
								<div
									key={result.id}
									className="border-2 border-black dark:border-dark-border"
								>
									<div className="p-4">
										<div className="flex justify-between items-center mb-2">
											<p className="text-lg font-bold text-foreground dark:text-dark-foreground">
												{formatDate(result.date)}
											</p>
											{result.scale && (
												<span className="px-2 py-1 text-xs font-bold bg-gray-200 text-black dark:bg-dark-muted dark:text-dark-foreground uppercase">
													{result.scale}
												</span>
											)}
										</div>
										{result.wodScore && (
											<p className="text-xl mb-1 text-foreground dark:text-dark-foreground">
												{result.wodScore}
											</p>
										)}
										{result.notes && (
											<p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
												Notes: {result.notes}
											</p>
										)}
									</div>
									{workout.roundsToScore &&
										workout.roundsToScore > 1 &&
										result.sets && (
											<Suspense
												fallback={
													<div className="text-foreground dark:text-dark-foreground">
														Loading sets...
													</div>
												}
											>
												<SetDetails sets={result.sets} />
											</Suspense>
										)}
								</div>
							))}
						</div>
					) : (
						<div className="text-gray-500 dark:text-dark-muted-foreground">
							No results logged yet.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
