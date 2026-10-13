import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { atlas } from "@/lib/atlas";
import { PaginaUsina } from "@/components/PaginaUsina";
import { pldDeReferencia } from "@/lib/pldReferencia";

// Uma página estática por usina de destaque, gerada na compilação.
export function generateStaticParams() {
  return atlas.usinas.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/plants/[id]">): Promise<Metadata> {
  const { id } = await params;
  const u = atlas.usinas.find((x) => x.id === id);
  return { title: u ? `${u.nome.replace(/^Conj\. /, "")} — Nomos` : "Nomos" };
}

// O endereço (params) é lido dentro de um Suspense: assim a navegação para a página continua instantânea
async function Conteudo({ params }: { params: PageProps<"/app/plants/[id]">["params"] }) {
  const { id } = await params;
  const u = atlas.usinas.find((x) => x.id === id);
  if (!u) notFound();
  return <PaginaUsina u={u} cambio={atlas.cambio} dadosAte={atlas.dados_ate} pld={pldDeReferencia(atlas.pld)} />;
}

export default function Page({ params }: PageProps<"/app/plants/[id]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
      <Conteudo params={params} />
    </Suspense>
  );
}
