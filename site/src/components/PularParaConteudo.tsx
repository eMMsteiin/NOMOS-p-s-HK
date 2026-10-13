"use client";

import { useIdioma } from "@/i18n/idioma";

/** Link invisível que aparece ao apertar Tab: quem usa o teclado pula o menu e vai direto ao conteúdo (<main id="conteudo">). */
export function PularParaConteudo() {
  const { t } = useIdioma();
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
    >
      {t.common.skip}
    </a>
  );
}
