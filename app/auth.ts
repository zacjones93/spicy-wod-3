import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { getUser } from '@/server/functions/user';
import { authConfig } from './auth.config';
import { User } from '@/server/db/types';

export const {    
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (!user) return null;
        let passwordsMatch = await compare(password, user.hashedPassword!);
        if (passwordsMatch) return user as any;
      },
    }),
  ],
});
