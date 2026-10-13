// Formatação de números e datas por idioma. Sem dados: pode ser usado no navegador.

export const num = (x: number, locale: string, casas = 0) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: casas, minimumFractionDigits: casas }).format(x);

export const pct = (x: number, locale: string, casas = 0) =>
  new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: casas, minimumFractionDigits: casas }).format(x);

export const reais = (x: number, locale: string, compacto = false) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: compacto ? 1 : 0,
    notation: compacto ? "compact" : "standard",
  }).format(x);

/** Data ISO (AAAA-MM-DD) sem fuso: evita que o dia "volte um" a oeste de Greenwich. */
export const dataCurta = (iso: string, locale: string, comAno = false) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    ...(comAno ? { year: "numeric" } : {}),
    weekday: comAno ? undefined : "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(a, m - 1, d)));
};

export const energia = (mwh: number, locale: string) =>
  mwh >= 1000 ? `${num(mwh / 1000, locale, 1)} GWh` : `${num(mwh, locale)} MWh`;

/** "08:00–16:00" para um horário de `horas` horas a partir de `inicio`; "24 h" quando não para nunca. */
export const faixaDeHorario = (inicio: number, horas: number) => {
  if (horas >= 24) return "24 h";
  const hh = (h: number) => `${String(((h % 24) + 24) % 24).padStart(2, "0")}:00`;
  return `${hh(inicio)}–${hh(inicio + horas)}`;
};

/** Soma de uma série de 24 horas entre `de` e `ate` (horas inteiras, `ate` exclusivo). Útil para "x% entre 8h e 15h". */
export const somaEntreHoras = (serie: number[], de: number, ate: number) => serie.slice(de, ate).reduce((a, b) => a + b, 0);

export const cor = (tipo: "eolica" | "solar") => (tipo === "eolica" ? "var(--color-wind)" : "var(--color-sun)");
