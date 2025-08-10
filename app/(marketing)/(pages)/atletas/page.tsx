"use client"

import { motion } from "framer-motion";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import AnimationContainer from "@/components/global/animation-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLAYERS } from "@/utils";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function AtletasPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 9;
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = PLAYERS.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(PLAYERS.length / playersPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

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

  return (
    <MaxWidthWrapper className="py-24 sm:py-32">
      <AnimationContainer>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-heading font-medium !leading-tight">
            Descubra Novos Talentos
          </h1>
          <p className="text-base md:text-lg text-center text-muted-foreground mt-4">
            Explore perfis de atletas promissores de todo o país em busca de sua
            próxima oportunidade no esporte.
          </p>
        </div>
      </AnimationContainer>

      {/* Grid de Atletas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full">
        {currentPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            custom={index}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <Card className="flex flex-col h-full items-center text-center p-8 rounded-2xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-card border-none">
              <div className="relative mb-6">
                <Image
                  src={player.image || "/placeholder.svg"}
                  alt={player.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-primary/10 transition-colors duration-300"
                />
                <Badge
                  variant={getLevelVariant(player.level)}
                  className="absolute bottom-0 right-0 shadow-md text-xs font-bold"
                >
                  {player.level}
                </Badge>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-1">
                {player.name}
              </h3>
              <p className="text-md text-primary font-semibold mb-4">
                {player.position}
              </p>

              <div className="w-full text-left space-y-2.5 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <span className="text-sm">{player.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <span className="text-sm">{player.age} anos</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-3 flex items-center justify-center text-primary font-bold text-sm">
                    ↔
                  </span>
                  <span className="text-sm">{player.height}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-3 flex items-center justify-center text-primary font-bold text-sm">
                    ⚖
                  </span>
                  <span className="text-sm">{player.weight}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full my-6">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-3xl font-bold text-foreground">
                    {player.goals}
                  </div>
                  <div className="text-sm text-muted-foreground">Gols</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-3xl font-bold text-foreground">
                    {player.matches}
                  </div>
                  <div className="text-sm text-muted-foreground">Jogos</div>
                </div>
              </div>

              <Link
                href={`/atletas/${encodeURIComponent(player.slug)}`}
                className="w-full"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg transform transition-transform duration-300 hover:scale-105">
                  Ver Perfil
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Controles de Paginação */}
      <motion.div
        className="flex items-center justify-center gap-4 mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </MaxWidthWrapper>
  );
}
