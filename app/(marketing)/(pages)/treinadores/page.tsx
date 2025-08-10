"use client"

import { motion } from 'framer-motion';
import MaxWidthWrapper from '@/components/global/max-width-wrapper';
import AnimationContainer from "@/components/global/animation-container";
import { COACHES } from '@/utils';
import React, { useState } from 'react'
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Star, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TreinadoresPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const coachesPerPage = 9;
  const indexOfLastCoach = currentPage * coachesPerPage;
  const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
  const currentCoaches = COACHES.slice(indexOfFirstCoach, indexOfLastCoach);
  const totalPages = Math.ceil(COACHES.length / coachesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <MaxWidthWrapper className="py-24 sm:py-32">
      <AnimationContainer>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-heading font-medium !leading-tight">
            Encontre o Treinador Ideal
          </h1>
          <p className="text-base md:text-lg text-center text-muted-foreground mt-4">
            Explore nossa lista de profissionais certificados e experientes,
            prontos para elevar seu potencial no esporte.
          </p>
        </div>
      </AnimationContainer>

      {/* Grid de Treinadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full">
        {currentCoaches.map((coach, index) => (
          <motion.div
            key={coach.id}
            custom={index}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <Card className="flex flex-col h-full items-center text-center p-8 rounded-2xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-card border-none">
              <div className="relative mb-6">
                <Image
                  src={coach.image || "/placeholder.svg"}
                  alt={coach.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-primary/10 transition-colors duration-300"
                />
                <Badge className="absolute bottom-0 right-0 bg-primary text-primary-foreground shadow-md px-2 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {coach.rating}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {coach.name}
              </h3>
              <p className="text-md text-primary font-semibold mb-4">
                {coach.specialty}
              </p>

              <div className="w-full text-left space-y-2.5 text-muted-foreground flex-grow">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <span className="text-sm">{coach.location}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <span className="text-sm">{coach.achievements}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <span className="text-sm">
                    {coach.players} atletas treinados
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <span className="text-sm">
                    {coach.experience} de experiência
                  </span>
                </div>
              </div>
              <Link
                href={`/treinadores/${encodeURIComponent(coach.slug)}`}
                className="w-full mt-8"
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