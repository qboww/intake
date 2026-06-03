import { type NextAuthConfig } from 'next-auth';
import Google from '@auth/core/providers/google';
import { isEmailWhitelisted } from './whitelist';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async authorized({ auth, request }) {
      // Check if user is signed in
      if (!auth?.user?.email) {
        return false;
      }

      // Check if user's email is whitelisted
      if (!isEmailWhitelisted(auth.user.email)) {
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      // JWT callback - just return token
      // User will be created/updated on first API access
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
