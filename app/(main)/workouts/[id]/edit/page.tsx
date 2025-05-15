import { getWorkoutById } from "@/server/functions/workout";
import { getAllTags } from "@/server/functions/tag";
import { getAllMovements } from "@/server/functions/movement";
import EditWorkoutClient from "./_components/edit-workout-client";

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
