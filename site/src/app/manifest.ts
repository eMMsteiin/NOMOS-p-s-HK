import type { MetadataRoute } from "next";

// Permite "Adicionar à tela inicial" no celular e no tablet: abre como app, sem a barra do navegador
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nomos",
    short_name: "Nomos",
    description: "Open atlas of the wind and solar power curtailed in Brazil's Northeast.",
    start_url: "/app",
    display: "standalone",
    background_color: "#f6f7f4",
    theme_color: "#f6f7f4",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
