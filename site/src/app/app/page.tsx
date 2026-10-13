import type { Metadata } from "next";
import { atlas } from "@/lib/atlas";
import { pldDeReferencia } from "@/lib/pldReferencia";
import { Inicio, type DadosInicio } from "@/components/Inicio";

export const metadata: Metadata = { title: "Onde instalar — Nomos" };

export default function Page() {
  // Só o necessário vai para o navegador; o resto do atlas.json fica no servidor.
  const dados: DadosInicio = {
    manchete: atlas.manchete,
    previsao: atlas.previsao,
    pld: atlas.pld,
    padroes: atlas.padroes,
    dados_ate: atlas.dados_ate,
    cambio: atlas.cambio,
    placar: atlas.teste.placar,
    ao_vivo: atlas.ao_vivo,
    razoes_nordeste: atlas.razoes.nordeste_2026.fracao,
    pldRef: pldDeReferencia(atlas.pld),
    usinas: atlas.usinas.map(({ id, nome, uf, tipo, local, capacidade_mw, proximas, calor, perdeu_jan_jul_2026_gwh, fracao_meias_horas_com_corte, razoes_2026 }) => ({
      id,
      nome,
      uf,
      tipo,
      local,
      capacidade_mw,
      proximas,
      calor,
      perdeu_jan_jul_2026_gwh,
      fracao_meias_horas_com_corte,
      razoes_2026,
    })),
  };
  return <Inicio d={dados} />;
}
