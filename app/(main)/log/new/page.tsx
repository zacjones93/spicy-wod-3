import { auth } from "@/auth";
import { getAllWorkouts } from "@/server/functions/workout";
import { redirect } from "next/navigation";
import LogFormClient from "./_components/log-form-client";

import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://spicywod.com"),
	title: "Spicy WOD | Log your Workout",
	description: "Track your spicy workouts and progress.",
	openGraph: {
		title: "Spicy WOD | Log your Workout", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent(
					"Spicy WOD | Log your Workout"
				)}`,
				width: 1200,
				height: 630,
				alt: "Spicy WOD | Log your Workout",
			},
		],
	},
};

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
