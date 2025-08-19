import * as zod from "zod";
import { da } from "zod/v4/locales";


export const SignInSchema = zod.object({
  email: zod.string().email({
    message: "Endereço de e-mail inválido",
  }),
  password: zod.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres",
  }),
});


export const SignUpSchema = zod.object({
  userType: zod.enum(["athlete", "coach"], {
    error: "Tipo de usuário inválido",
  }),
  name: zod.string().min(10, {
    message: "O nome deve ter pelo menos 10 caracteres",
  }),
  dateOfBirth: zod.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date <= new Date();
  }, {
    message: "Data de nascimento inválida",
  }),
  phone: zod.string().min(10, {
    message: "O telefone deve ter pelo menos 10 dígitos",
  }),
  email: zod.string().email({
    message: "Endereço de e-mail inválido",
  }),
  password: zod.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres",
  })
});

export type SignInSchemaType = zod.infer<typeof SignInSchema>;
export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;