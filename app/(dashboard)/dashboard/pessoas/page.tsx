
"use client";
import { UnderDevelopment } from "@/components/error-pages/under-development";
import { useSession } from "next-auth/react";
import Image from "next/image";



export default function PersonPage() {
  const { data: session } = useSession();

  if (!session) { 
    return <div>Acesso Negado</div>;
  }

  const sessionUser = session?.user;

  return (
    <UnderDevelopment />
  );
}