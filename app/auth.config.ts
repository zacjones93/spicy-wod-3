import type { DefaultSession, NextAuthConfig } from "next-auth";
import { getUserId } from "./server/functions/user";
import deepmerge from "deepmerge";


interface Session {
  user: {
    id: string;
  } & DefaultSession["user"];
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async session({ session, token, user }) {
      const userEmail = session.user?.email ?? "";

      if (!userEmail) {
        // If there's no email, we can't fetch the user, return session as is.
        return session;
      }


      const userId = await getUserId(userEmail)
      if (!userId) {
        return session; // Or handle the case where user is not found appropriately
      }

      return deepmerge(session, {
        user: {
          id: userId,
        },
      });
    },
  },
} satisfies NextAuthConfig;
