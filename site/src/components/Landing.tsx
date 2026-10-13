"use client";

// Apresentação do Nomos (landing): a promessa com um exemplo real, a dor, como a plataforma ajuda, para quem é,
// transparência e os botões de cadastro. Primeira parada do fluxo: apresentação → login → plataforma.
import { useIdioma } from "@/i18n/idioma";
import { dataCurta, num, pct, reais, somaEntreHoras } from "@/lib/formato";
import { ROTAS } from "@/lib/rotas";
import { CabecalhoLanding } from "./CabecalhoLanding";
import { GraficoHoras, PerfilHorario } from "./Graficos";
import { Icone, IconeTipo, type NomeIcone } from "./Icones";
import { Rodape } from "./Rodape";
import { Evidencia } from "./Selos";
import { Botao, Cartao, Eyebrow, Numero, Selo } from "./ui";

export type DadosLanding = {
  mwMedios: number;
  gwhDia: number;
  valorReais: number | null;
  valorAte: string; // AAAA-MM-DD
  dadosAte: string; // AAAA-MM-DD
  usinasComCalculadora: number;
  conjuntosModelados: number;
  /** Exemplo calculado com os dados reais, pela mesma conta da calculadora da plataforma */
  exemplo: {
    usina: string;
    uf: string;
    mw: number;
    horas: number;
    inicio: number;
    horasCorteMes: number;
    mwhMes: number;
    reais: number;
    perfil: number[];
    fracaoEne: number;
    fracaoEletrico: number;
  };
  /** As usinas de destaque para o mesmo cenário do exemplo, da que mais encontra corte para a que menos encontra */
  ranking: { id: string; nome: string; uf: string; tipo: "eolica" | "solar"; mwhMes: number }[];
  porHora: { eolica: number[]; solar: number[] };
};

const hora = (h: number) => `${String(h).padStart(2, "0")}:00`;

// ---------- miniaturas do produto (ilustrativas, com os números do exemplo real) ----------

function MiniCarga({ mw, horas, inicio }: { mw: number; horas: number; inicio: number }) {
  const { t } = useIdioma();
  const m = t.landing.how.mini;
  const campo = "rounded-lg border border-line-strong bg-card px-3 py-2 text-sm font-semibold text-ink";
  return (
    <div className="space-y-3 text-xs text-muted">
      <div>
        {m.load}
        <div className={`${campo} mt-1 flex items-center justify-between`}>
          <span className="tabular">{num(mw, t.locale)}</span>
          <span className="font-medium text-muted">MW</span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          {m.hours}
          <span className="tabular text-sm font-semibold text-ink">
            {horas} {m.hoursUnit}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full bg-line-strong">
          <div className="relative h-full rounded-full bg-brand-600" style={{ width: `${(horas / 24) * 100}%` }}>
            <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-brand-700 bg-white shadow" />
          </div>
        </div>
      </div>
      <div>
        {m.start}
        <div className={`${campo} tabular mt-1`}>{hora(inicio)}</div>
      </div>
    </div>
  );
}

