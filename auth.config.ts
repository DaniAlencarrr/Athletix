import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/register",
    signOut: "/",
    error: "/error",
  },
  providers: [
    // Deixe os providers aqui se eles forem "stateless" (como Google).
    // O provider 'Credentials' ficará no arquivo principal, pois ele depende do bcrypt e do banco de dados.
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        const isOnAuthPage =
          nextUrl.pathname.startsWith("/login") ||
          nextUrl.pathname.startsWith("/register");
        if (isOnAuthPage) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
    session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token }) {
      return token;
    },
  },
} satisfies NextAuthConfig;
