import { getDb } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { userSchema } from "@/server/db/types";

export async function getUser(email: string) {
  const db = getDb();
  const user = await db.select().from(users).where(eq(users.email, email));
  return userSchema.parse(user[0]);
}
export async function createUser(email: string, password: string) {
  const db = getDb();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, hashedPassword: hash, passwordSalt: salt, joinedAt: new Date() });
}