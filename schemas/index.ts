import * as zod from "zod";

export const SignInSchema = zod.object({
  email: zod.string().email({
    message: "Endereço de e-mail inválido",
  }),
  password: zod.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres",
  }),
});

export const SignUpSchema = zod.object({
  name: zod.string().min(1, {
    message: "O nome é obrigatório.",
  }),
  email: zod.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: zod.string().min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
});
export type SignInSchemaType = zod.infer<typeof SignInSchema>;
export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;