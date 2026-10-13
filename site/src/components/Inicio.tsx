"use client";

// "Onde instalar": a página de entrada da plataforma. Primeiro o cenário e o ranking das usinas (o que o visitante
// veio fazer), depois as janelas dos próximos dias e, por fim, o contexto: por que o corte acontece.
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useIdioma } from "@/i18n/idioma";
import type { PldRef } from "@/lib/calculadora";
import { dataCurta, num, pct } from "@/lib/formato";
import { diasDoPeriodo } from "@/lib/linhaDeBase";
import { ROTAS } from "@/lib/rotas";
import type { Atlas } from "@/lib/tipos";
import { Icone } from "./Icones";
import { PorQueAcontece } from "./PorQueAcontece";
import { PrevisaoDias } from "./PrevisaoDias";
import { RankingUsinas, type UsinaPainel } from "./RankingUsinas";
import { CabecalhoPagina } from "./ui";

export type DadosInicio = Pick<Atlas, "manchete" | "previsao" | "pld" | "padroes" | "dados_ate" | "cambio"> & {
  placar: Atlas["teste"]["placar"];
  ao_vivo: Atlas["ao_vivo"];
  razoes_nordeste: Record<string, number>;
  usinas: UsinaPainel[];
  pldRef: PldRef;
};

// "Como ler esta página": aparece na primeira visita e some quando a pessoa fecha (fica guardado no aparelho)
const CHAVE_GUIA = "nomos-guia-visto";
const ouvintes = new Set<() => void>();
const guiaVisto = () => {
  try {
    return localStorage.getItem(CHAVE_GUIA) === "1";
  } catch {
    return false;
  }
};
const assinarGuia = (f: () => void) => {
  ouvintes.add(f);
  return () => void ouvintes.delete(f);
};
function fecharGuia() {
  try {
    localStorage.setItem(CHAVE_GUIA, "1");
  } catch {
    // sem armazenamento: o guia some só até recarregar
  }
  ouvintes.forEach((f) => f());
}

function GuiaDeUso() {
  const { t } = useIdioma();
  // No servidor vale "já visto" (nada aparece); no navegador, o que está guardado
  const visto = useSyncExternalStore(assinarGuia, guiaVisto, () => true);
  if (visto) return null;
  return (
    <section className="nao-imprimir rounded-2xl border border-brand-100 bg-brand-50/70 p-5 sm:p-6" aria-label={t.panel.howToTitle}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="flex items-center gap-2.5 font-semibold text-brand-900">
          <Icone nome="info" className="size-5 text-brand-700" />
          {t.panel.howToTitle}
        </h2>
        <button
          type="button"
          onClick={fecharGuia}
          className="min-h-9 rounded-full bg-card px-4 text-sm font-semibold text-brand-800 shadow-card ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100"
        >
          {t.panel.howToClose}
        </button>
      </div>
      <ol className="mt-4 grid gap-4 sm:grid-cols-3">
        {t.panel.howTo.map((x, i) => (
          <li key={x} className="flex gap-3 text-sm leading-relaxed text-ink-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">{i + 1}</span>
            {x}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Inicio({ d }: { d: DadosInicio }) {
  const { t } = useIdioma();
  const L = t.locale;
  const p = t.panel;

  return (
    <div className="space-y-14">
      <div className="space-y-6">
        <CabecalhoPagina eyebrow={p.eyebrow} titulo={p.title} lead={p.lead}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sunken px-3 py-1.5 text-xs font-medium text-ink-2 ring-1 ring-inset ring-line">
            <Icone nome="calendario" className="size-3.5" />
            {p.dataUntil(dataCurta(d.dados_ate, L, true))}
          </span>
        </CabecalhoPagina>
        <GuiaDeUso />
      </div>

      <RankingUsinas usinas={d.usinas} pld={d.pldRef} />

      <PrevisaoDias
        previsao={d.previsao}
        usinas={d.usinas}
        dadosAte={d.dados_ate}
        pldPiso={d.pld.piso_2026_rs_mwh}
        comPldReal={!!d.pld.cruzamento}
        cambio={d.cambio}
      />

      <PorQueAcontece d={{ manchete: d.manchete, pld: d.pld, padroes: d.padroes, razoes_nordeste: d.razoes_nordeste }} />

      <Link href={ROTAS.placar} className="nao-imprimir group block rounded-3xl bg-brand-900 p-6 text-white transition hover:bg-brand-800 sm:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{t.home.trackCta}</h2>
            <p className="mt-2 text-brand-100/85">{t.home.trackCtaLead(num(d.placar.confirmadas, L), num(d.placar.total, L))}</p>
            {d.ao_vivo.total > 0 && (
              <p className="mt-1 text-sm text-brand-200/75">
                {t.home.liveLine(num(d.ao_vivo.confirmadas, L), num(d.ao_vivo.total, L), pct(d.ao_vivo.fracao_confirmadas ?? 0, L), num(diasDoPeriodo(d.ao_vivo.periodo), L))}
              </p>
            )}
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20 transition group-hover:translate-x-1">
            <Icone nome="seta" className="size-5" />
          </span>
        </div>
      </Link>
    </div>
  );
}
