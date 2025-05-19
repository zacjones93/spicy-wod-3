"use server";

import { getDb } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserNameAction(userId: string, newName: string) {
  "use server"
  const db = getDb();
  try {
    if (!userId) {
      return { error: "User ID is required." };
    }
    if (newName === null || newName.trim() === "") {
      // Allow unsetting the name by passing an empty string, which will be stored as NULL
      // or handle as an error if name is mandatory. Assuming name can be nullable.
      await db.update(users).set({ name: null }).where(eq(users.id, userId));
    } else {
      await db.update(users).set({ name: newName }).where(eq(users.id, userId));
    }
    revalidatePath("/profile"); // Revalidate the profile page to show the updated name
    revalidatePath("/"); // Revalidate other paths if the name is displayed elsewhere, e.g., navbar
    return { success: "Name updated successfully." };
  } catch (error) {
    console.error("Error updating user name:", error);
    return { error: "Failed to update name. Please try again." };
  }
} 