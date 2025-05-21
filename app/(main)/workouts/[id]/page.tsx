import { auth } from "@/auth";
import { getWorkoutById } from "@/server/functions/workout";
import {
	getResultSetsById,
	getWorkoutResultsByWorkoutAndUser,
} from "@/server/functions/workout-results";
import { redirect } from "next/navigation";
import WorkoutDetailClient from "./_components/workout-detail-client";
import type { Set } from "@/types";

export default async function WorkoutDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const myParams = await params;
	const workout = await getWorkoutById(myParams.id);

	const session = await auth();

	if (!session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	if (!workout) return <div>Workout not found.</div>;

	const results = await getWorkoutResultsByWorkoutAndUser(
		myParams.id,
		session?.user?.id
	);

	const resultsWithSets = await (async () => {
		if (
			!workout?.roundsToScore ||
			workout.roundsToScore <= 1 ||
			results.length === 0
		) {
			return results.map((result) => ({ ...result, sets: null }));
		}

		const allSetsPromises = results.map(async (result) => {
			const sets = await getResultSetsById(result.id);
			return { ...result, sets: sets && sets.length > 0 ? sets : null };
		});

		return Promise.all(allSetsPromises);
	})();

	return (
		<WorkoutDetailClient
			userId={session?.user?.id}
			workout={workout}
			workoutId={myParams.id}
			resultsWithSets={resultsWithSets}
		/>
	);
}
