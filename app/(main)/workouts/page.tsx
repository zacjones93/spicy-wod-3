import Link from "next/link";
import { Search, Plus, Filter } from "lucide-react";
import { getAllWorkouts } from "@/server/functions/workout";

export default async function WorkoutsPage() {
	const workouts = await getAllWorkouts();

	return (
		<div>
			<div className="flex justify-between sm:items-center sm:flex-row flex-col mb-6">
				<h1>WORKOUTS</h1>
				<Link href="/workouts/new" className="btn flex items-center gap-2 w-fit">
					<Plus className="h-5 w-5" />
					Create Workout
				</Link>
			</div>

			<div className="flex gap-4 mb-6">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
					<input
						type="text"
						placeholder="Search workouts..."
						className="input pl-10"
					/>
				</div>
				<button className="btn-outline flex items-center gap-2">
					<Filter className="h-5 w-5" />
					Filter
				</button>
			</div>

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
									key={movement?.id || movement}
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
