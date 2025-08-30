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
import { OnboardingFormData } from "@/types";
import { CalendarIcon } from "lucide-react";
import { DatePicker, Group } from "react-aria-components";
import { DateInput } from "@/components/ui/datefield-rac";

export function OnboardingForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const id = useId();

  const form = useForm<OnboardingFormData>({
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
    },
  });

  const userType = form.watch("userType");

  async function onSubmit(data: OnboardingFormData) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao salvar os dados.");
        }

        toast.success("Cadastro finalizado com sucesso! 🎉");
        router.push("/dashboard");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Ocorreu um erro."
        );
        console.error(error);
      }
    });
  }

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
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
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <DatePicker className="*:not-first:mt-2">
                      <div className="flex">
                        <Group className="w-full">
                          <DateInput className="pe-9" {...field} />
                        </Group>
                        <div className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
                          <CalendarIcon size={16} />
                        </div>
                      </div>
                    </DatePicker>
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
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fale um pouco sobre você..."
                      required
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
                      <FormLabel>Experiências</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva suas experiências como treinador..."
                          required
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
                      <FormLabel>Cobrança por hora (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id={id}
                            className="peer ps-6 pe-12"
                            placeholder="0.00"
                            type="text"
                            {...field}
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
                      <FormLabel>Certificações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Liste suas certificações..."
                          required
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
                      <FormLabel>Esporte</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        required
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
                      <FormLabel>Altura</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="peer pe-12"
                            placeholder="180"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
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
                      <FormLabel>Peso</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="peer pe-12"
                            placeholder="80"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
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
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe sua Rua" required {...field} />
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
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input required {...field} />
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
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input required {...field} />
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
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" required {...field} />
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
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input required {...field} />
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
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
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
