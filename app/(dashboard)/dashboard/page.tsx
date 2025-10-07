"use client";
import { useSession } from "next-auth/react";
import { CoachDashboard, AthleteDashboard } from "@/components/dashboard-views";



export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) { 
    return <div>Acesso Negado</div>;
  }

  const sessionUser = session?.user;

  const isAthlete = sessionUser?.role === 'Atleta';
  const isCoach = sessionUser?.role === 'Treinador';

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Olá, {sessionUser?.name}!</h1>
      
      {isAthlete && <AthleteDashboard />}
      {isCoach && <CoachDashboard />}
      
      {!isAthlete && !isCoach && (
        <div className="bg-muted/50 p-6 rounded-xl text-center">
          <p className="text-lg">Bem-vindo(a) à Dashboard! Sua função é {sessionUser?.role}.</p>
          <p className="text-sm text-muted-foreground">Conteúdo para {sessionUser?.role} será implementado aqui.</p>
        </div>
      )}
    </div>
  );
}