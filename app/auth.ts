import { User } from "@/server/db/types";
import { getUser } from "@/server/functions/user";
import { compare } from "bcrypt-ts";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, request) {
				const email =
					typeof credentials?.email === "string"
						? credentials.email
						: undefined;
				const password =
					typeof credentials?.password === "string"
						? credentials.password
						: undefined;

				if (!email || !password) {
					return null;
				}

				const user = await getUser(email);
				if (!user || !user.hashedPassword) {
					return null;
				}

				const passwordsMatch = await compare(password, user.hashedPassword);
				if (passwordsMatch) {
					return user;
				}
				return null;
			},
		}),
	],
});
