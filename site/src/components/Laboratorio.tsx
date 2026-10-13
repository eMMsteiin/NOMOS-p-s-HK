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
import { Cartao, SeloResultado } from "./Selos";

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

  const campo = "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm";

  return (
    <div className="space-y-6 pt-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{lab.title}</h1>
      </header>

      <div className="max-w-3xl rounded-xl border-2 border-wait bg-wait-soft p-4" role="note">
        <p className="text-lg font-semibold leading-snug text-wait">{lab.warning}</p>
      </div>
      <p className="max-w-3xl text-muted">{lab.lead}</p>

      <Cartao>
        <h2 className="text-lg font-semibold">{lab.reserveTitle}</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted">{lab.reserveLead}</p>
        <div className="mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">{lab.plant}</span>
            <select value={usina?.id ?? ""} onChange={(e) => setIdUsina(e.target.value)} className={campo}>
              {usinas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome.replace(/^Conj\. /, "")} · {u.uf}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">{lab.window}</span>
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
          <div className="mt-4 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-lg bg-paper p-3">
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div>
                <dt className="text-xs text-muted">{t.common.window}</dt>
                <dd className="tabular font-medium">
                  {escolhida.janela.inicio}–{escolhida.janela.fim}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t.common.chance}</dt>
                <dd className="tabular font-medium">{pct(escolhida.janela.chance_prevista, L)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{escolhida.replay ? t.plant.lost : t.common.expected}</dt>
                <dd className="tabular font-medium">
                  {escolhida.replay ? energia(escolhida.janela.energia_cortada_mwh ?? 0, L) : `~${energia(escolhida.janela.energia_esperada_mwh, L)}`}
                </dd>
              </div>
              {escolhida.replay && (
                <div>
                  <dt className="text-xs text-muted">ONS</dt>
                  <dd>
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
          <h2 className="text-lg font-semibold">{lab.cycleTitle}</h2>
          <p className="mt-1 text-sm text-muted">{lab.cycleLead}</p>
          <Link href={LINK_CICLO_0810} className="mt-3 inline-block text-sm font-medium underline">
            {lab.cycleLink}
          </Link>
        </Cartao>
        <Cartao>
          <h2 className="text-lg font-semibold">{lab.verifyTitle}</h2>
          <p className="mt-1 text-sm text-muted">{lab.verifyLead}</p>
          <Link href={ROTAS.verificar} className="mt-3 inline-block text-sm font-medium underline">
            {lab.verifyLink}
          </Link>
        </Cartao>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Cartao className="border-t-4 border-wait">
          <h2 className="text-lg font-semibold">{lab.simTitle}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {lab.sim.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </Cartao>
        <Cartao>
          <h2 className="text-lg font-semibold">{lab.stepsTitle}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            {lab.steps.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ol>
        </Cartao>
      </div>
    </div>
  );
}
