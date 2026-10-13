"use client";

import { useEffect } from "react";
import { cenarioDaBusca, definirCenario } from "@/lib/cenario";

/**
 * Quando alguém abre um link com cenário (?mw=10&h=8&i=8), guarda esse cenário e tira os parâmetros do endereço,
 * para que, ao recarregar, valha o que a pessoa escolher depois e não o do link.
 */
export function SementeDoCenario() {
  useEffect(() => {
    const parte = cenarioDaBusca(window.location.search);
    if (!parte) return;
    definirCenario(parte);
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
  }, []);
  return null;
}
