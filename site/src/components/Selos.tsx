"use client";

// Etiquetas que dependem do idioma: tipo de usina, resultado da previsão, nível de evidência e barra de chance.
import { useIdioma } from "@/i18n/idioma";
import type { Janela } from "@/lib/tipos";
import { IconeTipo } from "./Icones";
import { Selo, type TomSelo } from "./ui";

// Estas duas peças moram em ui.tsx; ficam reexportadas aqui para quem já importava daqui.
export { Cartao, Numero } from "./ui";

export function SeloTipo({ tipo }: { tipo: "eolica" | "solar" }) {
  const { t } = useIdioma();
  return (
    <Selo tom={tipo === "eolica" ? "eolica" : "solar"}>
      <IconeTipo tipo={tipo} className="size-3.5" />
      {tipo === "eolica" ? t.common.wind : t.common.solar}
    </Selo>
  );
}

export function SeloResultado({ resultado }: { resultado: Janela["resultado_ons"] }) {
  const { t } = useIdioma();
  const mapa: Record<Janela["resultado_ons"], { tom: TomSelo; icone: "check" | "x" | "relogio" | "menos"; rotulo: string }> = {
    confirmado: { tom: "ok", icone: "check", rotulo: t.common.confirmed },
    errado: { tom: "critico", icone: "x", rotulo: t.common.wrong },
    aguardando_ons: { tom: "neutro", icone: "relogio", rotulo: t.common.pending },
    sem_dado: { tom: "neutro", icone: "menos", rotulo: t.common.noData },
  };
  const { tom, icone, rotulo } = mapa[resultado];
  return (
    <Selo tom={tom} icone={icone}>
      {rotulo}
    </Selo>
  );
}

/** Os três níveis de evidência do Nomos, sempre com a mesma cor e o mesmo ícone no site inteiro. */
export function Evidencia({ nivel }: { nivel: "oficial" | "estimativa" | "simulacao" }) {
  const { t } = useIdioma();
  const mapa = {
    oficial: { tom: "ok", icone: "escudo", rotulo: t.evidence.official },
    estimativa: { tom: "aviso", icone: "calculadora", rotulo: t.evidence.estimate },
    simulacao: { tom: "simulacao", icone: "frasco", rotulo: t.evidence.simulation },
  } as const;
  const { tom, icone, rotulo } = mapa[nivel];
  return (
    <Selo tom={tom} icone={icone}>
      {rotulo}
    </Selo>
  );
}

/** Chance de corte: barra fina na cor dos dados de corte e o número ao lado. */
export function BarraChance({ valor }: { valor: number }) {
  const p = Math.round(valor * 100);
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${p}%`}>
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-line sm:w-16" aria-hidden>
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${p}%` }} />
      </div>
      <span className="tabular text-sm font-medium" aria-hidden>
        {p}%
      </span>
    </div>
  );
}
