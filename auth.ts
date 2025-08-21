// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import { authConfig } from "@/lib/auth.config";
// import { SignInSchema } from "@/schemas";
// import { userService } from "./service/user.service";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   session: { strategy: "jwt" },
//   providers: [
//     Credentials({
//       authorize: async (credentials) => {
//         const validated = await SignInSchema.safeParseAsync(credentials);
//         if (!validated.success) return null;

//         const { email, password } = validated.data;
//         const user = await userService.findByEmail(email);
//         if (!user || !user.password) return null;

//         const passwordsMatch = await bcrypt.compare(password, user.password);
//         if (!passwordsMatch) return null;

//         const { password: _, ...userWithoutPassword } = user;
//         return userWithoutPassword;
//       },
//     }),
//     Google,
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token.sub) session.user.id = token.sub;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) token.sub = user.id;
//       return token;
//     },
//   },
// });





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