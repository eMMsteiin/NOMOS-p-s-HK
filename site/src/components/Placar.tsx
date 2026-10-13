"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import type { Atlas, Usina } from "@/lib/tipos";
import { dataCurta, num, pct } from "@/lib/formato";
import { Cartao, Evidencia, SeloTipo } from "./Selos";
import { BarraRazoes, GraficoCalibracao, GraficoRazoesMes } from "./Graficos";
import { Icone } from "./Icones";
import type { ComparacaoLinhaDeBase } from "@/lib/linhaDeBase";
import { ROTAS } from "@/lib/rotas";
import { CabecalhoPagina, Nota, Numero, Selo } from "./ui";

const DICIONARIO_ONS =
  "https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/restricao_coff_eolica_tm/DicionarioDados_RestricaoContrainedoff_UsiEolicas.pdf";

export type DadosPlacar = {
  teste: Atlas["teste"];
  manchete: Atlas["manchete"];
  impressoes: string[];
  ao_vivo: Atlas["ao_vivo"];
  razoes: Atlas["razoes"];
  dados_ate: string;
  dias_ao_vivo: number;
  linha_de_base: ComparacaoLinhaDeBase | null;
  usinas: Pick<Usina, "id" | "nome" | "uf" | "tipo" | "teste" | "placar" | "placar_ao_vivo">[];
};

const ORDEM = ["taxa_media", "regra_fixa_8h_15h", "mesmo_mes_2025", "perfil_8_semanas", "combinado", "continuo_com_atraso"];
const cab = "px-3 py-3 font-medium";

