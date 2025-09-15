// app/api/coaches/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Rota da API para buscar treinadores.
 * - Se o parâmetro 'name' for fornecido (ex: /api/coaches?name=carlos-silva), busca um treinador específico.
 * - Se nenhum parâmetro for fornecido (ex: /api/coaches), retorna uma lista de todos os treinadores.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const nameSlug = searchParams.get('name');

  try {
    if (nameSlug) {
      const searchName = nameSlug.replace(/-/g, ' ');
      
      const coach = await prisma.user.findFirst({
        where: {
          name: {
            contains: searchName,
            mode: 'insensitive',
          },
          role: UserRole.Treinador,
        },
        include: {
          coach: true,
          address: true,
        },
      });

      if (!coach) {
        return NextResponse.json({ error: 'Treinador não encontrado' }, { status: 404 });
      }
      
      return NextResponse.json(coach, { status: 200 });
    }

    const coaches = await prisma.user.findMany({
      where: {
        role: UserRole.Treinador,
      },
      include: {
        coach: true,
        address: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(coaches, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar treinadores:", error);
    return NextResponse.json({ error: 'Ocorreu um erro interno no servidor.' }, { status: 500 });
  }
}