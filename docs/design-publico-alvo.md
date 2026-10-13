# Design do Nomos para o público-alvo

Este documento explica **por que** o site tem a cara que tem. Ele serve para quem for mexer no visual: antes de trocar uma cor, um texto ou um botão, confira se a mudança ainda atende a quem usa.

## 1. Quem usa (e o que cada pessoa precisa em 10 segundos)

| Perfil | Quem é | O que quer saber | Como chega |
|---|---|---|---|
| **Quem decide** (principal) | Sócio, CEO, diretor financeiro de uma empresa com carga flexível: computadores, mineração, fábrica, hidrogênio… Pensa em instalar a primeira unidade ou expandir. | "Onde eu coloco a minha carga e quanta energia sobrando eu encontraria?" Quer **uma resposta em linguagem de negócio**, números grandes, de onde vêm e quão confiáveis são. | Pelo celular, abrindo um link recebido no WhatsApp. Pouco tempo, pouca paciência com jargão. |
| **Quem analisa** | Analista de energia, gestor de ativos, consultor. | Fórmulas, fontes, arquivos para baixar, como o modelo se saiu. | No computador, com a planilha ao lado. Quer poder conferir tudo. |
| **Quem tem usina** | Gerador eólico ou solar. | Mostrar quanto e por que a usina é cortada, para conversar com possíveis cargas. | Computador. Quer uma referência neutra e aberta. |
| **Quem investe** | Investidor, banco, fundo. | Visão do mercado e se a ferramenta é séria (placar, transparência). | Computador ou celular. |

Todas as decisões abaixo foram tomadas pensando primeiro em **quem decide**, sem tirar nada de quem analisa: o detalhe continua lá, só fica **atrás de um clique**.

## 2. Princípios

1. **Resposta primeiro, evidência depois.** Cada tela abre com uma frase em português simples ("Com 10 MW rodando 8 h por dia, esta usina teve corte em cerca de 179 h por mês…"), depois os números grandes, depois o detalhe.
2. **Um caminho principal.** Landing → login → "Onde instalar" (informe a sua carga, veja o ranking das usinas) → página da usina (calculadora) → copiar o resumo para levar a uma conversa. Todo o resto é apoio.
3. **O jargão se explica sozinho.** PLD, MWh, corte, ENE, CNF, REL, GNRa… ganham um balãozinho de explicação (toque ou passe o mouse) e um glossário no Método.
4. **O número nunca anda sozinho.** Todo número grande tem unidade, período e, quando é estimativa, a etiqueta "estimativa". Quem lê sabe o que está olhando.
5. **A honestidade faz parte do visual.** Três níveis de evidência com cores fixas em todo o site: **Dado oficial** (verde), **Estimativa** (âmbar), **Simulação** (violeta). Nada é "garantia", nada "vende energia". O aviso aparece onde importa, uma vez, sem virar ruído.
6. **Calmo e sério.** Sem neon, sem cara de cripto. Papel quente, verde-floresta, tipografia editorial nos títulos. Passa a impressão de relatório bem feito, não de painel de brinquedo.
7. **Celular primeiro.** Barra de navegação na parte de baixo da tela, alvos de toque de 44 px, tabelas viram cartões, campos com 16 px (para o iPhone não aproximar a tela).
8. **Acessível.** Contraste de texto de pelo menos 4,5:1, foco visível, nada depende só da cor, gráficos com versão em tabela, respeita "reduzir movimento".

## 3. Sistema visual

### Cores (todas conferidas com `validate_palette` e razão de contraste)

| Papel | Valor | Uso |
|---|---|---|
| Papel | `#f8f7f2` | fundo da página (quente, menos cansativo que branco puro) |
| Cartão | `#ffffff` | superfícies |
| Tinta | `#0e1c17` | texto principal (16:1 sobre o papel) |
| Apoio | `#54615a` | texto secundário (6:1) |
| Marca 700 | `#125e47` | botões principais, links, foco |
| Marca 600 | `#1a775c` | dados: "quanto há de corte" (mapa de calor, barras de chance) |
| Marca 900/950 | `#032e24` / `#001c15` | faixas escuras (chamada final, login, rodapé) |
| Eólica | `#1d6fb8` | só para identificar o tipo eólico (gráficos, mapa) |
| Solar | `#d97706` | só para identificar o tipo solar |
| Dado oficial / Estimativa / Simulação | verde `#006300`, âmbar `#7a5200`, violeta `#5b21b6` (texto sobre tons claros) | selos de evidência |

Regras de gráfico (da skill de dataviz): azul e âmbar passam nos testes de daltonismo (ΔE ≥ 23) e de contraste (≥ 3:1); **nunca** se usa cor sozinha para dizer algo (sempre rótulo, ícone ou legenda); marcas finas, grade em fio, sem eixo duplo; as razões do corte (ENE/CNF/REL) viram **linhas com rótulo direto**, não cores a decorar.

### Tipografia

- **Títulos grandes (landing e título de cada página):** Newsreader, uma serifa editorial. Dá peso e credibilidade.
- **Interface, textos e números:** Geist. Números com `tabular-nums` só em colunas; números grandes isolados usam o espaçamento normal.
- **Logotipo:** Outfit, como já era.

### Forma

Cantos de 12–20 px, sombras curtas e suaves, muito respiro. Ícones de traço de 1,75 px, todos do mesmo conjunto (`components/Icones.tsx`).

## 4. Componentes e onde ficam

| O quê | Arquivo |
|---|---|
| Tokens de cor, fontes, impressão, mapa | `site/src/app/globals.css` |
| Ícones | `site/src/components/Icones.tsx` |
| Botões, selos, cartões, estatísticas, cabeçalho de página | `site/src/components/ui.tsx` e `Selos.tsx` |
| Balão de explicação de termos | `site/src/components/Termo.tsx` + bloco `glossary` em `i18n/dicionarios.ts` |
| Gráficos (com dica ao passar o mouse e versão em tabela) | `site/src/components/Graficos.tsx` |
| Cenário do usuário (MW, horas, início), guardado no aparelho e no link | `site/src/lib/cenario.tsx` |

## 5. O que muda para o usuário (resumo)

- **Landing:** promessa clara, exemplo real com gráfico no topo, a dor, como funciona em 3 passos, o que há dentro, para quem é, transparência e perguntas.
- **Login:** tela dividida, com o que a pessoa ganha ao entrar.
- **Plataforma:** menu fixo no topo (computador) ou embaixo (celular). Entrada pelo **"Onde instalar"**: informe a carga uma vez e veja as usinas ordenadas por quanta energia cortada a sua carga encontraria.
- **Página da usina:** resposta em uma frase, calculadora com gráfico das horas, botões "Copiar resumo", "Copiar link do cenário", "Compartilhar no WhatsApp" e "Imprimir".
- **Placar, Método, Laboratório:** mesma linguagem visual; o Laboratório continua claramente marcado como simulação.
- **Link no WhatsApp:** agora aparece com título, descrição e imagem de pré-visualização.

## 6. O que NÃO mudou (de propósito)

Nenhum número, fórmula, dado ou rota foi alterado. As regras de honestidade seguem valendo: o Nomos não vende nada, os valores são estimativas do passado, o Laboratório é simulação na devnet e o login com Google ainda não está ligado.
