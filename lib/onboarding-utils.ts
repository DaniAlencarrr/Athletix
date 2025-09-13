import { db } from "@/lib/db";

export interface OnboardingStatus {
  isComplete: boolean;
  hasRole: boolean;
  userExists: boolean;
  role?: string | null;
  onboardingCompleted?: boolean | null;
}

/**
 * Verifica o status do onboarding de um usuário
 * @param userId ID do usuário
 * @returns Status do onboarding
 */
export async function checkOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { 
        onboardingCompleted: true,
        role: true 
      }
    });

    if (!user) {
      return {
        isComplete: false,
        hasRole: false,
        userExists: false,
        role: null,
        onboardingCompleted: null
      };
    }

    const isComplete = user.onboardingCompleted === true;
    const hasRole = !!user.role;

    return {
      isComplete,
      hasRole,
      userExists: true,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted
    };
  } catch (error) {
    console.error("Erro ao verificar status do onboarding:", error);
    return {
      isComplete: false,
      hasRole: false,
      userExists: false,
      role: null,
      onboardingCompleted: null
    };
  }
}

/**
 * Verifica se o usuário pode acessar o dashboard
 * @param userId ID do usuário
 * @returns true se pode acessar o dashboard
 */
export async function canAccessDashboard(userId: string): Promise<boolean> {
  const status = await checkOnboardingStatus(userId);
  
  // Usuário pode acessar o dashboard se:
  // 1. Existe no banco
  // 2. Completou o onboarding (onboardingCompleted === true)
  return status.userExists && status.isComplete;
}

/**
 * Verifica se o usuário deve ser redirecionado para onboarding
 * @param userId ID do usuário
 * @returns true se deve ser redirecionado para onboarding
 */
export async function shouldRedirectToOnboarding(userId: string): Promise<boolean> {
  const status = await checkOnboardingStatus(userId);
  
  // Deve ser redirecionado se:
  // 1. Não existe no banco OU
  // 2. Não completou o onboarding
  return !status.userExists || !status.isComplete;
}
