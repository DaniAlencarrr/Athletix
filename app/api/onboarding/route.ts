import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import {
  users,
  userProfiles,
  coachDetails,
  athleteDetails,
} from "@/lib/db/schema";
import { OnboardingFormData } from "@/types";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    const userId = session.user.id;

    const data = (await req.json()) as OnboardingFormData;

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          role: data.userType,
          birthDate: new Date(data.birthDate).toISOString().split("T")[0],
          bio: data.bio,
          onboardingCompleted: true,
        })
        .where(eq(users.id, userId));

      await tx.insert(userProfiles).values({
        userId: userId,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      });
      if (data.userType === "coach") {
        await tx.insert(coachDetails).values({
          userId: userId,
          experience: data.experience,
          hourlyRate: String(data.hourlyRate),
          certifications: data.certifications,
        });
      } else if (data.userType === "athlete") {
        await tx.insert(athleteDetails).values({
          userId: userId,
          sport: data.sport,
          height: data.height,
          weight: data.weight,
          injuryHistory: data.injuryHistory,
        });
      }
    });

    return NextResponse.json(
      { message: "Perfil criado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no onboarding:", error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: unknown }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Este usuário já completou o onboarding." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Ocorreu um erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
