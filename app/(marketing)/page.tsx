"use client";

import AnimationContainer from "@/components/global/animation-container";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MagicBadge from "@/components/ui/magic-badge";
import Particles from "@/components/ui/particles";
import { FAQS } from "@/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowRightIcon,
  Calendar,
  MapPin,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { calculateAge } from "@/utils/ageUtils";

type AthleteData = {
  id: string;
  name: string | null;
  image: string | null;
  birthDate: string | null;
  athlete: {
    position: string | null;
    level: string | null;
    height: number;
    weight: number;
    goals: number | null;
    gamesPlayed: number | null;
  } | null;
  address: {
    city: string;
    state: string;
  } | null;
};

type CoachData = {
  id: string;
  name: string | null;
  image: string | null;
  coach: {
    title: string | null;
    rating: number | null;
    certifications: string | null;
    coachedProfessionalAthletes: number | null;
    careerStartDate: string | null;
  } | null;
  address: {
    city: string;
    state: string;
  } | null;
};

export default function HomePage() {
  const [athletes, setAthletes] = useState<AthleteData[]>([]);
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [athletesRes, coachesRes] = await Promise.all([
          fetch("/api/athletes"),
          fetch("/api/coaches"),
        ]);

        const athletesData = await athletesRes.json();
        const coachesData = await coachesRes.json();

        setAthletes(athletesData);
        setCoaches(coachesData);
      } catch (error) {
        console.error("Falha ao buscar dados da API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroVideos = [
    "/videos/futebol.mp4",
    "/videos/ciclismo.mp4",
    "/videos/box.mp4",
    "/videos/hokei.mp4",
    "/videos/natacao.mp4",
    "/videos/volei.mp4",
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Erro ao tentar reproduzir o vídeo:", error);
        });
      }
    }

    const prevIndex =
      (currentVideoIndex - 1 + heroVideos.length) % heroVideos.length;
    const prevVideo = videoRefs.current[prevIndex];
    if (prevVideo) {
      prevVideo.pause();
    }
  }, [currentVideoIndex, heroVideos.length]);

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "Profissional":
        return "default";
      case "Semi-Profissional":
        return "secondary";
      case "Juvenil":
        return "outline";
      default:
        return "outline";
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="overflow-x-hidden scrollbar-hide size-full">
      {/* <Hero /> */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {heroVideos.map((videoSrc, index) => (
            <motion.video
              key={videoSrc}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="absolute top-0 left-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentVideoIndex ? 1 : 0,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <source src={videoSrc} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </motion.video>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
        </div>

        {/* Content Layer */}
        <MaxWidthWrapper className="relative z-20 flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center w-full text-center">
            <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
              <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                <span>
                  <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                </span>
                <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
                <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                  ✨ Conecte-se com os melhores do esporte
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </span>
              </button>
              <h1 className="text-white text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
                Contato entre{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text inline-block">
                  treinadores e atletas
                </span>
              </h1>
              <p className="mb-8 tracking-tight text-neutral-300 text-base text-balance">
                A plataforma que une treinadores experientes e atletas
                talentosos. Encontre oportunidades, desenvolva carreiras e
                <br className="hidden md:block" />
                <span className="hidden md:block">
                  alcance seus objetivos no esporte.
                </span>
              </p>
              <div className="flex items-center justify-center whitespace-nowrap gap-4">
                <Button asChild>
                  <Link href="#precos" className="flex items-center">
                    Comece agora mesmo
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </AnimationContainer>
          </div>
        </MaxWidthWrapper>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        >
          <Link
            href="#about"
            className="flex flex-col items-center text-white elegant-hover group"
          >
            <span className="text-sm mb-2 group-hover:text-stone-300">
              Saiba mais
            </span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center group-hover:border-stone-300">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-3 bg-white rounded-full mt-2 group-hover:bg-stone-300"
              />
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Treinadores */}
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full">
          {coaches.slice(0, 6).map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="flex flex-col items-center text-center p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500 bg-card border-none">
                <div className="relative mb-6">
                  <Image
                    src={coach.image || "/images/default-avatar.png"}
                    alt={coach.name || "Treinador"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-primary/20 hover:border-primary transition-colors duration-300"
                  />
                  <Badge className="absolute bottom-0 right-0 bg-primary text-primary-foreground shadow-md px-2 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {coach.coach?.rating || "N/A"}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {coach.name}
                </h3>
                <p className="text-md text-primary font-semibold mb-4">
                  {coach.coach?.title || "Especialista"}
                </p>

                <div className="w-full text-left space-y-2 text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm">
                      {coach.address
                        ? `${coach.address.city}, ${coach.address.state}`
                        : "Local não informado"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm">
                      {coach.coach?.certifications ||
                        "Certificações não listadas"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm">
                      {coach.coach?.coachedProfessionalAthletes || 0} atletas
                      profissionais treinados
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm">
                      Desde{" "}
                      {coach.coach?.careerStartDate
                        ? new Date(
                          coach.coach.careerStartDate
                        ).getFullYear()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/treinadores/${generateSlug(coach.name || "")}`}
                  className="w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg mt-8 transform transition-transform duration-300 hover:scale-105">
                    Ver Perfil
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </MaxWidthWrapper>

      {/* Atletas */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div
            id="atletas"
            className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto"
          >
            <MagicBadge title="Atletas" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Descubra nossos atletas
              <br /> mais{" "}
              <span className="font-subheading italic">talentosos</span>
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Descubra jogadores promissores em busca de oportunidades para
              desenvolver suas carreiras
            </p>
          </div>
        </AnimationContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full">
          {athletes.slice(0, 6).map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="flex flex-col items-center text-center p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500 bg-card border-none">
                <div className="relative mb-6">
                  <Image
                    src={player.image || "/images/default-avatar.png"}
                    alt={player.name || "Atleta"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-primary/20 hover:border-primary transition-colors duration-300"
                  />
                  <Badge
                    variant={getLevelVariant(player.athlete?.level ?? "")}
                    className="absolute bottom-0 right-0 shadow-md text-xs font-bold"
                  >
                    {player.athlete?.level || "N/A"}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {player.name}
                </h3>
                <p className="text-md text-primary font-semibold mb-4">
                  {player.athlete?.position || "Posição não definida"}
                </p>

                <div className="w-full text-left space-y-2 text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm">
                      {player.address
                        ? `${player.address.city}, ${player.address.state}`
                        : "Local não informado"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm">
                      {player.birthDate
                        ? `${calculateAge(player.birthDate)} anos`
                        : "Idade não informada"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-3 flex items-center justify-center text-primary font-bold text-sm">
                      ↔
                    </span>
                    <span className="text-sm">
                      {player.athlete?.height
                        ? `${(player.athlete.height / 100).toFixed(2)}m`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-3 flex items-center justify-center text-primary font-bold text-sm">
                      ⚖
                    </span>
                    <span className="text-sm">
                      {player.athlete?.weight
                        ? `${player.athlete.weight}kg`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-xl transition-all duration-300 hover:bg-muted/80">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {player.athlete?.goals || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Gols</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl transition-all duration-300 hover:bg-muted/80">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {player.athlete?.gamesPlayed || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Jogos</div>
                  </div>
                </div>

                <Link
                  href={`/atletas/${generateSlug(player.name || "")}`}
                  className="w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg mt-8 transform transition-transform duration-300 hover:scale-105">
                    Ver Perfil
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/atletas">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md"
            >
              Explorar Todos os Atletas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </MaxWidthWrapper>

      {/* FAQs Section */}
      <MaxWidthWrapper className="py-20">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
            <MagicBadge title="FAQs" />
            <h2 className="text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Perguntas Frequentes
            </h2>
            <p className="mt-4 text-center text-lg text-muted-foreground max-w-lg">
              Respostas rápidas para as suas principais dúvidas sobre nossa
              plataforma.
            </p>
          </div>
        </AnimationContainer>
        <AnimationContainer delay={0.2} className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto space-y-4"
          >
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/50 rounded-xl px-6 py-2 bg-card/60 backdrop-blur-lg shadow-md hover:bg-card/80 transition-colors duration-300"
              >
                <AccordionTrigger className="text-lg md:text-xl text-left font-medium text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimationContainer>
      </MaxWidthWrapper>
      {/* CTA */}
      <MaxWidthWrapper>
        <div className="relative flex flex-col items-center justify-center w-full py-20">
          <AnimationContainer className="py-20 max-w-6xl mx-auto">
            <div className="relative flex flex-col items-center justify-center py-12 lg:py-20 px-0 rounded-2xl lg:rounded-3xl bg-background/20 text-center border border-foreground/20 overflow-hidden">
              <Particles
                refresh
                ease={80}
                quantity={80}
                color="#d4d4d4"
                className="hidden lg:block absolute inset-0 z-0"
              />
              <Particles
                refresh
                ease={80}
                quantity={35}
                color="#d4d4d4"
                className="block lg:hidden absolute inset-0 z-0"
              />

              <motion.div
                className="absolute -bottom-1/8 left-1/3 -translate-x-1/2 w-44 h-32 lg:h-52 lg:w-1/3 rounded-full blur-[5rem] lg:blur-[10rem] -z-10"
                style={{
                  background:
                    "conic-gradient(from 0deg at 50% 50%, #a855f7 0deg, #3b82f6 180deg, #06b6d4 360deg)",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium !leading-snug">
                Pronto para Transformar sua <br />{" "}
                <span className="font-subheading italic">Carreira</span> no
                Esporte?
              </h2>
              <p className="text-sm md:text-lg text-center text-accent-foreground/80 max-w-2xl mx-auto mt-4">
                Junte-se à maior plataforma de conexões do esporte brasileiro.
                Seja você um treinador experiente ou um atleta em busca de
                oportunidades,{" "}
                <span className="hidden lg:inline">
                  aqui você encontra o que precisa para alcançar seus objetivos
                </span>
              </p>
              <Link href="/dashboard" className="mt-8">
                <Button size="lg">Comece agora mesmo</Button>
              </Link>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
