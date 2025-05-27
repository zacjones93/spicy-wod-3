import { auth } from "@/auth";
import { getMovementById } from "@/server/functions/movement";
import { getWorkoutsByMovementId } from "@/server/functions/workout";
import { getWorkoutResultsByWorkoutAndUser } from "@/server/functions/workout-results";
import type { WorkoutResult } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import MovementDetailClient from "./_components/movement-detail-client"; // Will create this next

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const id = (await params).id;

	// fetch post information

	const movement = await getMovementById(id);

	if (!movement) {
		return {
			title: "Movement not found",
			description: "Movement not found",
		};
	}

	return {
		title: `Spicy WOD | ${movement.name}`,
		description: `Spicy WOD | ${movement.name}`,
		openGraph: {
			title: `Spicy WOD | ${movement.name}`,
			description: `Spicy WOD | ${movement.name}`,
			images: [
				{
					url: `/api/og?title=${encodeURIComponent(`Spicy WOD | ${movement.name}`)}`,
					width: 1200,
					height: 630,
					alt: `Spicy WOD | ${movement.name}`,
				},
			],
		},
	};
}

export default async function MovementDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const myParams = await params;

	const session = await auth();
	if (!session || !session?.user?.id) {
		console.log("[movements/[id]/page] User not authenticated");
		redirect("/login");
	}

	const movement = await getMovementById(myParams.id);

	if (!movement) {
		console.log(`[movements/[id]/page] Movement not found for id: ${myParams.id}`);
		return <div>Movement not found.</div>;
	}

	const workouts = await getWorkoutsByMovementId(myParams.id);
	console.log(
		`[movements/[id]/page] Found ${workouts.length} workouts for movement ${movement.name}`,
	);

	const workoutResultsMap: { [key: string]: WorkoutResult[] } = {};
	for (const workout of workouts) {
		const results = await getWorkoutResultsByWorkoutAndUser(workout.id, session.user.id);
		workoutResultsMap[workout.id] = results;
		console.log(
			`[movements/[id]/page] Found ${results.length} results for workout ${workout.name} (ID: ${workout.id})`,
		);
	}

	return (
		<MovementDetailClient
			movement={movement}
			workouts={workouts}
			workoutResults={workoutResultsMap}
			userId={session.user.id}
		/>
	);
}
