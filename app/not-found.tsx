"use client";

import AnimationContainer from "@/components/global/animation-container";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import Navbar from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import Particles from "@/components/ui/particles";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background text-foreground">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={100}
          color="#d4d4d4"
          refresh
        />

        <MaxWidthWrapper>
          <AnimationContainer className="flex flex-col items-center text-center">
            <h1 className="text-8xl font-bold tracking-tighter text-transparent bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text md:text-9xl lg:text-[150px]">
              404
            </h1>
            <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight sm:text-4xl">
              Página Não Encontrada
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Ops! Parece que você pegou um atalho errado. A página que você
              está procurando não existe ou foi movida.
            </p>
            <Button asChild className="mt-8">
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Voltar para a Página Inicial
              </Link>
            </Button>
          </AnimationContainer>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
