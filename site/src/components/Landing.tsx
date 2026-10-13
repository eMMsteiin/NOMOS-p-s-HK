"use client";

// Apresentação do Nomos (landing): a dor, como a plataforma ajuda, transparência e os botões de cadastro.
// Primeira parada do fluxo: apresentação → login → plataforma.
import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { dataCurta, num, reais } from "@/lib/formato";
import { ROTAS } from "@/lib/rotas";
import { CabecalhoLanding } from "./CabecalhoLanding";
import { Rodape } from "./Rodape";
import { Numero } from "./Selos";

export type DadosLanding = {
  mwMedios: number;
  gwhDia: number;
  valorReais: number | null;
  valorAte: string; // AAAA-MM-DD
  dadosAte: string; // AAAA-MM-DD
  usinasComCalculadora: number;
  conjuntosModelados: number;
  /** Exemplo calculado com os dados reais, pela mesma conta da calculadora da plataforma */
  exemplo: { usina: string; uf: string; mw: number; horas: number; horasCorteMes: number; mwhMes: number; reais: number };
};

const botaoPrimario =
  "inline-flex items-center justify-center rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90";
const botaoSecundario =
  "inline-flex items-center justify-center rounded-lg border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white";
const cartao = "rounded-xl border border-line bg-card p-5";

export function Landing({ d }: { d: DadosLanding }) {
  const { t } = useIdioma();
  const L = t.locale;
  const p = t.landing;
  const h = p.hero;
  const ex = d.exemplo;

  return (
    <>
      <CabecalhoLanding />
      <main className="flex-1">
        {/* 1. Abertura: a promessa e o exemplo real */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cut">{h.kicker}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{h.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{h.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={ROTAS.entrar} className={botaoPrimario}>
                {h.ctaPrimary}
              </Link>
              <a href="#como-funciona" className={botaoSecundario}>
                {h.ctaSecondary}
              </a>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-relaxed text-muted">{h.micro}</p>
          </div>

          <aside className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6" aria-label={h.exampleKicker}>
            <p className="text-xs font-semibold uppercase tracking-wide text-wind">{h.exampleKicker}</p>
            <p className="mt-1 text-sm font-medium text-muted">{h.exampleTitle(ex.usina, ex.uf, num(ex.mw, L), num(ex.horas, L))}</p>
            <div className="mt-5 space-y-4">
              {[
                [`${num(ex.horasCorteMes, L, 1)} h`, h.exampleHours],
                [`${num(ex.mwhMes, L)} MWh`, h.exampleEnergy],
                [reais(ex.reais, L), h.exampleValue],
              ].map(([valor, rotulo]) => (
                <div key={rotulo}>
                  <p className="tabular text-3xl font-semibold tracking-tight sm:text-4xl">{valor}</p>
                  <p className="text-sm text-muted">{rotulo}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-line pt-3 text-xs text-muted">{h.exampleNote(dataCurta(d.dadosAte, L, true))}</p>
          </aside>
        </section>

        {/* 2. A dor */}
        <section id="dor" className="scroll-mt-20 border-y border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{p.pain.title}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{p.pain.lead}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Numero valor={`${num(d.mwMedios / 1000, L, 1)} GW`} rotulo={t.home.statCut} destaque />
              <Numero valor={`${num(d.gwhDia, L)} GWh`} rotulo={t.home.statDay} />
              {d.valorReais && <Numero valor={reais(d.valorReais, L, true)} rotulo={t.home.statValueReal(dataCurta(d.valorAte, L, true))} />}
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold leading-snug">{p.pain.questionsTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {p.pain.questions.map((q) => (
                    <li key={q} className="flex gap-3">
                      <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cut" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="self-end text-muted">{p.pain.closing}</p>
            </div>
          </div>
        </section>

        {/* 3. Como o Nomos ajuda */}
        <section id="como-funciona" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{p.how.title}</h2>
            <p className="mt-4 max-w-3xl text-lg text-muted">{p.how.lead}</p>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {p.how.steps.map((s, i) => (
                <li key={s.title} className={cartao}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted">{p.how.coverage(num(d.usinasComCalculadora, L), num(d.conjuntosModelados, L))}</p>
          </div>
        </section>

        {/* 4. O que tem na plataforma */}
        <section className="border-y border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{p.features.title}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {p.features.items.map((f) => (
                <div key={f.title} className="rounded-xl border border-line bg-paper p-5">
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Transparência */}
        <section id="transparencia" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{p.trust.title}</h2>
            <p className="mt-4 max-w-3xl text-lg text-muted">{p.trust.lead}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className={`${cartao} border-t-4 border-t-ok`}>
                <h3 className="text-lg font-semibold">{p.trust.isTitle}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {p.trust.is.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="font-semibold text-ok">
                        ✓
                      </span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${cartao} border-t-4 border-t-cut`}>
                <h3 className="text-lg font-semibold">{p.trust.isNotTitle}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {p.trust.isNot.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="font-semibold text-cut">
                        ✕
                      </span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 max-w-3xl text-sm text-muted">{p.trust.validating}</p>
          </div>
        </section>

        {/* 6. Para quem é (hipótese, ainda não validada) */}
        <section className="border-y border-line bg-card">
          <div className="mx-auto max-w-6xl space-y-4 px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.audienceTitle}</h2>
              <span className="rounded bg-wait-soft px-2 py-1 text-xs font-semibold uppercase tracking-wide text-wait">{t.home.audienceBadge}</span>
            </div>
            <p className="max-w-3xl text-lg text-muted">{t.home.audienceLead}</p>
            <div className="grid gap-4 pt-4 md:grid-cols-3">
              {t.home.audienceWho.map((x) => (
                <div key={x.title} className="rounded-xl border border-dashed border-line bg-paper p-5">
                  <h3 className="font-semibold">{x.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{x.text}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-dashed border-line bg-paper p-5">
              <h3 className="font-semibold">{t.home.audienceFormatsTitle}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {t.home.audienceFormats.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">{t.home.audienceNote}</p>
            </div>
          </div>
        </section>

        {/* 7. Perguntas frequentes */}
        <section>
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{p.faq.title}</h2>
            <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-card">
              {p.faq.items.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}
                    <span aria-hidden className="text-xl leading-none text-muted transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Chamada final */}
        <section className="bg-ink text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">{p.final.title}</h2>
              <p className="mt-3 text-white/75">{p.final.text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={ROTAS.entrar} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white/90">
                {p.final.cta}
              </Link>
              <a href="#" className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                {p.final.top}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
