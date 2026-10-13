import type { Metadata } from "next";
import { AvisoDados } from "@/components/AvisoDados";
import { Cabecalho } from "@/components/Cabecalho";
import { PortaoSessao } from "@/components/PortaoSessao";
import { CabecalhoImpressao } from "@/components/CabecalhoImpressao";
import { Rodape } from "@/components/Rodape";
import { SementeDoCenario } from "@/components/SementeDoCenario";
import { atlas } from "@/lib/atlas";

// A plataforma não deve aparecer em buscas: o caminho é pela apresentação (/) e pelo login (/login)
export const metadata: Metadata = { robots: { index: false } };

// Terceira parada do fluxo: a plataforma (onde instalar, placar, método e laboratório)
export default function PlataformaLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <SementeDoCenario />
      <Cabecalho />
      <AvisoDados dadosAte={atlas.dados_ate} />
      <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <CabecalhoImpressao />
        <PortaoSessao>{children}</PortaoSessao>
      </main>
      <Rodape />
    </>
  );
}
