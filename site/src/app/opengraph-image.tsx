import { ImageResponse } from "next/og";
import { atlas } from "@/lib/atlas";
import { perfilHorario } from "@/lib/calculadora";

// Imagem de pré-visualização do link (WhatsApp, LinkedIn, e-mail): o que aparece quando alguém recebe o endereço do site.
// Usa dados reais: o desenho das barras é o perfil por hora de uma usina de destaque, com o horário das 8h às 16h em destaque.
export const alt = "Nomos: onde instalar ao lado de uma usina eólica ou solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem() {
  const usina = atlas.usinas.find((u) => u.id === "CJU_BASAR") ?? atlas.usinas[0];
  const perfil = perfilHorario(usina);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #001c15 0%, #032e24 55%, #0b5a45 100%)",
          color: "#ffffff",
        }}
      >
        {/* logotipo: "no", o símbolo e "os" */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>no</div>
          <svg width="46" height="45" viewBox="-1 -1 195 190" style={{ margin: "0 6px" }}>
            <path d="M8.75 178.25V8.75L168 172q16.5 14 16.5-6V8.75L99 101.3" fill="none" stroke="#ffffff" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 64, lineHeight: 1 }}>os</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 74, lineHeight: 1.06, letterSpacing: -2 }}>A energia limpa está sobrando no Nordeste.</div>
          <div style={{ fontSize: 40, lineHeight: 1.2, marginTop: 24, color: "#80d1b5" }}>Descubra quanto dela caberia na sua operação.</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 26, color: "#b1e7d5" }}>
            <div>Dados oficiais do ONS e da CCEE</div>
            <div style={{ marginTop: 6, color: "#80d1b5" }}>Estimativas do passado, não garantia</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            {perfil.map((v, h) => (
              <div
                key={h}
                style={{
                  width: 14,
                  marginLeft: 6,
                  height: Math.max(10, Math.round(v * 150)),
                  borderRadius: 4,
                  background: h >= 8 && h < 16 ? "#4fb492" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
