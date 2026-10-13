"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";
import { LogotipoNomos } from "./Marca";
import { SeletorIdioma } from "./SeletorIdioma";
import { Botao } from "./ui";

/** Cabeçalho da apresentação: âncoras para as seções e os botões de entrar e de cadastro. */
export function CabecalhoLanding() {
  const { t } = useIdioma();
  const n = t.landing.nav;
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link href={ROTAS.inicio} className="flex items-center whitespace-nowrap rounded-md" aria-label="Nomos">
          <LogotipoNomos className="text-[1.75rem]" />
        </Link>
        <nav className="ml-6 hidden items-center gap-0.5 text-sm font-medium md:flex" aria-label="Menu">
          {[
            ["#problema", n.problem],
            ["#como-funciona", n.how],
            ["#para-quem", n.who],
            ["#transparencia", n.trust],
          ].map(([href, rotulo]) => (
            <a key={href} href={href} className="rounded-lg px-3 py-2 text-ink-2 transition hover:bg-line/60 hover:text-ink">
              {rotulo}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SeletorIdioma />
          <Botao href={ROTAS.entrar} variante="fantasma" className="hidden sm:inline-flex">
            {n.signIn}
          </Botao>
          {/* no celular um botão só, curto; a partir de "sm" entram "Entrar" e "Quero me cadastrar" */}
          <Botao href={ROTAS.entrar} className="sm:hidden">
            {n.signIn}
          </Botao>
          <Botao href={ROTAS.entrar} className="hidden sm:inline-flex">
            {n.signUp}
          </Botao>
        </div>
      </div>
    </header>
  );
}
