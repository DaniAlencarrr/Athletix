import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";

export const metadata: Metadata = {
  title: "Athletix",
  description: "Plataforma de Conexão entre Treinadores e Atletas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
