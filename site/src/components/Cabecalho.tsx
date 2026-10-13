"use client";

// Navegação da plataforma (depois do login). No computador: barra no topo. No celular: barra no topo enxuta
// e uma barra de abas fixa na parte de baixo da tela, como nos aplicativos.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIdioma } from "@/i18n/idioma";
import { MOSTRAR } from "@/lib/recursos";
import { ROTAS } from "@/lib/rotas";
import { useSessao } from "@/lib/sessao";
import { Icone, type NomeIcone } from "./Icones";
import { LogotipoNomos } from "./Marca";
import { SeletorIdioma } from "./SeletorIdioma";

type Item = { href: string; rotulo: string; icone: NomeIcone; ativo: boolean; selo?: string };

export function Cabecalho() {
  const { t } = useIdioma();
  const { sair } = useSessao();
  const rota = usePathname();
  const itens: Item[] = [
    { href: ROTAS.plataforma, rotulo: t.nav.atlas, icone: "pino", ativo: rota === ROTAS.plataforma || rota.startsWith(ROTAS.usina("")) },
    { href: ROTAS.placar, rotulo: t.nav.track, icone: "alvo", ativo: rota.startsWith(ROTAS.placar) },
    { href: ROTAS.metodo, rotulo: t.nav.method, icone: "livro", ativo: rota.startsWith(ROTAS.metodo) },
    ...(MOSTRAR.abaVerificar ? [{ href: ROTAS.verificar, rotulo: t.verify.nav, icone: "escudo" as const, ativo: rota.startsWith(ROTAS.verificar) }] : []),
    // O Laboratório (simulação) fica no lugar da antiga aba "Verificar"; /app/verify faz parte dele
    {
      href: ROTAS.laboratorio,
      rotulo: t.nav.lab,
      icone: "frasco",
      ativo: rota.startsWith(ROTAS.laboratorio) || (!MOSTRAR.abaVerificar && rota.startsWith(ROTAS.verificar)),
      selo: t.nav.labBadge,
    },
  ];

  return (
    <>
      <header className="nao-imprimir sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href={ROTAS.plataforma} className="flex items-center whitespace-nowrap rounded-md" aria-label="Nomos">
            <LogotipoNomos className="text-[1.75rem]" />
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Menu">
            {itens.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                aria-current={i.ativo ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                  i.ativo ? "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-100" : "text-ink-2 hover:bg-line/60 hover:text-ink"
                }`}
              >
                <Icone nome={i.icone} className="size-[1.1rem]" />
                {i.rotulo}
                {i.selo && <span className="rounded-full bg-sim-soft px-1.5 py-0.5 text-[10px] font-semibold leading-none text-sim">{i.selo}</span>}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <SeletorIdioma />
            <button
              type="button"
              onClick={sair}
              className="flex min-h-9 items-center gap-2 rounded-xl px-2.5 text-sm font-medium text-ink-2 transition hover:bg-line/60 hover:text-ink md:px-3"
              aria-label={t.nav.signOut}
            >
              <Icone nome="sair" className="size-[1.1rem]" />
              <span className="hidden md:inline">{t.nav.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Abas fixas na parte de baixo (celular e tablet pequeno) */}
      <nav
        className="nao-imprimir fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Menu"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around">
          {itens.map((i) => (
            <li key={i.href} className="flex-1">
              <Link
                href={i.href}
                aria-current={i.ativo ? "page" : undefined}
                className={`relative flex min-h-[3.75rem] flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium leading-none transition ${
                  i.ativo ? "text-brand-700" : "text-muted hover:text-ink"
                }`}
              >
                {i.ativo && <span aria-hidden className="absolute inset-x-5 top-0 h-0.5 rounded-b-full bg-brand-700" />}
                <span className="relative">
                  <Icone nome={i.icone} className="size-[1.4rem]" />
                  {i.selo && <span aria-hidden className="absolute -right-1 -top-0.5 size-2 rounded-full bg-sim-mark ring-2 ring-card" />}
                </span>
                <span className="max-w-full truncate">{i.rotulo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
