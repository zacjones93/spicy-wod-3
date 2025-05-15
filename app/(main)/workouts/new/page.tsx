import { auth } from "@/auth";
import CreateWorkoutClient from "./_components/create-workout-client";
import { getAllMovements } from "@/server/functions/movement";
import { getAllTags } from "@/server/functions/tag";
import { createWorkout } from "@/server/functions/workout";
import { getUser } from "@/server/functions/user";

export const dynamic = "force-dynamic";

export default async function CreateWorkoutPage() {
	const movements = await getAllMovements();
	const tags = await getAllTags();

	let session = await auth();

	if (!session || !session?.user?.email) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	const user = await getUser(session?.user?.email);

	if (!user || !user.id) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

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
		if (!user || !user.id) {
			console.log("[log/page] No user found");
			throw new Error("No user found");
		}

		try {
			await createWorkout({ ...data, userId: user.id });
		} catch (error) {
			console.error("[log/page] Error creating workout", error);
			throw new Error("Error creating workout");
		}
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
