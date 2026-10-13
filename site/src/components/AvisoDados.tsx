"use client";

// Aviso de dados velhos. Esta versão de teste ainda não se atualiza sozinha: se os dados ficarem para trás,
// as "janelas previstas" de dias que já passaram deixam de ser previsões. A idade é medida no navegador,
// em dias de Brasília; no servidor vale 0, então nada aparece na pré-renderização.
import { useSyncExternalStore } from "react";
import { useIdioma } from "@/i18n/idioma";
import { dataCurta } from "@/lib/formato";
import { Icone } from "./Icones";

const DIA_MS = 86_400_000;
const LIMITE_DIAS = 3; // o ONS publica com cerca de 1 dia de atraso: 3 dias ou mais já é dado velho

const utc = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
};

function idadeEmDias(dadosAte: string): number {
  const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date()); // AAAA-MM-DD
  return Math.round((utc(hoje) - utc(dadosAte)) / DIA_MS);
}

const assinar = () => () => {};

export function AvisoDados({ dadosAte }: { dadosAte: string }) {
  const { t } = useIdioma();
  const dias = useSyncExternalStore(assinar, () => idadeEmDias(dadosAte), () => 0);
  if (dias < LIMITE_DIAS) return null;
  return (
    <div className="nao-imprimir border-b border-warn-mark/40 bg-warn-soft" role="status">
      <p className="mx-auto flex max-w-6xl items-start gap-2.5 px-4 py-2.5 text-xs leading-relaxed text-warn sm:px-6">
        <Icone nome="alerta" className="mt-px size-4" />
        {t.dataAge(dataCurta(dadosAte, t.locale, true), String(dias))}
      </p>
    </div>
  );
}
