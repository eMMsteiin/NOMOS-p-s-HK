"use client";

// Balão de explicação para os termos técnicos (PLD, MWh, ENE…). Abre ao tocar, ao passar o mouse ou com o teclado.
// O balão usa posição "fixed" para não ser cortado por tabelas e cartões com rolagem.
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useIdioma } from "@/i18n/idioma";
import type { ChaveGlossario } from "@/i18n/dicionarios";
import { Icone } from "./Icones";

const LARGURA = 320;
const MARGEM = 12;

export function Termo({ k, children, soIcone = false, className = "" }: { k: ChaveGlossario; children?: ReactNode; soIcone?: boolean; className?: string }) {
  const { t } = useIdioma();
  const g = t.glossary[k];
  const id = useId();
  const botao = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; largura: number } | null>(null);

  const abrir = useCallback(() => {
    const r = botao.current?.getBoundingClientRect();
    if (!r) return;
    const largura = Math.min(LARGURA, window.innerWidth - 2 * MARGEM);
    const left = Math.max(MARGEM, Math.min(r.left, window.innerWidth - largura - MARGEM));
    setPos({ top: r.bottom + 8, left, largura });
  }, []);
  const fechar = useCallback(() => setPos(null), []);

  useEffect(() => {
    if (!pos) return;
    const fora = (e: Event) => {
      if (!botao.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest?.("[data-termo-balao]")) fechar();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [pos, fechar]);

  return (
    <span className={`relative inline ${className}`}>
      <button
        ref={botao}
        type="button"
        aria-expanded={pos !== null}
        aria-describedby={pos ? id : undefined}
        aria-label={soIcone ? g.term : undefined}
        onClick={() => (pos ? fechar() : abrir())}
        onPointerEnter={(e) => e.pointerType === "mouse" && abrir()}
        onPointerLeave={(e) => e.pointerType === "mouse" && fechar()}
        className={
          soIcone
            ? "-my-1 ml-1 inline-flex size-6 items-center justify-center rounded-full align-middle text-faint hover:bg-line/70 hover:text-ink-2"
            : "cursor-help rounded-sm underline decoration-faint decoration-dotted decoration-2 underline-offset-[5px] hover:decoration-brand-600"
        }
      >
        {soIcone ? <Icone nome="info" className="size-4" /> : children ?? g.term}
      </button>
      {pos && (
        <span
          id={id}
          role="tooltip"
          data-termo-balao
          style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.largura }}
          className="z-50 rounded-xl border border-line bg-card p-3.5 text-left text-[0.8125rem] font-normal normal-case leading-relaxed tracking-normal text-ink-2 shadow-pop"
        >
          <span className="block font-semibold text-ink">{g.term}</span>
          {g.def}
        </span>
      )}
    </span>
  );
}
