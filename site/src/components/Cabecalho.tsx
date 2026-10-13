"use client";

// Cabeçalho da plataforma (depois do login): menu, idioma e o botão de sair.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIdioma } from "@/i18n/idioma";
import { MOSTRAR } from "@/lib/recursos";
import { ROTAS } from "@/lib/rotas";
import { useSessao } from "@/lib/sessao";
import { LogotipoNomos } from "./Marca";
import { SeletorIdioma } from "./SeletorIdioma";

export function Cabecalho() {
  const { t } = useIdioma();
  const { sair } = useSessao();
  const rota = usePathname();
  const links = [
    { href: ROTAS.plataforma, rotulo: t.nav.atlas, ativo: rota === ROTAS.plataforma || rota.startsWith(ROTAS.usina("")), selo: "" },
    { href: ROTAS.placar, rotulo: t.nav.track, ativo: rota.startsWith(ROTAS.placar), selo: "" },
    { href: ROTAS.metodo, rotulo: t.nav.method, ativo: rota.startsWith(ROTAS.metodo), selo: "" },
    ...(MOSTRAR.abaVerificar ? [{ href: ROTAS.verificar, rotulo: t.verify.nav, ativo: rota.startsWith(ROTAS.verificar), selo: "" }] : []),
    // O Laboratório (simulação) fica no lugar da antiga aba "Verificar"; /app/verify faz parte dele
    {
      href: ROTAS.laboratorio,
      rotulo: t.nav.lab,
      ativo: rota.startsWith(ROTAS.laboratorio) || (!MOSTRAR.abaVerificar && rota.startsWith(ROTAS.verificar)),
      selo: t.nav.labBadge,
    },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      {/* No celular, o menu desce para uma segunda linha; a partir de "sm" fica tudo numa linha só */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href={ROTAS.plataforma} className="flex items-center gap-3 whitespace-nowrap">
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
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <SeletorIdioma />
          <button type="button" onClick={sair} className="rounded-md px-2.5 py-2.5 text-xs font-medium text-muted hover:bg-line/60 hover:text-ink sm:py-1.5">
            {t.nav.signOut}
          </button>
        </div>
      </div>
    </header>
  );
}
