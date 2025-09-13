import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OnboardingSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
// import { update } from "@/auth"; // Removido temporariamente

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Sessão:", session?.user?.id ? "Usuário logado" : "Usuário não logado");
    
    if (!session?.user?.id) {
      console.log("Erro: Usuário não autorizado");
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Dados recebidos:", body);
    
    // Validar os dados do formulário
    const validatedData = OnboardingSchema.parse(body);
    console.log("Dados validados:", validatedData);
    
    // Determinar a role baseada no userType
    const role: UserRole = validatedData.userType === "coach" ? "Treinador" : "Atleta";
    console.log("Role definida:", role);
    
    // Verificar se a role é válida
    if (!role || (role !== "Treinador" && role !== "Atleta")) {
      console.error("❌ Role inválida:", role);
      return NextResponse.json(
        { error: "Tipo de usuário inválido" },
        { status: 400 }
      );
    }
    
    // Preparar dados para atualização do usuário
    const userUpdateData = {
      onboardingCompleted: true,
      role,
      birthDate: validatedData.birthDate,
      bio: validatedData.bio,
    };

    console.log("✅ Dados do usuário para atualização:", userUpdateData);

    // Usar transação para garantir consistência dos dados
    const result = await db.$transaction(async (tx) => {
      // Atualizar o usuário no banco de dados
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: userUpdateData,
      });

      // Criar registro específico baseado no tipo de usuário
      if (validatedData.userType === "coach") {
        const coachData = {
          experience: validatedData.experience,
          hourlyRate: validatedData.hourlyRate,
          certifications: validatedData.certifications,
        };
        
        console.log("Criando registro de treinador:", coachData);
        
        await tx.coach.create({
          data: {
            userId: session.user.id!,
            ...coachData,
          },
        });
        
        console.log("Registro de treinador criado com sucesso");
      } else {
        const athleteData = {
          sport: validatedData.sport,
          height: validatedData.height,
          weight: validatedData.weight,
          injuryHistory: validatedData.injuryHistory || null,
        };
        
        console.log("Criando registro de atleta:", athleteData);
        
        await tx.athlete.create({
          data: {
            userId: session.user.id!,
            ...athleteData,
          },
        });
        
        console.log("Registro de atleta criado com sucesso");
      }

      // Criar registro de endereço
      const addressData = {
        street: validatedData.street,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        country: validatedData.country,
      };
      
      console.log("Criando registro de endereço:", addressData);
      
      await tx.address.create({
        data: {
          userId: session.user.id!,
          ...addressData,
        },
      });
      
      console.log("Registro de endereço criado com sucesso");

      return updatedUser;
    });

    console.log("✅ Usuário atualizado:", {
      id: result.id,
      role: result.role,
      onboardingCompleted: result.onboardingCompleted
    });

    // Verificação final de segurança
    if (result.onboardingCompleted !== true) {
      console.error("❌ ERRO CRÍTICO: onboardingCompleted não foi definido como true");
      return NextResponse.json(
        { error: "Erro interno: falha ao completar onboarding" },
        { status: 500 }
      );
    }

    if (!result.role) {
      console.error("❌ ERRO CRÍTICO: role não foi definida");
      return NextResponse.json(
        { error: "Erro interno: falha ao definir role do usuário" },
        { status: 500 }
      );
    }

    console.log("🎉 Onboarding concluído com sucesso! Usuário pode acessar o dashboard.");

    // JWT será atualizado automaticamente no próximo login
    console.log("✅ JWT será atualizado automaticamente no próximo login");

    return NextResponse.json(
      { 
        success: "Onboarding concluído com sucesso!",
        user: {
          id: result.id,
          role: result.role,
          onboardingCompleted: result.onboardingCompleted
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Erro no onboarding:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      console.log("Erro de validação Zod:", error.message);
      return NextResponse.json(
        { error: "Dados inválidos. Verifique os campos obrigatórios." },
        { status: 400 }
      );
    }
    
    // Verificar se é erro de constraint do banco de dados
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      console.log("Erro de constraint única:", error.message);
      return NextResponse.json(
        { error: "Usuário já possui dados de onboarding. Tente fazer login." },
        { status: 409 }
      );
    }
    
    // Verificar se é erro de conexão com banco
    if (error instanceof Error && error.message.includes("connect")) {
      console.log("Erro de conexão com banco:", error.message);
      return NextResponse.json(
        { error: "Erro de conexão. Tente novamente em alguns instantes." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

