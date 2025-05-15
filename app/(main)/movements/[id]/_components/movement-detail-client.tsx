"use client";

import { type Movement, type WorkoutWithRelations } from "@/types/workout";
import Link from "next/link";

interface MovementDetailClientProps {
	movement: Movement;
	workouts: WorkoutWithRelations[];
}

export default function MovementDetailClient({
	movement,
	workouts,
}: MovementDetailClientProps) {
	console.log("[MovementDetailClient] Rendering for movement:", movement.name);
	console.log("[MovementDetailClient] Associated workouts:", workouts);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">{movement.name.toUpperCase()}</h1>

			<section>
				<h2 className="text-2xl font-semibold mb-4">
					Workouts Featuring This Movement
				</h2>
				{workouts.length > 0 ? (
					<ul className="space-y-4">
						{workouts.map((workout) => (
							<li
								key={workout.id}
								className="p-4 border-2 border-black hover:bg-gray-50 transition-all duration-150 max-w-md"
							>
								<Link href={`/workouts/${workout.id}`} className="block">
									<h3 className="text-xl font-medium text-black hover:underline">
										{workout.name}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										{workout.description}
									</p>
									{/* Optionally display other workout details like scheme, tags, etc. */}
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p>No workouts currently feature this movement.</p>
				)}
			</section>
		</div>
	);
}
