import { getWorkoutById } from "@/server/functions/workout";
import { getAllTags } from "@/server/functions/tag";
import { getAllMovements } from "@/server/functions/movement";
import EditWorkoutClient from "./_components/edit-workout-client";
import { auth } from "@/auth";
import { getUser } from "@/server/functions/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditWorkoutPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const myParams = await params;
	const workout = await getWorkoutById(myParams.id);
	const movements = await getAllMovements();
	const tags = await getAllTags();

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

	if (workout?.userId !== user.id) {
		redirect(`/workouts/${workout?.id}`);
	}

	if (!workout) {
		return <div>Workout not found</div>;
	}

	return (
		<EditWorkoutClient
			workout={workout}
			movements={movements}
			tags={tags}
			workoutId={myParams.id}
		/>
	);
}
