import { auth } from "@/auth";
import { createMovement } from "@/server/functions/movement";
import { redirect } from "next/navigation";
import CreateMovementForm from "./_components/create-movement-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Spicy WOD | Create Movement",
	description: "Track your spicy workouts and progress.",
	openGraph: {
		title: "Spicy WOD | Create Movement", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("Spicy WOD | Create Movement")}`,
				width: 1200,
				height: 630,
				alt: "Spicy WOD | Create Movement",
			},
		],
	},
};

export default async function CreateMovementPage() {
	const session = await auth();

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
