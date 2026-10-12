import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { atlas } from "@/lib/atlas";
import { PaginaUsina } from "@/components/PaginaUsina";
import { PLD_PISO_2026 } from "@/lib/tipos";

// Uma página estática por usina de destaque, gerada na compilação.
export function generateStaticParams() {
  return atlas.usinas.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: PageProps<"/plants/[id]">): Promise<Metadata> {
  const { id } = await params;
  const u = atlas.usinas.find((x) => x.id === id);
  return { title: u ? `${u.nome.replace(/^Conj\. /, "")} — Nomos` : "Nomos" };
}

export default async function Page({ params }: PageProps<"/plants/[id]">) {
  const { id } = await params;
  const u = atlas.usinas.find((x) => x.id === id);
  if (!u) notFound();
  // PLD médio de referência: o do Nordeste ponderado pela energia cortada (CCEE × ONS); se faltar, o piso regulatório.
  const piso = atlas.pld.piso_2026_rs_mwh ?? PLD_PISO_2026;
  const medio = atlas.pld.cruzamento?.pld_medio_ponderado_rs_mwh ?? atlas.pld.valor_rs_mwh ?? piso;
  return <PaginaUsina u={u} cambio={atlas.cambio} dadosAte={atlas.dados_ate} pld={{ medio, piso }} />;
}
