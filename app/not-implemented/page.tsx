import Image from "next/image";
import Link from "next/link";
import { Clock, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Componente visual principal que exibe o GIF com efeitos.
 * Nenhuma alteração necessária aqui.
 */
const VisualContainer = () => (
  <div className="relative w-[250px] h-[250px] md:w-[320px] md:h-[320px] group">
    {/* Anel de brilho externo */}
    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/30 via-violet-500/30 to-blue-500/30 blur-2xl group-hover:blur-3xl transition-all duration-700" />

    {/* Efeito de borda giratória */}
    <div className="absolute inset-0 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-blue-400/50 via-violet-400/50 to-blue-400/50 animate-spin [animation-duration:15s] opacity-60" />
    </div>

    {/* Container principal da imagem */}
    <div className="relative z-10 h-full w-full rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-900/10 group-hover:scale-[1.02] group-hover:shadow-violet-500/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5" />
      <Image
        src="/funniest-unscreen.gif" // Certifique-se que o caminho está correto
        alt="Página em construção"
        fill
        className="object-cover mix-blend-multiply dark:mix-blend-lighten opacity-90 group-hover:opacity-100 transition-opacity"
        priority
      />
    </div>

    {/* Detalhes nos cantos */}
    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400/70 rounded-tl-2xl transition-all duration-500 group-hover:w-10 group-hover:h-10" />
    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-violet-400/70 rounded-br-2xl transition-all duration-500 group-hover:w-10 group-hover:h-10" />
  </div>
);

export default function NotImplementedPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* NÚMERO 501 NO FUNDO */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <span className="select-none text-[20rem] md:text-[28rem] font-black text-foreground/10">
          501
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        {/* Bloco Visual com o GIF */}
        <VisualContainer />

        {/* Bloco de Conteúdo de Texto */}
        <div className="flex flex-col items-center gap-4">
          <Badge className="px-4 py-1.5 text-sm font-semibold shadow-lg rounded-full bg-blue-100 text-blue-800 dark:bg-red-900/50 dark:text-red-200 inline-flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            ERRO 501 - NOT IMPLEMENTED
          </Badge>

          <h2 className="text-3xl font-heading font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100">
            Página Não Implementada
          </h2>
          <p className="max-w-md text-muted-foreground">
            Estamos trabalhando duro para trazer esta funcionalidade para você.
            Como um atleta em treinamento, estamos nos preparando para entregar
            o melhor resultado.
          </p>
        </div>

        {/* Botão de Ação e Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            asChild
            className="px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Voltar para a Página Inicial
            </Link>
          </Button>
          <Badge className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium dark:bg-blue-900/50 dark:text-blue-200">
            <Clock className="mr-2 h-4 w-4" />
            <span className="leading-none">Previsão: Em breve</span>
          </Badge>
        </div>
      </div>
    </main>
  );
}
