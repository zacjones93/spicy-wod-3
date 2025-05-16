import { randomBytes, pbkdf2Sync } from "crypto";
import { getUser } from "@/server/functions/user";


const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
}

export async function verifyPassword(email: string, candidatePassword: string): Promise<boolean> {
  console.log(`[verifyPassword] Verifying for email: ${email}`)
  const user = await getUser(email)
  if (!user) {
    console.log(`[verifyPassword] No user found for email: ${email}`)
    return false
  }
  if (!user.hashedPassword || !user.passwordSalt) {
    console.log(`[verifyPassword] Missing hash or salt for user: ${email}`)
    return false
  }
  const candidateHash = hashPassword(candidatePassword, user.passwordSalt)
  const match = candidateHash === user.hashedPassword
  console.log(`[verifyPassword] Hash match: ${match}`)
  return match
}

