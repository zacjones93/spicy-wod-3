"use client";

import Link from "next/link";
import {
	ArrowLeft,
	Edit,
	Clock,
	Tag,
	Dumbbell,
	ListChecks,
} from "lucide-react";
import { type WorkoutResult } from "@/server/functions/workout-results";

export default function WorkoutDetailClient({
	userId,
	workout,
	workoutId,
	results,
}: {
	userId: string;
	workout: any;
	workoutId: string;
	results: WorkoutResult[];
}) {
	if (!workout) return <div>Loading...</div>;

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

				{/* Results Section */}
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-2">
							<ListChecks className="h-5 w-5" />
							<h2>WORKOUT RESULTS</h2>
						</div>
						<Link href={`/log/new?workoutId=${workoutId}`} className="btn">
							Log Result
						</Link>
					</div>
					{results && results.length > 0 ? (
						<div className="space-y-4">
							{results.map((result) => (
								<div key={result.id} className="border-2 border-black p-4">
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
