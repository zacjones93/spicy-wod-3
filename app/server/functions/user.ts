"use server";

import { getDbAsync } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { userSchema } from "@/server/db/types";

export async function getUserId(email: string) {
  const db = await getDbAsync();
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0].id;
}

export async function getUser(email: string) {
  if (!email) return null;
  const db = await getDbAsync();
  const user = await db.select().from(users).where(eq(users.email, email));
  const parsedUser = userSchema.safeParse(user[0]);
  if (!parsedUser.success) {
    console.error("Error parsing user", parsedUser.error);
    return null;
  }

  return parsedUser.data;
}
export async function createUser(email: string, password: string) {
  const db = await getDbAsync();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, hashedPassword: hash, passwordSalt: salt, joinedAt: new Date() });
}