/** Os três tipos de corte do ONS, quanto cada um pesa e quanto a previsão captura de cada um. */
function TiposDeCorte({ r }: { r: Atlas["razoes"] }) {
  const { t } = useIdioma();
  const L = t.locale;
  const ne = r.nordeste_2026;
  const tipos = ["ENE", "CNF", "REL"].filter((k) => ne.fracao[k]);
  const semRessarcimento = ne.fracao.ENE ?? 0;
  const ate = dataCurta(ne.periodo.slice(-10), L, true);
  const cap = (periodo: "teste_ago_set" | "ao_vivo", k: string) => (r.captura[periodo][k] ? pct(r.captura[periodo][k].capturado, L) : "—");
  return (
    <Cartao id="tipos" className="scroll-mt-24 overflow-x-auto">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{t.reasons.title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2">{t.reasons.lead(pct(ne.fracao.ENE ?? 0, L), ate)}</p>
      <div className="mt-5 max-w-3xl">
        <BarraRazoes fracao={ne.fracao} />
      </div>
      <div className="-mx-5 mt-6 overflow-x-auto border-y border-line sm:-mx-6">
        <table className="tabela-cartoes w-full text-sm">
          <thead className="bg-sunken/60 text-left text-xs text-muted">
            <tr>
              <th className={`${cab} pl-5 sm:pl-6`}>{t.reasons.type}</th>
              <th className={cab}>{t.reasons.code}</th>
              <th className={`${cab} text-right`}>{t.reasons.share}</th>
              <th className={`${cab} text-right`}>{t.reasons.capTest}</th>
              <th className={`${cab} text-right`}>{t.reasons.capLive}</th>
              <th className={`${cab} pr-5 text-right sm:pr-6`}>{t.reasons.ess}</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((k) => (
              <tr key={k} className="border-b border-line/70 last:border-0">
                <td className="py-3 pl-5 pr-3 font-medium sm:pl-6">{t.reasons.names[k]}</td>
                <td data-label={t.reasons.code} className="px-3 py-3 font-mono text-xs">
                  {k}
                </td>
                <td data-label={t.reasons.share} className="tabular px-3 py-3 text-right font-semibold">
                  {pct(ne.fracao[k], L)}
                </td>
                <td data-label={t.reasons.capTest} className="tabular px-3 py-3 text-right">
                  {cap("teste_ago_set", k)}
                </td>
                <td data-label={t.reasons.capLive} className="tabular px-3 py-3 text-right">
                  {cap("ao_vivo", k)}
                </td>
                <td data-label={t.reasons.ess} className={`px-3 py-3 text-right sm:pr-6 ${k !== "ENE" ? "font-semibold text-ok" : "text-muted"}`}>
                  {k !== "ENE" ? t.reasons.yes : t.reasons.no}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">
        {t.reasons.essNote(pct(semRessarcimento, L))}{" "}
        <a href={DICIONARIO_ONS} className="font-medium underline underline-offset-2 hover:text-ink">
          {t.reasons.dictionary} ↗
        </a>
      </p>
      <h3 className="mt-7 font-semibold text-ink">{t.reasons.byMonth}</h3>
      <div className="mt-3 max-w-3xl">
        <GraficoRazoesMes meses={r.nordeste_por_mes} />
      </div>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">{t.reasons.monthNote}</p>
    </Cartao>
  );
}

/** O modelo contra uma regra ingênua, nas mesmas janelas ao vivo. Mostra o resultado como ele é, inclusive se a regra ganhar. */
function LinhaDeBase({ c }: { c: ComparacaoLinhaDeBase }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [m, b] = [Math.round(c.erroModelo * 10) / 10, Math.round(c.erroBase * 10) / 10];
  const veredito = m < b ? t.track.baseWin(num(m, L, 1), num(b, L, 1)) : m > b ? t.track.baseLose(num(m, L, 1), num(b, L, 1)) : t.track.baseTie(num(m, L, 1));
  return (
    <div className="mt-5 max-w-3xl rounded-2xl bg-sunken p-4 ring-1 ring-inset ring-line sm:p-5">
      <h3 className="font-semibold text-ink">{t.track.baseTitle}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.track.baseLead(num(c.janelas, L), num(c.dias, L))}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {[
          [t.track.baseModel, m],
          [t.track.baseNaive, b],
        ].map(([rotulo, v]) => (
          <div key={rotulo as string} className="flex flex-col-reverse rounded-xl bg-card p-3 shadow-card">
            <dt className="mt-1 text-xs leading-tight text-muted">{rotulo}</dt>
            <dd className="tabular text-xl font-semibold text-ink">
              {num(v as number, L, 1)} <span className="text-sm font-medium text-muted">{t.track.basePp}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-semibold text-ink">{veredito}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{t.track.baseAlso(num(c.baseTambemOferecia, L), num(c.janelas, L))}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{t.track.basePerPlant(num(c.usinasModeloMaisPerto, L), num(c.usinas, L), num(c.usinas - c.usinasModeloMaisPerto, L))}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{t.track.baseCaveat(num(c.dias, L))}</p>
    </div>
  );
}

export function Placar({ d }: { d: DadosPlacar }) {
  const { t } = useIdioma();
  const L = t.locale;
  // uma casa decimal: evita que 89,5% vire "90%" aqui e "89%" em outro lugar
  const tripla = (m: { precisao: number; cobertura: number; energia_capturada: number }) =>
    `${pct(m.precisao, L, 1)} · ${pct(m.cobertura, L, 1)} · ${pct(m.energia_capturada, L, 1)}`;
  const ancoras = [
    ["#ao-vivo", t.track.liveTitle],
    ["#tipos", t.reasons.title],
    ["#modelos", t.track.tableTitle],
    ["#calibracao", t.track.calibTitle],
    ["#reproduzir", t.track.reproTitle],
  ];

  return (
    <div className="space-y-10">
      <CabecalhoPagina eyebrow={t.nav.track} titulo={t.track.title} lead={t.track.lead(num(d.manchete.usinas_avaliadas, L))}>
        <Evidencia nivel="oficial" />
      </CabecalhoPagina>

      {/* O placar em três números */}
      <section aria-label={t.track.title} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <Numero
            valor={`${pct(d.manchete.energia_capturada_ago, L)} / ${pct(d.manchete.energia_capturada_set, L)}`}
            rotulo={t.home.statCapture}
            nota={t.home.trackCtaLead(num(d.teste.placar.confirmadas, L), num(d.teste.placar.total, L))}
            destaque
          />
          <Numero
            valor={pct(d.ao_vivo.fracao_confirmadas ?? 0, L)}
            rotulo={t.track.liveScore(num(d.ao_vivo.confirmadas, L), num(d.ao_vivo.total, L), pct(d.ao_vivo.fracao_confirmadas ?? 0, L))}
            nota={t.track.liveSample(num(d.dias_ao_vivo, L), num(d.ao_vivo.total, L))}
          />
          {d.linha_de_base && (
            <Numero
              valor={
                Math.round(d.linha_de_base.erroModelo * 10) < Math.round(d.linha_de_base.erroBase * 10)
                  ? t.track.verdictWin
                  : Math.round(d.linha_de_base.erroModelo * 10) > Math.round(d.linha_de_base.erroBase * 10)
                    ? t.track.verdictLose
                    : t.track.verdictTie
              }
              rotulo={t.track.baseTitle}
              nota={t.track.baseNote(num(Math.round(d.linha_de_base.erroModelo * 10) / 10, L, 1), num(Math.round(d.linha_de_base.erroBase * 10) / 10, L, 1))}
            />
          )}
        </div>
        <nav aria-label="Atalhos" className="nao-imprimir flex flex-wrap gap-1.5 pt-1">
          {ancoras.map(([href, rotulo]) => (
            <a key={href} href={href} className="rounded-full border border-line-strong bg-card px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition hover:border-ink-2 hover:text-ink">
              {rotulo}
            </a>
          ))}
        </nav>
      </section>

      {/* Ao vivo: o mesmo modelo, depois do teste congelado; erros incluídos */}
      <Cartao id="ao-vivo" className="scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t.track.liveTitle}</h2>
          <Selo tom="ok" icone="check">
            {t.common.live}
          </Selo>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2">{t.track.liveLead(dataCurta(d.dados_ate, L, true))}</p>
        <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink">
          {t.track.liveScore(num(d.ao_vivo.confirmadas, L), num(d.ao_vivo.total, L), pct(d.ao_vivo.fracao_confirmadas ?? 0, L))}
        </p>
        <p className="mt-1 text-sm font-medium text-warn">{t.track.liveSample(num(d.dias_ao_vivo, L), num(d.ao_vivo.total, L))}</p>
        <p className="mt-1 text-sm text-ink-2">
          {d.ao_vivo.publicadas_antes.total
            ? t.track.liveBefore(num(d.ao_vivo.publicadas_antes.confirmadas, L), num(d.ao_vivo.publicadas_antes.total, L))
            : t.track.liveBeforeNone}
        </p>
        <Nota tom="aviso" titulo={t.track.liveWhyTitle} className="mt-5 max-w-3xl">
          {t.track.liveWhy}
        </Nota>
        {d.linha_de_base && <LinhaDeBase c={d.linha_de_base} />}
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">{t.track.liveNote}</p>
      </Cartao>

      <TiposDeCorte r={d.razoes} />

      <Cartao id="modelos" semPreenchimento className="scroll-mt-24 overflow-x-auto">
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t.track.tableTitle}</h2>
          <p className="mt-1 text-sm text-muted">
            {t.plant.precision} · {t.plant.coverage} · {t.plant.energyCaptured}
          </p>
        </div>
        <table className="tabela-cartoes mt-4 w-full text-sm">
          <thead className="border-y border-line bg-sunken/60 text-left text-xs text-muted">
            <tr>
              <th className={`${cab} pl-5 sm:pl-6`}>{t.track.model}</th>
              <th className={cab}>{t.plant.months[7]} 2026</th>
              <th className={cab}>{t.plant.months[8]} 2026</th>
              <th className={`${cab} pr-5 text-right sm:pr-6`}>{t.track.skill}</th>
            </tr>
          </thead>
          <tbody>
            {ORDEM.map((m) => {
              const prod = m === "continuo_com_atraso";
              const a = d.teste.agosto[m],
                s = d.teste.setembro[m];
              return (
                <tr key={m} className={`border-b border-line/70 last:border-0 ${prod ? "bg-brand-50/60 font-semibold" : ""}`}>
                  <td className="py-3 pl-5 pr-3 sm:pl-6">{t.track.models[m]}</td>
                  <td data-label={`${t.plant.months[7]} 2026`} className="tabular whitespace-nowrap px-3 py-3">
                    {tripla(a)}
                  </td>
                  <td data-label={`${t.plant.months[8]} 2026`} className="tabular whitespace-nowrap px-3 py-3">
                    {tripla(s)}
                  </td>
                  <td data-label={t.track.skill} className="tabular whitespace-nowrap px-3 py-3 text-right sm:pr-6">
                    {m === "taxa_media" ? "—" : `${pct(a.ganho_sobre_taxa_media, L)} / ${pct(s.ganho_sobre_taxa_media, L)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <dl className="grid gap-x-6 gap-y-1.5 border-t border-line px-5 py-4 text-xs leading-relaxed text-muted sm:grid-cols-2 sm:px-6">
          {t.track.defs.map(([termo, def]) => (
            <div key={termo}>
              <dt className="inline font-semibold text-ink">{termo}:</dt> <dd className="inline">{def}</dd>
            </div>
          ))}
        </dl>
      </Cartao>

      <Nota tom="aviso" titulo={t.track.honestTitle}>
        {t.track.honest}
      </Nota>

      <div id="calibracao" className="grid scroll-mt-24 gap-4 lg:grid-cols-2">
        <Cartao>
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t.track.calibTitle}</h2>
          <div className="mt-4 flex justify-center">
            <GraficoCalibracao faixas={d.teste.calibracao_agosto} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{t.track.calibNote}</p>
        </Cartao>
        <Cartao>
          <h2 className="text-xl font-semibold tracking-tight text-ink">{t.track.byType}</h2>
          <dl className="mt-4 space-y-3">
            {Object.entries(d.teste.por_tipo_agosto).map(([tipo, m]) => (
              <div key={tipo} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <dt>
                  <SeloTipo tipo={tipo as "eolica" | "solar"} />
                </dt>
                <dd className="tabular text-sm text-ink-2">{tripla(m)}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-6 text-sm font-semibold text-ink">{t.home.featured}</h3>
          <table className="mt-2 w-full text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th />
                <th className="py-1 text-right font-medium">{t.track.backtestCol}</th>
                <th className="py-1 pl-4 text-right font-medium">{t.track.liveCol}</th>
              </tr>
            </thead>
            <tbody>
              {d.usinas.map((u) => (
                <tr key={u.id} className="border-t border-line/70">
                  <td className="py-2">
                    <Link href={ROTAS.usina(u.id)} className="font-medium text-ink hover:text-brand-700 hover:underline">
                      {u.nome.replace(/^Conj\. /, "")}
                    </Link>{" "}
                    <span className="text-xs text-muted">{u.uf}</span>
                  </td>
                  <td className="tabular py-2 text-right text-ink-2">
                    {num(u.placar.confirmadas, L)}/{num(u.placar.janelas, L)}
                  </td>
                  <td className="tabular py-2 pl-4 text-right text-ink-2">{u.placar_ao_vivo.janelas ? `${num(u.placar_ao_vivo.confirmadas, L)}/${num(u.placar_ao_vivo.janelas, L)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Cartao>
      </div>

      <Cartao id="reproduzir" className="scroll-mt-24">
        <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
          <Icone nome="escudo" className="size-5 text-brand-700" />
          {t.track.reproTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2">{t.track.reproLead}</p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-brand-950 p-4 font-mono text-[11px] leading-relaxed text-brand-100/90">{d.impressoes.join("\n")}</pre>
        <p className="mt-4 max-w-3xl text-sm italic leading-relaxed text-ink-2">{t.track.reproQuote}</p>
        <h3 className="mt-6 text-sm font-semibold text-ink">{t.track.params}</h3>
        <pre className="mt-2 overflow-x-auto rounded-xl bg-sunken p-3 font-mono text-xs text-ink-2">{JSON.stringify(d.teste.parametros, null, 1)}</pre>
      </Cartao>
    </div>
  );
}
