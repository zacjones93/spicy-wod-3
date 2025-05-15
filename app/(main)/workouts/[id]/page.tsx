import { getWorkoutById } from "@/server/functions/workout";
import WorkoutDetailClient from "./_components/workout-detail-client";
import { getUser } from "@/server/functions/user";
import { auth } from "@/auth";
import { getWorkoutResultsByWorkoutAndUser } from "@/server/functions/workout-results";

export default async function WorkoutDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const workout = await getWorkoutById(params.id);

	let session = await auth();

	if (!session || !session?.user?.email) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	const user = await getUser(session?.user?.email);

	if (!user) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	if (!workout) return <div>Workout not found.</div>;

	const results = await getWorkoutResultsByWorkoutAndUser(params.id, user.id);

	return (
		<WorkoutDetailClient
			userId={user.id}
			workout={workout}
			workoutId={params.id}
			results={results}
		/>
	);
}
