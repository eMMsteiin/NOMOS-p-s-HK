# Tudo o que mudou em relação ao projeto original do Guilherme

Documento geral, em português simples, de **tudo o que foi feito nesta cópia (`eMMsteiin/nomos-v2`) desde o projeto que o Guilherme entregou**. Escrito em 13/10/2026, a partir do histórico do Git.

- **Ponto de partida (o projeto do Guilherme):** o último commit dele é o `10cd1b8` ("Atualização diária: dados do ONS até 2026-10-10", de 11/10/2026). Tudo antes disso é dele (e do `business-plan.md` inicial, criado pelo Stein).
- **Hoje:** `main` e a branch `design` estão em `1130920`, publicadas no GitHub.
- **Tamanho da mudança:** 76 arquivos alterados, cerca de 6.700 linhas adicionadas e 1.100 removidas (sem contar os arquivos de dados). São 21 commits novos (de `2862461` a `1130920`).

---

## 1. Como era o projeto do Guilherme (a base)

Um projeto de hackathon chamado **Vento Cortado / Nomos**, em 5 etapas:

1. **Dados e previsão (Python):** baixa os dados oficiais do ONS (energia eólica e solar cortada, a cada meia hora), calcula a chance de corte por usina, mês e hora, faz um teste retroativo (agosto e setembro) e prevê "janelas" de corte para os próximos 8 dias.
2. **Atlas (o site):** site em Next.js, em português e inglês, com mapa, janelas previstas, gráficos e o preço da energia (PLD da CCEE).
3. **Compra de janelas:** botão **Reservar** que paga em USDC (moeda de teste, rede devnet da Solana), dividindo o valor entre usina (70%), operador (25%) e plataforma (5%).
4. **Recibo e verificação:** recibo em duas fases e página **Verificar** que lê a blockchain.
5. **Operador de IA e atualização diária:** um programa que roda um trabalho pequeno de IA dentro da janela comprada e uma rotina automática (GitHub Actions) que atualiza os dados todo dia.

O site tinha 5 páginas (início, usina, placar, método, verificar), e a ideia central era **"mercado de janelas de energia cortada"**: o Nomos intermediaria a reserva dessa energia.

---

## 2. A mudança de ideia (o mais importante)

Descobrimos que o Nomos **não deve vender nada**. A nova premissa, escrita no `CLAUDE.md`:

> **O Nomos NÃO vende nada: é uma ferramenta de informação para decidir onde instalar ou expandir uma unidade ao lado de uma usina. O modelo de negócio é hipótese, não validada.**

Exemplo do dia a dia: em vez de ser a "corretora" que vende o ingresso, o Nomos virou o **guia que mostra onde está o show mais barato e lotado**, para a empresa decidir onde montar a sua unidade.

Consequências práticas:
- A pergunta do site passou a ser: **"se eu instalar X MW de carga ao lado desta usina, quanto corte eu teria aproveitado?"**
- A reserva em USDC, o recibo e o operador de IA viraram **"visão futura, simulada"** e foram para uma página separada (o Laboratório).
- Passamos a escrever regras de honestidade (o que nunca dizer e o que sempre deixar claro).
- Medimos que **o modelo de previsão hoje empata com uma regra ingênua** ("o corte acontece nas horas em que a usina costuma ser cortada"). O valor do projeto está no histórico, na calculadora e na transparência, e isso passou a ser dito no site.

---

## 3. O que mudou, por assunto

### 3.1 Funções novas (o que o site passou a fazer)

