// app/api/athletes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Rota da API para buscar atletas.
 * - Se o parâmetro 'name' for fornecido (ex: /api/athletes?name=joao-pedro), busca um atleta específico.
 * - Se nenhum parâmetro for fornecido (ex: /api/athletes), retorna uma lista de todos os atletas.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const nameSlug = searchParams.get('name');

  try {
    if (nameSlug) {
      const searchName = nameSlug.replace(/-/g, ' ');

      const athlete = await prisma.user.findFirst({
        where: {
          name: {
            contains: searchName,
            mode: 'insensitive',
          },
          role: UserRole.Atleta,
        },
        include: {
          athlete: true,
          address: true,
        },
      });

      if (!athlete) {
        return NextResponse.json({ error: 'Atleta não encontrado' }, { status: 404 });
      }

      return NextResponse.json(athlete, { status: 200 });
    }

    const athletes = await prisma.user.findMany({
      where: {
        role: UserRole.Atleta,
      },
      include: {
        athlete: true,
        address: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(athletes, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar atletas:", error);
    return NextResponse.json({ error: 'Ocorreu um erro interno no servidor.' }, { status: 500 });
  }
}