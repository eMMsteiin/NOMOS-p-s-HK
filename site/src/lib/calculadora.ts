// Calculadora de carga junto à usina: tudo é estimativa feita a partir do passado (dados do ONS e da CCEE
// que o Atlas já carrega). Sem dados novos, sem API: só aritmética sobre os campos de `Usina`.
import type { Usina } from "./tipos";

/** Dias de cada mês em 2026 (ano não bissexto): peso de cada mês na média anual. */
const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/** Janela de `fracao_meias_horas_com_corte` e `perdeu_jan_jul_2026_gwh`: 1º de janeiro a 31 de julho de 2026. */
const HORAS_JAN_JUL = (31 + 28 + 31 + 30 + 31 + 30 + 31) * 24;

export type PldRef = { medio: number; piso: number };

export type EntradaCalculadora = { mw: number; horasPorDia: number; inicio: number };

export type ResultadoCalculadora = {
  /** Horas de operação por mês, em média no ano (365/12 × horas por dia). */
  horasOperacaoMes: number;
  /** Horas por mês, em média, em que a usina teve corte dentro do horário escolhido. */
  horasCorteMes: number;
  /** Parte das horas de operação que teve corte (0–1). */
  fracaoCorte: number;
  /** Carga efetivamente considerada: o menor entre a carga informada, a capacidade e a potência média cortada. */
  mwUtil: number;
  /** Potência média que a usina deixou de gerar nas horas em que foi cortada (MW). */
  mwMedioCortado: number;
  /** A carga informada passou da capacidade da usina. */
  acimaDaCapacidade: boolean;
  /** Horas de corte por mês e MWh por mês, divididos por tipo de razão (ENE, elétrico = CNF+REL, outras). */
  razoes: Record<"ene" | "eletrico" | "outras", { fracao: number; horas: number; mwh: number }>;
  mwhMes: number;
  /** Valor de referência (R$/mês) ao PLD médio e ao piso. */
  reaisMedio: number;
  reaisPiso: number;
};

/** Horas por mês, em média no ano, com corte no horário [inicio, inicio + horasPorDia). */
export function horasCorteMes(u: Pick<Usina, "calor">, inicio: number, horasPorDia: number): number {
  const horas = Array.from({ length: horasPorDia }, (_, i) => (inicio + i) % 24);
  // calor[mês][hora] = fração das meias-horas daquela hora e mês com corte (histórico jan/2025 → hoje).
  // Por dia, a hora h tem em média calor × 1 h de corte. Soma sobre as horas e sobre os dias do mês.
  const total = u.calor.reduce((soma, linha, m) => soma + DIAS_MES[m] * horas.reduce((s, h) => s + (linha[h] ?? 0), 0), 0);
  return total / 12;
}

/** Potência média cortada enquanto há corte: energia perdida ÷ horas com corte, em jan–jul de 2026. */
export function mwMedioCortado(u: Pick<Usina, "perdeu_jan_jul_2026_gwh" | "fracao_meias_horas_com_corte">): number {
  const horasComCorte = u.fracao_meias_horas_com_corte * HORAS_JAN_JUL;
  return horasComCorte > 0 ? (u.perdeu_jan_jul_2026_gwh * 1000) / horasComCorte : 0;
}

export function calcular(u: Usina, pld: PldRef, e: EntradaCalculadora): ResultadoCalculadora {
  const horasPorDia = Math.min(24, Math.max(1, Math.round(e.horasPorDia)));
  const inicio = ((Math.round(e.inicio) % 24) + 24) % 24;
  const mw = Math.max(0, Number.isFinite(e.mw) ? e.mw : 0);

  const horasOperacaoMes = (365 / 12) * horasPorDia;
  const horasCorte = horasCorteMes(u, inicio, horasPorDia);
  const mwCortado = mwMedioCortado(u);
  const mwUtil = Math.min(mw, u.capacidade_mw, mwCortado);
  const mwhMes = horasCorte * mwUtil;

  // A divisão por razão usa a fração da energia cortada em 2026 (campo razoes_2026.fracao), não a fração das horas.
  const ene = u.razoes_2026.fracao.ENE ?? 0;
  const eletrico = (u.razoes_2026.fracao.CNF ?? 0) + (u.razoes_2026.fracao.REL ?? 0);
  const outras = Math.max(0, 1 - ene - eletrico);
  const parte = (fracao: number) => ({ fracao, horas: horasCorte * fracao, mwh: mwhMes * fracao });

  return {
    horasOperacaoMes,
    horasCorteMes: horasCorte,
    fracaoCorte: horasOperacaoMes > 0 ? horasCorte / horasOperacaoMes : 0,
    mwUtil,
    mwMedioCortado: mwCortado,
    acimaDaCapacidade: mw > u.capacidade_mw,
    razoes: { ene: parte(ene), eletrico: parte(eletrico), outras: parte(outras) },
    mwhMes,
    reaisMedio: mwhMes * pld.medio,
    reaisPiso: mwhMes * pld.piso,
  };
}

/** Hora de início (0–23) com mais horas de corte para um dia de `horasPorDia` horas. */
export function melhorInicio(u: Pick<Usina, "calor">, horasPorDia: number): { inicio: number; horasCorteMes: number } {
  let melhor = { inicio: 0, horasCorteMes: -1 };
  for (let i = 0; i < 24; i++) {
    const h = horasCorteMes(u, i, horasPorDia);
    if (h > melhor.horasCorteMes) melhor = { inicio: i, horasCorteMes: h };
  }
  return melhor;
}
