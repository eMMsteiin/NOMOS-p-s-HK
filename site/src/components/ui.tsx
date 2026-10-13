// Peças básicas de interface do Nomos: botão, selo, cartão, número em destaque, nota e cabeçalho de página.
// Não usam estado nem idioma, então servem tanto em componentes de servidor quanto do navegador.
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icone, type NomeIcone } from "./Icones";

// ---------- Botão ----------

type VarianteBotao = "primario" | "secundario" | "fantasma" | "claro" | "contornoClaro";
type TamanhoBotao = "sm" | "md" | "lg";

const BASE_BOTAO =
  "items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";
const VARIANTES: Record<VarianteBotao, string> = {
  primario: "bg-brand-700 text-white shadow-[0_1px_2px_rgb(3_46_36/0.35),inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-brand-800",
  secundario: "border border-line-strong bg-card text-ink shadow-card hover:bg-sunken",
  fantasma: "text-ink-2 hover:bg-line/60 hover:text-ink",
  claro: "bg-white text-brand-900 shadow-[0_1px_2px_rgb(0_0_0/0.25)] hover:bg-brand-50",
  contornoClaro: "border border-white/35 text-white hover:bg-white/10",
};
const TAMANHOS: Record<TamanhoBotao, string> = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export function classesBotao(variante: VarianteBotao = "primario", tamanho: TamanhoBotao = "md", extra = "") {
  // "hidden" (esconder no celular) precisa vencer o "inline-flex" padrão: duas classes de display na mesma lista não se resolvem sozinhas
  const exibicao = /(^|\s)hidden(\s|$)/.test(extra) ? "" : "inline-flex";
  return `${exibicao} ${BASE_BOTAO} ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${extra}`;
}

type ComunsBotao = {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  icone?: NomeIcone;
  iconeDireita?: NomeIcone;
  className?: string;
  children: ReactNode;
};
type PropsComoLink = ComunsBotao & { href: string } & Omit<ComponentProps<"a">, keyof ComunsBotao | "href">;
type PropsComoBotao = ComunsBotao & { href?: undefined } & Omit<ComponentProps<"button">, keyof ComunsBotao>;

/** Botão. Com `href` vira link (interno com o roteador do Next, externo ou âncora com <a>). */
export function Botao(props: PropsComoLink | PropsComoBotao) {
  const { variante = "primario", tamanho = "md", icone, iconeDireita, className = "", children, ...resto } = props;
  const classes = classesBotao(variante, tamanho, className);
  const conteudo = (
    <>
      {icone && <Icone nome={icone} className="size-[1.1em]" />}
      {children}
      {iconeDireita && <Icone nome={iconeDireita} className="size-[1.1em]" />}
    </>
  );
  if (props.href !== undefined) {
    const { href, ...atributos } = resto as Omit<ComponentProps<"a">, "href"> & { href: string };
    const externo = /^https?:/.test(href);
    if (externo || href.startsWith("#")) {
      return (
        <a href={href} className={classes} {...(externo ? { target: "_blank", rel: "noreferrer" } : {})} {...atributos}>
          {conteudo}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...atributos}>
        {conteudo}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...(resto as ComponentProps<"button">)}>
      {conteudo}
    </button>
  );
}

// ---------- Selo (etiqueta pequena) ----------

export type TomSelo = "neutro" | "marca" | "eolica" | "solar" | "ok" | "aviso" | "critico" | "simulacao" | "escuro";
const TONS: Record<TomSelo, string> = {
  neutro: "bg-sunken text-ink-2 ring-line",
  marca: "bg-brand-50 text-brand-800 ring-brand-200",
  eolica: "bg-wind-soft text-wind-ink ring-wind/20",
  solar: "bg-sun-soft text-sun-ink ring-sun/25",
  ok: "bg-ok-soft text-ok ring-ok-mark/25",
  aviso: "bg-warn-soft text-warn ring-warn-mark/40",
  critico: "bg-crit-soft text-crit ring-crit-mark/25",
  simulacao: "bg-sim-soft text-sim ring-sim-mark/25",
  escuro: "bg-white/10 text-brand-100 ring-white/20",
};

