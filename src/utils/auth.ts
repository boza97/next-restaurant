import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions, User, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './connect';
import { NextRequest } from 'next/server';

declare module 'next-auth' {
  interface Session {
    user: User & {
      isAdmin: boolean;
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token }) {
      const userInDb = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
      });
      token.isAdmin = userInDb!.isAdmin;
      return token;
    },
  },
};

export const getAuthSession = (req: NextRequest) => getServerSession({ req, ...authOptions });