function MiniRanking({ linhas }: { linhas: DadosLanding["ranking"] }) {
  const { t } = useIdioma();
  const m = t.landing.how.mini;
  const max = Math.max(...linhas.map((l) => l.mwhMes), 1);
  return (
    <div className="text-xs text-muted">
      <div className="flex justify-between pb-1.5">
        <span>{m.plant}</span>
        <span>{m.energy}</span>
      </div>
      <ul className="space-y-2.5">
        {linhas.map((l, i) => (
          <li key={l.id}>
            <div className="flex items-center justify-between gap-2 text-ink">
              <span className="flex min-w-0 items-center gap-1.5 text-[0.8125rem] font-medium">
                <span className="tabular w-3 text-muted">{i + 1}</span>
                <IconeTipo tipo={l.tipo} className={`size-3.5 ${l.tipo === "eolica" ? "text-wind" : "text-sun"}`} />
                <span className="truncate">{l.nome}</span>
              </span>
              <span className="tabular shrink-0 text-[0.8125rem] font-semibold">{num(l.mwhMes, t.locale)}</span>
            </div>
            <div className="ml-[1.1rem] mt-1 h-1.5 rounded-full bg-line">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${(l.mwhMes / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniResultado({ ex }: { ex: DadosLanding["exemplo"] }) {
  const { t } = useIdioma();
  const L = t.locale;
  const m = t.landing.how.mini;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          [num(ex.horasCorteMes, L), m.resultHours],
          [num(ex.mwhMes, L), m.resultEnergy],
          [reais(ex.reais, L, true), m.resultValue],
        ].map(([v, r]) => (
          <div key={r}>
            <div className="tabular whitespace-nowrap text-[0.85rem] font-semibold leading-none text-ink sm:text-[0.95rem]">{v}</div>
            <div className="mt-1.5 text-[10.5px] leading-tight text-muted">{r}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
          <div className="rounded-l-full bg-brand-600" style={{ width: `${ex.fracaoEne * 100}%` }} />
          <div className="rounded-r-full bg-[#b3bcb7]" style={{ width: `${ex.fracaoEletrico * 100}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[10.5px] text-muted">
          <span>
            {m.surplus} {pct(ex.fracaoEne, L)}
          </span>
          <span>
            {m.electrical} {pct(ex.fracaoEletrico, L)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- a página ----------

export function Landing({ d }: { d: DadosLanding }) {
  const { t } = useIdioma();
  const L = t.locale;
  const p = t.landing;
  const h = p.hero;
  const ex = d.exemplo;
  const parteEolica8a15 = somaEntreHoras(d.porHora.eolica, 8, 15) / 100;
  const quemIcones: NomeIcone[] = ["servidor", "vento", "grafico"];
  const titulo = "font-display font-medium leading-[1.08] tracking-[-0.015em] text-ink";

  return (
    <>
      <CabecalhoLanding />
      <main id="conteudo" className="flex-1">
        {/* 1. Abertura: a promessa e o exemplo real */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-48 -top-48 size-[36rem] rounded-full bg-brand-100/80 blur-3xl" />
            <div className="fundo-pontos absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_75%)]" />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
            <div className="min-w-0">
              <Selo tom="marca" icone="raio" quebra>
                {h.eyebrow}
              </Selo>
              <h1 className={`${titulo} mt-5 text-[2.6rem] sm:text-6xl lg:text-[3.75rem]`}>
                {h.title} <span className="italic text-brand-700">{h.accent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{h.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Botao href={ROTAS.entrar} tamanho="lg" iconeDireita="seta">
                  {h.ctaPrimary}
                </Botao>
                <Botao href="#como-funciona" variante="secundario" tamanho="lg">
                  {h.ctaSecondary}
                </Botao>
              </div>
              <ul className="mt-8 flex flex-col gap-2.5 text-sm text-ink-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {h.proof.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Icone nome="check" className="size-4 text-brand-600" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted">{h.micro}</p>
            </div>

            <aside aria-label={h.exampleBadge} className="min-w-0 rounded-3xl border border-line bg-card p-5 shadow-pop sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Selo tom="ok" icone="escudo">
                  {h.exampleBadge}
                </Selo>
                <span className="text-xs text-muted">{dataCurta(d.dadosAte, L, true)}</span>
              </div>
              <h2 className="mt-4 text-[1.05rem] font-semibold leading-snug text-ink">{h.exampleTitle(ex.usina, ex.uf, num(ex.mw, L), num(ex.horas, L))}</h2>
              <p className="mt-1 text-xs text-muted">{h.exampleChart}</p>
              <div className="mt-2">
                <PerfilHorario perfil={ex.perfil} inicio={ex.inicio} horas={ex.horas} altura={184} legenda={false} />
              </div>
              <ul className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3 sm:gap-3">
                {[
                  [`${num(ex.horasCorteMes, L)} h`, h.exampleHours],
                  [`${num(ex.mwhMes, L)} MWh`, h.exampleEnergy],
                  [reais(ex.reais, L, true), h.exampleValue],
                ].map(([valor, rotulo]) => (
                  <li key={rotulo} className="flex items-baseline gap-4 sm:block">
                    <p className="w-[9.5rem] shrink-0 text-[1.5rem] font-semibold leading-none tracking-tight text-ink sm:w-auto sm:text-[1.55rem]">{valor}</p>
                    <p className="text-[11px] leading-snug text-muted sm:mt-2">{rotulo}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] leading-relaxed text-muted">{h.exampleNote(dataCurta(d.dadosAte, L, true))}</p>
            </aside>
          </div>
        </section>

        {/* 2. O tamanho da sobra */}
        <section className="border-y border-line bg-card">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:items-center lg:gap-14">
            <div>
              <h2 className={`${titulo} text-3xl sm:text-4xl`}>{p.size.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{p.size.lead}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Numero valor={`${num(d.mwMedios / 1000, L, 1)} GW`} rotulo={t.home.statCut} destaque />
              <Numero valor={`${num(d.gwhDia, L)} GWh`} rotulo={t.home.statDay} />
              {d.valorReais && <Numero valor={reais(d.valorReais, L, true)} rotulo={t.home.statValueReal(dataCurta(d.valorAte, L, true))} />}
            </div>
          </div>
        </section>

        {/* 3. O problema */}
        <section id="problema" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <Eyebrow>{p.problem.eyebrow}</Eyebrow>
              <h2 className={`${titulo} mt-2 text-[2rem] sm:text-5xl`}>{p.problem.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-2">{p.problem.lead}</p>
              <ol className="mt-6 space-y-3.5">
                {p.problem.questions.map((q, i) => (
                  <li key={q} className="flex gap-3.5">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">{i + 1}</span>
                    <span className="leading-relaxed text-ink">{q}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 leading-relaxed text-muted">{p.problem.closing}</p>
            </div>
            <Cartao>
              <h3 className="font-semibold text-ink">{p.problem.chartTitle}</h3>
              <p className="mt-0.5 text-sm text-muted">{t.home.hourTitle}</p>
              <div className="mt-3">
                <GraficoHoras eolica={d.porHora.eolica} solar={d.porHora.solar} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{p.problem.chartNote(pct(parteEolica8a15, L))}</p>
            </Cartao>
          </div>
        </section>

        {/* 4. Como funciona */}
        <section id="como-funciona" className="scroll-mt-20 border-y border-brand-100 bg-brand-50/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Eyebrow>{p.how.eyebrow}</Eyebrow>
            <h2 className={`${titulo} mt-2 text-[2rem] sm:text-5xl`}>{p.how.title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-ink-2">{p.how.lead}</p>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {p.how.steps.map((s, i) => (
                <li key={s.title} className="flex flex-col rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
                  <div aria-hidden className="rounded-xl bg-sunken p-4 ring-1 ring-inset ring-line">
                    {i === 0 && <MiniCarga mw={ex.mw} horas={ex.horas} inicio={ex.inicio} />}
                    {i === 1 && <MiniRanking linhas={d.ranking} />}
                    {i === 2 && <MiniResultado ex={ex} />}
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">{i + 1}</span>
                    <h3 className="text-lg font-semibold leading-snug text-ink">{s.title}</h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted">{p.how.coverage(num(d.usinasComCalculadora, L), num(d.conjuntosModelados, L))}</p>
          </div>
        </section>

        {/* 5. O que há na plataforma */}
        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className={`${titulo} text-[2rem] sm:text-5xl`}>{p.features.title}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {p.features.items.map((f) => (
                <div key={f.title} className="flex gap-4 rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                    <Icone nome={f.icon as NomeIcone} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Para quem é (hipótese, ainda não validada) */}
        <section id="para-quem" className="scroll-mt-20 border-y border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className={`${titulo} text-[2rem] sm:text-5xl`}>{t.home.audienceTitle}</h2>
              <Selo tom="simulacao">{t.home.audienceBadge}</Selo>
            </div>
            <p className="mt-4 max-w-3xl text-lg text-ink-2">{t.home.audienceLead}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {t.home.audienceWho.map((x, i) => (
                <div key={x.title} className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-card text-brand-700 shadow-card ring-1 ring-inset ring-line">
                    <Icone nome={quemIcones[i]} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{x.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{x.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-line-strong p-5 sm:p-6">
              <h3 className="font-semibold text-ink">{t.home.audienceFormatsTitle}</h3>
              <ul className="mt-3 grid gap-2 text-sm text-ink-2 md:grid-cols-3">
                {t.home.audienceFormats.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Icone nome="estrela" className="mt-0.5 size-4 text-faint" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">{t.home.audienceNote}</p>
            </div>
          </div>
        </section>

        {/* 7. Transparência */}
        <section id="transparencia" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className={`${titulo} text-[2rem] sm:text-5xl`}>{p.trust.title}</h2>
            <p className="mt-4 max-w-3xl text-lg text-ink-2">{p.trust.lead}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Cartao>
                <h3 className="flex items-center gap-2.5 text-lg font-semibold text-ink">
                  <span className="flex size-7 items-center justify-center rounded-full bg-ok-soft text-ok">
                    <Icone nome="check" className="size-4" />
                  </span>
                  {p.trust.isTitle}
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
                  {p.trust.is.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Icone nome="check" className="mt-0.5 size-4 text-ok" />
                      {x}
                    </li>
                  ))}
                </ul>
              </Cartao>
              <Cartao>
                <h3 className="flex items-center gap-2.5 text-lg font-semibold text-ink">
                  <span className="flex size-7 items-center justify-center rounded-full bg-crit-soft text-crit">
                    <Icone nome="x" className="size-4" />
                  </span>
                  {p.trust.isNotTitle}
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
                  {p.trust.isNot.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Icone nome="x" className="mt-0.5 size-4 text-crit" />
                      {x}
                    </li>
                  ))}
                </ul>
              </Cartao>
            </div>
            <h3 className="mt-12 text-xl font-semibold text-ink">{p.trust.levelsTitle}</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {p.trust.levels.map((n) => (
                <div key={n.nivel} className="rounded-2xl border border-line bg-card p-5">
                  <Evidencia nivel={n.nivel as "oficial" | "estimativa" | "simulacao"} />
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{n.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm text-muted">{p.trust.validating}</p>
          </div>
        </section>

        {/* 8. Perguntas frequentes */}
        <section className="border-t border-line bg-card">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className={`${titulo} text-[2rem] sm:text-5xl`}>{p.faq.title}</h2>
            <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper">
              {p.faq.items.map((f) => (
                <details key={f.q} className="abre group">
                  <summary className="flex items-center justify-between gap-4 p-5 font-medium text-ink">
                    {f.q}
                    <span className="sinal grid size-7 shrink-0 place-items-center rounded-full bg-card text-ink-2 ring-1 ring-inset ring-line transition-transform">
                      <Icone nome="mais" className="size-4" />
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Chamada final */}
        <section className="px-4 pb-16 pt-4 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-900 text-white">
            <div aria-hidden className="fundo-pontos-claro pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-600/40 blur-3xl" />
            <div className="relative flex flex-col items-start gap-8 px-6 py-14 sm:px-12 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight sm:text-[2.75rem]">{p.final.title}</h2>
                <p className="mt-3 text-lg text-brand-100/85">{p.final.text}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Botao href={ROTAS.entrar} variante="claro" tamanho="lg" iconeDireita="seta">
                  {p.final.cta}
                </Botao>
                <Botao href="#" variante="contornoClaro" tamanho="lg">
                  {p.final.top}
                </Botao>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Rodape variante="landing" />
    </>
  );
}
