interface BaseFormData {
  birthDate: Date;
  bio: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Tipo específico para Treinador
interface CoachData extends BaseFormData {
  userType: "coach";
  experience: string;
  hourlyRate: number;
  certifications: string;
}

// Tipo específico para Atleta
interface AthleteData extends BaseFormData {
  userType: "athlete";
  sport: string;
  height: number;
  weight: number;
  injuryHistory?: string; // Opcional
}

// Tipo final que une as duas possibilidades
export type OnboardingFormData = CoachData | AthleteData;