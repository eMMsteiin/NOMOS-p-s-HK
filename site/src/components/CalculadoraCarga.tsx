"use client";

import { useMemo, useState } from "react";
import { useIdioma } from "@/i18n/idioma";
import { calcular, melhorInicio, type PldRef } from "@/lib/calculadora";
import { num, pct, reais } from "@/lib/formato";
import type { Usina } from "@/lib/tipos";
import { Cartao, Numero } from "./Selos";

const hora = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** Quanto do corte passado uma carga ao lado da usina teria encontrado. Cálculo no navegador, com os dados já carregados. */
export function CalculadoraCarga({ u, pld }: { u: Usina; pld: PldRef }) {
  const { t } = useIdioma();
  const c = t.calc;
  const L = t.locale;

  const [mwTexto, setMwTexto] = useState("10");
  const [horas, setHoras] = useState(8);
  const [inicio, setInicio] = useState(8);

  const mw = Number(mwTexto.replace(",", "."));
  const r = useMemo(() => calcular(u, pld, { mw, horasPorDia: horas, inicio }), [u, pld, mw, horas, inicio]);
  const melhor = useMemo(() => melhorInicio(u, horas), [u, horas]);

  const linhas = [
    { chave: "ene", rotulo: c.reasonEne, dado: r.razoes.ene },
    { chave: "eletrico", rotulo: c.reasonElec, dado: r.razoes.eletrico },
    ...(r.razoes.outras.fracao >= 0.005 ? [{ chave: "outras", rotulo: c.reasonOther, dado: r.razoes.outras }] : []),
  ];

  return (
    <Cartao>
      <h2 className="text-lg font-semibold">{c.title}</h2>
      <p className="mt-1 text-sm text-muted">{c.lead}</p>
      <p className="mt-3 rounded-lg border border-ink px-3 py-2 text-sm font-medium">{c.disclaimer}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">{c.loadLabel}</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={mwTexto}
              onChange={(e) => setMwTexto(e.target.value)}
              className="tabular w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            />
            <span className="text-sm text-muted">MW</span>
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{c.hoursLabel}</span>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
              className="w-full accent-[var(--color-ink)]"
            />
            <span className="tabular w-10 shrink-0 text-right font-semibold">{horas} h</span>
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{c.startLabel}</span>
          <select
            value={inicio}
            onChange={(e) => setInicio(Number(e.target.value))}
            className="tabular mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
          >
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>
                {hora(h)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {r.acimaDaCapacidade && <p className="mt-2 text-xs text-muted">{c.capNote(`${num(u.capacidade_mw, L)} MW`)}</p>}
      {melhor.inicio !== inicio && (
        <p className="mt-2 text-xs text-muted">
          {c.bestStart(hora(melhor.inicio), num(melhor.horasCorteMes, L))}{" "}
          <button type="button" onClick={() => setInicio(melhor.inicio)} className="font-medium text-ink underline">
            {c.useBest}
          </button>
        </p>
      )}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <Numero
          valor={`${num(r.horasCorteMes, L, 1)} h`}
          rotulo={`${c.hoursTitle}: ${c.hoursNote(num(r.horasOperacaoMes, L), pct(r.fracaoCorte, L))}`}
        />
        <Numero valor={`${num(r.mwhMes, L)} MWh`} rotulo={`${c.energyTitle} ${c.energyNote(num(r.mwMedioCortado, L))}`} />
        <Numero
          valor={reais(r.reaisMedio, L)}
          rotulo={`${c.valueTitle} ${c.valueNote(`R$ ${num(pld.medio, L, 2)}`)} ${c.valueFloor(`R$ ${num(pld.piso, L, 2)}`, reais(r.reaisPiso, L))}`}
        />
      </div>
      <p className="mt-2 text-xs text-muted">{c.valueDisclaimer}</p>

      <h3 className="mt-6 text-sm font-semibold">{c.reasonsTitle}</h3>
      <table className="mt-2 w-full text-sm">
        <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="py-2 font-medium">{c.reasonsHead[0]}</th>
            <th className="px-2 py-2 text-right font-medium">{c.reasonsHead[1]}</th>
            <th className="py-2 pl-2 text-right font-medium">{c.reasonsHead[2]}</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map(({ chave, rotulo, dado }) => (
            <tr key={chave} className="border-b border-line/70 last:border-0">
              <td className="py-2">
                {rotulo} <span className="text-muted">({pct(dado.fracao, L)})</span>
              </td>
              <td className="tabular px-2 py-2 text-right">{num(dado.horas, L, 1)} h</td>
              <td className="tabular py-2 pl-2 text-right">{num(dado.mwh, L)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted">{c.reasonsNote(pct(r.razoes.ene.fracao, L), pct(r.razoes.eletrico.fracao, L))}</p>
      <p className="mt-2 text-sm">{c.elecWarn}</p>

      <div className="mt-5 rounded-lg bg-paper p-3 text-sm">
        <div className="font-medium">{c.ruleTitle}</div>
        <p className="mt-1 text-muted">{c.rule}</p>
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium">{c.methodTitle}</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          {c.method.map((linha) => (
            <li key={linha}>{linha}</li>
          ))}
        </ul>
      </details>
    </Cartao>
  );
}
