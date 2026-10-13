"use client";

// Tela de login: segunda parada do fluxo (apresentação → login → plataforma).
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";
import { destinoSeguro, useSessao } from "@/lib/sessao";
import { Icone, type NomeIcone } from "./Icones";
import { LogotipoNomos } from "./Marca";
import { SeletorIdioma } from "./SeletorIdioma";
import { Nota } from "./ui";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Logotipo "G" do Google (cores oficiais), para o botão de login. */
function IconeGoogle() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Login() {
  const { t } = useIdioma();
  const l = t.login;
  const { modo, usuario, erro, entrar } = useSessao();
  const router = useRouter();
  const destino = destinoSeguro(useSearchParams().get("from"));
  // Quem já está logado vai direto para a plataforma
  useEffect(() => {
    if (modo === "google" && usuario) router.replace(destino);
  }, [modo, usuario, destino, router]);
  const pontos = l.panelPoints as { icon: string; title: string; text: string }[];

  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      {/* Painel de apresentação: só em telas largas; no celular os mesmos pontos aparecem abaixo do cartão */}
      <aside className="relative hidden overflow-hidden bg-brand-950 text-white lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div aria-hidden className="fundo-pontos-claro pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-brand-600/30 blur-3xl" />
        <Link href={ROTAS.inicio} className="relative w-fit rounded-md" aria-label="Nomos">
          <LogotipoNomos className="text-[2rem] text-white" />
        </Link>
        <div className="relative">
          <h2 className="max-w-md font-display text-[2.6rem] font-medium leading-[1.08] tracking-tight xl:text-5xl">{l.panelTitle}</h2>
          <ul className="mt-10 space-y-6">
            {pontos.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200 ring-1 ring-inset ring-white/15">
                  <Icone nome={p.icon as NomeIcone} className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{p.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-brand-100/75">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-200/70">{l.panelFoot}</p>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:justify-end">
          <Link href={ROTAS.inicio} className="rounded-md lg:hidden" aria-label="Nomos">
            <LogotipoNomos className="text-[1.75rem]" />
          </Link>
          <SeletorIdioma />
        </header>
        <main id="conteudo" className="flex flex-1 items-center justify-center px-4 pb-12 pt-4 sm:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-line bg-card p-6 shadow-lift sm:p-8">
              <h1 className="font-display text-[2rem] font-medium leading-tight tracking-tight text-ink">{l.title}</h1>
              <p className="mt-2 text-ink-2">{l.lead}</p>
              <button
                type="button"
                onClick={() => entrar(destino)}
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-white px-4 py-3 text-[0.9375rem] font-semibold text-ink shadow-card transition hover:bg-sunken active:translate-y-px"
              >
                <IconeGoogle />
                {l.google}
              </button>
              {erro && (
                <Nota tom="aviso" className="mt-5">
                  {l.error}
                </Nota>
              )}
              {modo === "aberto" && (
                <Nota tom="neutro" className="mt-5">
                  {l.testNote}
                </Nota>
              )}
              <p className="mt-5 text-xs leading-relaxed text-muted">{l.fine}</p>
              <div className="mt-6 flex flex-col gap-1 border-t border-line pt-4 text-sm">
                <Link href={ROTAS.inicio} className="rounded-md py-1.5 font-medium text-ink-2 hover:text-ink hover:underline">
                  {l.back}
                </Link>
                <Link href={`${ROTAS.inicio}#como-funciona`} className="rounded-md py-1.5 text-muted hover:text-ink hover:underline">
                  {l.more}
                </Link>
              </div>
            </div>

            {/* No celular, os pontos do painel aparecem aqui embaixo */}
            <ul className="mt-8 space-y-4 lg:hidden">
              {pontos.map((p) => (
                <li key={p.title} className="flex gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                    <Icone nome={p.icon as NomeIcone} className="size-[1.1rem]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{p.title}</p>
                    <p className="text-sm leading-relaxed text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
