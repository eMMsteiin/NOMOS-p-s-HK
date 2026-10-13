"use client";

// "Onde instalar": o visitante informa a carga uma vez e vê as usinas de destaque ordenadas por quanta energia
// cortada essa carga teria encontrado no passado. Usa a mesma conta da calculadora de cada usina.
import Link from "next/link";
import { useMemo, useState } from "react";
import { useIdioma } from "@/i18n/idioma";
import { calcular, melhorInicio, type PldRef, type UsinaCalc } from "@/lib/calculadora";
import { useCenario } from "@/lib/cenario";
import { faixaDeHorario, num, pct, reais } from "@/lib/formato";
import { ROTAS } from "@/lib/rotas";
import type { Usina } from "@/lib/tipos";
import { CamposCenario } from "./CamposCenario";
import { Icone } from "./Icones";
import { MapaCarregado } from "./MapaCarregado";
import { Evidencia, SeloTipo } from "./Selos";
import { Termo } from "./Termo";
import { Cartao, Nota, Selo } from "./ui";

export type UsinaPainel = Pick<Usina, "id" | "nome" | "uf" | "tipo" | "local" | "capacidade_mw" | "proximas"> & UsinaCalc;

type Ordem = "energy" | "hours" | "value" | "surplus";
const hora = (h: number) => `${String(h).padStart(2, "0")}:00`;

