import { auth } from "@/auth";
import { getAllMovements } from "@/server/functions/movement";
import { getAllTags } from "@/server/functions/tag";
import { getUser } from "@/server/functions/user";
import { getWorkoutById } from "@/server/functions/workout";
import { updateWorkout } from "@/server/functions/workout";
import type { WorkoutUpdate } from "@/types/workout";
import { redirect } from "next/navigation";
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

	const session = await auth();

	if (!session || !session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	if (workout?.userId !== session?.user?.id) {
		redirect(`/workouts/${workout?.id}`);
	}

	if (!workout) {
		return <div>Workout not found</div>;
	}

	async function updateWorkoutAction(data: {
		id: string;
		workout: WorkoutUpdate;
		tagIds: string[];
		movementIds: string[];
	}) {
		"use server";
		try {
			await updateWorkout({
				id: data.id,
				workout: data.workout,
				tagIds: data.tagIds,
				movementIds: data.movementIds,
			});
		} catch (error) {
			console.error("[EditWorkoutPage] Error updating workout", error);
			// Optionally, re-throw or return an error object to the client
			throw new Error("Error updating workout");
		}
		redirect(`/workouts/${data.id}`);
	}

	return (
		<EditWorkoutClient
			workout={workout}
			movements={movements}
			tags={tags}
			workoutId={myParams.id}
			updateWorkoutAction={updateWorkoutAction}
		/>
	);
}
