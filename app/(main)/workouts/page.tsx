import { getAllWorkouts } from "@/server/functions/workout";
import { Plus } from "lucide-react";
import Link from "next/link";
import WorkoutControls from "./_components/WorkoutControls";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Spicy Wod | Explore Workouts",
	description: "Track your spicy workouts and progress.",
	openGraph: {
		title: "Spicy Wod | Explore Workouts", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("Spicy Wod | Explore Workouts")}`,
				width: 1200,
				height: 630,
				alt: "Spicy Wod | Explore Workouts",
			},
		],
	},
};


export default async function WorkoutsPage({
	searchParams,
}: {
	searchParams?: Promise<{ search?: string; tag?: string; movement?: string }>;
}) {
	const mySearchParams = await searchParams;
	const allWorkouts = await getAllWorkouts();
	const searchTerm = mySearchParams?.search?.toLowerCase() || "";
	const selectedTag = mySearchParams?.tag || "";
	const selectedMovement = mySearchParams?.movement || "";
	const workouts = allWorkouts.filter((workout) => {
		const nameMatch = workout.name.toLowerCase().includes(searchTerm);
		const descriptionMatch = workout.description
			?.toLowerCase()
			.includes(searchTerm);
		const movementSearchMatch = workout.movements.some((movement) =>
			movement?.name?.toLowerCase().includes(searchTerm)
		);
		const tagSearchMatch = workout.tags.some((tag) =>
			tag.name.toLowerCase().includes(searchTerm)
		);
		const searchFilterPassed = searchTerm
			? nameMatch || descriptionMatch || movementSearchMatch || tagSearchMatch
			: true;
		const tagFilterPassed = selectedTag
			? workout.tags.some((tag) => tag.name === selectedTag)
			: true;
		const movementFilterPassed = selectedMovement
			? workout.movements.some(
					(movement) => movement?.name === selectedMovement
			  )
			: true;
		return searchFilterPassed && tagFilterPassed && movementFilterPassed;
	});

	// Get today's date for filtering
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

	const todaysWorkouts = allWorkouts.filter((workout) => {
		if (!workout.createdAt) return false;
		const workoutDate = new Date(workout.createdAt);
		workoutDate.setHours(0, 0, 0, 0); // Normalize to start of day
		return workoutDate.getTime() === today.getTime();
	});

	// Extract unique tags and movements for filter dropdowns
	const allTags = [
		...new Set(
			allWorkouts.flatMap((workout) => workout.tags.map((tag) => tag.name))
		),
	].sort() as string[];
	const allMovements = [
		...new Set(
			allWorkouts.flatMap((workout) =>
				workout.movements.map((m) => m?.name).filter(Boolean)
			)
		),
	].sort() as string[];
	return (
		<div>
			<div className="flex justify-between items-center sm:flex-row flex-col mb-6">
				<h1 className="mb-4">WORKOUTS</h1>
				<Link
					href="/workouts/new"
					className="btn flex items-center gap-2 w-fit"
				>
					<Plus className="h-5 w-5" />
					Create Workout
				</Link>
			</div>

			{todaysWorkouts.length > 0 && (
				<div className="mb-12">
					<h2 className="text-2xl font-bold mb-4 border-b pb-2 sm:text-left text-center">
						Workout{todaysWorkouts.length > 1 ? "s" : ""} of the Day
					</h2>
					<div className="space-y-6">
						{todaysWorkouts.map((workout) => (
							<div key={workout.id} className="card p-6">
								<div className="flex flex-col sm:flex-row justify-between items-start">
									<Link href={`/workouts/${workout.id}`}>
										<h3 className="text-xl font-semibold mb-2 underline">
											{workout.name}
										</h3>
									</Link>
									<Link
										href={`/log/new?workoutId=${workout.id}&redirectUrl=/workouts`}
										className="btn btn-primary btn-sm mb-2"
									>
										Log Result
									</Link>
								</div>
								<p className="text-sm text-muted-foreground mb-1">
									Created:{" "}
									{workout.createdAt
										? workout.createdAt.toLocaleDateString()
										: "N/A"}
								</p>
								{workout.description && (
									<p className="text-md mb-4 whitespace-pre-wrap">
										{workout.description}
									</p>
								)}
								{workout.movements && workout.movements.length > 0 && (
									<div className="mb-4">
										<h4 className="font-semibold mb-1">Movements:</h4>
										<div className="flex flex-wrap gap-2">
											{workout.movements.map((movement) => (
												<span
													key={movement?.id || movement?.name}
													className="inline-block px-2 py-1 text-xs font-bold bg-black text-white dark:bg-dark-foreground dark:text-dark-background"
												>
													{movement?.name}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Display Today's Results if any */}
								{workout.resultsToday && workout.resultsToday.length > 0 && (
									<div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border/50">
										<h4 className="font-semibold mb-2 text-sm uppercase text-gray-600 dark:text-dark-muted-foreground">
											Your Logged Result
											{workout.resultsToday.length > 1 ? "s" : ""} for Today:
										</h4>
										<div className="space-y-3">
											{workout.resultsToday.map((result: any) => (
												<div
													key={result.id}
													className="p-3 bg-gray-50 dark:bg-dark-accent rounded-md border border-gray-200 dark:border-dark-border w-fit"
												>
													<div className="flex gap-4 justify-between items-center">
														<p className="font-bold text-lg text-foreground dark:text-dark-foreground">
															{result.wodScore}
														</p>
														{result.scale && (
															<span
																className={`px-2 py-0.5 text-xs font-semibold ${
																	result.scale === "rx"
																		? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
																		: result.scale === "rx+"
																		? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
																		: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100"
																}`}
															>
																{result.scale.toUpperCase()}
															</span>
														)}
													</div>
													{result.notes && (
														<p className="text-sm text-gray-700 dark:text-dark-muted-foreground mt-1 italic">
															Notes: {result.notes}
														</p>
													)}
													{/* Consider adding a link to view/edit the specific log entry if needed */}
												</div>
											))}
										</div>
									</div>
								)}
								{/* Optionally, add more details like tags if needed */}
							</div>
						))}
					</div>
				</div>
			)}

			<WorkoutControls allTags={allTags} allMovements={allMovements} />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{workouts.map((workout) => (
					<Link
						key={workout.id}
						href={`/workouts/${workout.id}`}
						className="card hover:bg-gray-50 dark:hover:bg-dark-accent transition-colors min-h-[300px] flex flex-col justify-between"
					>
						<div className="">
							<h3 className="mb-2">{workout.name}</h3>
							<p className="text-sm mb-3 whitespace-pre-wrap line-clamp-6">
								{workout.description}
							</p>
						</div>
						<div>
							<div className="flex flex-wrap gap-2 mb-3">
								{workout.movements.map((movement) => (
									<span
										key={movement?.id || movement?.name}
										className="inline-block px-2 py-1 text-xs font-bold bg-black text-white dark:bg-dark-foreground dark:text-dark-background"
									>
										{movement?.name}
									</span>
								))}
							</div>
							<div className="flex flex-wrap gap-1">
								{workout.tags.map((tag) => (
									<span
										key={tag.id}
										className="inline-block px-2 py-1 text-xs border border-black dark:border-dark-border dark:text-dark-foreground"
									>
										{tag.name}
									</span>
								))}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
