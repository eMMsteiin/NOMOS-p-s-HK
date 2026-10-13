"use client";

import { useSyncExternalStore } from "react";
import { useIdioma } from "@/i18n/idioma";
import { LogotipoNomos } from "./Marca";

const assinar = () => () => {};

/** Faixa que só aparece na impressão e no "salvar em PDF": marca, data e o lembrete de que os números são estimativas. */
export function CabecalhoImpressao() {
  const { t } = useIdioma();
  // A data é lida no navegador (no servidor vale vazio): assim a página pré-gerada não "congela" o dia da compilação
  const hoje = useSyncExternalStore(
    assinar,
    () => new Intl.DateTimeFormat(t.locale, { dateStyle: "long" }).format(new Date()),
    () => "",
  );
  return (
    <div className="so-impressao mb-4 flex items-end justify-between gap-6 border-b border-black pb-3">
      <LogotipoNomos className="text-[1.9rem]" />
      <p className="max-w-md text-right text-xs">
        {hoje} · {t.print.note}
      </p>
    </div>
  );
}
