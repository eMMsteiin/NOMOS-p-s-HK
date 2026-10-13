"use client";

import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";
import { CabecalhoSimples } from "@/components/CabecalhoSimples";
import { Icone } from "@/components/Icones";
import { Botao } from "@/components/ui";

// Página 404 do Nomos (a padrão do Next fica preta quando o sistema do visitante está no modo escuro)
export default function NotFound() {
  const { t } = useIdioma();
  return (
    <>
      <CabecalhoSimples />
      <main id="conteudo" className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 pb-24 pt-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
          <Icone nome="bussola" className="size-8" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">404</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">{t.notFound.title}</h1>
        <p className="mt-3 text-ink-2">{t.notFound.text}</p>
        <Botao href={ROTAS.inicio} className="mt-8" iconeDireita="seta">
          {t.notFound.back}
        </Botao>
      </main>
    </>
  );
}
