"use server";

import bcrypt from "bcryptjs";
import { SignUpSchema, SignUpSchemaType } from "@/schemas";
import { db } from "@/lib/db";

export const register = async (data: SignUpSchemaType) => {
  const validatedFields = SignUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Campos inválados!" };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Este e-mail já está em uso." };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return { success: "Conta criada com sucesso! Agora vamos fazer o login." };
};