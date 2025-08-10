import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import { SignInSchema } from "@/schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = await SignInSchema.safeParseAsync(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        return null;
      },
    }),
    Google,
  ],
});
