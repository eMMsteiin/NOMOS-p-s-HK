"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";
import { REPOSITORIO } from "@/lib/tipos";
import { LogotipoNomos } from "./Marca";

/** Rodapé. Na apresentação (variante "landing") é uma faixa escura com mais informação; na plataforma, uma linha discreta. */
export function Rodape({ variante = "plataforma" }: { variante?: "landing" | "plataforma" }) {
  const { t } = useIdioma();
  const f = t.footer;

  if (variante === "plataforma") {
    return (
      <footer className="nao-imprimir border-t border-line bg-paper pb-24 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs leading-relaxed text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>{f.data}</p>
          <p>
            {f.team}{" "}
            <a href={REPOSITORIO} className="underline decoration-line-strong underline-offset-2 hover:text-ink" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <LogotipoNomos className="text-[2rem] text-white" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200/80">{f.tagline}</p>
          <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-100 ring-1 ring-inset ring-white/15">{f.version}</p>
        </div>
        <nav aria-label={f.platform}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">{f.platform}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href={ROTAS.entrar} className="text-brand-100 hover:text-white hover:underline">
                {f.signIn}
              </Link>
            </li>
            <li>
              <a href="#como-funciona" className="text-brand-100 hover:text-white hover:underline">
                {t.landing.nav.how}
              </a>
            </li>
            <li>
              <a href="#transparencia" className="text-brand-100 hover:text-white hover:underline">
                {t.landing.nav.trust}
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">{f.about}</h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-200/80">{f.data}</p>
          <a href={REPOSITORIO} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-brand-100 underline decoration-white/30 underline-offset-2 hover:text-white">
            GitHub
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-brand-200/70 sm:px-6">{f.team}</p>
      </div>
    </footer>
  );
}