| Novidade | O que é |
| --- | --- |
| **Calculadora de carga junto à usina** | Em cada usina: informe MW, horas por dia e horário de início e veja as horas de corte por mês, a energia que a carga teria aproveitado e um valor de referência (não é preço). Mostra a divisão entre sobra de energia (ENE) e corte elétrico (CNF+REL), o melhor horário de início, e explica a regra da Aneel (REN 1.170/2026) **só pelo que o texto diz**. |
| **"Onde instalar"** (`/app`) | Nova página de entrada: o visitante informa a carga **uma vez** e vê as 8 usinas de destaque **ordenadas** por energia aproveitável (ou horas, valor, parte previsível), com mapa ligado à tabela e a opção "melhor horário de cada usina". |
| **Cenário que viaja** | A carga escolhida fica guardada no aparelho e pode ir num link (`?mw=10&h=8&i=8`), para mandar a conta pronta a outra pessoa. |
| **Resumo para levar à conversa** | Botões **Copiar resumo**, **Copiar link do cenário**, **Enviar no WhatsApp** e **Imprimir / salvar em PDF**. |
| **Comparação com a regra ingênua** | O Placar passou a mostrar, nas mesmas janelas ao vivo, o erro do modelo contra a regra ingênua, o resultado usina por usina e o tamanho da amostra em dias. Resultado honesto: **empate**. |
| **Corte por tipo** | Os três tipos de corte do ONS (ENE sobra de energia, CNF confiabilidade da rede, REL linha ou equipamento fora) explicados, com quanto a previsão captura de cada um e a nota sobre ressarcimento (Lei 15.269/2025). |
| **Fluxo em 3 paradas** | **Apresentação** (`/`) → **Login** (`/login`) → **Plataforma** (`/app`). O botão "Continuar com o Google" **ainda não está ligado de verdade**: leva direto à plataforma e a tela avisa. Fica tudo preparado em um único arquivo (`sessao.tsx`) para ligar depois. |
| **Aviso de dados antigos** | Faixa amarela quando os dados têm 3 dias ou mais (hoje aparece, porque a atualização diária desta cópia está parada). |
| **Idioma automático** | O site abre em português se o navegador estiver em português; senão, em inglês. |
| **Balões de explicação e glossário** | Termos como PLD, MWh, ENE, CNF, REL, janela e chance explicam-se ao tocar ou passar o mouse; o glossário completo está na página Método. |
| **Páginas 404 e de erro** | Próprias, no estilo do site (a padrão do Next ficava preta). |
| **Pré-visualização do link** | Ao colar o endereço no WhatsApp aparece título, descrição e uma imagem (feita com dados reais). |
| **Funciona em celular e tablet** | Tabelas viram cartões, campos sem zoom no iPhone, área segura de notch, instalável na tela inicial. |

### 3.2 O que saiu do caminho principal (nada foi apagado)

- Botões **Reservar** e **Replay**, "horas de GPU", o bloco roxo "Visão futura" e a aba **Verificar** foram **escondidos** por interruptores em `site/src/lib/recursos.ts` (para mostrar de novo, troque `false` por `true`).
- A reserva simulada vive agora numa página própria, o **Laboratório** (`/app/lab`), com selo "simulação" no menu, a lista do que é simulado e o ciclo de exemplo de 08/10. A página Verificar faz parte dele.
- O trecho do Método sobre Pix, operador e reserva por janela foi substituído por um aviso que aponta para o Laboratório.

### 3.3 Endereços (rotas)

| Antes (Guilherme) | Agora |
| --- | --- |
| `/` (início com mapa e janelas) | `/` = **apresentação**; o antigo início virou `/app` ("Onde instalar") |
| `/plants/[id]` | `/app/plants/[id]` |
| `/track-record` | `/app/track-record` |
| `/method` | `/app/method` |
| `/verify` | `/app/verify` (dentro do Laboratório) |
| (não existia) | `/login`, `/app/lab` |

Os endereços antigos **continuam funcionando** (redirecionam). As rotas `/api` não mudaram.

### 3.4 Textos corrigidos pelas regras de honestidade

- **Regras escritas** (`CLAUDE.md`): nunca dizer "IA barata", "energia grátis", "parceria", "provamos que a energia foi usada" etc.; sempre dizer que a demo é na devnet, usina e operador são simulados, o oráculo é declarado e os cálculos são histórico, não garantia.
- Correções feitas nos textos do site e dos READMEs: valor de referência ("não é um preço"), limitações do Método, "domina a sobra de energia desde fevereiro" (e não março), custo da energia na GPU (4–11%, não 1–2%), lei do ressarcimento (CNF e REL, não "só REL"), regra europeia de hidrogênio (sem número de parágrafo não confirmado) e a REN 1.170/2026 (agora "segundo o texto publicado no Legisweb").
- Uma **revisão geral** (`docs/revisao-geral-2026-10-12.md`) recalculou de forma independente os 98 vereditos ao vivo, os 614 do teste retroativo e as 9 impressões digitais (**tudo bateu**), procurou segredos nos 58 commits (nenhum) e testou os links.
- Nesta última rodada, a seção "Para quem é" deixou de dizer "hipótese, ainda não validada", porque os perfis foram validados.

### 3.5 O visual (redesenho completo, 12–13/10)

Pensado para quem decide numa empresa de carga flexível, abrindo o link no celular. As razões estão em `docs/design-publico-alvo.md`.

