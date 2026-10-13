import type { MetadataRoute } from "next";

// Permite "Adicionar à tela inicial" no celular e no tablet: abre como app, sem a barra do navegador
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nomos",
    short_name: "Nomos",
    description: "Atlas aberto do corte de energia eólica e solar no Nordeste do Brasil.",
    lang: "pt-BR",
    start_url: "/app",
    display: "standalone",
    background_color: "#f8f7f2",
    theme_color: "#f8f7f2",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
