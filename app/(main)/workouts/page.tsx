import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllWorkouts } from "@/server/functions/workout";
import WorkoutControls from "./_components/WorkoutControls";

export const dynamic = "force-dynamic";

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
		const movementSearchMatch = workout.movements.some((movement: any) =>
			movement?.name?.toLowerCase().includes(searchTerm)
		);
		const tagSearchMatch = workout.tags.some((tag: any) =>
			tag.toLowerCase().includes(searchTerm)
		);

		const searchFilterPassed = searchTerm
			? nameMatch || descriptionMatch || movementSearchMatch || tagSearchMatch
			: true;

		const tagFilterPassed = selectedTag
			? workout.tags.some((tag: any) => tag === selectedTag)
			: true;

		const movementFilterPassed = selectedMovement
			? workout.movements.some(
					(movement: any) => movement?.name === selectedMovement
			  )
			: true;

		return searchFilterPassed && tagFilterPassed && movementFilterPassed;
	});

	// Extract unique tags and movements for filter dropdowns
	const allTags = [
		...new Set(allWorkouts.flatMap((workout: any) => workout.tags)),
	].sort() as string[];

	const allMovements = [
		...new Set(
			allWorkouts.flatMap((workout: any) =>
				workout.movements.map((m: any) => m?.name).filter(Boolean)
			)
		),
	].sort() as string[];

	return (
		<div>
			<div className="flex justify-between sm:items-center sm:flex-row flex-col mb-6">
				<h1>WORKOUTS</h1>
				<Link
					href="/workouts/new"
					className="btn flex items-center gap-2 w-fit"
				>
					<Plus className="h-5 w-5" />
					Create Workout
				</Link>
			</div>

			<WorkoutControls allTags={allTags} allMovements={allMovements} />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{workouts.map((workout: any) => (
					<Link
						key={workout.id}
						href={`/workouts/${workout.id}`}
						className="card hover:bg-gray-50 transition-colors"
					>
						<h3 className="mb-2">{workout.name}</h3>
						<p className="text-sm mb-3">{workout.description}</p>
						<div className="flex flex-wrap gap-2 mb-3">
							{workout.movements.map((movement: any) => (
								<span
									key={movement?.id || movement?.name || movement}
									className="inline-block px-2 py-1 text-xs font-bold bg-black text-white"
								>
									{movement?.name || movement}
								</span>
							))}
						</div>
						<div className="flex flex-wrap gap-1">
							{workout.tags.map((tag: any) => (
								<span
									key={tag}
									className="inline-block px-2 py-1 text-xs border border-black"
								>
									{tag}
								</span>
							))}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
