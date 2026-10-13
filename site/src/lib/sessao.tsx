"use client";

// Sessão do visitante: quem entrou e como entrar e sair.
// Com as variáveis NEXT_PUBLIC_FIREBASE_* configuradas na Vercel, o login com o Google é de verdade (Firebase
// Authentication, direto no navegador: sem rota /api e sem segredo). Sem elas, o modo é "aberto": a plataforma abre
// para todos e o botão de entrar leva direto a ela. O resto do site só usa useSessao().
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { carregarAuth, loginGoogleLigado } from "./firebase";
import { ROTAS } from "./rotas";

export type Usuario = { nome: string | null; email: string | null; foto: string | null };

type Sessao = {
  modo: "aberto" | "google";
  usuario: Usuario | null;
  /** No modo Google: ainda não sabemos se há alguém logado (o Firebase está lendo a sessão salva). */
  carregando: boolean;
  /** Mensagem do último erro de login, se houve. */
  erro: string | null;
  entrar: (destino?: string | null) => void;
  sair: () => void;
};

/** Só aceita destinos dentro da plataforma: evita mandar o visitante para outro site depois do login. */
export function destinoSeguro(destino: string | null | undefined): string {
  return destino && /^\/app(\/|\?|#|$)/.test(destino) ? destino : ROTAS.plataforma;
}

const Contexto = createContext<Sessao>({ modo: "aberto", usuario: null, carregando: false, erro: null, entrar: () => {}, sair: () => {} });

export function SessaoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(loginGoogleLigado);
  const [erro, setErro] = useState<string | null>(null);

  // Acompanha quem está logado (o Firebase guarda a sessão no navegador)
  useEffect(() => {
    if (!loginGoogleLigado) return;
    let cancelado = false;
    let parar = () => {};
    carregarAuth()
      .then(({ auth, onAuthStateChanged }) => {
        if (cancelado) return;
        parar = onAuthStateChanged(auth, (u) => {
          setUsuario(u ? { nome: u.displayName, email: u.email, foto: u.photoURL } : null);
          setCarregando(false);
        });
      })
      .catch(() => setCarregando(false));
    return () => {
      cancelado = true;
      parar();
    };
  }, []);

  const valor = useMemo<Sessao>(
    () => ({
      modo: loginGoogleLigado ? "google" : "aberto",
      usuario,
      carregando,
      erro,
      entrar: (destino) => {
        const alvo = destinoSeguro(destino);
        if (!loginGoogleLigado) return router.replace(alvo);
        setErro(null);
        carregarAuth()
          .then(({ auth, GoogleAuthProvider, signInWithPopup }) => signInWithPopup(auth, new GoogleAuthProvider()))
          .then(() => router.replace(alvo))
          .catch((e: { code?: string }) => {
            // fechar a janela do Google não é erro
            if (e?.code !== "auth/popup-closed-by-user" && e?.code !== "auth/cancelled-popup-request") setErro(e?.code ?? "erro");
          });
      },
      sair: () => {
        if (!loginGoogleLigado) return router.push(ROTAS.inicio);
        carregarAuth()
          .then(({ auth, signOut }) => signOut(auth))
          .finally(() => router.push(ROTAS.inicio));
      },
    }),
    [router, usuario, carregando, erro],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export const useSessao = () => useContext(Contexto);
