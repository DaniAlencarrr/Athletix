"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import {
  SignInSchema,
  SignInSchemaType,
  SignUpSchema,
  SignUpSchemaType,
} from "@/schemas";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";

export const userSignIn = async (data: SignInSchemaType) => {
  const validatedFields = SignInSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error:
        "Campos inválidos. Por favor, verifique os dados e tente novamente.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return { error: "Credenciais inválidas." };
    }
    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciais inválidas." };
        default:
          return { error: "Ocorreu um erro durante o login." };
      }
    }
    throw error;
  }
};

export const userSignUp = async (data: SignUpSchemaType) => {
  const validatedFields = SignUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error:
        "Campos inválidos. Por favor, verifique os dados e tente novamente.",
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    return {
      error: "Este e-mail já está em uso.",
    };
  }
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });
  await userSignIn({
    email,
    password,
  });
  return { success: "Usuário cadastrado com sucesso!" };
};
