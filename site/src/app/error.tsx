"use client";

import { useIdioma } from "@/i18n/idioma";

// Se alguma página falhar ao carregar, o visitante vê esta mensagem em vez de uma tela quebrada.
// Nesta versão do Next a função de tentar de novo se chama `retry`.
export default function Erro({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { t } = useIdioma();
  return (
    <div className="mx-auto max-w-xl pt-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{t.pageError.title}</h1>
      <p className="mt-3 text-muted">{t.pageError.text}</p>
      <button type="button" onClick={() => retry()} className="mt-6 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white">
        {t.pageError.retry}
      </button>
    </div>
  );
}