- **Cores:** papel quente, verde-floresta como marca; azul = eólica e âmbar = solar (conferidos para daltônicos e contraste); três níveis de evidência sempre com a mesma cor e ícone: **Dado oficial** (verde), **Estimativa** (amarelo), **Simulação** (roxo).
- **Tipografia:** títulos em serifa (Newsreader), interface em Geist, logotipo como antes.
- **Apresentação nova:** abre com um exemplo real (gráfico das horas de corte de uma usina), depois o tamanho da sobra, o problema, "como funciona" em 3 passos, o que há dentro, para quem é, transparência e perguntas.
- **Login** em tela dividida; **navegação** no topo (computador) e em abas fixas embaixo (celular).
- **Gráficos refeitos** em SVG próprio: texto legível no celular, valores ao passar o mouse ou com o teclado, versão em tabela de cada gráfico, uma cor por significado.
- **Mapa** em tons de cinza, com o círculo da usina destacado ao passar o mouse na tabela.
- **Acessibilidade:** contraste de texto de pelo menos 4,5:1, foco visível, link "Pular para o conteúdo", respeita "reduzir movimento", versão de impressão.
- Testado em 320, 390, 768, 1024 e 1280 px, em português e inglês, sem barra de rolagem lateral.

### 3.6 Documentos novos

| Arquivo | Para quê |
| --- | --- |
| `CLAUDE.md` | A direção do projeto, a premissa, o que é comprovado e o que é hipótese, as regras de honestidade e o backlog. |
| `docs/inventario-do-site.md` | Cada página, seção e botão do site, com origem do dado e se combina com a premissa. |
| `docs/raio-x-nomos.md` | O "raio-X" do projeto inteiro, em linguagem simples. |
| `docs/revisao-geral-2026-10-12.md` | O que foi verificado e corrigido na revisão geral. |
| `docs/design-publico-alvo.md` | O porquê de cada escolha visual. |
| `docs/business-plan.md` | Versão curta em inglês separando fatos validados de hipóteses, com fontes. |
| READMEs (raiz e `site/`, PT e EN) | Atualizados para a ideia nova e para o fluxo. |

---

## 4. O que NÃO foi mexido (de propósito)

- `.github/workflows` (a atualização diária), os **scripts Python** de previsão, as **rotas `/api`**, chaves e variáveis secretas, o `package.json` e os **dados** (`atlas.json`, arquivos do ONS).
- O repositório original do Guilherme (`AmorimGui/Hackaton-Project`) nunca foi alterado. Esta cópia é sua; o que ficar bom pode ser levado para lá.
- Nenhum `force push`.

---

## 5. Como tudo foi publicado

- Branches de trabalho: `calculadora`, `so-decisao`, `revisao-geral`, `fluxo-login`, `design`, todas feitas a partir da anterior.
- Na Vercel (projeto importado de `eMMsteiin/nomos-v2`), a produção acompanha a branch `main`. Em 13/10/2026 o `main` foi avançado até `1130920` (sem sobrescrever nada).
- Os commits da Vercel só passam se o autor for `eMMsteiin <stein100706@gmail.com>`.

---

## 6. O que ainda está aberto

1. **Login real com o Google:** mexe em `/api` e em chaves, então precisa de autorização sua.
2. **Atualização diária dos dados:** o workflow ainda aponta para o site do Guilherme; os dados desta cópia estão parados em 10/10 (por isso a faixa amarela). Mexer nele exige sua autorização.
3. **Só 8 usinas têm calculadora**, de 166 conjuntos modelados.
4. **Conferir a REN 1.170/2026 no Diário Oficial** e falar com um advogado regulatório sobre cargas que não são autoprodução.
5. **Quem pagaria** pelo atlas ou pela calculadora continua sem validação (a página Método ainda diz isso).
6. **Link do GitHub no rodapé** ainda aponta para o repositório do Guilherme (troca em uma linha: `REPOSITORIO` em `site/src/lib/tipos.ts`).
7. **Conferir no navegador:** a janela "Reservar (demo)" do Laboratório com o visual novo e o "Imprimir / salvar em PDF".
8. **4 vulnerabilidades moderadas** do `npm audit`, todas dentro da biblioteca da Solana.
9. **Produto futuro** (relatório exportável, cenários salvos, alertas, contas): só depois de validar com quem poderia usar.

---

## 7. Como conferir sozinho no Git

```bash
git log --oneline 10cd1b8..HEAD     # os commits que fizemos
git diff --stat 10cd1b8 HEAD        # arquivos mudados em relação ao Guilherme
git diff 10cd1b8 HEAD -- site/src   # o código do site, linha a linha
```

Para voltar ao projeto do Guilherme exatamente como ele deixou (só para olhar, sem perder nada): `git checkout 10cd1b8`.
