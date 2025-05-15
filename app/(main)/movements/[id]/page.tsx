import { getMovementById } from "@/server/functions/movement";
import { getWorkoutsByMovementId } from "@/server/functions/workout";
import Link from "next/link";
import MovementDetailClient from "./_components/movement-detail-client"; // Will create this next

export const dynamic = "force-dynamic";

export default async function MovementDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const myParams = await params;
	const movement = await getMovementById(myParams.id);

	if (!movement) {
		console.log(
			`[movements/[id]/page] Movement not found for id: ${myParams.id}`
		);
		return <div>Movement not found.</div>;
	}

	const workouts = await getWorkoutsByMovementId(myParams.id);
	console.log(
		`[movements/[id]/page] Found ${workouts.length} workouts for movement ${movement.name}`
	);

	return <MovementDetailClient movement={movement} workouts={workouts} />;
}
