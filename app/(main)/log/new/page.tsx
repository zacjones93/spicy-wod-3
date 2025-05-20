import { auth } from "@/auth";
import { getAllWorkouts } from "@/server/functions/workout";
import { redirect } from "next/navigation";
import LogFormClient from "./_components/log-form-client";

export const dynamic = "force-dynamic";

export default async function LogNewResultPage({
	searchParams,
}: {
	searchParams?: Promise<{ workoutId?: string; redirectUrl?: string }>;
}) {
	console.log("[log/new] Fetching workouts for log form");
	const session = await auth();
	const mySearchParams = await searchParams;

	if (!session || !session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	const workouts = await getAllWorkouts();
	return (
		<LogFormClient
			workouts={workouts}
			userId={session.user.id}
			selectedWorkoutId={mySearchParams?.workoutId}
			redirectUrl={mySearchParams?.redirectUrl}
		/>
	);
}
