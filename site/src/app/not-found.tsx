"use client";

import Link from "next/link";
import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";
import { CabecalhoSimples } from "@/components/CabecalhoSimples";

// Página 404 do Nomos (a padrão do Next fica preta quando o sistema do visitante está no modo escuro)
export default function NotFound() {
  const { t } = useIdioma();
  return (
    <>
      <CabecalhoSimples />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-cut">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t.notFound.title}</h1>
        <p className="mt-3 text-muted">{t.notFound.text}</p>
        <Link href={ROTAS.inicio} className="mt-6 inline-block rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white">
          {t.notFound.back}
        </Link>
      </main>
    </>
  );
}
