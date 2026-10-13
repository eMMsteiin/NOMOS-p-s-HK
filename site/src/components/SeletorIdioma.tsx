"use client";

import { useIdioma } from "@/i18n/idioma";

/** Botões EN / PT, em forma de pílula. Usado em todos os cabeçalhos (apresentação, login e plataforma). */
export function SeletorIdioma({ className = "", escuro = false }: { className?: string; escuro?: boolean }) {
  const { idioma, trocar } = useIdioma();
  return (
    <div
      className={`inline-flex shrink-0 rounded-full p-0.5 text-xs font-semibold ${escuro ? "bg-white/10" : "bg-sunken ring-1 ring-inset ring-line"} ${className}`}
      role="group"
      aria-label="Language"
    >
      {(["pt", "en"] as const).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => trocar(i)}
          aria-pressed={idioma === i}
          lang={i}
          className={`min-h-9 rounded-full px-3 uppercase transition sm:min-h-8 sm:px-2.5 ${
            idioma === i
              ? escuro
                ? "bg-white text-brand-900 shadow-sm"
                : "bg-card text-ink shadow-sm ring-1 ring-line"
              : escuro
                ? "text-white/70 hover:text-white"
                : "text-muted hover:text-ink"
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}
