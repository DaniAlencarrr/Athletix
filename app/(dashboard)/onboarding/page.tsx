"use client";

import { OnboardingForm } from "./onboarding-form";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/logo";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const heroImages = [
    {
      src: "/images/arco-e-flecha.jpg",
      alt: "Atleta de arco e flecha em ação",
    },
    {
      src: "/images/box.jpg",
      alt: "Atleta de boxe em ação",
    },
    {
      src: "/images/futebol.jpg",
      alt: "Atleta de futebol em ação",
    },
    {
      src: "/images/natacao.jpg",
      alt: "Nadador em ação",
    },
    {
      src: "/images/rokei.jpg",
      alt: "Atleta em ação",
    },
    {
      src: "/images/skate.jpg",
      alt: "Atleta de skate em ação",
    },
    {
      src: "/images/ski.jpg",
      alt: "Atleta de esqui em ação",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const genericTitle = "Sua Jornada Atlética Começa Aqui";
  const genericDescription =
    "Alcance seu potencial máximo com planos personalizados, monitoramento inteligente e a comunidade Athletix ao seu lado.";

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-6 md:p-12 lg:p-16 bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
        <motion.div
          className="flex justify-center gap-3 md:justify-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold text-xl tracking-tight text-gray-800 dark:text-gray-100 hover:text-green-600 dark:hover:text-teal-400 transition-colors duration-300"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl shadow-lg">
              <Logo />
            </div>
            Athletix
          </Link>
        </motion.div>
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="text-center mb-8 space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-green-500 to-teal-600 dark:from-blue-300 dark:via-green-300 dark:to-teal-300 bg-clip-text text-transparent">
                Bem-vindo ao Athletix
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Transforme sua jornada atlética com nossa plataforma inteligente
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
              <OnboardingForm />
            </div>
            <motion.p
              className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Ao continuar, você concorda com nossos{" "}
              <Link
                href="/terms"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline decoration-dotted"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline decoration-dotted"
              >
                Política de Privacidade
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-teal-800/40 to-green-900/50 z-10" />
        <div className="absolute inset-0 z-20 opacity-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              className="object-cover"
              priority={currentImageIndex === 0}
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex gap-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentImageIndex
                    ? "bg-white shadow-lg scale-125"
                    : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-16 left-8 right-8 z-30">
          <motion.div
            key="generic-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-2xl">
              {genericTitle}
            </h2>
            <p className="text-white/90 text-sm md:text-base drop-shadow-lg leading-relaxed max-w-md mx-auto">
              {genericDescription}
            </p>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-4 right-4 z-30 flex justify-between items-center transform -translate-y-1/2">
          <button
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev - 1 + heroImages.length) % heroImages.length
              )
            }
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group"
            aria-label="Imagem anterior"
          >
            <svg
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() =>
              setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
            }
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group"
            aria-label="Próxima imagem"
          >
            <svg
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
