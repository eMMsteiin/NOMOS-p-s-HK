// Conjunto de ícones do Nomos: traço de 1,75 px, cantos arredondados, desenhados na mesma grade de 24 px.
// Todos herdam a cor do texto (currentColor). Por padrão são decorativos (aria-hidden); passe `titulo` para dar um nome.

const CAMINHOS = {
  // tipos de usina
  vento: "M12 9.5V21M9 21h6M12 9.5V2.8M12 9.5l-5.8 3.3M12 9.5l5.8 3.3",
  sol: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6",
  // ideias do produto
  raio: "M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z",
  pino: "M12 21.5s-7-6-7-11.2a7 7 0 0114 0c0 5.2-7 11.2-7 11.2zM12 7.8a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
  grafico: "M4 20.5V10M10 20.5V4M16 20.5v-7M21.5 20.5h-19",
  calculadora: "M6 3h12a1.5 1.5 0 011.5 1.5v15A1.5 1.5 0 0118 21H6a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 016 3zM8 7h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01",
  escudo: "M12 2.8l7.5 2.8v5.7c0 4.9-3.2 8.6-7.5 10-4.3-1.4-7.5-5.1-7.5-10V5.6L12 2.8zM8.8 12l2.2 2.2 4.2-4.4",
  livro: "M5 3.5h12.5a1.5 1.5 0 011.5 1.5v14.5H6.5A1.5 1.5 0 005 21V3.5zM5 18.5h14M9 8h6",
  frasco: "M9.5 3h5M10.5 3v6L5.3 18.3A2 2 0 007 21.2h10a2 2 0 001.7-2.9L13.5 9V3M8 14.5h8",
  alvo: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM12 11.5a.5.5 0 100 1 .5.5 0 000-1z",
  dados: "M12 4c4.4 0 8 1.1 8 2.5S16.4 9 12 9 4 7.9 4 6.5 7.6 4 12 4zM4 6.5v5C4 12.9 7.6 14 12 14s8-1.1 8-2.5v-5M4 11.5v5C4 17.9 7.6 19 12 19s8-1.1 8-2.5v-5",
  predio: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01",
  servidor: "M5 4h14a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0119 10H5a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 015 4zM5 14h14a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0119 20H5a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 015 14zM7.5 7h.01M7.5 17h.01",
  moeda: "M12 3a9 9 0 100 18 9 9 0 000-18zM14.8 9.2c-.5-.9-1.5-1.4-2.8-1.4-1.7 0-2.8.9-2.8 2.1 0 3 5.8 1.6 5.8 4.3 0 1.3-1.2 2.2-3 2.2-1.4 0-2.5-.6-3-1.6M12 6.5v1.3M12 16.2v1.3",
  // ações
  seta: "M4.5 12h15M13.5 5.5l6.5 6.5-6.5 6.5",
  setaEsquerda: "M19.5 12h-15M10.5 5.5L4 12l6.5 6.5",
  check: "M5 12.5l4.5 4.5L19 7",
  x: "M6 6l12 12M18 6L6 18",
  mais: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  info: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5.5M12 7.8h.01",
  alerta: "M12 3.5l9.5 16.5h-19L12 3.5zM12 10v4.5M12 17.2h.01",
  baixar: "M12 3.5v12M7 11l5 5 5-5M5 20.5h14",
  copiar: "M9 9h10.5a1 1 0 011 1v10.5a1 1 0 01-1 1H9a1 1 0 01-1-1V10a1 1 0 011-1zM16 9V4.5a1 1 0 00-1-1H4.5a1 1 0 00-1 1V15a1 1 0 001 1H8",
  link: "M10 14a4.2 4.2 0 005.9 0l3-3a4.2 4.2 0 00-5.9-5.9l-1.2 1.2M14 10a4.2 4.2 0 00-5.9 0l-3 3a4.2 4.2 0 005.9 5.9l1.2-1.2",
  externo: "M14 4.5h5.5V10M19.5 4.5L10.5 13.5M17.5 14v4.5a1 1 0 01-1 1h-11a1 1 0 01-1-1v-11a1 1 0 011-1H10",
  imprimir: "M7 8.5V3.5h10v5M7 17.5h-2a1.5 1.5 0 01-1.5-1.5v-5.5A1.5 1.5 0 015 9h14a1.5 1.5 0 011.5 1.5V16a1.5 1.5 0 01-1.5 1.5h-2M7 14h10v6.5H7V14z",
  compartilhar: "M18 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 20.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.2 13.2l7.6 4.3M15.8 6.5l-7.6 4.3",
  menu: "M4 7h16M4 12h16M4 17h16",
  sair: "M10 4.5H6a1.5 1.5 0 00-1.5 1.5v12A1.5 1.5 0 006 19.5h4M15.5 8l4 4-4 4M19.5 12h-10",
  globo: "M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 12h17M12 3c2.6 2.4 3.9 5.4 3.9 9s-1.3 6.6-3.9 9c-2.6-2.4-3.9-5.4-3.9-9S9.4 5.4 12 3z",
  relogio: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5.2l3.2 2",
  calendario: "M5 5.5h14A1.5 1.5 0 0120.5 7v12.5A1.5 1.5 0 0119 21H5a1.5 1.5 0 01-1.5-1.5V7A1.5 1.5 0 015 5.5zM3.5 10h17M8 3v4M16 3v4",
  filtro: "M4 5.5h16l-6 7.2v5.8l-4 2v-7.8L4 5.5z",
  ordenar: "M7 4.5v15M3.5 16l3.5 3.5L10.5 16M17 19.5v-15M13.5 8L17 4.5 20.5 8",
  estrela: "M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8L12 3z",
  bussola: "M12 3a9 9 0 100 18 9 9 0 000-18zM15.8 8.2l-1.9 5.7-5.7 1.9 1.9-5.7 5.7-1.9z",
  olho: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
  cadeado: "M6 10.5h12a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0118 20.5H6A1.5 1.5 0 014.5 19v-7A1.5 1.5 0 016 10.5zM8 10.5V8a4 4 0 118 0v2.5",
} as const;

export type NomeIcone = keyof typeof CAMINHOS;

export function Icone({ nome, className = "size-5", titulo }: { nome: NomeIcone; className?: string; titulo?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      <path d={CAMINHOS[nome]} />
    </svg>
  );
}

/** Ícone do tipo de usina: turbina para eólica, sol para solar. */
export function IconeTipo({ tipo, className = "size-4" }: { tipo: "eolica" | "solar"; className?: string }) {
  return <Icone nome={tipo === "eolica" ? "vento" : "sol"} className={className} />;
}
