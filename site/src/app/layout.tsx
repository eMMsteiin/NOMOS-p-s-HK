import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader, Outfit } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { PularParaConteudo } from "@/components/PularParaConteudo";
import { ProvedorIdioma } from "@/i18n/idioma";
import { SessaoProvider } from "@/lib/sessao";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Fonte do logotipo "noMos" (geométrica, como a da logo do time)
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400"] }); // traço igual ao da logo (medido)
// Serifa dos títulos grandes: dá o tom de relatório sério. "opsz" ajusta o desenho ao tamanho da letra.
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"], display: "swap" });

// O endereço público do site (a Vercel informa na hora de publicar) serve para a imagem de pré-visualização do link
const ENDERECO = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3100";

export const metadata: Metadata = {
  metadataBase: new URL(ENDERECO),
  title: { default: "Nomos — onde instalar ao lado de uma usina eólica ou solar", template: "%s" },
  description:
    "Quanta energia limpa sobra ao lado de cada usina do Nordeste e quanto uma carga sua aproveitaria. Dados oficiais do ONS e da CCEE; estimativas do passado, não garantia. Open atlas of curtailed wind and solar power in Brazil.",
  applicationName: "Nomos",
  openGraph: {
    type: "website",
    siteName: "Nomos",
    locale: "pt_BR",
    title: "Nomos — onde instalar ao lado de uma usina eólica ou solar",
    description: "Quanta energia limpa sobra ao lado de cada usina do Nordeste e quanto uma carga sua aproveitaria. Dados oficiais do ONS e da CCEE.",
  },
  twitter: { card: "summary_large_image" },
};

// Celular, tablet e computador: largura do aparelho, área do entalhe (notch) e cor da barra do navegador
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f7f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ProvedorIdioma>
          <SessaoProvider>
            <PularParaConteudo />
            {children}
          </SessaoProvider>
        </ProvedorIdioma>
      </body>
    </html>
  );
}
