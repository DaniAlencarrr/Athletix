import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
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
        const decryptedPassword = decryptPasswordForTCC(
          user.password,
          encryptionKey
        );

        if (decryptedPassword === password) {
          return user;
        }

        return null;
      },
    }),
    Google,
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Quando o usuário faz login
      if (user) {
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      
      // Se for um update do token (quando onboarding é completado)
      if (trigger === "update") {
        // Buscar dados atualizados do usuário no banco
        const updatedUser = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            onboardingCompleted: true
          }
        });
        
        if (updatedUser) {
          token.role = updatedUser.role;
          token.onboardingCompleted = updatedUser.onboardingCompleted;
        }
      }
      
      // Sempre verificar se os dados do token estão atualizados
      // Se não tiver onboardingCompleted, buscar do banco
      if (token.sub && (token.onboardingCompleted === undefined || token.onboardingCompleted === null)) {
        console.log("🔄 JWT sem dados de onboarding - buscando do banco");
        const userData = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            onboardingCompleted: true
          }
        });
        
        if (userData) {
          token.role = userData.role;
          token.onboardingCompleted = userData.onboardingCompleted;
          console.log("✅ Dados do banco carregados no JWT:", userData);
        }
      }
      
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.role = token.role as UserRole | null;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean | null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
