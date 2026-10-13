# Atlas (site do Vento Cortado)

Site em Next.js 16 + TypeScript + Tailwind. Abre em português quando o navegador está em português e em inglês nos demais casos, com um botão EN/PT.

O site segue um fluxo: **apresentação → login → plataforma**.

| Página | O que mostra |
| --- | --- |
| `/` | **Apresentação (landing)**: um exemplo com dados reais (perfil por hora de uma usina, com o horário da carga em destaque), o tamanho da sobra, a dor, como o Nomos ajuda em três passos, para quem é, transparência (três níveis de evidência), perguntas frequentes e os botões de cadastro. Pública |
| `/login` | **Login** com o Google. Hoje o login com o Google ainda não está ligado: o botão leva direto à plataforma (a tela avisa). Tudo passa por `src/lib/sessao.tsx`, o único arquivo que muda quando o login real for ligado |
| `/app` | **Onde instalar** (entrada da plataforma): informe a sua carga uma vez (MW, horas por dia, início; fica guardado no aparelho e pode ir num link) e veja as usinas de destaque ordenadas por quanta energia cortada essa carga teria encontrado, com o mapa ligado à tabela; depois, as janelas previstas por dia e os gráficos de "por que acontece" |
| `/app/plants/[id]` | Detalhe de cada usina: a **calculadora de carga** (feita no navegador, com os dados já carregados) com a resposta em uma frase, um gráfico por hora e ações para copiar o resumo, copiar o link do cenário, enviar no WhatsApp ou imprimir; janelas previstas, por que é cortada, mapa de calor mês × hora, histórico com o veredito do ONS e teste retroativo |
| `/app/track-record` | Placar público: resultado ao vivo, modelo contra uma regra ingênua, razões do corte, comparação de modelos, calibração e impressões digitais (SHA-256) |
| `/app/method` | O que é real, estimado e simulado; glossário; dados abertos para baixar; limitações |
| `/app/lab` | **Laboratório (simulação)**: a demonstração de reserva (escolha de usina e janela; Reservar e Replay só existem aqui), um ciclo completo de exemplo e a lista do que é simulado. Não é o produto |
| `/app/verify?tx=…` | Parte do Laboratório: a comprovação pública de uma reserva simulada, lida da Solana devnet. Sem transação, explica a si mesma |

Os endereços antigos (`/plants/…`, `/track-record`, `/method`, `/lab`, `/verify`) redirecionam para os novos (veja `next.config.ts`). Todos os links internos estão em `src/lib/rotas.ts`.

## Design

A linguagem visual e os porquês (público, princípios, cores, tipografia, componentes) estão em [`../docs/design-publico-alvo.md`](../docs/design-publico-alvo.md). Em resumo:

- **Tokens** (cores, fontes, sombras) ficam em `src/app/globals.css`; botões, selos, cartões e notas em `src/components/ui.tsx`; ícones em `Icones.tsx`; gráficos (SVG próprio, com balão e versão em tabela) em `Graficos.tsx`.
- **Balões de explicação:** acrescente o termo ao bloco `glossary` de `src/i18n/dicionarios.ts` (nas duas línguas) e use `<Termo k="chave">` ou `<Termo k="chave" soIcone />`; ele também aparece no glossário da página Método.
- **Cenário** (MW, horas, início): `src/lib/cenario.ts`; leia com `useCenario()`. Um link com `?mw=10&h=8&i=8` preenche o cenário.
- **Pré-visualização do link** (WhatsApp, LinkedIn): `src/app/opengraph-image.tsx`; o endereço do site vem da variável `VERCEL_PROJECT_PRODUCTION_URL` da Vercel.

## Dados

O site não calcula nada no servidor (a calculadora de carga roda no navegador, com os dados já carregados): lê `src/data/atlas.json` e serve os arquivos de `public/data/`, ambos gerados por:

```bash
python dados/scripts/atlas.py
```

(rodar na raiz do repositório, depois de `dados/scripts/etapa1.py`). Não edite `atlas.json` à mão.

Os textos das duas línguas ficam em `src/i18n/dicionarios.ts`.

### Preço da energia (PLD)

A CCEE bloqueia download automático, então o PLD horário é baixado pelo navegador:

1. Em [dadosabertos.ccee.org.br](https://dadosabertos.ccee.org.br), abra o conjunto **PLD horário** e baixe o CSV do ano (ex.: `pld_horario_2026.csv`).
2. Salve em `dados/ccee/` (na raiz do repositório).
3. Rode `python dados/scripts/atlas.py`.

Com o arquivo, o valor das janelas usa o PLD do Nordeste hora a hora e o site mostra o cruzamento preço × corte. Sem ele, usa o piso de 2026 (R$ 57,31/MWh) como premissa declarada.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento, em http://localhost:3000
npm run build    # compilação de produção
npm run start    # serve a compilação
```

Mapa: Leaflet com OpenStreetMap (sem chave de API). Localização das usinas: `dados/config/localizacao_usinas.json` (aproximada, por município).
