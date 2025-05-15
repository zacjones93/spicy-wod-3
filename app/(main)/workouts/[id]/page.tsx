import { getWorkoutById } from "@/server/functions/workout";
import WorkoutDetailClient from "./_components/workout-detail-client";

export default async function WorkoutDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const workout = await getWorkoutById(params.id);
	if (!workout) return <div>Workout not found.</div>;
	return <WorkoutDetailClient workout={workout} workoutId={params.id} />;
}
