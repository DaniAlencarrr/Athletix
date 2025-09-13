import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const PROTECTED_PREFIX = "/dashboard";
const PUBLIC_ROUTES = ["/login", "/registrar"];
const ONBOARDING_ROUTE = "/onboarding";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = nextUrl.pathname.startsWith(PROTECTED_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isOnboardingRoute = nextUrl.pathname === ONBOARDING_ROUTE;

  console.log("=== MIDDLEWARE SIMPLES ===");
  console.log("URL:", nextUrl.pathname);
  console.log("Logado:", isLoggedIn);
  console.log("Rota protegida:", isProtectedRoute);
  console.log("Rota onboarding:", isOnboardingRoute);

  // Se não estiver logado e tentar acessar rota protegida
  if (isProtectedRoute && !isLoggedIn) {
    console.log("❌ Usuário não logado - redirecionando para login");
    const signInUrl = new URL("/login", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  // Se estiver logado e tentar acessar rota pública
  if (isLoggedIn && isPublicRoute) {
    console.log("🔄 Usuário logado em rota pública - redirecionando para home");
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Se estiver logado, verificar onboarding usando dados do JWT com fallback para banco
  if (isLoggedIn && (isProtectedRoute || isOnboardingRoute)) {
    const userId = req.auth?.user?.id;
    const jwtOnboardingCompleted = req.auth?.user?.onboardingCompleted;
    const jwtRole = req.auth?.user?.role;
    
    if (!userId) {
      console.log("❌ ID do usuário não encontrado");
      return NextResponse.redirect(new URL("/login", nextUrl.origin));
    }

    console.log("🔍 Verificando onboarding para usuário:", userId);
    console.log("📊 Dados do JWT:", {
      userId,
      onboardingCompleted: jwtOnboardingCompleted,
      role: jwtRole,
      type: typeof jwtOnboardingCompleted
    });

    // Se JWT tem dados válidos, usar eles
    if (jwtOnboardingCompleted !== undefined && jwtOnboardingCompleted !== null) {
      console.log("✅ Usando dados do JWT");
      
      if (jwtOnboardingCompleted === true) {
        console.log("✅ ONBOARDING COMPLETO (via JWT)!");
        
        if (isOnboardingRoute) {
          console.log("🔄 Redirecionando de /onboarding para /dashboard");
          return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
        }
        
        if (isProtectedRoute) {
          console.log("✅ Permitindo acesso ao dashboard");
          return NextResponse.next();
        }
      }

      if (jwtOnboardingCompleted !== true) {
        console.log("❌ ONBOARDING NÃO COMPLETO (via JWT)");
        
        if (isProtectedRoute) {
          console.log("🔄 Redirecionando para /onboarding");
          return NextResponse.redirect(new URL("/onboarding", nextUrl.origin));
        }
        
        if (isOnboardingRoute) {
          console.log("✅ Permitindo acesso à página de onboarding");
          return NextResponse.next();
        }
      }
    } else {
      // Fallback: consultar banco de dados
      console.log("⚠️ JWT não tem dados de onboarding - consultando banco");
      
      try {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { 
            onboardingCompleted: true,
            role: true 
          }
        });

        console.log("📊 Dados do banco:", {
          exists: !!user,
          onboardingCompleted: user?.onboardingCompleted,
          role: user?.role
        });

        if (!user) {
          console.log("❌ Usuário não encontrado no banco");
          return NextResponse.redirect(new URL("/onboarding", nextUrl.origin));
        }

        if (user.onboardingCompleted === true) {
          console.log("✅ ONBOARDING COMPLETO (via banco)!");
          
          if (isOnboardingRoute) {
            console.log("🔄 Redirecionando de /onboarding para /dashboard");
            return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
          }
          
          if (isProtectedRoute) {
            console.log("✅ Permitindo acesso ao dashboard");
            return NextResponse.next();
          }
        }

        if (user.onboardingCompleted !== true) {
          console.log("❌ ONBOARDING NÃO COMPLETO (via banco)");
          
          if (isProtectedRoute) {
            console.log("🔄 Redirecionando para /onboarding");
            return NextResponse.redirect(new URL("/onboarding", nextUrl.origin));
          }
          
          if (isOnboardingRoute) {
            console.log("✅ Permitindo acesso à página de onboarding");
            return NextResponse.next();
          }
        }
      } catch (error) {
        console.error("❌ Erro ao consultar banco:", error);
        
        if (isProtectedRoute) {
          console.log("⚠️ Erro - redirecionando para onboarding");
          return NextResponse.redirect(new URL("/onboarding", nextUrl.origin));
        }
        
        console.log("✅ Erro em rota não protegida - permitindo acesso");
        return NextResponse.next();
      }
    }

    // Fallback final
    console.log("✅ Fallback final - permitindo acesso");
    return NextResponse.next();
  }

  console.log("✅ Continuando para próxima etapa");
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};