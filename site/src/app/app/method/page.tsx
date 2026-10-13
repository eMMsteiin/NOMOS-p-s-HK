import type { Metadata } from "next";
import { Metodo } from "@/components/Metodo";
import { atlas } from "@/lib/atlas";

export const metadata: Metadata = { title: "Método — Nomos" };

export default function Page() {
  // O período do PLD horário vem dos dados (atlas.json), para não ficar com uma data escrita à mão
  return <Metodo pldPeriodo={atlas.pld.periodo ?? ""} />;
}
