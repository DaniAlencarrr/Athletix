"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  const user = session.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user.name}!</p>
      <p>Seu ID de usuário é: {user.id}</p>
      <Button
        variant="ghost"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2"
      >
        <LogOut />
        Sair
      </Button>
    </div>
  );
}
