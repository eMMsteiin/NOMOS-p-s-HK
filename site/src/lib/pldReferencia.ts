import { PLD_PISO_2026, type Atlas } from "./tipos";
import type { PldRef } from "./calculadora";

/** PLD de referência da calculadora: a média do Nordeste ponderada pela energia cortada; se faltar, o piso regulatório. */
export function pldDeReferencia(pld: Atlas["pld"]): PldRef {
  const piso = pld.piso_2026_rs_mwh ?? PLD_PISO_2026;
  const medio = pld.cruzamento?.pld_medio_ponderado_rs_mwh ?? pld.valor_rs_mwh ?? piso;
  return { medio, piso };
}
