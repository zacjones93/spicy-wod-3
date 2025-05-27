import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDbAsync } from "../db";
import { movements } from "../db/schema";

type MovementType = "strength" | "gymnastic" | "monostructural";
const VALID_MOVEMENT_TYPES: MovementType[] = ["strength", "gymnastic", "monostructural"];

// Fetch all movements
export async function getAllMovements() {
	console.log("[server/functions/movement] getAllMovements called");
	try {
		const db = await getDbAsync();
		const allMovements = await db.select().from(movements);
		console.log(`[server/functions/movement] Fetched ${allMovements.length} movements`);
		return allMovements;
	} catch (error) {
		console.error("[server/functions/movement] Error in getAllMovements:", error);
		throw new Error("Failed to fetch movements.");
	}
}

// Fetch a single movement by ID
export async function getMovementById(id: string) {
	console.log(`[server/functions/movement] getMovementById called for id: ${id}`);
	try {
		const db = await getDbAsync();
		const movement = await db.select().from(movements).where(eq(movements.id, id));
		if (movement.length === 0) {
			console.log(`[server/functions/movement] No movement found for id: ${id}`);
			return null;
		}
		console.log(`[server/functions/movement] Fetched movement: ${movement[0].name}`);
		return movement[0];
	} catch (error) {
		console.error(`[server/functions/movement] Error in getMovementById for id ${id}:`, error);
		throw new Error("Failed to fetch movement.");
	}
}

// Create a new movement
export async function createMovement(data: {
	name: string;
	type: string;
	// userId is not in the current schema for movements table
	userId?: string;
}) {
	console.log("[server/functions/movement] createMovement called with data:", data);
	const db = await getDbAsync();
	const { name, type: rawType } = data;

	const lowerCaseType = rawType.toLowerCase();

	if (!VALID_MOVEMENT_TYPES.includes(lowerCaseType as MovementType)) {
		const errorMessage = `Invalid movement type: '${lowerCaseType}'. Must be one of: ${VALID_MOVEMENT_TYPES.join(", ")}.`;
		console.error(`[server/functions/movement] ${errorMessage}`);
		throw new Error(errorMessage);
	}

	const movementType = lowerCaseType as MovementType; // Type assertion after validation

	if (!name) {
		// type is already validated by implication above
		console.error("[server/functions/movement] Name is required.");
		throw new Error("Movement name is required.");
	}

	const movementId = crypto.randomUUID();
	console.log(`[server/functions/movement] Generated movementId: ${movementId}`);

	try {
		await db.insert(movements).values({
			id: movementId,
			name,
			type: movementType,
		});
		console.log(`[server/functions/movement] Movement created successfully: ${movementId}`);

		revalidatePath("/movements");
		revalidatePath("/"); // Revalidate home page if it lists movements or related data
		console.log("[server/functions/movement] Revalidated paths: /movements, /");

		// Return the created movement or its ID, could be useful for the client
		// For now, the action in page.tsx doesn't expect a return value for redirection
		return { id: movementId, name, movementType };
	} catch (error) {
		console.error(`[server/functions/movement] Error creating movement '${name}':`, error);
		// Consider more specific error messages based on error type
		throw new Error("Failed to create movement in the database.");
	}
}
