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


// Schema base com campos comuns a ambos os perfis
const baseProfileSchema = zod.object({
  bio: zod.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  expertise: zod.string().min(1, "O campo de experiência é obrigatório."),
});

// Schema específico para Atleta
const athleteProfileSchema = baseProfileSchema.extend({
  userType: zod.literal("athlete"),
  height: zod.coerce.number().min(100, "Altura inválida.").max(250, "Altura inválida."),
  weight: zod.coerce.number().min(30, "Peso inválido.").max(300, "Peso inválido."),
  sportId: zod.string().uuid("Esporte inválido."),
  trainingSchedule: zod.string().min(1, "O cronograma é obrigatório."),
  injuryHistory: zod.string().min(1, "O histórico de lesões é obrigatório."),
  trainingGoals: zod.string().min(1, "As metas são obrigatórias."),
});

// Schema específico para Treinador
const coachProfileSchema = baseProfileSchema.extend({
  userType: zod.literal("coach"),
  hourlyRate: zod.coerce.number().min(1, "O valor por hora é obrigatório."),
  certifications: zod.string().min(1, "As certificações são obrigatórias."),
});

// Schema de Endereço
const addressSchema = zod.object({
  street: zod.string().min(1, "O endereço é obrigatório."),
  city: zod.string().min(1, "A cidade é obrigatória."),
  state: zod.string().min(1, "O estado é obrigatório."),
  zipCode: zod.string().min(1, "O CEP é obrigatório."),
  country: zod.string().min(1, "O país é obrigatório."),
});

// Schema principal do Onboarding que une tudo
export const onboardingSchema = zod.object({
  profile: zod.discriminatedUnion("userType", [athleteProfileSchema, coachProfileSchema]),
  address: addressSchema,
});

export type OnboardingData = zod.infer<typeof onboardingSchema>;
export type SignInSchemaType = zod.infer<typeof SignInSchema>;
export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;