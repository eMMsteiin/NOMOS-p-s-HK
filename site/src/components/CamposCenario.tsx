"use client";

// Os campos do cenário: tamanho da carga (MW), horas por dia e horário de início, com atalhos.
// Usado em "Onde instalar" e na calculadora de cada usina; os dois leem e gravam o mesmo cenário.
import { useId, useState, type CSSProperties } from "react";
import { useIdioma } from "@/i18n/idioma";
import type { Cenario } from "@/lib/cenario";
import { faixaDeHorario, num } from "@/lib/formato";
import { Icone } from "./Icones";
import { Termo } from "./Termo";

const hora = (h: number) => `${String(h).padStart(2, "0")}:00`;
const MW_RAPIDOS = [1, 5, 10, 50, 100];
const PRESETS = [
  { chave: "office", inicio: 8, horas: 10 },
  { chave: "sun", inicio: 9, horas: 6 },
  { chave: "all", inicio: 0, horas: 24 },
  { chave: "night", inicio: 20, horas: 8 },
] as const;

/** Passo dos botões de + e −, proporcional ao tamanho da carga. */
const passoMW = (mw: number) => (mw < 10 ? 1 : mw < 50 ? 5 : mw < 200 ? 10 : 50);

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`min-h-9 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-xs font-semibold transition ${
        ativo ? "border-brand-700 bg-brand-700 text-white" : "border-line-strong bg-card text-ink-2 hover:border-ink-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function CamposCenario({
  cenario,
  aoMudar,
  mostrarMelhor = false,
  className = "",
}: {
  cenario: Cenario;
  aoMudar: (parte: Partial<Cenario>) => void;
  /** Mostra a opção "usar o melhor horário de cada usina" (só faz sentido onde há várias usinas). */
  mostrarMelhor?: boolean;
  className?: string;
}) {
  const { t } = useIdioma();
  const L = t.locale;
  const p = t.panel;
  const id = useId();
  // Enquanto a pessoa digita ("1," ou vazio), o texto fica aqui; o cenário só muda quando o número é válido
  const [rascunho, setRascunho] = useState<string | null>(null);
  const textoMw = rascunho ?? String(cenario.mw).replace(".", L.startsWith("pt") ? "," : ".");
  const campo = "min-h-11 w-full rounded-xl border border-line-strong bg-card px-3.5 text-[0.9375rem] font-semibold text-ink shadow-card";

  const digitar = (v: string) => {
    setRascunho(v);
    const n = Number(v.replace(",", "."));
    if (Number.isFinite(n) && n > 0) aoMudar({ mw: n });
  };
  const passo = (sinal: 1 | -1) => {
    setRascunho(null);
    aoMudar({ mw: Math.max(1, cenario.mw + sinal * passoMW(cenario.mw)) });
  };
  const progresso = ((cenario.horas - 1) / 23) * 100;

  return (
    <div className={className}>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-3">
        {/* Carga */}
        <div>
          <label htmlFor={`${id}-mw`} className="text-sm font-semibold text-ink">
            {p.load} <Termo k="mw" soIcone />
          </label>
          <div className="mt-2 flex items-stretch gap-1.5">
            <button type="button" onClick={() => passo(-1)} aria-label={p.stepDown} className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-card text-ink-2 shadow-card hover:bg-sunken">
              <Icone nome="menos" className="size-4" />
            </button>
            <div className="relative min-w-0 flex-1">
              <input
                id={`${id}-mw`}
                type="text"
                inputMode="decimal"
                value={textoMw}
                onChange={(e) => digitar(e.target.value)}
                onBlur={() => setRascunho(null)}
                className={`${campo} tabular pr-12 text-center`}
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">MW</span>
            </div>
            <button type="button" onClick={() => passo(1)} aria-label={p.stepUp} className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-card text-ink-2 shadow-card hover:bg-sunken">
              <Icone nome="mais" className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">{p.loadHint}</p>
        </div>

        {/* Horas por dia */}
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={`${id}-h`} className="text-sm font-semibold text-ink">
              {p.hours}
            </label>
            <output htmlFor={`${id}-h`} className="tabular whitespace-nowrap text-lg font-semibold leading-none text-ink">
              {cenario.horas} h
            </output>
          </div>
          <div className="mt-2.5 flex min-h-11 items-center">
            <input
              id={`${id}-h`}
              type="range"
              min={1}
              max={24}
              step={1}
              value={cenario.horas}
              onChange={(e) => aoMudar({ horas: Number(e.target.value) })}
              className="campo-faixa"
              style={{ "--p": `${progresso}%` } as CSSProperties}
            />
          </div>
          <div className="mt-0.5 flex justify-between text-[11px] text-muted" aria-hidden>
            <span>1 h</span>
            <span>12 h</span>
            <span>24 h</span>
          </div>
        </div>

        {/* Início */}
        <div>
          <label htmlFor={`${id}-i`} className="text-sm font-semibold text-ink">
            {p.start}
          </label>
          <select
            id={`${id}-i`}
            value={cenario.inicio}
            disabled={mostrarMelhor && cenario.melhorHorario}
            onChange={(e) => aoMudar({ inicio: Number(e.target.value) })}
            className={`${campo} tabular mt-2 disabled:cursor-not-allowed disabled:bg-sunken disabled:text-muted`}
          >
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>
                {hora(h)}
              </option>
            ))}
          </select>
          <p className="tabular mt-2 text-xs text-muted">{mostrarMelhor && cenario.melhorHorario ? p.best : faixaDeHorario(cenario.inicio, cenario.horas)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-[1fr_1.7fr]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{p.quickLoad}</p>
          <div className="sem-barra -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {MW_RAPIDOS.map((mw) => (
              <Chip
                key={mw}
                ativo={cenario.mw === mw}
                onClick={() => {
                  setRascunho(null);
                  aoMudar({ mw });
                }}
              >
                {num(mw, L)} MW
              </Chip>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{p.quickSchedule}</p>
          <div className="sem-barra -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {PRESETS.map((pr) => (
              <Chip key={pr.chave} ativo={cenario.inicio === pr.inicio && cenario.horas === pr.horas} onClick={() => aoMudar({ inicio: pr.inicio, horas: pr.horas })}>
                {p.presets[pr.chave]} · {pr.horas === 24 ? "24 h" : faixaDeHorario(pr.inicio, pr.horas).replaceAll(":00", "h")}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {mostrarMelhor && (
        <label className="mt-6 flex cursor-pointer items-start gap-3.5 rounded-xl border border-line bg-sunken/60 p-3.5">
          <input type="checkbox" checked={cenario.melhorHorario} onChange={(e) => aoMudar({ melhorHorario: e.target.checked })} className="peer sr-only" />
          <span
            aria-hidden
            className="relative mt-0.5 inline-block h-6 w-11 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-brand-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">{p.best}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted">{p.bestHint}</span>
          </span>
        </label>
      )}
    </div>
  );
}
