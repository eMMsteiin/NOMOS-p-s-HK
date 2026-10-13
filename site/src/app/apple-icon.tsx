import { ImageResponse } from "next/og";

// Ícone que o iPhone usa quando alguém escolhe "Adicionar à tela de início"
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icone() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#084535" }}>
        <svg width="104" height="101" viewBox="-1 -1 195 190">
          <path d="M8.75 178.25V8.75L168 172q16.5 14 16.5-6V8.75L99 101.3" fill="none" stroke="#ffffff" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
