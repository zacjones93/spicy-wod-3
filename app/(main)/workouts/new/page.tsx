import CreateWorkoutClient from "./_components/create-workout-client";
import { getAllMovements } from "@/server/functions/movement";
import { getAllTags } from "@/server/functions/tag";
import { createWorkout } from "@/server/functions/workout";

export default async function CreateWorkoutPage() {
	const movements = await getAllMovements();
	const tags = await getAllTags();

	async function createWorkoutAction(data: {
		workout: {
			id: string;
			name: string;
			description: string;
			scheme: string;
			createdAt: Date;
			roundsToScore?: number;
			repsPerRound?: number;
		};
		tagIds: string[];
		movementIds: string[];
	}) {
		"use server";
		await createWorkout(data);
		// Revalidate or redirect if necessary after creation,
		// but client-side redirect is already handled in CreateWorkoutClient
	}

	return (
		<CreateWorkoutClient
			movements={movements}
			tags={tags}
			createWorkoutAction={createWorkoutAction}
		/>
	);
}
