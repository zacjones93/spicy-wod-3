import { auth } from "@/auth";
import { getAllMovements } from "@/server/functions/movement";
import { getAllTags } from "@/server/functions/tag";
import { createWorkout } from "@/server/functions/workout";
import { fromZonedTime } from "date-fns-tz";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CreateWorkoutClient from "./_components/create-workout-client";
import type { WorkoutCreate, Tag, Movement } from "@/types";
export const dynamic = "force-dynamic";

export default async function CreateWorkoutPage() {
	const movements = await getAllMovements();
	const tags = await getAllTags();

	const session = await auth();

	if (!session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	async function createWorkoutAction(data: {
		workout: Omit<WorkoutCreate, "createdAt">;
		tagIds: Tag["id"][];
		movementIds: Movement["id"][];
	}) {
		"use server";
		if (!session?.user?.id) {
			console.log("[log/page] No user found");
			throw new Error("No user found");
		}

		const headerList = await headers();
		const timezone = headerList.get("x-vercel-ip-timezone") ?? "America/Denver";
		const date =  new Date().toISOString().split("T")[0]
		const createdAtDate = fromZonedTime(
			`${date}T00:00:00`,
			timezone,
		);

		try {
			await createWorkout({
				...data,
				workout: {
					...data.workout,
					createdAt: createdAtDate,
				},
				userId: session?.user?.id,
			});
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
