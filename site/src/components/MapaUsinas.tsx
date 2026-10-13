"use client";

// Mapa com Leaflet + OpenStreetMap, controlado diretamente (sem react-leaflet).
//
// Por quê: com Cache Components, o Next.js não desmonta a página ao navegar; ele a esconde
// (React <Activity>) e, na volta, roda os efeitos de novo sobre o MESMO elemento. O react-leaflet
// não suporta isso ("Map container is being reused"). Aqui o mapa é criado no efeito e destruído
// com map.remove() na limpeza, então pode ser recriado quantas vezes for preciso.
//
// O mapa só é recriado quando muda o CONJUNTO de usinas. Mudanças de cor, tamanho e dica (por exemplo ao
// passar o mouse numa linha da tabela) só atualizam os círculos que já existem, sem piscar.
import L from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useIdioma } from "@/i18n/idioma";
import { ROTAS } from "@/lib/rotas";

export type PontoMapa = {
  id: string;
  nome: string;
  tipo: "eolica" | "solar";
  lat: number;
  lon: number;
  capacidade_mw: number;
  /** 0 a 1: quanto o círculo é preenchido (null = sem dado). Pode ser a chance prevista ou o aproveitamento relativo. */
  chance: number | null;
  /** Texto da dica ao passar o mouse: janela, chance, energia. */
  rotulo: string;
};

const COR = { eolica: "#1d6fb8", solar: "#d97706" } as const;
const TINTA = "#0e1c17";

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const raio = (p: PontoMapa, ativo: boolean) => 7 + Math.sqrt(p.capacidade_mw) / 2.2 + (ativo ? 2.5 : 0);

function estilo(p: PontoMapa, ativo: boolean): L.CircleMarkerOptions {
  return {
    radius: raio(p, ativo),
    color: ativo ? TINTA : "#ffffff",
    weight: ativo ? 3 : 2.5,
    fillColor: COR[p.tipo],
    fillOpacity: p.chance === null ? 0.35 : 0.4 + p.chance * 0.5,
  };
}

export default function MapaUsinas({
  pontos,
  selecionado,
  destaque = null,
  legenda = true,
  notaLegenda,
}: {
  pontos: PontoMapa[];
  selecionado?: string;
  /** Usina em destaque (por exemplo, a linha da tabela sob o mouse). */
  destaque?: string | null;
  legenda?: boolean;
  notaLegenda?: string;
}) {
  const { t } = useIdioma();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const marcadores = useRef(new Map<string, L.CircleMarker>());
  const pontosAtuais = useRef(pontos);
  // O mapa só é refeito quando muda o conjunto de usinas
  const chaveIds = pontos.map((p) => p.id).join("|");

  // 1. Guarda os pontos mais recentes para o efeito que cria o mapa (que só roda quando o conjunto muda)
  useEffect(() => {
    pontosAtuais.current = pontos;
  }, [pontos]);

  // 2. Cria o mapa e os círculos
  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    const iniciais = pontosAtuais.current;
    const circulos = marcadores.current;
    const mapa = L.map(div, { scrollWheelZoom: false, attributionControl: true, zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);

    for (const p of iniciais) {
      const m = L.circleMarker([p.lat, p.lon], estilo(p, false))
        .bindTooltip(`<strong>${escapar(p.nome)}</strong><br/>${escapar(p.rotulo)}`, { direction: "top", offset: [0, -raio(p, false)], className: "dica-nomos" })
        .on("click", () => router.push(ROTAS.usina(p.id)))
        .addTo(mapa);
      circulos.set(p.id, m);
    }

    // Enquadra as usinas; refaz quando a área muda de tamanho (e ignora quando a página está escondida)
    const limites = L.latLngBounds(iniciais.map((p) => [p.lat, p.lon] as [number, number]));
    const enquadrar = () => {
      if (!div.offsetWidth || !div.offsetHeight) return;
      mapa.invalidateSize();
      if (iniciais.length === 1) mapa.setView(limites.getCenter(), 7);
      else mapa.fitBounds(limites, { padding: [36, 36] });
    };
    const observador = new ResizeObserver(enquadrar);
    observador.observe(div);
    enquadrar();

    return () => {
      observador.disconnect();
      mapa.remove();
      circulos.clear();
    };
  }, [chaveIds, router]);

  // 3. Atualiza o visual dos círculos que já existem
  useEffect(() => {
    for (const p of pontos) {
      const m = marcadores.current.get(p.id);
      if (!m) continue;
      const ativo = p.id === selecionado || p.id === destaque;
      m.setStyle(estilo(p, ativo));
      m.setRadius(raio(p, ativo));
      m.setTooltipContent(`<strong>${escapar(p.nome)}</strong><br/>${escapar(p.rotulo)}`);
      if (ativo) m.bringToFront();
    }
  }, [pontos, selecionado, destaque, chaveIds]);

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-line">
      <div ref={ref} className="absolute inset-0" role="application" aria-label={t.panel.mapTitle} />
      {legenda && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-card/95 px-2.5 py-1.5 text-xs text-ink-2 shadow-card ring-1 ring-line">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: COR.eolica }} />
            {t.common.wind}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: COR.solar }} />
            {t.common.solar}
          </span>
          <span className="text-muted">{notaLegenda ?? t.panel.mapLegend}</span>
        </div>
      )}
    </div>
  );
}
