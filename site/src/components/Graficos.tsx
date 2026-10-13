"use client";

// Gráficos do Nomos, desenhados em SVG sem biblioteca. Seguem as regras de visualização de dados do projeto:
// marcas finas, grade em fio, texto em cor de texto (nunca na cor da série), legenda sempre que há 2 ou mais séries,
// balão com os valores ao passar o mouse/dedo ou com as setas do teclado, e uma versão em tabela de cada gráfico.
// A largura é medida na tela, então o texto dos eixos fica legível também no celular.
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useIdioma } from "@/i18n/idioma";
import { faixaDeHorario, num, pct } from "@/lib/formato";
import { Icone } from "./Icones";
import { Termo } from "./Termo";

// ---------- cores (as de tipo foram validadas com validate_palette: azul e âmbar, ΔE ≥ 23 para daltônicos) ----------
const COR = {
  marca: "var(--color-brand-600)",
  marcaForte: "var(--color-brand-800)",
  contexto: "#cfd4d0", // o que não é o foco: horas fora do horário, parte elétrica do corte
  neutro: "#6b7a73", // uma série que não é nem vento nem sol nem corte (preço)
  vento: "var(--color-wind)",
  sol: "var(--color-sun)",
  grade: "var(--color-line)",
  eixo: "var(--color-line-strong)",
  fundo: "var(--color-card)",
};

/** Cores e ordem das razões do corte (códigos do ONS). A parte de sobra de energia (ENE) é o destaque; as elétricas ficam em cinza. */
export const COR_RAZAO: Record<string, string> = { ENE: COR.marca, CNF: "#8f9c95", REL: "#b3bcb7", PAR: "#b3bcb7", sem: "#d4d9d6" };
export const ORDEM_RAZAO = ["ENE", "CNF", "REL", "PAR", "sem"];

// ---------- peças comuns ----------

/** Largura do contêiner, medida no navegador. No servidor vale `inicial`. */
function useLargura(inicial = 640): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(inicial);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setW(Math.max(240, Math.round(el.getBoundingClientRect().width)));
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, w];
}

/** Qual coluna está em foco: pelo mouse ou dedo (sobre a área do gráfico) e pelas setas do teclado. */
function useAtivo(n: number) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const mover = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setAtivo(Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * n))));
  };
  const teclar = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setAtivo((a) => Math.min(n - 1, (a ?? -1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setAtivo((a) => Math.max(0, (a ?? n) - 1));
    } else if (e.key === "Escape") setAtivo(null);
  };
  return {
    ativo,
    sobreposicao: {
      onPointerMove: mover,
      onPointerDown: mover,
      onPointerLeave: (e: PointerEvent<SVGRectElement>) => e.pointerType === "mouse" && setAtivo(null),
      style: { touchAction: "pan-y" as const },
    },
    teclado: { tabIndex: 0, onKeyDown: teclar, onBlur: () => setAtivo(null) },
  };
}

type LinhaDica = { cor?: string; rotulo: string; valor: string };

/** Balão com os valores: o valor em destaque e o nome da série ao lado; cada série com um traço curto da sua cor. */
function Dica({ x, y, largura, titulo, linhas, nota }: { x: number; y: number; largura: number; titulo: string; linhas: LinhaDica[]; nota?: string }) {
  const meia = 96;
  const cx = Math.max(meia, Math.min(largura - meia, x));
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 w-max max-w-[200px] -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-lift"
      style={{ left: cx, top: Math.max(0, y - 8) }}
    >
      <div className="font-medium text-ink-2">{titulo}</div>
      {linhas.map((l) => (
        <div key={l.rotulo} className="mt-1 flex items-center gap-2">
          {l.cor && <span className="h-0.5 w-3 shrink-0 rounded" style={{ background: l.cor }} />}
          <span className="tabular font-semibold text-ink">{l.valor}</span>
          <span className="text-muted">{l.rotulo}</span>
        </div>
      ))}
      {nota && <div className="mt-1 text-[11px] text-muted">{nota}</div>}
    </div>
  );
}

type ItemLegenda = { cor: string; rotulo: ReactNode; forma?: "quadrado" | "linha" | "contorno" };

