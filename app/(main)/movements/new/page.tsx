import { auth } from "@/auth";
import CreateMovementForm from "./_components/create-movement-form";
import { createMovement } from "@/server/functions/movement";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateMovementPage() {
	let session = await auth();

	if (!session || !session?.user?.id) {
		console.log("[movements/new/page] No user found");
		redirect("/login");
	}

	async function createMovementAction(data: {
		name: string;
		type: string;
		// Potentially add description or other fields later
	}) {
		"use server";
		if (!session?.user?.id) {
			console.log("[movements/new/page] No user found during action");
			throw new Error("No user found");
		}

		try {
			// Assuming createMovement function takes an object with name, type, and userId
			await createMovement({ ...data, userId: session.user.id });
		} catch (error) {
			console.error("[movements/new/page] Error creating movement", error);
			throw new Error("Error creating movement");
		}
		// Client-side redirect will be handled in CreateMovementForm
	}

	return <CreateMovementForm createMovementAction={createMovementAction} />;
}
