import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Buscar dados atualizados do usuário no banco
    const updatedUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        onboardingCompleted: true
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        role: updatedUser.role,
        onboardingCompleted: updatedUser.onboardingCompleted
      },
      message: "Dados atualizados com sucesso"
    });
    
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
