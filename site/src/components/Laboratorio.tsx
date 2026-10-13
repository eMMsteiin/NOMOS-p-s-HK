"use client";

// Laboratório: a ideia de reservar uma janela, simulada na devnet da Solana. Não é o produto e não vende eletricidade.
// Reaproveita o botão e a janela de reserva que antes ficavam nas tabelas do atlas.
import Link from "next/link";
import { useMemo, useState } from "react";
import { useIdioma } from "@/i18n/idioma";
import { dataCurta, energia, pct } from "@/lib/formato";
import { LINK_CICLO_0810 } from "@/lib/laboratorio";
import { ROTAS } from "@/lib/rotas";
import type { Cambio, Janela } from "@/lib/tipos";
import { BotaoComprar } from "./BotaoComprar";
import { Icone } from "./Icones";
import { Cartao, Evidencia, SeloResultado } from "./Selos";
import { CabecalhoPagina, Nota } from "./ui";

export type UsinaLab = { id: string; nome: string; uf: string; proximas: Janela[]; recentes: Janela[] };

type Opcao = { chave: string; janela: Janela; replay: boolean };

export function Laboratorio({ usinas, cambio }: { usinas: UsinaLab[]; cambio: Cambio | null }) {
  const { t } = useIdioma();
  const lab = t.lab;
  const L = t.locale;
  const [idUsina, setIdUsina] = useState(usinas[0]?.id ?? "");
  const [chave, setChave] = useState("");
  const usina = usinas.find((u) => u.id === idUsina) ?? usinas[0];

  // Primeiro as janelas futuras; depois as passadas (mais recentes antes), que rodam como replay
  const opcoes = useMemo<Opcao[]>(
    () => [
      ...(usina?.proximas ?? []).map((janela) => ({ chave: `p|${janela.data}|${janela.inicio}`, janela, replay: false })),
      ...[...(usina?.recentes ?? [])].reverse().map((janela) => ({ chave: `r|${janela.data}|${janela.inicio}`, janela, replay: true })),
    ],
    [usina],
  );
  const proximas = opcoes.filter((o) => !o.replay);
  const passadas = opcoes.filter((o) => o.replay);
  const escolhida = opcoes.find((o) => o.chave === chave) ?? opcoes[0];

  const resultado = (j: Janela) => (j.resultado_ons === "confirmado" ? t.common.confirmed : j.resultado_ons === "errado" ? t.common.wrong : t.common.noData);
  const rotulo = (o: Opcao) =>
    `${dataCurta(o.janela.data, L)} · ${o.janela.inicio}–${o.janela.fim} · ${o.replay ? resultado(o.janela) : pct(o.janela.chance_prevista, L)}`;

  const campo = "mt-2 min-h-11 w-full rounded-xl border border-line-strong bg-card px-3.5 text-sm font-medium text-ink shadow-card";

  return (
    <div className="space-y-6">
      <CabecalhoPagina eyebrow={t.nav.lab} titulo={lab.title}>
        <Evidencia nivel="simulacao" />
      </CabecalhoPagina>

      <div className="max-w-3xl rounded-2xl border-2 border-sim-mark/50 bg-sim-soft p-5" role="note">
        <p className="flex items-start gap-3 text-lg font-semibold leading-snug text-sim">
          <Icone nome="frasco" className="mt-0.5 size-6" />
          {lab.warning}
        </p>
      </div>
      <p className="max-w-3xl leading-relaxed text-ink-2">{lab.lead}</p>

      <Cartao>
        <h2 className="text-lg font-semibold text-ink">{lab.reserveTitle}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-2">{lab.reserveLead}</p>
        <div className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-ink">{lab.plant}</span>
            <select value={usina?.id ?? ""} onChange={(e) => setIdUsina(e.target.value)} className={campo}>
              {usinas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome.replace(/^Conj\. /, "")} · {u.uf}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">{lab.window}</span>
            <select value={escolhida?.chave ?? ""} onChange={(e) => setChave(e.target.value)} className={campo} disabled={!escolhida}>
              {proximas.length > 0 && (
                <optgroup label={lab.upcoming}>
                  {proximas.map((o) => (
                    <option key={o.chave} value={o.chave}>
                      {rotulo(o)}
                    </option>
                  ))}
                </optgroup>
              )}
              {passadas.length > 0 && (
                <optgroup label={lab.past}>
                  {passadas.map((o) => (
                    <option key={o.chave} value={o.chave}>
                      {rotulo(o)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>
        </div>

        {escolhida && usina ? (
          <div className="mt-5 flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-2xl bg-sunken p-4 ring-1 ring-inset ring-line">
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted">{t.common.window}</dt>
                <dd className="tabular font-semibold text-ink">
                  {escolhida.janela.inicio}–{escolhida.janela.fim}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t.common.chance}</dt>
                <dd className="tabular font-semibold text-ink">{pct(escolhida.janela.chance_prevista, L)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{escolhida.replay ? t.plant.lost : t.common.expected}</dt>
                <dd className="tabular font-semibold text-ink">
                  {escolhida.replay ? energia(escolhida.janela.energia_cortada_mwh ?? 0, L) : `~${energia(escolhida.janela.energia_esperada_mwh, L)}`}
                </dd>
              </div>
              {escolhida.replay && (
                <div>
                  <dt className="text-xs text-muted">ONS</dt>
                  <dd className="mt-0.5">
                    <SeloResultado resultado={escolhida.janela.resultado_ons} />
                  </dd>
                </div>
              )}
            </dl>
            <BotaoComprar idUsina={usina.id} nomeUsina={usina.nome} janela={escolhida.janela} cambio={cambio} replay={escolhida.replay} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">{lab.noWindows}</p>
        )}
      </Cartao>

      <div className="grid gap-4 md:grid-cols-2">
        <Cartao>
          <h2 className="text-lg font-semibold text-ink">{lab.cycleTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{lab.cycleLead}</p>
          <Link href={LINK_CICLO_0810} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
            {lab.cycleLink}
          </Link>
        </Cartao>
        <Cartao>
          <h2 className="text-lg font-semibold text-ink">{lab.verifyTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{lab.verifyLead}</p>
          <Link href={ROTAS.verificar} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
            {lab.verifyLink}
          </Link>
        </Cartao>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Nota tom="simulacao" titulo={lab.simTitle} className="p-5">
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-2">
            {lab.sim.map((i) => (
              <li key={i} className="flex gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sim-mark" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </Nota>
        <Cartao>
          <h2 className="text-lg font-semibold text-ink">{lab.stepsTitle}</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
            {lab.steps.map((i, n) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sim-soft text-xs font-semibold text-sim">{n + 1}</span>
                <span>{i}</span>
              </li>
            ))}
          </ol>
        </Cartao>
      </div>
    </div>
  );
}