/** Etiqueta pequena. Por padrão não quebra linha; com `quebra` o texto pode ocupar mais de uma linha (para frases longas no celular). */
export function Selo({ tom = "neutro", icone, children, className = "", quebra = false }: { tom?: TomSelo; icone?: NomeIcone; children: ReactNode; className?: string; quebra?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${quebra ? "rounded-2xl py-1.5 leading-snug" : "whitespace-nowrap rounded-full py-1 leading-none"} px-2.5 text-xs font-medium ring-1 ring-inset ${TONS[tom]} ${className}`}
    >
      {icone && <Icone nome={icone} className="size-3.5" />}
      {children}
    </span>
  );
}

// ---------- Cartão ----------

export function Cartao({
  children,
  className = "",
  id,
  semPreenchimento = false,
  tom = "padrao",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  semPreenchimento?: boolean;
  tom?: "padrao" | "suave" | "escuro";
}) {
  const fundo = tom === "escuro" ? "border-brand-800 bg-brand-900 text-white" : tom === "suave" ? "border-line bg-sunken" : "border-line bg-card shadow-card";
  // "p-0" na lista de classes também tira o espaçamento (o que as páginas antigas já faziam)
  const semEspaco = semPreenchimento || /(^|\s)p-0(\s|$)/.test(className);
  return (
    <section id={id} className={`rounded-2xl border ${fundo} ${semEspaco ? "" : "p-5 sm:p-6"} ${className}`}>
      {children}
    </section>
  );
}

// ---------- Número em destaque ----------

/** Um número grande com o que ele significa. Número sozinho usa as figuras normais da fonte (não tabulares). */
export function Numero({
  valor,
  rotulo,
  destaque = false,
  nota,
  className = "",
}: {
  valor: string;
  rotulo: ReactNode;
  destaque?: boolean;
  nota?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5 ${className}`}>
      <div className={`text-[1.75rem] font-semibold leading-none tracking-tight sm:text-4xl ${destaque ? "text-brand-700" : "text-ink"}`}>{valor}</div>
      <div className="mt-2 text-sm leading-snug text-ink-2">{rotulo}</div>
      {nota && <div className="mt-1 text-xs leading-snug text-muted">{nota}</div>}
    </div>
  );
}

// ---------- Nota (caixa de aviso ou explicação) ----------

type TomNota = "neutro" | "ok" | "aviso" | "simulacao" | "marca";
const TONS_NOTA: Record<TomNota, { caixa: string; icone: string; nome: NomeIcone }> = {
  neutro: { caixa: "border-line bg-sunken", icone: "text-muted", nome: "info" },
  marca: { caixa: "border-brand-200 bg-brand-50", icone: "text-brand-700", nome: "info" },
  ok: { caixa: "border-ok-mark/30 bg-ok-soft", icone: "text-ok", nome: "escudo" },
  aviso: { caixa: "border-warn-mark/50 bg-warn-soft", icone: "text-warn", nome: "alerta" },
  simulacao: { caixa: "border-sim-mark/30 bg-sim-soft", icone: "text-sim", nome: "frasco" },
};

export function Nota({ tom = "neutro", titulo, icone, children, className = "" }: { tom?: TomNota; titulo?: ReactNode; icone?: NomeIcone; children: ReactNode; className?: string }) {
  const t = TONS_NOTA[tom];
  return (
    <div className={`flex gap-3 rounded-xl border p-4 text-sm ${t.caixa} ${className}`} role={tom === "aviso" ? "note" : undefined}>
      <Icone nome={icone ?? t.nome} className={`mt-0.5 size-[1.15rem] ${t.icone}`} />
      <div className="min-w-0 leading-relaxed text-ink-2">
        {titulo && <div className="font-semibold text-ink">{titulo}</div>}
        {children}
      </div>
    </div>
  );
}

// ---------- Cabeçalho de página e de seção ----------

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.14em] text-brand-700 ${className}`}>{children}</p>;
}

/** Cabeçalho de página da plataforma: etiqueta, título em serifa, frase de apoio e, à direita, ações. */
export function CabecalhoPagina({ eyebrow, titulo, lead, children, className = "" }: { eyebrow?: ReactNode; titulo: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <header className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-4 ${className}`}>
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-2 font-display text-[2rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-[2.5rem]">{titulo}</h1>
        {lead && <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">{lead}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

export function TituloSecao({ titulo, lead, eyebrow, className = "" }: { titulo: ReactNode; lead?: ReactNode; eyebrow?: ReactNode; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">{titulo}</h2>
      {lead && <p className="mt-2 leading-relaxed text-ink-2">{lead}</p>}
    </div>
  );
}
