import { getWorkoutById } from "@/server/functions/workout";
import WorkoutDetailClient from "./_components/workout-detail-client";
import { auth } from "@/auth";
import { getWorkoutResultsByWorkoutAndUser } from "@/server/functions/workout-results";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkoutDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const myParams = await params;
	const workout = await getWorkoutById(myParams.id);

	let session = await auth();

	if (!session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	if (!workout) return <div>Workout not found.</div>;

	const results = await getWorkoutResultsByWorkoutAndUser(
		myParams.id,
		session?.user?.id
	);

	return (
		<WorkoutDetailClient
			userId={session?.user?.id}
			workout={workout}
			workoutId={myParams.id}
			results={results}
		/>
	);
}
