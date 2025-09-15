"use client";

import AnimationContainer from "@/components/global/animation-container";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Briefcase,
  Cake,
  Handshake,
  Link as LinkIcon,
  Mail,
  MapPin,
  PersonStanding,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { calculateAge } from "@/utils/ageUtils";
import { useEffect, useState } from "react";

type AthleteData = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  birthDate: string | null;
  email: string | null;
  athlete: {
    level: string | null;
    position: string | null;
    gamesPlayed: number | null;
    goals: number | null;
    height: number;
    weight: number;
  } | null;
  address: {
    city: string;
    state: string;
  } | null;
};

export default function AthletePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchAthleteData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/athletes?name=${slug}`);
          if (!response.ok) {
            throw new Error("Atleta não encontrado");
          }
          const data = await response.json();
          setAthlete(data);
        } catch (error) {
          console.error(error);
          setAthlete(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAthleteData();
    }
  }, [slug]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Carregando perfil...</div>;
  }

  if (!athlete) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground pt-32 pb-16 md:pb-24">
      <MaxWidthWrapper>
        <AnimationContainer delay={0}>
          <Button
            variant="ghost"
            asChild
            className="mb-10 group text-muted-foreground hover:text-foreground"
          >
            <Link href="/#atletas">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Ver todos os atletas
            </Link>
          </Button>
        </AnimationContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
          {/* Coluna Esquerda: Perfil do Atleta */}
          <AnimationContainer
            delay={0.1}
            className="lg:col-span-2 flex flex-col gap-10"
          >
            <div className="group relative rounded-3xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-green-500/50 rounded-3xl blur-lg opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Card className="relative bg-card/90 backdrop-blur-sm border-border/10 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  {/* Cabeçalho com Infos Principais */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="relative shrink-0">
                      <Image
                        src={athlete.image || "/images/default-avatar.png"}
                        alt={`Foto de ${athlete.name}`}
                        width={180}
                        height={180}
                        className="rounded-full object-cover border-4 border-card shadow-lg"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute bottom-3 right-0 shadow-md px-3 py-1 text-sm font-bold"
                      >
                        {athlete.athlete?.level || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex flex-col justify-center pt-2 text-center sm:text-left">
                      <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {athlete.name}
                      </h1>
                      <p className="text-xl text-primary font-medium mt-2">
                        {athlete.athlete?.position || "Posição não informada"}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-muted-foreground mt-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 shrink-0" />
                          <span>{athlete.address ? `${athlete.address.city}, ${athlete.address.state}` : 'Local não informado'}</span>
                        </div>
                        <div className="flex items-center">
                          <Cake className="w-4 h-4 mr-2 shrink-0" />
                          <span>{athlete.birthDate ? `${calculateAge(athlete.birthDate)} anos` : 'Idade não informada'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px my-10 bg-gradient-to-r from-transparent via-border to-transparent"></div>

                  {/* Estatísticas de Performance */}
                  <div>
                    <h2 className="text-2xl font-bold font-heading mb-6">
                      Estatísticas
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center bg-muted/30 p-4 rounded-xl">
                        <ShieldCheck className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-3xl font-bold text-foreground">
                          {athlete.athlete?.gamesPlayed || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Jogos</p>
                      </div>
                      <div className="text-center bg-muted/30 p-4 rounded-xl">
                        <Target className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-3xl font-bold text-foreground">
                          {athlete.athlete?.goals || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Pontuação</p>
                      </div>
                      <div className="text-center bg-muted/30 p-4 rounded-xl">
                        <PersonStanding className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-3xl font-bold text-foreground">
                          {athlete.athlete ? `${(athlete.athlete.height / 100).toFixed(2)}m` : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">Altura</p>
                      </div>
                      <div className="text-center bg-muted/30 p-4 rounded-xl">
                        <Scale className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-3xl font-bold text-foreground">
                          {athlete.athlete ? `${athlete.athlete.weight}kg` : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">Peso</p>
                      </div>
                    </div>
                  </div>

                  {/* Sobre o Atleta */}
                  <div className="mt-10">
                    <h2 className="text-2xl font-bold font-heading mb-4">
                      Sobre
                    </h2>
                    <p className="text-muted-foreground leading-loose">
                      {athlete.bio || "Nenhuma biografia disponível."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimationContainer>

          {/* Coluna Direita: Contato */}
          <AnimationContainer delay={0.2} className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="bg-card/95 backdrop-blur-xl border-border/10 rounded-3xl shadow-2xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-heading">
                    <Handshake className="w-7 h-7 text-primary" />
                    Oportunidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground pb-2">
                    Interessado em meu perfil? Entre em contato através de uma
                    das opções abaixo para discutirmos oportunidades.
                  </p>
                  <Button size="lg" className="w-full font-bold">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Mensagem Direta
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Ver Rede Profissional
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Contatar Representante
                  </Button>
                </CardContent>
              </Card>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
