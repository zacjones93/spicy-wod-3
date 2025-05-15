import { getAllTags, getAllMovements } from "@/server/functions/workout";
import CreateWorkoutClient from "./_components/create-workout-client";

export default async function CreateWorkoutPage() {
	const movements = await getAllMovements();
	const tags = await getAllTags();

	return <CreateWorkoutClient movements={movements} tags={tags} />;
}
