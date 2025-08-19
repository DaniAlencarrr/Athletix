// import NextAuth from "next-auth";
// import { authConfig } from "@/lib/auth.config";

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

import { auth } from "@/lib/auth";

export async function middleware(req: Request) {
  const session = await auth({ req });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return undefined; // permite que a rota prossiga
}

export const config = {
  matcher: ["/api/:path*"], // protege todas as rotas da API
};
