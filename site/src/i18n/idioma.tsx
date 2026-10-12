"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { dicionarios, type Dicionario, type Idioma } from "./dicionarios";

type Contexto = { idioma: Idioma; t: Dicionario; trocar: (i: Idioma) => void };

const IdiomaContexto = createContext<Contexto>({ idioma: "en", t: dicionarios.en, trocar: () => {} });

const CHAVE = "vento-cortado-idioma";
const ouvintes = new Set<() => void>();
let memoria: Idioma | null = null; // escolha feita nesta visita; vale quando o navegador bloqueia o armazenamento

/** Sem escolha salva: português se o idioma principal do navegador for português (pt, pt-BR, pt-PT); senão, inglês. */
function doNavegador(): Idioma {
  const principal = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
  return /^pt(-|$)/.test(principal) ? "pt" : "en";
}

function ler(): Idioma {
  let salvo: string | null = null;
  try {
    salvo = localStorage.getItem(CHAVE);
  } catch {
    // sem armazenamento: vale a escolha desta visita, se houver
  }
  if (salvo === "pt" || salvo === "en") return salvo;
  return memoria ?? doNavegador();
}

function assinar(avisar: () => void) {
  ouvintes.add(avisar);
  window.addEventListener("storage", avisar); // troca feita em outra aba
  return () => {
    ouvintes.delete(avisar);
    window.removeEventListener("storage", avisar);
  };
}

function trocar(novo: Idioma) {
  memoria = novo;
  try {
    localStorage.setItem(CHAVE, novo);
  } catch {
    // sem armazenamento: a troca vale só nesta visita
  }
  ouvintes.forEach((avisar) => avisar());
}

export function ProvedorIdioma({ children }: { children: ReactNode }) {
  // O servidor sempre entrega inglês. No navegador vale a escolha salva do visitante; sem escolha salva,
  // abre em português se o navegador estiver em português e em inglês nos demais casos.
  const idioma = useSyncExternalStore(assinar, ler, () => "en" as const);

  useEffect(() => {
    document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";
  }, [idioma]);

  return <IdiomaContexto.Provider value={{ idioma, t: dicionarios[idioma], trocar }}>{children}</IdiomaContexto.Provider>;
}

export const useIdioma = () => useContext(IdiomaContexto);
