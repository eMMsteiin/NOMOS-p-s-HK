"use client";

import { useIdioma } from "@/i18n/idioma";
import { CabecalhoSimples } from "@/components/CabecalhoSimples";
import { Icone } from "@/components/Icones";
import { Botao } from "@/components/ui";

// Se alguma página falhar ao carregar, o visitante vê esta mensagem em vez de uma tela quebrada.
// Nesta versão do Next a função de tentar de novo se chama `retry`.
export default function Erro({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { t } = useIdioma();
  return (
    <>
      <CabecalhoSimples />
      <main id="conteudo" className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 pb-24 pt-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-warn-soft text-warn ring-1 ring-inset ring-warn-mark/40">
          <Icone nome="alerta" className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink">{t.pageError.title}</h1>
        <p className="mt-3 text-ink-2">{t.pageError.text}</p>
        <Botao className="mt-8" onClick={() => retry()}>
          {t.pageError.retry}
        </Botao>
      </main>
    </>
  );
}
