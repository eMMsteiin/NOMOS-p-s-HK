// O "cenário" do visitante: o tamanho da carga (MW), as horas de operação por dia e o horário de início.
// Fica guardado no aparelho (localStorage) para valer em todas as páginas da plataforma, e pode viajar num link
// (?mw=10&h=8&i=8) para outra pessoa abrir o mesmo cenário. É só uma preferência de tela: não vai para nenhum servidor.
import { useSyncExternalStore } from "react";

export type Cenario = {
  /** Carga, em megawatts. */
  mw: number;
  /** Horas de operação por dia (1 a 24). */
  horas: number;
  /** Hora em que começa (0 a 23). */
  inicio: number;
  /** Em vez do horário fixo, usar o melhor início de cada usina (para cargas que podem escolher quando rodar). */
  melhorHorario: boolean;
};

export const CENARIO_PADRAO: Cenario = { mw: 10, horas: 8, inicio: 8, melhorHorario: false };

const CHAVE = "nomos-cenario";
const ouvintes = new Set<() => void>();
let estado: Cenario | null = null;

const inteiro = (x: unknown, min: number, max: number, padrao: number) => {
  const n = Math.round(Number(x));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : padrao;
};

/** Garante valores possíveis, venham de onde vierem (armazenamento, link, tela). */
export function limitar(c: Partial<Cenario> | null | undefined): Cenario {
  const mw = Number(c?.mw);
  return {
    mw: Number.isFinite(mw) && mw > 0 ? Math.min(5000, Math.round(mw * 100) / 100) : CENARIO_PADRAO.mw,
    horas: inteiro(c?.horas, 1, 24, CENARIO_PADRAO.horas),
    inicio: inteiro(c?.inicio, 0, 23, CENARIO_PADRAO.inicio),
    melhorHorario: c?.melhorHorario === true,
  };
}

function lerArmazenado(): Cenario {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) return limitar(JSON.parse(bruto));
  } catch {
    // sem armazenamento (navegação privada, bloqueio): vale o padrão
  }
  return CENARIO_PADRAO;
}

function guardar(c: Cenario) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(c));
  } catch {
    // sem armazenamento: o cenário vale só nesta visita
  }
}

function avisar() {
  ouvintes.forEach((f) => f());
}

function assinar(f: () => void) {
  ouvintes.add(f);
  const outraAba = (e: StorageEvent) => {
    if (e.key === CHAVE) {
      estado = lerArmazenado();
      f();
    }
  };
  window.addEventListener("storage", outraAba);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener("storage", outraAba);
  };
}

const instantaneo = () => (estado ??= lerArmazenado());
const doServidor = () => CENARIO_PADRAO;

/** Muda parte do cenário (e guarda). */
export function definirCenario(parte: Partial<Cenario>) {
  estado = limitar({ ...instantaneo(), ...parte });
  guardar(estado);
  avisar();
}

/** Lê o cenário e devolve também a função para mudá-lo. No servidor (e na primeira pintura) vale o padrão. */
export function useCenario(): [Cenario, (parte: Partial<Cenario>) => void] {
  const c = useSyncExternalStore(assinar, instantaneo, doServidor);
  return [c, definirCenario];
}

/** Lê o cenário de um endereço (?mw=10&h=8&i=8&m=1). Devolve null se o endereço não traz cenário. */
export function cenarioDaBusca(busca: string): Partial<Cenario> | null {
  const q = new URLSearchParams(busca);
  if (!q.has("mw") && !q.has("h") && !q.has("i")) return null;
  const c: Partial<Cenario> = {};
  if (q.has("mw")) c.mw = Number(q.get("mw"));
  if (q.has("h")) c.horas = Number(q.get("h"));
  if (q.has("i")) c.inicio = Number(q.get("i"));
  c.melhorHorario = q.get("m") === "1";
  return c;
}

/** Endereço completo que abre a página com este cenário. */
export function linkDoCenario(c: Cenario, caminho: string): string {
  const q = new URLSearchParams({ mw: String(c.mw), h: String(c.horas), i: String(c.inicio) });
  if (c.melhorHorario) q.set("m", "1");
  const origem = typeof window === "undefined" ? "" : window.location.origin;
  return `${origem}${caminho}?${q.toString()}`;
}
