import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcryptjs";
import { decryptPasswordForTCC } from "./utils/vigenereCipher";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { SignInSchema } from "@/schemas";
import { KEY } from "./types/key";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await SignInSchema.parseAsync(credentials);

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

      if (!user || !user.password) {
          return null;
        }
        
        // const isValid = bcrypt.compareSync(password, user.password!);

        const encryptionKey = process.env.ENCRYPTION_KEY || KEY;
        const decryptedPassword = decryptPasswordForTCC(user.password, encryptionKey);

        if (decryptedPassword === password) {
          return user;
        }

        return null;
      },
    }),
    Google,
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