export function RankingUsinas({ usinas, pld }: { usinas: UsinaPainel[]; pld: PldRef }) {
  const { t } = useIdioma();
  const L = t.locale;
  const p = t.panel;
  const [c, definir] = useCenario();
  const [ordem, setOrdem] = useState<Ordem>("energy");
  const [destaque, setDestaque] = useState<string | null>(null);

  const linhas = useMemo(() => {
    const calculadas = usinas.map((u) => {
      const inicio = c.melhorHorario ? melhorInicio(u, c.horas).inicio : c.inicio;
      return { u, inicio, r: calcular(u, pld, { mw: c.mw, horasPorDia: c.horas, inicio }), ene: u.razoes_2026.fracao.ENE ?? 0 };
    });
    const chave: Record<Ordem, (x: (typeof calculadas)[number]) => number> = {
      energy: (x) => x.r.mwhMes,
      hours: (x) => x.r.horasCorteMes,
      value: (x) => x.r.reaisMedio,
      surplus: (x) => x.ene,
    };
    return [...calculadas].sort((a, b) => chave[ordem](b) - chave[ordem](a));
  }, [usinas, pld, c, ordem]);

  const maxEnergia = Math.max(...linhas.map((x) => x.r.mwhMes), 1);
  const melhorEnergia = linhas.reduce((m, x) => (x.r.mwhMes > m.r.mwhMes ? x : m), linhas[0]);
  const mw = num(c.mw, L, c.mw % 1 ? 1 : 0);
  const titulo = c.melhorHorario ? p.resultTitleBest(mw, String(c.horas)) : p.resultTitle(mw, String(c.horas), faixaDeHorario(c.inicio, c.horas));

  const pontos = usinas.map((u) => {
    const x = linhas.find((l) => l.u.id === u.id)!;
    return {
      id: u.id,
      nome: u.nome,
      tipo: u.tipo,
      lat: u.local.lat,
      lon: u.local.lon,
      capacidade_mw: u.capacidade_mw,
      chance: x.r.mwhMes / maxEnergia,
      rotulo: `${num(x.r.mwhMes, L)} MWh · ${reais(x.r.reaisMedio, L, true)} ${t.charts.perMonth}`,
    };
  });

  const ordens: { chave: Ordem; rotulo: string }[] = [
    { chave: "energy", rotulo: p.sort.energy },
    { chave: "hours", rotulo: p.sort.hours },
    { chave: "value", rotulo: p.sort.value },
    { chave: "surplus", rotulo: p.sort.surplus },
  ];
  const cab = "px-3 py-3 font-medium";

  return (
    <div className="space-y-8">
      {/* 1. O cenário */}
      <Cartao>
        <h2 className="text-lg font-semibold text-ink">{p.scenarioTitle}</h2>
        <CamposCenario cenario={c} aoMudar={definir} mostrarMelhor className="mt-5" />
      </Cartao>

      {/* 2. O resultado */}
      <section aria-labelledby="ranking-titulo">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="max-w-3xl">
            <h2 id="ranking-titulo" className="text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
              {titulo}
            </h2>
            <p className="mt-1.5 text-ink-2">{p.resultLead}</p>
          </div>
          <Evidencia nivel="estimativa" />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2" role="group" aria-label={p.sortBy}>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{p.sortBy}</span>
          <div className="inline-flex flex-wrap gap-1 rounded-full bg-sunken p-0.5 ring-1 ring-inset ring-line">
            {ordens.map((o) => (
              <button
                key={o.chave}
                type="button"
                onClick={() => setOrdem(o.chave)}
                aria-pressed={ordem === o.chave}
                className={`min-h-9 rounded-full px-3.5 text-xs font-semibold transition ${ordem === o.chave ? "bg-card text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"}`}
              >
                {o.rotulo}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-medium text-ink">{p.topSentence(melhorEnergia.u.nome.replace(/^Conj\. /, ""), melhorEnergia.u.uf, num(melhorEnergia.r.mwhMes, L))}</p>
            {/* Celular: um cartão por usina, com o número principal em destaque */}
            <ol className="space-y-3 md:hidden">
              {linhas.map((x, i) => {
                const topo = x.u.id === melhorEnergia.u.id;
                return (
                  <li key={x.u.id}>
                    <Link
                      href={ROTAS.calculadora(x.u.id)}
                      className={`block rounded-2xl border p-4 shadow-card transition active:translate-y-px ${topo ? "border-brand-200 bg-brand-50/60" : "border-line bg-card"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="tabular mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sunken text-xs font-semibold text-ink-2 ring-1 ring-inset ring-line">{i + 1}</span>
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug text-ink">{x.u.nome.replace(/^Conj\. /, "")}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                              <SeloTipo tipo={x.u.tipo} />
                              <span>
                                {x.u.local.municipio}, {x.u.uf}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Icone nome="seta" className="mt-1 size-5 text-ink-2" />
                      </div>
                      {topo && ordem === "energy" && (
                        <div className="mt-2.5">
                          <Selo tom="marca" icone="estrela">
                            {p.topBadge}
                          </Selo>
                        </div>
                      )}
                      <div className="mt-3.5 flex items-baseline justify-between gap-3">
                        <p className="text-[1.65rem] font-semibold leading-none tracking-tight text-ink">
                          {num(x.r.mwhMes, L)} <span className="text-sm font-medium text-muted">MWh</span>
                        </p>
                        <p className="text-xs text-muted">{t.charts.perMonth}</p>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-line" aria-hidden>
                        <div className="h-full rounded-full bg-brand-600" style={{ width: `${(x.r.mwhMes / maxEnergia) * 100}%` }} />
                      </div>
                      <dl className="mt-3.5 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs">
                        {[
                          [`${num(x.r.horasCorteMes, L)} h`, p.sort.hours],
                          [reais(x.r.reaisMedio, L, true), p.sort.value],
                          [pct(x.ene, L), p.colSurplus],
                        ].map(([v, r]) => (
                          <div key={r} className="flex flex-col-reverse">
                            <dt className="mt-0.5 leading-tight text-muted">{r}</dt>
                            <dd className="tabular text-sm font-semibold text-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      {c.melhorHorario && <p className="tabular mt-2.5 text-xs text-brand-700">{p.bestStartAt(hora(x.inicio))}</p>}
                    </Link>
                  </li>
                );
              })}
            </ol>
            <Cartao semPreenchimento className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-line bg-sunken/60 text-left text-xs text-muted">
                  <tr>
                    <th className={`${cab} pl-5`}>{p.colPlant}</th>
                    <th className={cab}>{p.colHours}</th>
                    <th className={cab}>
                      {p.colEnergy} <Termo k="mwh" soIcone />
                    </th>
                    <th className={cab}>
                      {p.colValue} <Termo k="pld" soIcone />
                    </th>
                    <th className={cab}>
                      {p.colSurplus} <Termo k="ene" soIcone />
                    </th>
                    <th className="w-10 pr-3" />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((x, i) => {
                    const topo = x.u.id === melhorEnergia.u.id;
                    return (
                      <tr
                        key={x.u.id}
                        onPointerEnter={() => setDestaque(x.u.id)}
                        onPointerLeave={() => setDestaque(null)}
                        className={`border-b border-line/70 transition-colors last:border-0 ${destaque === x.u.id ? "bg-sunken/70" : topo ? "bg-brand-50/50" : ""}`}
                      >
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="flex items-start gap-3">
                            <span className="tabular mt-0.5 hidden w-4 shrink-0 text-xs font-semibold text-muted sm:block">{i + 1}</span>
                            <div className="min-w-0">
                              <Link href={ROTAS.usina(x.u.id)} className="font-semibold text-ink hover:text-brand-700 hover:underline">
                                {x.u.nome.replace(/^Conj\. /, "")}
                              </Link>
                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-normal text-muted">
                                <SeloTipo tipo={x.u.tipo} />
                                <span className="whitespace-nowrap">
                                  {x.u.local.municipio}, {x.u.uf}
                                </span>
                              </div>
                              {c.melhorHorario && <div className="tabular mt-1 text-xs font-normal text-brand-700">{p.bestStartAt(hora(x.inicio))}</div>}
                              {topo && ordem === "energy" && (
                                <div className="mt-1.5">
                                  <Selo tom="marca" icone="estrela">
                                    {p.topBadge}
                                  </Selo>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="tabular whitespace-nowrap px-3 py-3.5 font-medium">
                          {num(x.r.horasCorteMes, L)} h
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="tabular whitespace-nowrap font-semibold text-ink">{num(x.r.mwhMes, L)} MWh</div>
                          <div className="mt-1.5 h-1.5 w-full min-w-16 rounded-full bg-line" aria-hidden>
                            <div className="h-full rounded-full bg-brand-600" style={{ width: `${(x.r.mwhMes / maxEnergia) * 100}%` }} />
                          </div>
                        </td>
                        <td className="tabular whitespace-nowrap px-3 py-3.5 font-medium">
                          {reais(x.r.reaisMedio, L, true)}
                        </td>
                        <td className="tabular whitespace-nowrap px-3 py-3.5">
                          <span className="font-medium">{pct(x.ene, L)}</span>
                        </td>
                        <td className="pr-3 text-right">
                          <Link
                            href={ROTAS.calculadora(x.u.id)}
                            aria-label={`${p.open}: ${x.u.nome.replace(/^Conj\. /, "")}`}
                            className="inline-flex size-9 items-center justify-center rounded-full text-ink-2 transition hover:bg-brand-50 hover:text-brand-700"
                          >
                            <Icone nome="seta" className="size-[1.1rem]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Cartao>
            <p className="mt-3 text-xs leading-relaxed text-muted">{p.valueNote(`R$ ${num(pld.medio, L, 2)}`)}</p>
            <Nota tom="aviso" className="mt-4">
              {p.caution}
            </Nota>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-3 text-sm font-semibold text-ink">{p.mapTitle}</h3>
            <div className="h-72 lg:h-[520px]">
              <MapaCarregado pontos={pontos} destaque={destaque} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