function Legenda({ itens }: { itens: ItemLegenda[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
      {itens.map((i, k) => (
        <li key={k} className="flex items-center gap-1.5">
          {i.forma === "linha" ? (
            <span className="h-0.5 w-3.5 rounded" style={{ background: i.cor }} />
          ) : i.forma === "contorno" ? (
            <span className="size-3 rounded-[3px] border-2" style={{ borderColor: i.cor }} />
          ) : (
            <span className="size-2.5 rounded-[3px]" style={{ background: i.cor }} />
          )}
          {i.rotulo}
        </li>
      ))}
    </ul>
  );
}

/** A versão em tabela do gráfico: o equivalente acessível, também para quem prefere ler os números. */
function VistaTabela({ cabecalho, linhas }: { cabecalho: string[]; linhas: (string | number)[][] }) {
  const { t } = useIdioma();
  return (
    <details className="abre nao-imprimir mt-3 text-xs">
      <summary className="inline-flex items-center gap-1.5 rounded-md py-1 font-medium text-muted hover:text-ink">
        <Icone nome="dados" className="size-3.5" />
        {t.charts.table}
      </summary>
      <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-line">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-sunken text-muted">
            <tr>
              {cabecalho.map((c) => (
                <th key={c} className="px-3 py-1.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={i} className="border-t border-line">
                {l.map((v, j) => (
                  <td key={j} className="tabular px-3 py-1.5">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** Retângulo com o canto de cima arredondado (4 px) e a base reta, colada na linha de base. */
function colunaArredondada(x: number, y: number, w: number, h: number, r = 4) {
  if (h <= 0) return "";
  const raio = Math.min(r, h, w / 2);
  return `M${x} ${y + h}V${y + raio}Q${x} ${y} ${x + raio} ${y}H${x + w - raio}Q${x + w} ${y} ${x + w} ${y + raio}V${y + h}Z`;
}

const hh = (h: number) => `${h}h`;

// ---------- 1. Em que horas esta usina costuma ser cortada (calculadora e abertura) ----------

/** Chance média de corte em cada hora do dia, com o horário da carga em destaque (o resto fica em cinza). */
export function PerfilHorario({
  perfil,
  inicio,
  horas,
  melhor,
  altura = 200,
  legenda = true,
}: {
  perfil: number[];
  inicio: number;
  horas: number;
  melhor?: { inicio: number; horas: number } | null;
  altura?: number;
  legenda?: boolean;
}) {
  const { t } = useIdioma();
  const L = t.locale;
  const [ref, W] = useLargura(520);
  const { ativo, sobreposicao, teclado } = useAtivo(24);
  const esq = 38, dir = 6, topo = 14, base = altura - 48;
  const passo = (W - esq - dir) / 24;
  const larg = Math.min(24, passo * 0.68);
  const y = (v: number) => base - v * (base - topo);
  const cx = (h: number) => esq + h * passo + passo / 2;
  const naJanela = new Set(Array.from({ length: Math.min(24, horas) }, (_, i) => (inicio + i) % 24));
  const naMelhor = melhor ? new Set(Array.from({ length: Math.min(24, melhor.horas) }, (_, i) => (melhor.inicio + i) % 24)) : null;
  const passoRotulo = W >= 520 ? 3 : 6;

  // trechos contínuos do horário (pode atravessar a meia-noite, então são até dois)
  const trechos = (set: Set<number>) => {
    const r: [number, number][] = [];
    let a: number | null = null;
    for (let h = 0; h <= 24; h++) {
      if (h < 24 && set.has(h)) a ??= h;
      else if (a !== null) {
        r.push([a, h]);
        a = null;
      }
    }
    return r;
  };
  const trechosJanela = trechos(naJanela);
  const maiorTrecho = trechosJanela.reduce((m, x) => (x[1] - x[0] > m[1] - m[0] ? x : m), trechosJanela[0] ?? [0, 0]);
  const rotuloHorario = `${t.charts.yourSchedule} · ${faixaDeHorario(inicio, horas)}`;
  // o rótulo fica centrado no trecho; se o trecho for curto, alinha pela borda para o texto não sair do gráfico
  const largTrecho = maiorTrecho[1] - maiorTrecho[0];
  const centroTrecho = esq + ((maiorTrecho[0] + maiorTrecho[1]) / 2) * passo;
  const ancora = largTrecho >= 6 ? "middle" : maiorTrecho[0] < 12 ? "start" : "end";
  const xRotulo = ancora === "middle" ? Math.max(esq + 80, Math.min(W - dir - 80, centroTrecho)) : ancora === "start" ? esq + maiorTrecho[0] * passo : esq + maiorTrecho[1] * passo;

  return (
    <figure>
      <div ref={ref} className="relative" {...teclado} role="group" aria-label={t.charts.hourProfile}>
        <svg width={W} height={altura} className="block max-w-full" role="img" aria-label={`${t.charts.hourProfile}. ${rotuloHorario}`}>
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={esq} x2={W - dir} y1={y(v)} y2={y(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <text x={esq - 8} y={y(v) + 4} textAnchor="end" fontSize="11" className="fill-muted">
                {v * 100}%
              </text>
            </g>
          ))}
          {ativo !== null && <rect x={esq + ativo * passo} y={topo} width={passo} height={base - topo} fill="var(--color-sunken)" />}
          {perfil.map((v, h) => (
            <path key={h} d={colunaArredondada(cx(h) - larg / 2, y(v), larg, base - y(v))} fill={naJanela.has(h) ? COR.marca : COR.contexto} />
          ))}
          {naMelhor &&
            trechos(naMelhor).map(([a, b]) => (
              <rect key={a} x={esq + a * passo + 1} y={topo - 4} width={(b - a) * passo - 2} height={base - topo + 8} rx={6} fill="none" stroke={COR.marcaForte} strokeWidth={1.5} />
            ))}
          {perfil.map((_, h) =>
            h % passoRotulo === 0 ? (
              <text key={h} x={cx(h)} y={base + 15} textAnchor="middle" fontSize="11" className="fill-muted">
                {hh(h)}
              </text>
            ) : null,
          )}
          {/* o horário da carga, em chave sob o eixo */}
          {trechosJanela.map(([a, b]) => (
            <line key={a} x1={esq + a * passo + 2} x2={esq + b * passo - 2} y1={base + 26} y2={base + 26} stroke={COR.marcaForte} strokeWidth={2} strokeLinecap="round" />
          ))}
          {maiorTrecho[1] > maiorTrecho[0] && (
            <text x={xRotulo} y={base + 42} textAnchor={ancora} fontSize="11" fontWeight={600} className="fill-brand-800">
              {rotuloHorario}
            </text>
          )}
          <rect x={esq} y={topo} width={W - esq - dir} height={base - topo} fill="transparent" {...sobreposicao} />
        </svg>
        {ativo !== null && (
          <Dica
            x={cx(ativo)}
            y={y(perfil[ativo])}
            largura={W}
            titulo={`${hh(ativo)}–${hh((ativo + 1) % 24)}`}
            linhas={[{ cor: naJanela.has(ativo) ? COR.marca : COR.contexto, rotulo: t.charts.cutTime, valor: pct(perfil[ativo], L) }]}
            nota={naJanela.has(ativo) ? t.charts.insideSchedule : undefined}
          />
        )}
      </div>
      {legenda && (
        <Legenda
          itens={[
            { cor: COR.marca, rotulo: t.charts.insideSchedule },
            { cor: COR.contexto, rotulo: t.charts.outsideSchedule },
            ...(melhor ? [{ cor: COR.marcaForte, rotulo: `${t.charts.bestWindow} · ${faixaDeHorario(melhor.inicio, melhor.horas)}`, forma: "contorno" as const }] : []),
          ]}
        />
      )}
      <VistaTabela cabecalho={[t.charts.hour, t.charts.cutTime]} linhas={perfil.map((v, h) => [`${hh(h)}–${hh((h + 1) % 24)}`, pct(v, L)])} />
    </figure>
  );
}

// ---------- 2. Perda por hora do dia, eólica e solar (duas linhas) ----------

export function GraficoHoras({ eolica, solar, destaque = [8, 15] }: { eolica: number[]; solar: number[]; destaque?: [number, number] }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [ref, W] = useLargura(640);
  const { ativo, sobreposicao, teclado } = useAtivo(24);
  const altura = 230, esq = 40, dir = 10, topo = 16, base = altura - 30;
  const max = Math.ceil(Math.max(...eolica, ...solar) / 5) * 5;
  const passo = (W - esq - dir) / 24;
  const x = (h: number) => esq + h * passo + passo / 2;
  const y = (v: number) => base - (v / max) * (base - topo);
  const caminho = (serie: number[]) => serie.map((v, h) => `${h ? "L" : "M"}${x(h).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const passoRotulo = W >= 520 ? 3 : 6;
  const pico = (serie: number[]) => serie.reduce((m, v, h) => (v > serie[m] ? h : m), 0);

  return (
    <figure>
      <div ref={ref} className="relative" {...teclado} role="group" aria-label={t.home.hourTitle}>
        <svg width={W} height={altura} className="block max-w-full" role="img" aria-label={t.home.hourTitle}>
          <rect x={esq + destaque[0] * passo} y={topo} width={(destaque[1] - destaque[0]) * passo} height={base - topo} fill="var(--color-brand-50)" />
          <text x={esq + ((destaque[0] + destaque[1]) / 2) * passo} y={base - 8} textAnchor="middle" fontSize="11" className="fill-brand-800">
            {t.charts.peak} {hh(destaque[0])}–{hh(destaque[1])}
          </text>
          {[0, max / 2, max].map((v) => (
            <g key={v}>
              <line x1={esq} x2={W - dir} y1={y(v)} y2={y(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <text x={esq - 8} y={y(v) + 4} textAnchor="end" fontSize="11" className="fill-muted">
                {num(v, L)}%
              </text>
            </g>
          ))}
          {eolica.map((_, h) =>
            h % passoRotulo === 0 ? (
              <text key={h} x={x(h)} y={base + 18} textAnchor="middle" fontSize="11" className="fill-muted">
                {hh(h)}
              </text>
            ) : null,
          )}
          {ativo !== null && <line x1={x(ativo)} x2={x(ativo)} y1={topo} y2={base} stroke={COR.eixo} />}
          <path d={caminho(eolica)} fill="none" stroke={COR.vento} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={caminho(solar)} fill="none" stroke={COR.sol} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {/* o ponto mais alto de cada série, com o valor */}
          {([[eolica, COR.vento], [solar, COR.sol]] as const).map(([serie, cor]) => {
            const h = pico(serie);
            return (
              <g key={cor}>
                <circle cx={x(h)} cy={y(serie[h])} r={4.5} fill={cor} stroke={COR.fundo} strokeWidth={2} />
                <text x={x(h) + (cor === COR.vento ? -9 : 9)} y={y(serie[h]) - 7} textAnchor={cor === COR.vento ? "end" : "start"} fontSize="11" fontWeight={600} className="fill-ink">
                  {num(serie[h], L, 1)}%
                </text>
              </g>
            );
          })}
          {ativo !== null &&
            ([[eolica, COR.vento], [solar, COR.sol]] as const).map(([serie, cor]) => (
              <circle key={cor} cx={x(ativo)} cy={y(serie[ativo])} r={4.5} fill={cor} stroke={COR.fundo} strokeWidth={2} />
            ))}
          <rect x={esq} y={topo} width={W - esq - dir} height={base - topo} fill="transparent" {...sobreposicao} />
        </svg>
        {ativo !== null && (
          <Dica
            x={x(ativo)}
            y={Math.min(y(eolica[ativo]), y(solar[ativo]))}
            largura={W}
            titulo={`${hh(ativo)}–${hh((ativo + 1) % 24)}`}
            linhas={[
              { cor: COR.vento, rotulo: t.common.wind, valor: `${num(eolica[ativo], L, 1)}%` },
              { cor: COR.sol, rotulo: t.common.solar, valor: `${num(solar[ativo], L, 1)}%` },
            ]}
          />
        )}
      </div>
      <Legenda
        itens={[
          { cor: COR.vento, rotulo: t.common.wind, forma: "linha" },
          { cor: COR.sol, rotulo: t.common.solar, forma: "linha" },
        ]}
      />
      <VistaTabela
        cabecalho={[t.charts.hour, t.common.wind, t.common.solar]}
        linhas={eolica.map((v, h) => [`${hh(h)}–${hh((h + 1) % 24)}`, `${num(v, L, 1)}%`, `${num(solar[h], L, 1)}%`])}
      />
    </figure>
  );
}

// ---------- 3. Fração das horas com o PLD no piso, por hora do dia ----------

export function GraficoPiso({ pct: valores, destaque = [8, 15] }: { pct: number[]; destaque?: [number, number] }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [ref, W] = useLargura(640);
  const { ativo, sobreposicao, teclado } = useAtivo(24);
  const altura = 210, esq = 40, dir = 10, topo = 16, base = altura - 30;
  const passo = (W - esq - dir) / 24;
  const larg = Math.min(24, passo * 0.68);
  const y = (v: number) => base - (v / 100) * (base - topo);
  const cx = (h: number) => esq + h * passo + passo / 2;
  const passoRotulo = W >= 520 ? 3 : 6;

  return (
    <figure>
      <div ref={ref} className="relative" {...teclado} role="group" aria-label={t.home.floorTitle}>
        <svg width={W} height={altura} className="block max-w-full" role="img" aria-label={t.home.floorTitle}>
          <rect x={esq + destaque[0] * passo} y={topo} width={(destaque[1] - destaque[0]) * passo} height={base - topo} fill="var(--color-brand-50)" />
          <text x={esq + ((destaque[0] + destaque[1]) / 2) * passo} y={topo + 12} textAnchor="middle" fontSize="11" className="fill-brand-800">
            {t.charts.peak} {hh(destaque[0])}–{hh(destaque[1])}
          </text>
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <line x1={esq} x2={W - dir} y1={y(v)} y2={y(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <text x={esq - 8} y={y(v) + 4} textAnchor="end" fontSize="11" className="fill-muted">
                {v}%
              </text>
            </g>
          ))}
          {ativo !== null && <rect x={esq + ativo * passo} y={topo} width={passo} height={base - topo} fill="var(--color-sunken)" opacity={0.7} />}
          {valores.map((v, h) => (
            <g key={h}>
              <path d={colunaArredondada(cx(h) - larg / 2, y(v), larg, base - y(v))} fill={COR.neutro} />
              {h % passoRotulo === 0 && (
                <text x={cx(h)} y={base + 18} textAnchor="middle" fontSize="11" className="fill-muted">
                  {hh(h)}
                </text>
              )}
            </g>
          ))}
          <rect x={esq} y={topo} width={W - esq - dir} height={base - topo} fill="transparent" {...sobreposicao} />
        </svg>
        {ativo !== null && (
          <Dica x={cx(ativo)} y={y(valores[ativo])} largura={W} titulo={`${hh(ativo)}–${hh((ativo + 1) % 24)}`} linhas={[{ cor: COR.neutro, rotulo: t.charts.atFloor, valor: `${num(valores[ativo], L)}%` }]} />
        )}
      </div>
      <VistaTabela cabecalho={[t.charts.hour, t.charts.atFloor]} linhas={valores.map((v, h) => [`${hh(h)}–${hh((h + 1) % 24)}`, `${num(v, L)}%`])} />
    </figure>
  );
}

// ---------- 4. Potência média cortada por mês: eólica + solar empilhadas ----------

export function GraficoMensal({ meses }: { meses: { mes: string; eolica: number; solar: number }[] }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [ref, W] = useLargura(640);
  const { ativo, sobreposicao, teclado } = useAtivo(meses.length);
  const altura = 240, esq = 46, dir = 10, topo = 20, base = altura - 30;
  const max = Math.ceil(Math.max(...meses.map((m) => m.eolica + m.solar)) / 1000) * 1000;
  const passo = (W - esq - dir) / meses.length;
  const larg = Math.min(24, passo * 0.68);
  const y = (v: number) => base - (v / max) * (base - topo);
  const cx = (i: number) => esq + i * passo + passo / 2;
  const nomes = t.plant.months;
  const rotuloMes = (m: string) => `${nomes[Number(m.slice(5, 7)) - 1]}/${m.slice(2, 4)}`;
  const passoRotulo = Math.max(1, Math.ceil(meses.length / Math.max(2, Math.floor((W - esq) / 52))));
  const GAP = 2;

  return (
    <figure>
      <div ref={ref} className="relative" {...teclado} role="group" aria-label={t.home.monthTitle}>
        <svg width={W} height={altura} className="block max-w-full" role="img" aria-label={t.home.monthTitle}>
          <text x={0} y={topo - 8} fontSize="11" className="fill-muted">
            {t.common.mwAvg}
          </text>
          {[0, max / 2, max].map((v) => (
            <g key={v}>
              <line x1={esq} x2={W - dir} y1={y(v)} y2={y(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <text x={esq - 8} y={y(v) + 4} textAnchor="end" fontSize="11" className="fill-muted">
                {num(v, L)}
              </text>
            </g>
          ))}
          {ativo !== null && <rect x={esq + ativo * passo} y={topo} width={passo} height={base - topo} fill="var(--color-sunken)" opacity={0.7} />}
          {meses.map((m, i) => {
            const x0 = cx(i) - larg / 2;
            const yEol = y(m.eolica);
            const yTot = y(m.eolica + m.solar);
            return (
              <g key={m.mes}>
                <rect x={x0} y={yEol} width={larg} height={base - yEol} fill={COR.vento} />
                <path d={colunaArredondada(x0, yTot, larg, Math.max(0, yEol - GAP - yTot))} fill={COR.sol} />
                {i % passoRotulo === 0 && (
                  <text x={cx(i)} y={base + 18} textAnchor="middle" fontSize="11" className="fill-muted">
                    {rotuloMes(m.mes)}
                  </text>
                )}
              </g>
            );
          })}
          <rect x={esq} y={topo} width={W - esq - dir} height={base - topo} fill="transparent" {...sobreposicao} />
        </svg>
        {ativo !== null && (
          <Dica
            x={cx(ativo)}
            y={y(meses[ativo].eolica + meses[ativo].solar)}
            largura={W}
            titulo={rotuloMes(meses[ativo].mes)}
            linhas={[
              { cor: COR.sol, rotulo: t.common.solar, valor: `${num(meses[ativo].solar, L)} MW` },
              { cor: COR.vento, rotulo: t.common.wind, valor: `${num(meses[ativo].eolica, L)} MW` },
              { rotulo: t.charts.total, valor: `${num(meses[ativo].eolica + meses[ativo].solar, L)} MW` },
            ]}
          />
        )}
      </div>
      <Legenda
        itens={[
          { cor: COR.vento, rotulo: t.common.wind },
          { cor: COR.sol, rotulo: t.common.solar },
        ]}
      />
      <VistaTabela
        cabecalho={[t.plant.month, `${t.common.wind} (${t.common.mwAvg})`, `${t.common.solar} (${t.common.mwAvg})`]}
        linhas={meses.map((m) => [rotuloMes(m.mes), num(m.eolica, L), num(m.solar, L)])}
      />
    </figure>
  );
}

// ---------- 5. Por que a energia é cortada: uma linha por razão, com o rótulo ao lado ----------

/** Cada razão do corte numa linha: nome, parte da energia cortada e uma barra fina. A sobra de energia (ENE) é o destaque. */
export function BarraRazoes({ fracao }: { fracao: Record<string, number> }) {
  const { t } = useIdioma();
  const L = t.locale;
  const itens = ORDEM_RAZAO.filter((k) => (fracao[k] ?? 0) > 0);
  const termo = (k: string): "ene" | "cnf" | "rel" | null => (k === "ENE" ? "ene" : k === "CNF" ? "cnf" : k === "REL" ? "rel" : null);
  return (
    <ul className="space-y-3.5">
      {itens.map((k) => {
        const chave = termo(k);
        return (
          <li key={k}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 font-medium text-ink">
                {chave ? <Termo k={chave}>{t.reasons.names[k]}</Termo> : t.reasons.names[k]} <span className="font-normal text-muted">({k})</span>
              </span>
              <span className="tabular shrink-0 text-base font-semibold text-ink">{pct(fracao[k], L, fracao[k] < 0.1 ? 1 : 0)}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line" role="img" aria-label={`${t.reasons.names[k]}: ${pct(fracao[k], L)}`}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(1.5, fracao[k] * 100)}%`, background: COR_RAZAO[k] }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ---------- 6. A mistura das razões, mês a mês ----------

/** Colunas de 100%: a parte de sobra de energia (ENE) em destaque e a parte elétrica (CNF + REL) em cinza. */
export function GraficoRazoesMes({ meses }: { meses: Record<string, Record<string, number>> }) {
  const { t } = useIdioma();
  const L = t.locale;
  const lista = Object.entries(meses).sort(([a], [b]) => a.localeCompare(b));
  const [ref, W] = useLargura(640);
  const { ativo, sobreposicao, teclado } = useAtivo(lista.length);
  const altura = 230, esq = 40, dir = 10, topo = 12, base = altura - 30;
  const passo = (W - esq - dir) / lista.length;
  const larg = Math.min(34, passo * 0.7);
  const y = (v: number) => base - v * (base - topo);
  const cx = (i: number) => esq + i * passo + passo / 2;
  const nomeMes = (m: string) => t.plant.months[Number(m.slice(5, 7)) - 1];
  const GAP = 2;

  return (
    <figure>
      <div ref={ref} className="relative" {...teclado} role="group" aria-label={t.reasons.byMonth}>
        <svg width={W} height={altura} className="block max-w-full" role="img" aria-label={t.reasons.byMonth}>
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={esq} x2={W - dir} y1={y(v)} y2={y(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <text x={esq - 8} y={y(v) + 4} textAnchor="end" fontSize="11" className="fill-muted">
                {v * 100}%
              </text>
            </g>
          ))}
          {ativo !== null && <rect x={esq + ativo * passo} y={topo} width={passo} height={base - topo} fill="var(--color-sunken)" opacity={0.7} />}
          {lista.map(([mes, fr], i) => {
            const ene = fr.ENE ?? 0;
            const x0 = cx(i) - larg / 2;
            const altEne = ene * (base - topo);
            return (
              <g key={mes}>
                <rect x={x0} y={y(ene)} width={larg} height={altEne} fill={COR.marca} />
                <path d={colunaArredondada(x0, y(1), larg, Math.max(0, y(ene) - GAP - y(1)))} fill={COR.contexto} />
                {altEne >= 20 && (
                  <text x={cx(i)} y={base - 6} textAnchor="middle" fontSize="11" fontWeight={600} fill="#fff">
                    {Math.round(ene * 100)}%
                  </text>
                )}
                <text x={cx(i)} y={base + 18} textAnchor="middle" fontSize="11" className="fill-muted">
                  {nomeMes(mes)}
                </text>
              </g>
            );
          })}
          <rect x={esq} y={topo} width={W - esq - dir} height={base - topo} fill="transparent" {...sobreposicao} />
        </svg>
        {ativo !== null && (
          <Dica
            x={cx(ativo)}
            y={topo + 8}
            largura={W}
            titulo={`${nomeMes(lista[ativo][0])}/${lista[ativo][0].slice(2, 4)}`}
            linhas={ORDEM_RAZAO.filter((k) => lista[ativo][1][k]).map((k) => ({ cor: COR_RAZAO[k], rotulo: t.reasons.names[k], valor: pct(lista[ativo][1][k], L) }))}
          />
        )}
      </div>
      <Legenda
        itens={[
          { cor: COR.marca, rotulo: t.charts.surplus },
          { cor: COR.contexto, rotulo: t.charts.electrical },
        ]}
      />
      <VistaTabela
        cabecalho={[t.plant.month, t.reasons.names.ENE, t.reasons.names.CNF, t.reasons.names.REL]}
        linhas={lista.map(([mes, fr]) => [`${nomeMes(mes)}/${mes.slice(2, 4)}`, pct(fr.ENE ?? 0, L), pct(fr.CNF ?? 0, L), pct(fr.REL ?? 0, L)])}
      />
    </figure>
  );
}

// ---------- 7. Mapa de calor: chance de corte por mês e hora ----------

/** Uma escala de uma cor só (da marca): quanto mais escuro, mais vezes a usina foi cortada naquele mês e hora. */
export function MapaCalor({ calor, janela }: { calor: (number | null)[][]; janela?: { inicio: number; horas: number } }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [foco, setFoco] = useState<{ m: number; h: number; x: number; y: number; larg: number } | null>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const naJanela = janela ? new Set(Array.from({ length: Math.min(24, janela.horas) }, (_, i) => (janela.inicio + i) % 24)) : null;

  const aoPassar = (e: PointerEvent<HTMLTableElement>) => {
    const td = (e.target as HTMLElement).closest<HTMLElement>("td[data-m]");
    if (!td || !caixa.current) return setFoco(null);
    const r = td.getBoundingClientRect();
    const c = caixa.current.getBoundingClientRect();
    setFoco({ m: Number(td.dataset.m), h: Number(td.dataset.h), x: r.left - c.left + r.width / 2, y: r.top - c.top, larg: c.width });
  };
  const cor = (v: number) => `color-mix(in oklab, var(--color-brand-700) ${Math.round(v * 100)}%, #fff)`;
  const valorFoco = foco ? calor[foco.m][foco.h] : null;

  return (
    <figure>
      <div ref={caixa} className="relative">
        <div className="overflow-x-auto pb-1">
          <table
            className="w-full min-w-[520px] table-fixed border-separate border-spacing-[2px] text-[10px]"
            aria-label={t.plant.heatTitle}
            onPointerMove={aoPassar}
            onPointerLeave={() => setFoco(null)}
          >
            <thead>
              <tr>
                <th className="w-9 text-left font-normal text-muted">{t.plant.month}</th>
                {Array.from({ length: 24 }, (_, h) => (
                  <th key={h} className={`font-normal text-muted ${naJanela?.has(h) ? "border-b-2 border-brand-800" : ""}`}>
                    {h % 3 === 0 ? h : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calor.map((linha, m) => (
                <tr key={m}>
                  <td className="pr-1 text-left text-muted">{t.plant.months[m]}</td>
                  {linha.map((v, h) => (
                    <td
                      key={h}
                      data-m={m}
                      data-h={h}
                      aria-label={`${t.plant.months[m]} ${hh(h)}: ${v === null ? t.charts.noData : pct(v, L)}`}
                      className="h-5 rounded-[3px]"
                      style={{ background: v === null ? "repeating-linear-gradient(135deg, var(--color-line) 0 2px, transparent 2px 4px)" : cor(v) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {foco && (
          <Dica
            x={foco.x}
            y={foco.y}
            largura={foco.larg}
            titulo={`${t.plant.months[foco.m]} · ${hh(foco.h)}–${hh((foco.h + 1) % 24)}`}
            linhas={[{ cor: valorFoco === null ? "var(--color-line-strong)" : cor(valorFoco), rotulo: t.charts.cutTime, valor: valorFoco === null ? "—" : pct(valorFoco, L) }]}
          />
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span>0%</span>
        <div className="h-2 w-28 rounded-full" style={{ background: "linear-gradient(to right, #fff, var(--color-brand-700))", boxShadow: "inset 0 0 0 1px var(--color-line)" }} />
        <span>100%</span>
        <span className="text-faint">·</span>
        <span>{t.charts.heatLegend}</span>
        {naJanela && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-brand-800" /> {t.charts.yourSchedule}
          </span>
        )}
      </div>
    </figure>
  );
}

// ---------- 8. Calibração: chance prevista x frequência observada ----------

export function GraficoCalibracao({ faixas }: { faixas: { faixa: string; prevista: number; observada: number; n: number }[] }) {
  const { t } = useIdioma();
  const L = t.locale;
  const [ref, largura] = useLargura(320);
  const lado = Math.min(360, largura);
  const [foco, setFoco] = useState<number | null>(null);
  const m = 40, fim = 12;
  const p = (v: number) => m + v * (lado - m - fim);
  const q = (v: number) => lado - m - v * (lado - m - fim) + fim;

  return (
    <figure>
      <div ref={ref} className="relative mx-auto w-full max-w-[360px]">
        <svg width={lado} height={lado} className="block max-w-full" role="img" aria-label={t.track.calibTitle}>
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={p(0)} x2={p(1)} y1={q(v)} y2={q(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <line y1={q(0)} y2={q(1)} x1={p(v)} x2={p(v)} stroke={v === 0 ? COR.eixo : COR.grade} />
              <text x={p(v)} y={q(0) + 16} textAnchor="middle" fontSize="11" className="fill-muted">
                {v * 100}%
              </text>
              <text x={p(0) - 8} y={q(v) + 4} textAnchor="end" fontSize="11" className="fill-muted">
                {v * 100}%
              </text>
            </g>
          ))}
          <line x1={p(0)} y1={q(0)} x2={p(1)} y2={q(1)} stroke={COR.contexto} strokeWidth={1.5} />
          <text x={p(0.62)} y={q(0.62) + 18} fontSize="11" className="fill-muted" transform={`rotate(-45 ${p(0.62)} ${q(0.62) + 18})`}>
            {t.charts.perfect}
          </text>
          <polyline points={faixas.map((f) => `${p(f.prevista)},${q(f.observada)}`).join(" ")} fill="none" stroke={COR.marca} strokeWidth={2} strokeLinejoin="round" />
          {faixas.map((f, i) => (
            <g key={f.faixa} onPointerEnter={() => setFoco(i)} onPointerLeave={() => setFoco(null)} onPointerDown={() => setFoco(i)}>
              <circle cx={p(f.prevista)} cy={q(f.observada)} r={14} fill="transparent" />
              <circle cx={p(f.prevista)} cy={q(f.observada)} r={4.5} fill={COR.marca} stroke={COR.fundo} strokeWidth={2} />
            </g>
          ))}
          <text x={p(0.5)} y={lado - 4} textAnchor="middle" fontSize="11" className="fill-ink-2">
            {t.track.predicted}
          </text>
          <text x={12} y={q(0.5)} textAnchor="middle" fontSize="11" className="fill-ink-2" transform={`rotate(-90 12 ${q(0.5)})`}>
            {t.track.observed}
          </text>
        </svg>
        {foco !== null && (
          <Dica
            x={p(faixas[foco].prevista)}
            y={q(faixas[foco].observada)}
            largura={lado}
            titulo={faixas[foco].faixa}
            linhas={[
              { rotulo: t.track.predicted, valor: pct(faixas[foco].prevista, L) },
              { rotulo: t.track.observed, valor: pct(faixas[foco].observada, L) },
            ]}
            nota={`n = ${num(faixas[foco].n, L)}`}
          />
        )}
      </div>
      <VistaTabela
        cabecalho={[t.charts.range, t.track.predicted, t.track.observed, "n"]}
        linhas={faixas.map((f) => [f.faixa, pct(f.prevista, L), pct(f.observada, L), num(f.n, L)])}
      />
    </figure>
  );
}
