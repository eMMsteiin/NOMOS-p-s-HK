"use client";

// Mostra o registro, na Solana, do SHA-256 da previsão publicada: prova de que ela existia antes dos dias previstos.
import { useEffect, useState } from "react";
import { useIdioma } from "@/i18n/idioma";
import type { RegistroCadeia } from "@/lib/tipos";
import { Icone } from "./Icones";

type Resposta = { previsao: { arquivo: string; sha256: string }; registro: RegistroCadeia | null };

export function SeloPrevisao() {
  const { t } = useIdioma();
  const [r, setR] = useState<Resposta | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/previsao")
      .then((x) => (x.ok ? (x.json() as Promise<Resposta>) : null))
      .then((dados) => vivo && setR(dados))
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  if (!r?.registro) return null;
  const quando = new Intl.DateTimeFormat(t.locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date((r.registro.horario ?? 0) * 1000));
  return (
    <div className="mt-3 flex max-w-3xl items-start gap-2.5 rounded-xl border border-ok-mark/30 bg-ok-soft px-3.5 py-2.5 text-xs leading-relaxed text-ink-2">
      <Icone nome="escudo" className="mt-px size-4 text-ok" />
      <p>
        {t.home.forecastProof(quando)}{" "}
        <a href={r.registro.explorador} target="_blank" rel="noreferrer" className="font-semibold text-ok underline underline-offset-2">
          Solana Explorer ↗
        </a>{" "}
        ·{" "}
        <a href={`/${r.previsao.arquivo}`} download className="font-semibold text-ok underline underline-offset-2">
          {t.home.forecastFile}
        </a>{" "}
        <span className="font-mono text-[11px] text-muted">sha256 {r.previsao.sha256.slice(0, 12)}…</span>
      </p>
    </div>
  );
}
