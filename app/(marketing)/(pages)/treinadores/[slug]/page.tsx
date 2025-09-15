// app/treinadores/[slug]/page.tsx

"use client";

import AnimationContainer from "@/components/global/animation-container";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COACHES } from "@/utils";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Star,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type CoachData = {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  coach: {
    rating: number | null;
    title: string | null;
    experience: string;
    certifications: string;
    coachedProfessionalAthletes: number | null;
    careerStartDate: string | null;
  } | null;
  address: {
    city: string;
    state: string;
  } | null;
};

const coachPlans = [
  {
    id: 1,
    title: "Plano Essencial",
    price: "499",
    period: "/mês",
    features: [
      "Acompanhamento semanal",
      "Análise de vídeo",
      "Plano de treino personalizado",
      "Suporte via chat",
    ],
  },
  {
    id: 2,
    title: "Plano Performance",
    price: "1.299",
    period: "/trimestre",
    features: [
      "Tudo do plano Essencial",
      "2 sessões de mentoria online",
      "Análise de métricas avançadas",
    ],
  },
];

export default function CoachPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchCoachData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/coaches?name=${slug}`);
          if (!response.ok) {
            throw new Error("Treinador não encontrado");
          }
          const data = await response.json();
          setCoach(data);
        } catch (error) {
          console.error(error);
          setCoach(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCoachData();
    }
  }, [slug]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Carregando perfil...</div>;
  }

  if (!coach) {
    notFound();
  }

  const calculateExperience = (startDate: string | null | undefined): string => {
    if (!startDate) return "Experiência não informada";
    const startYear = new Date(startDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = currentYear - startYear;
    return `${years}+ anos de carreira`;
  };

  return (
    // Adicionado padding no topo para afastar o conteúdo da Navbar fixa
    <main className="bg-background text-foreground pt-32 pb-16 md:pb-24">
      <MaxWidthWrapper>
        <AnimationContainer delay={0}>
          <Button
            variant="ghost"
            asChild
            className="mb-10 group text-muted-foreground hover:text-foreground"
          >
            <Link href="/#treinadores">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Voltar para a lista
            </Link>
          </Button>
        </AnimationContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
          {/* Coluna Esquerda: Informações do Treinador */}
          <AnimationContainer
            delay={0.1}
            className="lg:col-span-2 flex flex-col gap-10"
          >
            {/* Card de Apresentação com efeito de brilho */}
            <div className="group relative rounded-3xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-3xl blur-lg opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Card className="relative bg-card/90 backdrop-blur-sm border-border/10 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Imagem */}
                    <div className="relative shrink-0">
                      <Image
                        src={coach.image || "/images/default-avatar.png"}
                        alt={`Foto de ${coach.name}`}
                        width={180}
                        height={180}
                        className="rounded-full object-cover border-4 border-card shadow-lg"
                      />
                      <Badge className="absolute bottom-3 right-3 bg-amber-400 text-black shadow-md px-3 py-1 text-sm font-bold">
                        <Star className="w-4 h-4 mr-1.5 fill-current" />
                        {coach.coach?.rating?.toFixed(1) || "N/A"}
                      </Badge>
                    </div>

                    {/* Nome, Especialidade e Localização */}
                    <div className="flex flex-col justify-center pt-2 text-center sm:text-left">
                      <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {coach.name}
                      </h1>
                      <p className="text-xl text-primary font-medium mt-2">
                        {coach.coach?.title || "Especialista"}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start text-muted-foreground mt-4">
                        <MapPin className="w-4 h-4 mr-2 shrink-0" />
                        <span>{coach.address ? `${coach.address.city}, ${coach.address.state}` : 'Local não informado'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Separador elegante */}
                  <div className="w-full h-px my-10 bg-gradient-to-r from-transparent via-border to-transparent"></div>

                  {/* Descrição e Detalhes */}
                  <div>
                    <h2 className="text-2xl font-bold font-heading mb-4">
                      Filosofia de Treino
                    </h2>
                    <p className="text-muted-foreground leading-loose">
                      {coach.coach?.experience || "Nenhuma descrição disponível."}
                    </p>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-2xl font-bold font-heading mb-6">
                      Destaques
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        {coach.coach?.experience || "Nenhuma descrição disponível."}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <span>{coach.coach?.coachedProfessionalAthletes || 0} atletas profissionais</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <span>{calculateExperience(coach.coach?.careerStartDate)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimationContainer>

          {/* Coluna Direita: Planos e Contato */}
          <AnimationContainer delay={0.2} className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="bg-card/95 backdrop-blur-xl border-border/10 rounded-3xl shadow-2xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-heading">
                    <Wallet className="w-6 h-6 text-primary" />
                    Invista na sua Carreira
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {coachPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-border/10 rounded-2xl p-6 bg-background/50 hover:border-primary/50 transition-all duration-300"
                    >
                      <h3 className="font-bold text-lg text-foreground">
                        {plan.title}
                      </h3>
                      <p className="text-4xl font-bold text-primary my-3">
                        R$ {plan.price}
                        <span className="text-base font-normal text-muted-foreground">
                          {plan.period}
                        </span>
                      </p>
                      <ul className="space-y-2.5 mt-5 mb-7">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-green-500 shrink-0" />
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full font-bold group">
                        Contratar Plano
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  ))}

                  <div className="w-full h-px my-2 bg-gradient-to-r from-transparent via-border to-transparent"></div>

                  {/* Botão de Contato */}
                  <div className="text-center">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      Tire suas dúvidas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>
    </main>
  );
}