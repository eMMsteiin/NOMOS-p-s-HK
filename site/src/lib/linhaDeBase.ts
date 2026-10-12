// Linha de base ingênua para o placar ao vivo: "o corte acontece nas horas em que esta usina costuma ser cortada".
// Compara o modelo e essa regra nas MESMAS janelas ao vivo. Sem dados novos: só o mapa de calor e as janelas já publicadas.
import type { Janela, Usina } from "./tipos";

type JanelaViva = Pick<Janela, "id_ons" | "data" | "inicio" | "fim" | "chance_prevista" | "fracao_com_corte" | "resultado_ons">;

export type ComparacaoLinhaDeBase = {
  janelas: number;
  dias: number;
  /** Erro médio, em pontos percentuais (0–100): |chance prevista − fração das meias-horas da janela com corte|. */
  erroModelo: number;
  erroBase: number;
  /** Janelas em que a regra ingênua também teria oferecido a janela (chance média das horas >= 50%). */
  baseTambemOferecia: number;
};

/** Dias do período "AAAA-MM-DD a AAAA-MM-DD" (inclusive). */
export function diasDoPeriodo(periodo: string): number {
  const utc = (iso: string) => {
    const [a, m, d] = iso.split("-").map(Number);
    return Date.UTC(a, m - 1, d);
  };
  const [ini, fim] = periodo.split(" a ");
  return Math.round((utc(fim) - utc(ini)) / 86_400_000) + 1;
}

/** Chance média de corte nas horas da janela, pelo perfil do mês anterior (sem olhar os dias que estão sendo avaliados). */
function chanceDaBase(j: JanelaViva, calor: Usina["calor"]): number | null {
  const mesAnterior = (Number(j.data.slice(5, 7)) - 1 + 11) % 12; // índice 0–11 do mês anterior
  const slot = (hhmm: string) => Number(hhmm.slice(0, 2)) * 2 + (hhmm.slice(3, 5) === "30" ? 1 : 0);
  const valores: number[] = [];
  for (let s = slot(j.inicio); s < slot(j.fim); s++) {
    const v = calor[mesAnterior]?.[Math.floor(s / 2)];
    if (v !== null && v !== undefined) valores.push(v);
  }
  return valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
}

export function compararComLinhaDeBase(janelas: JanelaViva[], calorPorUsina: Record<string, Usina["calor"]>): ComparacaoLinhaDeBase | null {
  const usadas = janelas.flatMap((j) => {
    const calor = calorPorUsina[j.id_ons];
    const base = calor && j.fracao_com_corte !== null && j.resultado_ons !== "sem_dado" ? chanceDaBase(j, calor) : null;
    return base === null ? [] : [{ j, base }];
  });
  if (!usadas.length) return null;
  const media = (f: (x: (typeof usadas)[number]) => number) => usadas.reduce((s, x) => s + f(x), 0) / usadas.length;
  return {
    janelas: usadas.length,
    dias: new Set(usadas.map((x) => x.j.data)).size,
    erroModelo: media((x) => Math.abs(x.j.chance_prevista - (x.j.fracao_com_corte ?? 0))) * 100,
    erroBase: media((x) => Math.abs(x.base - (x.j.fracao_com_corte ?? 0))) * 100,
    baseTambemOferecia: usadas.filter((x) => x.base >= 0.5).length,
  };
}
