"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { dataCurta } from "@/lib/formato";
import { MOSTRAR } from "@/lib/recursos";
import { ROTAS } from "@/lib/rotas";
import { REPOSITORIO } from "@/lib/tipos";
import { Icone } from "./Icones";
import { Evidencia } from "./Selos";
import { Botao, Cartao, CabecalhoPagina } from "./ui";

/** "2026-01-01 a 2026-10-11" vira "Jan 1, 2026 – Oct 11, 2026": o período vem dos dados, não de uma data escrita à mão. */
function periodoLegivel(periodo: string, locale: string) {
  const [de, ate] = periodo.split(" a ");
  return de && ate ? `${dataCurta(de, locale, true)} – ${dataCurta(ate, locale, true)}` : "";
}

export function Metodo({ pldPeriodo }: { pldPeriodo: string }) {
  const { t, idioma } = useIdioma();
  const m = t.method;

  const blocos: { nivel: "oficial" | "estimativa" | "simulacao"; titulo: string; itens: string[]; faixa: string; link?: { href: string; rotulo: string } }[] = [
    { nivel: "oficial", titulo: m.realTitle, itens: [...m.real, m.pldItem(periodoLegivel(pldPeriodo, t.locale))], faixa: "bg-ok-mark" },
    { nivel: "estimativa", titulo: m.estTitle, itens: MOSTRAR.horasDeGpu ? [...m.est, m.estGpu] : m.est, faixa: "bg-warn-mark" },
    // A reserva simulada saiu daqui: o cartão só aponta para o Laboratório
    { nivel: "simulacao", titulo: m.simTitle, itens: m.sim, faixa: "bg-sim-mark", link: { href: ROTAS.laboratorio, rotulo: m.simLink } },
  ];

  // Glossário: os termos explicados nos balões, mais duas definições que só existem aqui, em ordem alfabética
  const extras = [m.defs[2], m.defs[4]].map(([term, def]) => ({ term, def }));
  const glossario = [...Object.values(t.glossary), ...extras].sort((a, b) => a.term.localeCompare(b.term, idioma === "pt" ? "pt-BR" : "en"));

  return (
    <div className="space-y-10">
      <CabecalhoPagina eyebrow={t.nav.method} titulo={m.title} lead={m.lead} />

      <div className="grid gap-4 md:grid-cols-3">
        {blocos.map((b) => (
          <Cartao key={b.titulo} semPreenchimento className="flex flex-col overflow-hidden">
            <div aria-hidden className={`h-1.5 ${b.faixa}`} />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Evidencia nivel={b.nivel} />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-ink">{b.titulo}</h2>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-2">
                {b.itens.map((i) => (
                  <li key={i} className="flex gap-2.5">
                    <Icone nome="check" className="mt-0.5 size-4 text-faint" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              {b.link && (
                <Link href={b.link.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
                  {b.link.rotulo}
                </Link>
              )}
            </div>
          </Cartao>
        ))}
      </div>

      <Cartao id="glossario" className="scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{m.defTitle}</h2>
        <dl className="mt-5 space-y-5 text-sm md:columns-2 md:gap-x-10">
          {glossario.map(({ term, def }) => (
            <div key={term} className="break-inside-avoid">
              <dt className="font-semibold text-ink">{term}</dt>
              <dd className="mt-0.5 leading-relaxed text-ink-2">{def}</dd>
            </div>
          ))}
        </dl>
      </Cartao>

      <div className="grid gap-4 lg:grid-cols-2">
        <Cartao>
          <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
            <Icone nome="dados" className="size-5 text-brand-700" />
            {m.dataTitle}
          </h2>
          <p className="mt-1.5 text-sm text-ink-2">{m.dataLead}</p>
          <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
            {Object.entries(m.files).map(([arquivo, desc]) => (
              <li key={arquivo}>
                <a href={`/data/${arquivo}`} download className="group flex items-start gap-3 px-3.5 py-3 transition hover:bg-sunken/70">
                  <Icone nome="baixar" className="mt-0.5 size-4 text-faint transition group-hover:text-brand-700" />
                  <span className="min-w-0">
                    <span className="block break-all font-mono text-xs font-medium text-brand-700 group-hover:underline">{arquivo}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-2">{desc}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <Botao href={REPOSITORIO} variante="secundario" tamanho="sm" iconeDireita="externo" className="mt-4">
            {m.codeLink}
          </Botao>
        </Cartao>
        <Cartao>
          <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
            <Icone nome="alerta" className="size-5 text-warn" />
            {m.limitsTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
            {m.limits.map((l) => (
              <li key={l} className="flex gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-warn-mark" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>
    </div>
  );
}
