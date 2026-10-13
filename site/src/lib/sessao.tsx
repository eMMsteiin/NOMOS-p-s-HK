"use client";

// Sessão do visitante: quem entrou e como entrar e sair.
// HOJE o login com o Google ainda não está ligado: o modo é "aberto" (a plataforma abre para todos e o botão
// de entrar leva direto a ela). Quando o login real for ligado, só este arquivo muda: o resto do site só usa
// useSessao() e não sabe de onde vem o login.
import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { ROTAS } from "./rotas";

export type Usuario = { nome: string | null; email: string | null; foto: string | null };

type Sessao = {
  modo: "aberto" | "google";
  usuario: Usuario | null;
  entrar: (destino?: string | null) => void;
  sair: () => void;
};

/** Só aceita destinos dentro da plataforma: evita mandar o visitante para outro site depois do login. */
export function destinoSeguro(destino: string | null | undefined): string {
  return destino && /^\/app(\/|\?|#|$)/.test(destino) ? destino : ROTAS.plataforma;
}

const Contexto = createContext<Sessao>({ modo: "aberto", usuario: null, entrar: () => {}, sair: () => {} });

export function SessaoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const valor = useMemo<Sessao>(
    () => ({
      modo: "aberto",
      usuario: null,
      entrar: (destino) => router.replace(destinoSeguro(destino)),
      sair: () => router.push(ROTAS.inicio),
    }),
    [router],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export const useSessao = () => useContext(Contexto);
