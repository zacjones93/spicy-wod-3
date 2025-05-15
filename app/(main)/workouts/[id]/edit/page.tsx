import { getWorkoutById } from "@/server/functions/workout";
import { getAllTags } from "@/server/functions/tag";
import { getAllMovements } from "@/server/functions/movement";
import EditWorkoutClient from "./_components/edit-workout-client";

export default async function EditWorkoutPage({
	params,
}: {
	params: { id: string };
}) {
	const workout = await getWorkoutById(params.id);
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
			workoutId={params.id}
		/>
	);
}
