import type { Metadata } from "next";
import { atlas } from "@/lib/atlas";
import { Laboratorio } from "@/components/Laboratorio";

export const metadata: Metadata = { title: "Laboratório (simulação) — Nomos" };

export default function Page() {
  // Só o necessário vai para o navegador: as janelas de cada usina de destaque e o câmbio usado no preço da demo
  const usinas = atlas.usinas.map(({ id, nome, uf, proximas, recentes }) => ({ id, nome, uf, proximas, recentes }));
  return <Laboratorio usinas={usinas} cambio={atlas.cambio} />;
}
