import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { findUserByEmail, upsertOAuthUser } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        const user = await findUserByEmail(email);
        if (!user || !user.password_hash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          investorCategory: user.investor_category,
          dematProvider: user.demat_provider,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const dbUser = await upsertOAuthUser({
            name: user.name || "Investor",
            email: user.email,
            image: user.image || undefined,
          });
          if (dbUser) {
            user.id = dbUser.id;
            (user as any).phone = dbUser.phone;
            (user as any).investorCategory = dbUser.investor_category;
            (user as any).dematProvider = dbUser.demat_provider;
          }
        } catch (err) {
          console.error("Error upserting Google user in Neon DB:", err);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.investorCategory = (user as any).investorCategory;
        token.dematProvider = (user as any).dematProvider;
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.phone = session.user.phone;
        token.investorCategory = session.user.investorCategory;
        token.dematProvider = session.user.dematProvider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone as string;
        (session.user as any).investorCategory = token.investorCategory as string;
        (session.user as any).dematProvider = token.dematProvider as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET,
});
