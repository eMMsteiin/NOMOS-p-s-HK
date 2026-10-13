import { Landing, type DadosLanding } from "@/components/Landing";
import { atlas } from "@/lib/atlas";
import { calcular, perfilHorario } from "@/lib/calculadora";
import { pldDeReferencia } from "@/lib/pldReferencia";
import catalogo from "../../public/data/usinas.json";

// Primeira parada do fluxo: a apresentação do Nomos (a dor, a proposta e os botões de cadastro).
export default function Page() {
  // O exemplo da abertura usa a mesma conta da calculadora, com dados reais: Serra do Assuruá, 10 MW, 8 h por dia
  const usina = atlas.usinas.find((u) => u.id === "CJU_BASAR") ?? atlas.usinas[0];
  const entrada = { mw: 10, horasPorDia: 8, inicio: 8 };
  const pld = pldDeReferencia(atlas.pld);
  const r = calcular(usina, pld, entrada);
  // O mesmo cenário nas usinas de destaque, para a miniatura do ranking
  const ranking = atlas.usinas
    .map((u) => ({ id: u.id, nome: u.nome.replace(/^Conj\. /, ""), uf: u.uf, tipo: u.tipo, mwhMes: calcular(u, pld, entrada).mwhMes }))
    .sort((a, b) => b.mwhMes - a.mwhMes)
    .slice(0, 4);
  const dados: DadosLanding = {
    mwMedios: atlas.manchete.nordeste_mw_medios,
    gwhDia: atlas.manchete.nordeste_gwh_dia,
    valorReais: atlas.manchete.valor_pld_real_rs,
    valorAte: (atlas.manchete.valor_pld_real_periodo ?? "").slice(-10),
    dadosAte: atlas.dados_ate,
    usinasComCalculadora: atlas.usinas.length,
    conjuntosModelados: catalogo.length,
    exemplo: {
      usina: usina.nome.replace(/^Conj\. /, ""),
      uf: usina.uf,
      mw: entrada.mw,
      horas: entrada.horasPorDia,
      inicio: entrada.inicio,
      horasCorteMes: r.horasCorteMes,
      mwhMes: r.mwhMes,
      reais: r.reaisMedio,
      perfil: perfilHorario(usina),
      fracaoEne: r.razoes.ene.fracao,
      fracaoEletrico: r.razoes.eletrico.fracao,
    },
    ranking,
    porHora: atlas.padroes.perda_por_hora_pct,
  };
  return <Landing d={dados} />;
}
