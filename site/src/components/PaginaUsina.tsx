"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import type { Cambio, Usina } from "@/lib/tipos";
import type { PldRef } from "@/lib/calculadora";
import { useCenario } from "@/lib/cenario";
import { MOSTRAR } from "@/lib/recursos";
import { ROTAS } from "@/lib/rotas";
import { dataCurta, energia, num, pct, reais } from "@/lib/formato";
import { BotaoComprar } from "./BotaoComprar";
import { CalculadoraCarga } from "./CalculadoraCarga";
import { BarraRazoes, MapaCalor } from "./Graficos";
import { Icone } from "./Icones";
import { MapaCarregado } from "./MapaCarregado";
import { BarraChance, Cartao, Numero, SeloResultado, SeloTipo } from "./Selos";
import { Termo } from "./Termo";

const INICIO_AO_VIVO = "2026-10-01"; // depois do teste de agosto e setembro

export function PaginaUsina({ u, cambio, dadosAte, pld }: { u: Usina; cambio: Cambio | null; dadosAte: string; pld: PldRef }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [cen] = useCenario();
  const nome = u.nome.replace(/^Conj\. /, "");
  const ponto = {
    id: u.id,
    nome: u.nome,
    tipo: u.tipo,
    lat: u.local.lat,
    lon: u.local.lon,
    capacidade_mw: u.capacidade_mw,
    chance: null,
    rotulo: `${u.local.municipio}, ${u.uf}`,
  };
  const cab = "px-3 py-3 font-medium";

  return (
    <div className="space-y-8">
      <Link href={ROTAS.plataforma} className="nao-imprimir inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-ink-2 hover:text-ink">
        <Icone nome="setaEsquerda" className="size-4" />
        {t.nav.atlas}
      </Link>

      <header className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <SeloTipo tipo={u.tipo} />
            <span className="font-mono text-xs text-muted">{u.id}</span>
          </div>
          <h1 className="mt-3 font-display text-[2.25rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">{nome}</h1>
          <p className="mt-2 text-ink-2">
            {u.local.municipio}, {u.uf} · <span className="text-muted">{t.common.approxLocation}</span>
          </p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
            <dt className="text-muted">{t.common.operator}</dt>
            <dd className="font-medium text-ink">{u.agente}</dd>
            <dt className="text-muted">
              {t.common.capacity} <Termo k="mw" soIcone />
            </dt>
            <dd className="tabular font-medium text-ink">{num(u.capacidade_mw, L)} MW</dd>
            <dt className="text-muted">{t.plant.connection}</dt>
            <dd className="font-medium text-ink">{u.ponto_conexao}</dd>
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Numero valor={`${num(u.perdeu_jan_jul_2026_gwh, L)} GWh`} rotulo={t.plant.lostJanJul} destaque />
            <Numero valor={pct(u.fracao_meias_horas_com_corte, L)} rotulo={t.plant.cutShare} />
          </div>
        </div>
        <div className="nao-imprimir h-52 sm:h-72 lg:col-span-2 lg:h-auto lg:min-h-[22rem]">
          <MapaCarregado pontos={[ponto]} selecionado={u.id} legenda={false} />
        </div>
      </header>

      {/* A calculadora é o coração da ferramenta de decisão: fica logo abaixo do cabeçalho da usina */}
      <CalculadoraCarga u={u} pld={pld} />

      <Cartao semPreenchimento className="overflow-x-auto">
        <h2 className="px-5 pt-5 text-lg font-semibold text-ink">{t.plant.nextTitle}</h2>
        <table className="tabela-cartoes mt-3 w-full text-sm">
          <thead className="border-y border-line bg-sunken/60 text-left text-xs text-muted">
            <tr>
              <th className={`${cab} pl-5`}>{t.common.data}</th>
              <th className={cab}>
                {t.common.window} <Termo k="window" soIcone />
              </th>
              <th className={cab}>
                {t.common.chance} <Termo k="chance" soIcone />
              </th>
              <th className={`${cab} text-right`}>{t.common.expected}</th>
              <th className={`${cab} text-right`}>{t.common.value}</th>
              <th className={`${cab} text-right`}>ONS</th>
              {MOSTRAR.reservaNoAtlas && <th className="px-5 py-2" />}
            </tr>
          </thead>
          <tbody>
            {u.proximas.map((j) => (
              <tr key={`${j.data}-${j.inicio}`} className="border-b border-line/70 last:border-0">
                <td className="whitespace-nowrap py-3 pl-5 pr-3 font-medium">{dataCurta(j.data, L)}</td>
                <td data-label={t.common.window} className="tabular whitespace-nowrap px-3 py-3">
                  {j.inicio}–{j.fim}
                </td>
                <td data-label={t.common.chance} className="px-3 py-3">
                  <BarraChance valor={j.chance_prevista} />
                </td>
                <td data-label={t.common.expected} className="tabular whitespace-nowrap px-3 py-3 text-right">
                  ~{energia(j.energia_esperada_mwh, L)}
                </td>
                <td data-label={t.common.value} className="tabular whitespace-nowrap px-3 py-3 text-right">
                  {reais(j.valor_referencia_rs ?? 0, L, true)}
                  {j.pld_estimado && (
                    <span title={t.common.pldEstTitle} className="ml-1 cursor-help text-[10px] text-muted underline decoration-dotted">
                      {t.common.pldEst}
                    </span>
                  )}
                </td>
                <td data-label="ONS" className="px-3 py-3 text-right">
                  <SeloResultado resultado={j.resultado_ons} />
                </td>
                {MOSTRAR.reservaNoAtlas && (
                  <td className="px-5 py-2 text-right">
                    <BotaoComprar idUsina={u.id} nomeUsina={u.nome} janela={j} cambio={cambio} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Cartao>

      <div className="grid gap-4 lg:grid-cols-2">
        <Cartao>
          <h2 className="text-lg font-semibold text-ink">{t.reasons.plantTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">
            {t.reasons.plantLead(`${num(u.razoes_2026.gwh, L)} GWh`, pct(u.razoes_2026.fracao.ENE ?? 0, L), pct(u.razoes_2026.fracao.REL ?? 0, L))}
          </p>
          <div className="mt-5">
            <BarraRazoes fracao={u.razoes_2026.fracao} />
          </div>
        </Cartao>
        <Cartao>
          <h2 className="text-lg font-semibold text-ink">{t.plant.backtestTitle}</h2>
          <p className="mt-1 text-sm text-ink-2">{t.plant.scoreboard(num(u.placar.confirmadas, L), num(u.placar.janelas, L))}</p>
          {u.placar_ao_vivo.janelas > 0 && (
            <p className="mt-0.5 text-sm font-medium text-ok">{t.plant.scoreboardLive(num(u.placar_ao_vivo.confirmadas, L), num(u.placar_ao_vivo.janelas, L))}</p>
          )}
          {(["agosto", "setembro"] as const).map((mes) => (
            <div key={mes} className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{mes === "agosto" ? t.plant.months[7] : t.plant.months[8]} 2026</div>
              <dl className="mt-1.5 grid grid-cols-3 gap-2 text-center">
                {[
                  [t.plant.precision, u.teste[mes].precisao],
                  [t.plant.coverage, u.teste[mes].cobertura],
                  [t.plant.energyCaptured, u.teste[mes].energia_capturada],
                ].map(([rotulo, v]) => (
                  <div key={rotulo as string} className="flex flex-col-reverse rounded-xl bg-sunken p-2.5">
                    <dt className="mt-0.5 text-[11px] leading-tight text-muted">{rotulo}</dt>
                    <dd className="tabular text-lg font-semibold text-ink">{pct(v as number, L)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </Cartao>
      </div>

      <Cartao>
        <h2 className="text-lg font-semibold text-ink">{t.plant.heatTitle}</h2>
        <p className="mt-1 text-sm text-ink-2">
          {t.plant.heatNote(dataCurta(dadosAte, L, true))} {t.plant.scheduleHint}
        </p>
        <div className="mt-4">
          <MapaCalor calor={u.calor} janela={{ inicio: cen.inicio, horas: cen.horas }} />
        </div>
      </Cartao>

      <Cartao semPreenchimento className="overflow-x-auto">
        <div className="px-5 pt-5">
          <h2 className="text-lg font-semibold text-ink">{t.plant.recentTitle}</h2>
          <p className="mt-1 text-sm text-ink-2">{t.plant.recentNote}</p>
        </div>
        <table className="tabela-cartoes mt-3 w-full text-sm">
          <thead className="border-y border-line bg-sunken/60 text-left text-xs text-muted">
            <tr>
              <th className={`${cab} pl-5`}>{t.common.data}</th>
              <th className={cab}>{t.common.window}</th>
              <th className={cab}>{t.common.chance}</th>
              <th className={`${cab} text-right`}>{t.plant.lost}</th>
              <th className={cab}>{t.plant.reasons}</th>
              <th className={`${cab} text-right`}>ONS</th>
              {MOSTRAR.reservaNoAtlas && <th className="px-5 py-2" />}
            </tr>
          </thead>
          <tbody>
            {[...u.recentes].reverse().map((j) => (
              <tr key={`${j.data}-${j.inicio}`} className="border-b border-line/70 last:border-0">
                <td className="whitespace-nowrap py-3 pl-5 pr-3 font-medium">
                  {dataCurta(j.data, L)}
                  {j.data >= INICIO_AO_VIVO && <span className="ml-1.5 text-[10px] font-semibold uppercase text-ok">{t.common.live}</span>}
                </td>
                <td data-label={t.common.window} className="tabular whitespace-nowrap px-3 py-3">
                  {j.inicio}–{j.fim}
                </td>
                <td data-label={t.common.chance} className="tabular px-3 py-3">
                  {pct(j.chance_prevista, L)}
                </td>
                <td data-label={t.plant.lost} className="tabular whitespace-nowrap px-3 py-3 text-right">
                  {energia(j.energia_cortada_mwh ?? 0, L)}
                </td>
                <td data-label={t.plant.reasons} className="px-3 py-3 text-xs text-muted">
                  {Object.keys(j.razoes_do_corte).join(", ") || "—"}
                </td>
                <td data-label="ONS" className="px-3 py-3 text-right">
                  <SeloResultado resultado={j.resultado_ons} />
                </td>
                {MOSTRAR.reservaNoAtlas && (
                  <td className="px-5 py-2 text-right">
                    <BotaoComprar idUsina={u.id} nomeUsina={u.nome} janela={j} cambio={cambio} replay />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-xs text-muted">{t.reasons.legend}</p>
      </Cartao>
    </div>
  );
}
