"use client";

// "Por que acontece": o tamanho do corte no Nordeste e os padrões que o explicam (hora do dia, dia da semana, motivo, preço e mês).
import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { dataCurta, num, pct, reais, somaEntreHoras } from "@/lib/formato";
import { ROTAS } from "@/lib/rotas";
import type { Atlas } from "@/lib/tipos";
import { BarraRazoes, GraficoHoras, GraficoMensal, GraficoPiso } from "./Graficos";
import { Icone } from "./Icones";
import { Cartao, Numero, TituloSecao } from "./ui";

export type DadosEntender = Pick<Atlas, "manchete" | "pld" | "padroes"> & { razoes_nordeste: Record<string, number> };

export function PorQueAcontece({ d }: { d: DadosEntender }) {
  const { t } = useIdioma();
  const L = t.locale;
  const piso = `R$ ${num(d.pld.piso_2026_rs_mwh, L, 2)}`;
  const parteEolica = somaEntreHoras(d.padroes.perda_por_hora_pct.eolica, 8, 15) / 100;

  return (
    <section className="space-y-6" aria-labelledby="entender-titulo">
      <TituloSecao titulo={<span id="entender-titulo">{t.panel.contextTitle}</span>} lead={t.panel.contextLead} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Numero valor={`${num(d.manchete.nordeste_mw_medios, L)} MW`} rotulo={t.home.statCut} destaque />
        <Numero valor={`${num(d.manchete.nordeste_gwh_dia, L)} GWh`} rotulo={t.home.statDay} />
        {d.manchete.valor_pld_real_rs ? (
          <Numero valor={reais(d.manchete.valor_pld_real_rs, L, true)} rotulo={t.home.statValueReal(dataCurta((d.manchete.valor_pld_real_periodo ?? "").slice(-10), L, true))} />
        ) : (
          <Numero valor={reais(d.manchete.valor_anual_piso_rs, L, true)} rotulo={t.home.statValue} />
        )}
        <Numero valor={`${pct(d.manchete.energia_capturada_ago, L)} / ${pct(d.manchete.energia_capturada_set, L)}`} rotulo={t.home.statCapture} />
      </div>

      <TituloSecao titulo={t.home.whyTitle} className="pt-4" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Cartao className="lg:col-span-2">
          <h3 className="font-semibold text-ink">{t.home.hourTitle}</h3>
          <div className="mt-3">
            <GraficoHoras eolica={d.padroes.perda_por_hora_pct.eolica} solar={d.padroes.perda_por_hora_pct.solar} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{t.landing.problem.chartNote(pct(parteEolica, L))}</p>
        </Cartao>
        <Cartao>
          <h3 className="font-semibold text-ink">{t.home.weekTitle}</h3>
          <dl className="mt-5 space-y-5">
            <div>
              <dt className="text-sm text-muted">{t.home.weekday}</dt>
              <dd className="mt-1 text-4xl font-semibold leading-none tracking-tight text-ink">{pct(d.padroes.chance_dia_util, L)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t.home.weekend}</dt>
              <dd className="mt-1 text-4xl font-semibold leading-none tracking-tight text-brand-700">{pct(d.padroes.chance_fim_de_semana, L)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-ink-2">{t.home.weekNote}</p>
        </Cartao>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Cartao>
          <h3 className="font-semibold text-ink">{t.reasons.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.reasons.homeLead(pct(d.razoes_nordeste.ENE ?? 0, L))}</p>
          <div className="mt-5">
            <BarraRazoes fracao={d.razoes_nordeste} />
          </div>
          <Link href={ROTAS.placar} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
            {t.reasons.homeLink}
            <Icone nome="seta" className="size-4" />
          </Link>
        </Cartao>
        {d.pld.cruzamento && (
          <Cartao>
            <h3 className="font-semibold text-ink">{t.home.floorTitle}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.home.floorChart(dataCurta(d.pld.cruzamento.periodo.slice(-10), L, true))}</p>
            <div className="mt-3">
              <GraficoPiso pct={d.pld.cruzamento.piso_por_hora_pct} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              {t.home.floorNote(
                pct(Math.min(...d.pld.cruzamento.piso_por_hora_pct.slice(9, 13)) / 100, L),
                pct(d.pld.cruzamento.fracao_energia_com_pld_no_piso, L),
                piso,
              )}
            </p>
          </Cartao>
        )}
      </div>

      <Cartao>
        <h3 className="font-semibold text-ink">{t.home.monthTitle}</h3>
        <div className="mt-3">
          <GraficoMensal meses={d.padroes.nordeste_mensal_mw} />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{t.home.monthNote}</p>
      </Cartao>
    </section>
  );
}
