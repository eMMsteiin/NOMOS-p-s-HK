"use client";

import Link from "next/link";
import { ROTAS } from "@/lib/rotas";
import { LogotipoNomos } from "./Marca";
import { SeletorIdioma } from "./SeletorIdioma";

/** Cabeçalho mínimo (logotipo e idioma) para as páginas fora da plataforma: 404 e erro. */
export function CabecalhoSimples() {
  return (
    <header className="border-b border-line/70 bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={ROTAS.inicio} className="flex items-center whitespace-nowrap rounded-md" aria-label="Nomos">
          <LogotipoNomos className="text-[1.75rem]" />
        </Link>
        <SeletorIdioma />
      </div>
    </header>
  );
}
