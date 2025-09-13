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

// Schema base para onboarding
const BaseOnboardingSchema = zod.object({
  userType: zod.enum(["coach", "athlete"], {
    message: "Selecione um tipo de usuário",
  }),
  birthDate: zod.union([
    zod.string().transform((str) => {
      const date = new Date(str);
      if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
      }
      return date;
    }),
    zod.date()
  ]).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, {
    message: "A data de nascimento não pode ser no futuro"
  }).refine((date) => {
    const minAge = new Date();
    minAge.setFullYear(minAge.getFullYear() - 13);
    return date <= minAge;
  }, {
    message: "Você deve ter pelo menos 13 anos"
  }),
  bio: zod.string().min(10, {
    message: "A biografia deve ter pelo menos 10 caracteres",
  }),
  street: zod.string().min(1, {
    message: "Rua é obrigatória",
  }),
  city: zod.string().min(1, {
    message: "Cidade é obrigatória",
  }),
  state: zod.string().min(1, {
    message: "Estado é obrigatório",
  }),
  zipCode: zod.string().min(8, {
    message: "CEP deve ter pelo menos 8 caracteres",
  }),
  country: zod.string().min(1, {
    message: "País é obrigatório",
  }),
});

// Schema para treinador
const CoachOnboardingSchema = BaseOnboardingSchema.extend({
  userType: zod.literal("coach"),
  experience: zod.string().min(10, {
    message: "Experiência deve ter pelo menos 10 caracteres",
  }),
  hourlyRate: zod.number().min(0, {
    message: "Valor por hora deve ser maior ou igual a 0",
  }),
  certifications: zod.string().min(1, {
    message: "Certificações são obrigatórias",
  }),
});

// Schema para atleta
const AthleteOnboardingSchema = BaseOnboardingSchema.extend({
  userType: zod.literal("athlete"),
  sport: zod.string().min(1, {
    message: "Esporte é obrigatório",
  }),
  height: zod.number().min(100, {
    message: "Altura deve ser pelo menos 100cm",
  }).max(250, {
    message: "Altura deve ser no máximo 250cm",
  }),
  weight: zod.number().min(30, {
    message: "Peso deve ser pelo menos 30kg",
  }).max(300, {
    message: "Peso deve ser no máximo 300kg",
  }),
  injuryHistory: zod.string().optional(),
});

export const OnboardingSchema = zod.discriminatedUnion("userType", [
  CoachOnboardingSchema,
  AthleteOnboardingSchema,
]);

export type SignInSchemaType = zod.infer<typeof SignInSchema>;
export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;
export type OnboardingSchemaType = zod.infer<typeof OnboardingSchema>;