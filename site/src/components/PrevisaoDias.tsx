"use client";

// Janelas de corte previstas para os próximos dias, por usina de destaque, com o dia escolhido em abas.
import Link from "next/link";
import { useState } from "react";
import { useIdioma } from "@/i18n/idioma";
import { dataCurta, energia, num, reais } from "@/lib/formato";
import { MOSTRAR } from "@/lib/recursos";
import { ROTAS } from "@/lib/rotas";
import type { Atlas, Cambio, Janela, Usina } from "@/lib/tipos";
import { BotaoComprar } from "./BotaoComprar";
import { BarraChance, Cartao, SeloTipo } from "./Selos";
import { SeloPrevisao } from "./SeloPrevisao";
import { Nota, TituloSecao } from "./ui";

type UsinaPrevisao = Pick<Usina, "id" | "nome" | "uf" | "tipo" | "local" | "proximas">;

export function PrevisaoDias({
  previsao,
  usinas,
  dadosAte,
  pldPiso,
  comPldReal,
  cambio,
}: {
  previsao: Atlas["previsao"];
  usinas: UsinaPrevisao[];
  dadosAte: string;
  pldPiso: number;
  comPldReal: boolean;
  cambio: Cambio | null;
}) {
  const { t } = useIdioma();
  const L = t.locale;
  // o primeiro dia previsto é o dia seguinte ao último dado do ONS, ou seja, normalmente hoje
  const [dia, setDia] = useState(previsao.dias[0]);
  const doDia = previsao.por_dia[dia];
  const piso = `R$ ${num(pldPiso, L, 2)}`;
  const compacto = (x: number) => new Intl.NumberFormat(L, { notation: "compact", maximumFractionDigits: 1 }).format(x);

  const linhas = usinas.flatMap((u): { u: UsinaPrevisao; j: Janela | null }[] => {
    const js = u.proximas.filter((j) => j.data === dia);
    return js.length ? js.map((j) => ({ u, j })) : [{ u, j: null }];
  });
  const cab = "px-3 py-3 font-medium";

  return (
    <section className="space-y-5" aria-labelledby="previsao-titulo">
      <div>
        <TituloSecao titulo={<span id="previsao-titulo">{t.home.forecastTitle}</span>} lead={t.home.forecastLead(dataCurta(dadosAte, L, true))} />
        <SeloPrevisao />
      </div>

      <div className="sem-barra -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label={t.home.day}>
        <div className="flex gap-1.5 pb-1">
          {previsao.dias.map((x) => (
            <button
              key={x}
              type="button"
              role="tab"
              aria-selected={x === dia}
              onClick={() => setDia(x)}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition ${
                x === dia ? "border-brand-700 bg-brand-700 text-white" : "border-line-strong bg-card text-ink-2 hover:border-ink-2 hover:text-ink"
              }`}
            >
              {dataCurta(x, L)}
            </button>
          ))}
        </div>
      </div>

      <Cartao semPreenchimento className="overflow-x-auto">
        <table className="tabela-cartoes w-full text-sm">
          <thead className="border-b border-line bg-sunken/60 text-left text-xs text-muted">
            <tr>
              <th className={`${cab} pl-5`}>{t.home.featured}</th>
              <th className={cab}>{t.common.window}</th>
              <th className={cab}>{t.common.chance}</th>
              <th className={`${cab} text-right`}>{t.common.expected}</th>
              <th className={`${cab} pr-5 text-right`}>{t.common.value}</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ u, j }, i) => (
              <tr key={`${u.id}-${i}`} className="border-b border-line/70 last:border-0">
                <td className="py-3 pl-5 pr-3">
                  <Link href={ROTAS.usina(u.id)} className="font-semibold text-ink hover:text-brand-700 hover:underline">
                    {u.nome.replace(/^Conj\. /, "")}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-normal text-muted">
                    <SeloTipo tipo={u.tipo} />
                    <span className="whitespace-nowrap">
                      {u.local.municipio}, {u.uf}
                    </span>
                  </div>
                </td>
                {j ? (
                  <>
                    <td data-label={t.common.window} className="tabular whitespace-nowrap px-3 py-3 font-medium">
                      {j.inicio}–{j.fim}
                    </td>
                    <td data-label={t.common.chance} className="px-3 py-3">
                      <BarraChance valor={j.chance_prevista} />
                    </td>
                    <td data-label={t.common.expected} className="tabular whitespace-nowrap px-3 py-3 text-right">
                      ~{energia(j.energia_esperada_mwh, L)}
                      {MOSTRAR.horasDeGpu && (
                        <div className="text-xs text-muted">
                          {compacto(j.gpu_horas_esperadas)} {t.common.gpuHours}
                        </div>
                      )}
                    </td>
                    <td data-label={t.common.value} className="tabular whitespace-nowrap px-3 py-3 text-right md:pr-5">
                      {reais(j.valor_referencia_rs ?? 0, L, true)}
                      {j.pld_estimado && (
                        <span title={t.common.pldEstTitle} className="ml-1 cursor-help text-[10px] text-muted underline decoration-dotted">
                          {t.common.pldEst}
                        </span>
                      )}
                      {MOSTRAR.reservaNoAtlas && (
                        <div className="mt-1">
                          <BotaoComprar idUsina={u.id} nomeUsina={u.nome} janela={j} cambio={cambio} />
                        </div>
                      )}
                    </td>
                  </>
                ) : (
                  <td colSpan={4} className="px-3 py-3 text-muted">
                    {t.home.noWindow}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Cartao>

      {doDia && <p className="text-sm text-ink-2">{t.home.allPlantsLine(num(doDia.janelas, L), num(doDia.usinas, L), energia(doDia.energia_esperada_mwh, L))}</p>}
      <p className="text-xs leading-relaxed text-muted">{comPldReal ? t.home.valueNoteReal(piso) : t.home.valueNote(piso)}</p>
      {MOSTRAR.visaoFuturaNoInicio && (
        <Nota tom="simulacao" titulo={t.home.visionTitle} className="max-w-3xl">
          {t.home.visionNote}
        </Nota>
      )}
    </section>
  );
}
