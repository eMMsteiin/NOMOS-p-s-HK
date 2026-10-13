"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";
import { LogotipoNomos } from "./Marca";
import { SeletorIdioma } from "./SeletorIdioma";

/** Cabeçalho da apresentação: âncoras para as seções e os botões de entrar e de cadastro. */
export function CabecalhoLanding() {
  const { t } = useIdioma();
  const n = t.landing.nav;
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link href={ROTAS.inicio} className="flex items-center whitespace-nowrap" aria-label="Nomos">
          <LogotipoNomos className="text-[1.75rem]" />
        </Link>
        <nav className="ml-4 hidden items-center gap-1 text-sm md:flex">
          {[
            ["#dor", n.pain],
            ["#como-funciona", n.how],
            ["#transparencia", n.trust],
          ].map(([href, rotulo]) => (
            <a key={href} href={href} className="rounded-md px-2.5 py-1.5 text-muted hover:bg-line/60 hover:text-ink">
              {rotulo}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SeletorIdioma />
          <Link href={ROTAS.entrar} className="hidden rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-line/60 sm:inline-block">
            {n.signIn}
          </Link>
          <Link href={ROTAS.entrar} className="rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white hover:bg-ink/90 sm:text-sm">
            {n.signUp}
          </Link>
        </div>
      </div>
    </header>
  );
}
