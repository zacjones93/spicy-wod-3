import { getAllWorkouts } from "@/server/functions/workout";
import LogFormClient from "./_components/log-form-client";
import { getUser } from "@/server/functions/user";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function LogNewResultPage({
	searchParams,
}: {
	searchParams?: Promise<{ workoutId?: string; redirectUrl?: string }>;
}) {
	console.log("[log/new] Fetching workouts for log form");
	let session = await auth();
	const mySearchParams = await searchParams;

	if (!session || !session?.user?.email) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	const user = await getUser(session?.user?.email);

	if (!user) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	const workouts = await getAllWorkouts();
	return (
		<LogFormClient
			workouts={workouts}
			userId={user.id}
			selectedWorkoutId={mySearchParams?.workoutId}
			redirectUrl={mySearchParams?.redirectUrl}
		/>
	);
}
