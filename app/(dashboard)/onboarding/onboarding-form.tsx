"use client";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useId, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ContactRound, Loader2, UserStar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OnboardingSchemaType } from "@/schemas";

// Tipo específico para o formulário que inclui todos os campos possíveis
type OnboardingFormType = {
  userType: "coach" | "athlete";
  birthDate?: Date;
  bio: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Campos de treinador
  experience?: string;
  hourlyRate?: number;
  certifications?: string;
  // Campos de atleta
  sport?: string;
  height?: number;
  weight?: number;
  injuryHistory?: string;
};

export function OnboardingForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const id = useId();

  const form = useForm<OnboardingFormType>({
    defaultValues: {
      userType: "coach",
      birthDate: undefined,
      bio: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Brasil",
      experience: "",
      hourlyRate: 0,
      certifications: "",
      sport: "",
      height: 0,
      weight: 0,
      injuryHistory: "",
    },
  });

  const userType = form.watch("userType");

  // Função para converter dados do formulário para o formato da API
  const convertFormDataToApiFormat = (data: OnboardingFormType): OnboardingSchemaType => {
    if (data.userType === "coach") {
      return {
        userType: "coach",
        birthDate: data.birthDate!,
        bio: data.bio,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        experience: data.experience!,
        hourlyRate: data.hourlyRate!,
        certifications: data.certifications!,
      };
    } else {
      return {
        userType: "athlete",
        birthDate: data.birthDate!,
        bio: data.bio,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        sport: data.sport!,
        height: data.height!,
        weight: data.weight!,
        injuryHistory: data.injuryHistory,
      };
    }
  };

  async function onSubmit(data: OnboardingFormType) {
    console.log("=== INICIANDO SUBMISSÃO DO FORMULÁRIO ===");
    console.log("Dados do formulário:", data);
    console.log("Tipo de usuário:", data.userType);
    
    // Validação adicional antes do envio
    if (!data.userType) {
      toast.error("Por favor, selecione um tipo de usuário.");
      return;
    }

    // A validação de data agora é feita pelo Zod schema
    if (!data.birthDate) {
      toast.error("Por favor, informe sua data de nascimento.");
      return;
    }

    if (!data.bio || data.bio.trim().length < 10) {
      toast.error("Por favor, escreva uma biografia com pelo menos 10 caracteres.");
      return;
    }

    // Validação específica por tipo de usuário
    if (data.userType === 'coach') {
      if (!data.experience || data.experience.trim().length < 10) {
        toast.error("Por favor, descreva sua experiência com pelo menos 10 caracteres.");
        return;
      }
      if (!data.certifications || data.certifications.trim().length === 0) {
        toast.error("Por favor, informe suas certificações.");
        return;
      }
      if (!data.hourlyRate || data.hourlyRate < 0) {
        toast.error("Por favor, informe um valor por hora válido.");
        return;
      }
    } else if (data.userType === 'athlete') {
      if (!data.sport) {
        toast.error("Por favor, selecione um esporte.");
        return;
      }
      if (!data.height || data.height < 100 || data.height > 250) {
        toast.error("Por favor, informe uma altura válida (entre 100cm e 250cm).");
        return;
      }
      if (!data.weight || data.weight < 30 || data.weight > 300) {
        toast.error("Por favor, informe um peso válido (entre 30kg e 300kg).");
        return;
      }
    }

    // Validação de endereço
    if (!data.street || !data.city || !data.state || !data.zipCode || !data.country) {
      toast.error("Por favor, preencha todos os campos de endereço.");
      return;
    }

    startTransition(async () => {
      try {
        console.log("Enviando dados para API...");
        
        // Converter dados do formulário para o formato da API
        const apiData = convertFormDataToApiFormat(data);
        console.log("Dados convertidos para API:", apiData);
        
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });

        console.log("Resposta da API:", response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro da API:", errorData);
          throw new Error(errorData.error || "Falha ao salvar os dados.");
        }

        const result = await response.json();
        console.log("Resultado da API:", result);

        toast.success("Cadastro finalizado com sucesso! 🎉");
        
        // Forçar atualização da sessão
        try {
          console.log("Atualizando sessão...");
          await fetch("/api/auth/update-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
          console.log("Sessão atualizada com sucesso");
        } catch (updateError) {
          console.error("Erro ao atualizar sessão:", updateError);
        }
        
        // Aguardar um pouco antes do redirecionamento para garantir que o toast apareça
        setTimeout(() => {
          console.log("Redirecionando para dashboard...");
          // Forçar redirecionamento completo
          window.location.href = "/dashboard";
        }, 2000);
        
      } catch (error) {
        console.error("Erro no onboarding:", error);
        toast.error(
          error instanceof Error ? error.message : "Ocorreu um erro inesperado."
        );
      }
    });
  }

  const handleNextStep = () => {
    // Validar campos da etapa atual antes de avançar
    const currentStepFields = getCurrentStepFields(step, userType);
    const isValid = validateCurrentStep(currentStepFields);
    
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios antes de continuar.");
    }
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const getCurrentStepFields = (currentStep: number, userType: string) => {
    switch (currentStep) {
      case 1:
        return ['userType'];
      case 2:
        const baseFields = ['birthDate', 'bio'];
        if (userType === 'coach') {
          return [...baseFields, 'experience', 'hourlyRate', 'certifications'];
        } else {
          return [...baseFields, 'sport', 'height', 'weight'];
        }
      case 3:
        return ['street', 'city', 'state', 'zipCode', 'country'];
      default:
        return [];
    }
  };

  const validateCurrentStep = (fields: string[]) => {
    const values = form.getValues();
    return fields.every(field => {
      const value = values[field as keyof typeof values];
      if (field === 'userType') return value;
      if (field === 'birthDate') {
        return value instanceof Date && !isNaN(value.getTime());
      }
      if (field === 'hourlyRate' || field === 'height' || field === 'weight') {
        return typeof value === 'number' && value > 0;
      }
      return value && value.toString().trim().length > 0;
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {/* Indicador de Progresso */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                stepNumber <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>

        {/* Etapa 1: Seleção de Perfil */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">
                Complete as informações da sua conta
              </h1>
              <p className="text-muted-foreground text-sm text-balance">
                Primeiro, nos diga quem você é.
              </p>
            </div>
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Você é um Treinador ou um Atleta?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="grid-cols-2"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      {/* Treinador */}
                      <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
                        <RadioGroupItem
                          id={`${id}-1`}
                          value="coach"
                          className="sr-only"
                        />
                        <UserStar
                          className="opacity-60"
                          size={20}
                          aria-hidden="true"
                        />
                        <label
                          htmlFor={`${id}-1`}
                          className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                        >
                          Treinador
                        </label>
                      </div>
                      {/* Atleta */}
                      <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
                        <RadioGroupItem
                          id={`${id}-3`}
                          value="athlete"
                          className="sr-only"
                        />
                        <ContactRound
                          className="opacity-60"
                          size={20}
                          aria-hidden="true"
                        />
                        <label
                          htmlFor={`${id}-3`}
                          className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                        >
                          Atleta
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Etapa 2: Detalhes do Perfil */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in-20">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Conte-nos sobre você</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Preencha os detalhes abaixo para completar seu perfil.
              </p>
            </div>

            {/* Campos Comuns */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="DD/MM/AAAA"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                        console.log("Data selecionada:", dateValue);
                        field.onChange(dateValue);
                      }}
                      className="w-full"
                      max={new Date().toISOString().split('T')[0]} // Não permite datas futuras
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fale um pouco sobre você..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos de Treinador */}
            {userType === "coach" && (
              <>
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiências *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva suas experiências como treinador..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cobrança por hora (R$) *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id={id}
                            className="peer ps-6 pe-12"
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                            $
                          </span>
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                            BRL
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificações *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Liste suas certificações..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Campos de Atleta */}
            {userType === "athlete" && (
              <>
                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Esporte *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um esporte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Futebol">Futebol</SelectItem>
                          <SelectItem value="Basquete">Basquete</SelectItem>
                          <SelectItem value="Vôlei">Vôlei</SelectItem>
                          <SelectItem value="Corrida">Corrida</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="peer pe-12"
                            placeholder="180"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                            (cm)
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="peer pe-12"
                            placeholder="80"
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                            (Kg)
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="injuryHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico de lesões</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva lesões relevantes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        )}

        {/* Etapa 3: Endereço */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in-20">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Onde você mora?</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Por fim, informe seu endereço.
              </p>
            </div>
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua *</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe sua Rua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="flex gap-4 justify-end">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={isPending}
              className="flex-1"
            >
              Voltar
            </Button>
          )}

          {/* Botão de Avançar (condicional) */}
          {step < 3 && (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isPending || !userType}
              className="flex-1"
            >
              Avançar
            </Button>
          )}

          {/* Botão de Finalizar (condicional) */}
          {step === 3 && (
            <Button 
              type="submit" 
              disabled={isPending} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold"
              onClick={() => {
                console.log("Botão Finalizar Cadastro clicado!");
                console.log("Estado do formulário:", form.formState);
                console.log("Valores atuais:", form.getValues());
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Finalizando...
                </>
              ) : (
                "Finalizar Cadastro"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
