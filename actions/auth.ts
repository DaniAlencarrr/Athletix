// "use server";

// import bcrypt from "bcryptjs";
// import { AuthError } from "next-auth";
// import { eq } from "drizzle-orm";
// import { signIn } from "@/auth";
// import {
//   SignInSchema,
//   SignInSchemaType,
//   SignUpSchema,
//   SignUpSchemaType,
// } from "@/schemas";
// import { db } from "@/lib/db/db";
// import { users, permissions } from "@/lib/db/schema";

// /**
//  * Realiza o login do usuário usando o provider "credentials".
//  * Esta função já estava correta, pois delega a lógica para o `signIn` do NextAuth.
//  */
// export const userSignIn = async (data: SignInSchemaType) => {
//   const validatedFields = SignInSchema.safeParse(data);

//   if (!validatedFields.success) {
//     return {
//       error:
//         "Campos inválidos. Por favor, verifique os dados e tente novamente.",
//     };
//   }

//   const { email, password } = validatedFields.data;

//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       redirectTo: "/dashboard",
//     });
//     // Se o signIn for bem-sucedido, ele redirecionará e este código não será executado.
//   } catch (error) {
//     if (error instanceof AuthError) {
//       // A mensagem de erro específica vem da sua função 'authorize' no auth.ts
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Credenciais inválidas." };
//         default:
//           return { error: "Ocorreu um erro durante o login." };
//       }
//     }
//     throw error;
//   }
// };

// /**
//  * Realiza o cadastro de um novo usuário e, em seguida, faz o login automaticamente.
//  */
// export const userSignUp = async (data: SignUpSchemaType) => {
//   const validatedFields = SignUpSchema.safeParse(data);

//   if (!validatedFields.success) {
//     return {
//       error:
//         "Campos inválidos. Por favor, verifique os dados e tente novamente.",
//     };
//   }
  
//   const {
//     name,
//     email,
//     password,
//     dateOfBirth,
//     phone,
//     userType
//   } = validatedFields.data;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const [existingUser] = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email));

//   if (existingUser) {
//     return {
//       error: "Este e-mail já está em uso.",
//     };
//   }

//   const [commonPermission] = await db
//     .select()
//     .from(permissions)
//     .where(eq(permissions.name, userType === 'athlete' ? 'Athlete' : 'Coach'));

//   await db.insert(users).values({
//     name,
//     email,
//     password: hashedPassword,
//     dateOfBirth,
//     permissionId: commonPermission.id,
//     phone
//   });

//   await userSignIn({
//     email,
//     password,
//   });
//   return { success: "Usuário cadastrado com sucesso!" };
// };





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

/**
 * Realiza o login do usuário usando o provider "credentials".
 * Agora redireciona para onboarding ou dashboard baseado no status do usuário.
 */
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
    // Primeiro, busca o usuário para verificar o status do onboarding
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return { error: "Credenciais inválidas." };
    }

    // Determina o redirecionamento baseado no status do onboarding
    // const redirectTo = user.onboardingCompleted ? "/dashboard" : "/onboarding";

    await signIn("credentials", {
      email,
      password,
      // redirectTo,
    });
    // Se o signIn for bem-sucedido, ele redirecionará e este código não será executado.
  } catch (error) {
    if (error instanceof AuthError) {
      // A mensagem de erro específica vem da sua função 'authorize' no auth.ts
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

/**
 * Realiza o cadastro de um novo usuário e, em seguida, faz o login automaticamente.
 * Novos usuários sempre vão para o onboarding primeiro.
 */
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

  // Cria usuário com onboardingCompleted = false (padrão)
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    // onboardingCompleted: false,
  });

  // Faz login e redireciona para onboarding
  await userSignIn({
    email,
    password,
  });
  return { success: "Usuário cadastrado com sucesso!" };
};