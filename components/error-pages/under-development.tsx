"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Clock, Zap } from "lucide-react";
import Image from "next/image";

export function UnderDevelopment() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#6BA3E8] via-[#7DB8F0] to-[#5EC4A8]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#5EC4A8]/20 blur-3xl animate-pulse [animation-delay:1000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse [animation-delay:500ms]" />

        <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
        <div className="absolute top-3/4 right-1/4 h-2 w-2 rounded-full bg-white/30 animate-bounce [animation-delay:700ms]" />
        <div className="absolute top-1/2 right-1/3 h-1.5 w-1.5 rounded-full bg-[#5EC4A8]/40 animate-bounce [animation-delay:1200ms]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div
          className={`flex max-w-4xl flex-col items-center gap-8 text-center transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-white/20 px-6 py-3 backdrop-blur-md border border-white/30 shadow-lg">
            <Badge
              variant="secondary"
              className="bg-white/90 text-[#6BA3E8] font-mono font-bold px-3 py-1"
            >
              HTTP 501
            </Badge>
            <span className="h-1 w-1 rounded-full bg-white/60 animate-pulse" />
            <span className="text-sm font-semibold text-white/90 tracking-wide">
              Not Implemented
            </span>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-200 ${
              mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="relative h-[300px] w-[300px] md:h-[450px] md:w-[450px] group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5EC4A8]/40 to-[#6BA3E8]/40 blur-3xl animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-white/20 to-transparent blur-2xl" />

              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin [animation-duration:20s]" />
              <div className="absolute inset-8 rounded-full border border-white/10 animate-spin [animation-duration:15s] [animation-direction:reverse]" />

              {/* GIF with enhanced presentation */}
              <div className="relative z-10 h-full w-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm border border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/funniest-unscreen.gif"
                  alt="Em breve"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-balance font-sans text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-lg">
              Em Desenvolvimento
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-white/90 md:text-xl font-medium drop-shadow-md">
              Estamos trabalhando duro para trazer esta funcionalidade para
              você. Como um atleta em treinamento, estamos nos preparando para
              entregar o melhor resultado.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 delay-400 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
              <div className="relative h-3 w-3">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#5EC4A8]" />
                <div className="relative h-3 w-3 rounded-full bg-[#5EC4A8] shadow-lg shadow-[#5EC4A8]/50" />
              </div>
              <span className="text-sm font-semibold text-white/95">
                Em construção
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/80">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Previsão: Em breve</span>
            </div>
          </div>

          <div
            className={`flex flex-col items-center gap-4 sm:flex-row transition-all duration-1000 delay-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Button
              size="lg"
              onClick={() => window.history.back()}
              className="group bg-white text-[#6BA3E8] hover:bg-white/95 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1 duration-300" />
              Voltar
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.reload()}
              className="group border-2 border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <RefreshCw className="mr-2 h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
              Tentar Novamente
            </Button>
          </div>

          <div
            className={`mt-8 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-600 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Badge
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white/90 px-4 py-2 text-sm font-medium"
            >
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Performance otimizada
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white/90 px-4 py-2 text-sm font-medium"
            >
              Design moderno
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white/90 px-4 py-2 text-sm font-medium"
            >
              Experiência aprimorada
            </Badge>
          </div>

          <div
            className={`mt-4 transition-all duration-1000 delay-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-sm text-white/70 font-medium">
              Se você acredita que isso é um erro, entre em contato com o
              suporte
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
}
