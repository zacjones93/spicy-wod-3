import { z } from "zod";

export const userSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		hashedPassword: z.string(),
		passwordSalt: z.string(),
		joinedAt: z.coerce.date(),
		name: z.string().nullish(),
	})
	.optional();
export type User = z.infer<typeof userSchema>;
