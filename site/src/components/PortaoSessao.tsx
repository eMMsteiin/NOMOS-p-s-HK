"use client";

// Guarda da plataforma: com o login do Google ligado, quem não entrou é levado ao /login e volta para a página que queria.
// No modo "aberto" (sem login configurado) não faz nada.
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROTAS } from "@/lib/rotas";
import { useSessao } from "@/lib/sessao";

export function PortaoSessao({ children }: { children: ReactNode }) {
  const { modo, usuario, carregando } = useSessao();
  const rota = usePathname();
  const router = useRouter();
  const bloqueado = modo === "google" && !usuario;

  useEffect(() => {
    if (bloqueado && !carregando) router.replace(`${ROTAS.entrar}?from=${encodeURIComponent(rota)}`);
  }, [bloqueado, carregando, rota, router]);

  if (bloqueado) return <div aria-hidden className="h-96 animate-pulse rounded-2xl bg-line/50" />;
  return <>{children}</>;
}
