import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIX = "/dashboard";
const PUBLIC_ROUTES = ["/login", "/registrar"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = nextUrl.pathname.startsWith(PROTECTED_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/login", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};