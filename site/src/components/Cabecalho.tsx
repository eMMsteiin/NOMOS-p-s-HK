"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIdioma } from "@/i18n/idioma";
import { LogotipoNomos } from "./Marca";
import { MOSTRAR } from "@/lib/recursos";

export function Cabecalho() {
  const { t, idioma, trocar } = useIdioma();
  const rota = usePathname();
  const links = [
    { href: "/", rotulo: t.nav.atlas, ativo: rota === "/" || rota.startsWith("/plants"), selo: "" },
    { href: "/track-record", rotulo: t.nav.track, ativo: rota.startsWith("/track-record"), selo: "" },
    { href: "/method", rotulo: t.nav.method, ativo: rota.startsWith("/method"), selo: "" },
    ...(MOSTRAR.abaVerificar ? [{ href: "/verify", rotulo: t.verify.nav, ativo: rota.startsWith("/verify"), selo: "" }] : []),
    // O Laboratório (simulação) fica no lugar da antiga aba "Verificar"; /verify faz parte dele
    { href: "/lab", rotulo: t.nav.lab, ativo: rota.startsWith("/lab") || (!MOSTRAR.abaVerificar && rota.startsWith("/verify")), selo: t.nav.labBadge },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      {/* No celular, o menu desce para uma segunda linha; a partir de "sm" fica tudo numa linha só */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
          <LogotipoNomos className="text-[1.75rem]" />
          <span aria-hidden className="hidden h-5 w-px bg-line lg:block" />
          <span className="hidden text-sm text-muted lg:inline">{t.nav.tagline}</span>
        </Link>
        <nav className="order-last flex w-full items-center gap-1 text-sm sm:order-none sm:ml-auto sm:w-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-md px-2.5 py-2.5 sm:py-1.5 ${l.ativo ? "bg-ink text-white" : "text-muted hover:bg-line/60 hover:text-ink"}`}
            >
              {l.rotulo}
              {l.selo && (
                // No celular o selo fica sobre o canto da aba (não ocupa largura); a partir de "sm" fica ao lado do nome
                <span className="absolute -right-1 -top-2 rounded bg-wait-soft px-1 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide text-wait sm:static sm:ml-1.5 sm:align-middle">
                  {l.selo}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 overflow-hidden rounded-md border border-line text-xs font-medium sm:ml-0" role="group" aria-label="Language">
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
      </div>
    </header>
  );
}
