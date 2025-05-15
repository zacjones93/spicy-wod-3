"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Clock, Tag, Dumbbell } from "lucide-react";

export default function WorkoutDetailClient({
	workout,
	workoutId,
}: {
	workout: any;
	workoutId: string;
}) {
	if (!workout) return <div>Loading...</div>;

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href="/workouts" className="btn-outline p-2">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1>{workout.name}</h1>
				</div>
				<Link
					href={`/workouts/${workoutId}/edit`}
					className="btn flex items-center gap-2"
				>
					<Edit className="h-5 w-5" />
					Edit Workout
				</Link>
			</div>

			<div className="border-2 border-black mb-6">
				{/* Workout Details Section */}
				<div className="p-6 border-b-2 border-black">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h2 className="mb-4">DESCRIPTION</h2>
							<p className="text-lg mb-6">{workout.description}</p>

							<div className="flex items-center gap-2 mb-4">
								<Clock className="h-5 w-5" />
								<h3>SCHEME</h3>
							</div>
							<div className="border-2 border-black p-4 mb-6">
								<p className="text-lg font-bold uppercase">{workout.scheme}</p>
							</div>

							<div className="flex items-center gap-2 mb-4">
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
						</div>

						<div>
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
						</div>
					</div>
				</div>

				{/* Results Section Placeholder */}
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<h2>WORKOUT RESULTS</h2>
						<button className="btn">Log Result</button>
					</div>
					<div className="text-gray-500">Results integration coming soon.</div>
				</div>
			</div>
		</div>
	);
}
