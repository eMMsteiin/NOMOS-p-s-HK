"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useIdioma } from "@/i18n/idioma";
import { calcular, melhorInicio, perfilHorario, type PldRef } from "@/lib/calculadora";
import { linkDoCenario, useCenario } from "@/lib/cenario";
import { faixaDeHorario, num, pct, reais } from "@/lib/formato";
import { ROTAS } from "@/lib/rotas";
import type { Usina } from "@/lib/tipos";
import { CamposCenario } from "./CamposCenario";
import { PerfilHorario } from "./Graficos";
import { Icone, type NomeIcone } from "./Icones";
import { Evidencia } from "./Selos";
import { Termo } from "./Termo";
import { Botao, Cartao, Nota } from "./ui";

const hora = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** Plano B para navegadores que bloqueiam a área de transferência moderna: copia pelo método antigo. */
function copiarPeloMetodoAntigo(texto: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Copia texto para a área de transferência. Se o navegador não deixar (ou demorar), tenta o método antigo. */
async function copiar(texto: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    const novo = await Promise.race([
      navigator.clipboard.writeText(texto).then(() => true, () => false),
      new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 1500)),
    ]);
    if (novo) return true;
  }
  return copiarPeloMetodoAntigo(texto);
}

/** Quanto do corte passado uma carga ao lado da usina teria encontrado. Cálculo no navegador, com os dados já carregados. */
export function CalculadoraCarga({ u, pld }: { u: Usina; pld: PldRef }) {
  const { t } = useIdioma();
  const c = t.calc;
  const L = t.locale;
  const [cen, definir] = useCenario();
  const [aviso, setAviso] = useState<string | null>(null);
  // Se a cópia automática falhar, o texto aparece numa caixa para a pessoa copiar à mão
  const [manual, setManual] = useState<string | null>(null);

  const r = useMemo(() => calcular(u, pld, { mw: cen.mw, horasPorDia: cen.horas, inicio: cen.inicio }), [u, pld, cen.mw, cen.horas, cen.inicio]);
  const melhor = useMemo(() => melhorInicio(u, cen.horas), [u, cen.horas]);
  const perfil = useMemo(() => perfilHorario(u), [u]);
  const sugerir = melhor.inicio !== cen.inicio && melhor.horasCorteMes > r.horasCorteMes * 1.03;

  const nome = u.nome.replace(/^Conj\. /, "");
  const mwTxt = num(cen.mw, L, cen.mw % 1 ? 1 : 0);
  const faixa = faixaDeHorario(cen.inicio, cen.horas);
  const valorTxt = reais(r.reaisMedio, L, true);
  const pldTxt = `R$ ${num(pld.medio, L, 2)}`;

  const dizer = (msg: string) => {
    setAviso(msg);
    window.setTimeout(() => setAviso(null), 2600);
  };
  const resumo = () =>
    c.clipboard(nome, u.uf, mwTxt, String(cen.horas), faixa, num(r.horasCorteMes, L), num(r.mwhMes, L), valorTxt, pldTxt, `${linkDoCenario(cen, ROTAS.usina(u.id))}#calculadora`);
  const copiarTexto = async (texto: string) => {
    const ok = await copiar(texto);
    setManual(ok ? null : texto);
    dizer(ok ? c.actions.copied : c.actions.failed);
  };
  const copiarResumo = () => copiarTexto(resumo());
  const copiarLink = () => copiarTexto(`${linkDoCenario(cen, ROTAS.usina(u.id))}#calculadora`);

  const linhasRazao = [
    { chave: "ene", rotulo: c.reasonEne, dado: r.razoes.ene, termo: "ene" as const },
    { chave: "eletrico", rotulo: c.reasonElec, dado: r.razoes.eletrico, termo: null },
    ...(r.razoes.outras.fracao >= 0.005 ? [{ chave: "outras", rotulo: c.reasonOther, dado: r.razoes.outras, termo: null }] : []),
  ];
  const acao = "min-h-10";
  const numeros: { icone: NomeIcone; titulo: React.ReactNode; valor: string; detalhe: React.ReactNode }[] = [
    {
      icone: "relogio",
      titulo: c.hoursTitle,
      valor: `${num(r.horasCorteMes, L)} h`,
      detalhe: c.hoursNote(num(r.horasOperacaoMes, L), pct(r.fracaoCorte, L)),
    },
    {
      icone: "raio",
      titulo: (
        <>
          {c.energyTitle} <Termo k="mwh" soIcone />
        </>
      ),
      valor: `${num(r.mwhMes, L)} MWh`,
      detalhe: c.perMonthAvg,
    },
    {
      icone: "moeda",
      titulo: (
        <>
          {c.valueTitle} <Termo k="pld" soIcone />
        </>
      ),
      valor: valorTxt,
      detalhe: (
        <>
          {c.valueShort(pldTxt)}
          <span className="mt-1 block">{c.valueFloor(`R$ ${num(pld.piso, L, 2)}`, reais(r.reaisPiso, L, true))}</span>
        </>
      ),
    },
  ];

  return (
    <Cartao id="calculadora" className="scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
              <Icone nome="calculadora" className="size-5" />
            </span>
            {c.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">{c.lead}</p>
        </div>
        <Evidencia nivel="estimativa" />
      </div>

      <Nota tom="aviso" className="mt-5">
        <span className="font-medium text-ink">{c.disclaimer}</span>
      </Nota>

      <div className="mt-5 rounded-2xl bg-sunken/70 p-4 ring-1 ring-inset ring-line sm:p-5">
        <CamposCenario cenario={cen} aoMudar={definir} />
      </div>
      {r.acimaDaCapacidade && <p className="mt-3 text-sm text-muted">{c.capNote(`${num(u.capacidade_mw, L)} MW`)}</p>}
      {!r.acimaDaCapacidade && cen.mw > r.mwMedioCortado && r.mwMedioCortado > 0 && <p className="mt-3 text-sm text-muted">{c.limitNote(num(r.mwMedioCortado, L, r.mwMedioCortado < 10 ? 1 : 0))}</p>}

      {/* A resposta, em uma frase */}
      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/70 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{c.summaryTitle}</p>
        <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink sm:text-lg">
          {c.summary(mwTxt, String(cen.horas), faixa, num(r.horasCorteMes, L), pct(r.fracaoCorte, L), num(r.mwhMes, L), valorTxt)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {numeros.map((n, i) => (
          <div key={i} className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
            <div className="flex items-center gap-2 text-sm font-medium leading-snug text-ink-2">
              <Icone nome={n.icone} className="size-[1.05rem] text-brand-700" />
              <span>{n.titulo}</span>
            </div>
            <p className="mt-3 text-[2rem] font-semibold leading-none tracking-tight text-ink">{n.valor}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{n.detalhe}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{c.valueDisclaimer}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{c.assumption}</p>

      {/* Em que horas, no ano, a usina costuma ser cortada */}
      <div className="mt-7">
        <h3 className="font-semibold text-ink">{t.plant.profileTitle}</h3>
        <p className="mt-0.5 text-sm text-muted">{t.charts.hourProfile}</p>
        <div className="mt-3">
          <PerfilHorario perfil={perfil} inicio={cen.inicio} horas={cen.horas} melhor={sugerir ? { inicio: melhor.inicio, horas: cen.horas } : null} />
        </div>
        {sugerir && (
          <Nota tom="marca" className="mt-3">
            <span>{c.bestStart(hora(melhor.inicio), num(melhor.horasCorteMes, L))}</span>{" "}
            <button type="button" onClick={() => definir({ inicio: melhor.inicio, melhorHorario: false })} className="font-semibold text-brand-800 underline underline-offset-2 hover:text-brand-900">
              {c.useBest}
            </button>
          </Nota>
        )}
      </div>

      {/* Por que essas horas foram cortadas */}
      <div className="mt-7">
        <h3 className="font-semibold text-ink">{c.reasonsTitle}</h3>
        <ul className="mt-4 space-y-4">
          {linhasRazao.map(({ chave, rotulo, dado, termo }) => (
            <li key={chave}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                <span className="font-medium text-ink">
                  {termo ? <Termo k={termo}>{rotulo}</Termo> : rotulo} <span className="font-normal text-muted">({pct(dado.fracao, L)})</span>
                </span>
                <span className="tabular text-ink-2">{c.reasonsLine(num(dado.horas, L, 1), num(dado.mwh, L))}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line" aria-hidden>
                <div className="h-full rounded-full" style={{ width: `${Math.max(1.5, dado.fracao * 100)}%`, background: chave === "ene" ? "var(--color-brand-600)" : "#8f9c95" }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted">{c.reasonsNote(pct(r.razoes.ene.fracao, L), pct(r.razoes.eletrico.fracao, L))}</p>
        <Nota tom="aviso" className="mt-3">
          {c.elecWarn}
        </Nota>
      </div>

      {/* Levar para a conversa */}
      <div className="nao-imprimir mt-8 border-t border-line pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Botao onClick={copiarResumo} icone="copiar" className={acao}>
            {c.actions.copySummary}
          </Botao>
          <Botao onClick={copiarLink} variante="secundario" icone="link" className={acao}>
            {c.actions.copyLink}
          </Botao>
          <Botao onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(resumo())}`, "_blank", "noopener")} variante="secundario" icone="compartilhar" className={acao}>
            {c.actions.whatsapp}
          </Botao>
          <Botao onClick={() => window.print()} variante="fantasma" icone="imprimir" className={acao}>
            {c.actions.print}
          </Botao>
        </div>
        <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-brand-700">
          {aviso}
        </p>
        {manual && (
          <textarea
            readOnly
            value={manual}
            rows={7}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={c.actions.copySummary}
            className="mt-2 w-full rounded-xl border border-line-strong bg-card p-3 text-xs leading-relaxed text-ink"
          />
        )}
        <Link href={ROTAS.plataforma} className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          {c.compare}
          <Icone nome="seta" className="size-4" />
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        <details className="abre rounded-xl border border-line">
          <summary className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink">
            {c.ruleTitle}
            <span className="sinal grid size-6 place-items-center rounded-full bg-sunken text-ink-2 transition-transform">
              <Icone nome="mais" className="size-3.5" />
            </span>
          </summary>
          <p className="px-4 pb-4 text-sm leading-relaxed text-ink-2">{c.rule}</p>
        </details>
        <details className="abre rounded-xl border border-line">
          <summary className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink">
            {c.methodTitle}
            <span className="sinal grid size-6 place-items-center rounded-full bg-sunken text-ink-2 transition-transform">
              <Icone nome="mais" className="size-3.5" />
            </span>
          </summary>
          <ul className="list-disc space-y-1.5 px-4 pb-4 pl-8 text-sm leading-relaxed text-ink-2">
            {c.method.map((linha) => (
              <li key={linha}>{linha}</li>
            ))}
          </ul>
        </details>
      </div>
    </Cartao>
  );
}
