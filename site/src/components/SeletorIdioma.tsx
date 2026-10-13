"use client";

import { useIdioma } from "@/i18n/idioma";

/** Botões EN / PT. Usado em todos os cabeçalhos (apresentação, login e plataforma). */
export function SeletorIdioma({ className = "" }: { className?: string }) {
  const { idioma, trocar } = useIdioma();
  return (
    <div className={`flex shrink-0 overflow-hidden rounded-md border border-line text-xs font-medium ${className}`} role="group" aria-label="Language">
      {(["en", "pt"] as const).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => trocar(i)}
          aria-pressed={idioma === i}
          className={`px-3 py-2.5 uppercase sm:px-2 sm:py-1.5 ${idioma === i ? "bg-ink text-white" : "bg-card text-muted hover:text-ink"}`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}
