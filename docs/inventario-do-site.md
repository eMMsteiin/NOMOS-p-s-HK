# Inventário completo do site Nomos: cada página, seção, botão e função

> **Atenção:** este inventário descreve o site **antes** da versão `so-decisao` (12/10/2026). Nessa versão, os itens marcados com ❌ (botões Reservar e Replay, "horas de GPU", bloco roxo "Visão futura" do Início e a aba Verificar) deixaram de aparecer no caminho principal e foram para o Laboratório (`/lab`). Os textos e a abertura em PT também mudaram.

Escrito em 12/10/2026, lendo o código do site (`site/src`). Cada item diz **o que é**, **o que acontece quando você usa**, **de onde vem a informação** e se **combina com a premissa**.

**A premissa de referência** (a "Ideia A"): o Nomos é uma **ferramenta de informação para decidir** onde instalar ou expandir uma unidade ao lado de uma usina eólica ou solar. Ele **não vende nada**.

**Legenda de status** (de onde vem o dado ou o que a função é):
- **REAL**: dado oficial ou cálculo direto dele.
- **ESTIMATIVA**: cálculo a partir do passado, que não é garantia.
- **SIMULADO**: demonstração em rede de teste, com carteiras falsas.

**Legenda de coerência** com a premissa:
- ✅ **Alinha**: é o coração da ferramenta de decisão.
- ⚪ **Apoio**: sustenta a credibilidade, sem confundir.
- ⚠️ **Revisar**: pode confundir ou está desatualizado.
- ❌ **Não combina**: contradiz a premissa de "não vende nada".

---

## Parte 0. O site em números

- **5 páginas** (rotas): Início `/`, Usina `/plants/<id>` (8 páginas, uma por usina), Placar `/track-record`, Método `/method`, Verificar `/verify`.
- **8 usinas de destaque** têm página própria e calculadora, de **166 conjuntos** modelados (RN, BA e CE).
- **2 idiomas** (PT e EN). O site abre em **inglês**. A escolha fica salva no navegador do visitante (`localStorage`).
- **Sem login, sem conta, sem cookies de rastreio, sem analytics.** Nada do visitante é guardado, exceto o idioma.
- **Cálculos** da calculadora: todos no navegador, com os dados já carregados.
- **Tudo é público**: qualquer pessoa com o link vê tudo.

---

## Parte 1. Elementos que aparecem em TODAS as páginas

### 1.1 Cabeçalho (fixo no topo, acompanha a rolagem)

| # | Elemento | O que faz | Coerência |
| --- | --- | --- | --- |
| 1 | **Logotipo "nomos"** | Clique leva ao Início. | ⚪ |
| 2 | **Frase ao lado do logotipo** ("Energia limpa cortada, mapeada e registrada.") | Só aparece em tela larga (a partir de 1024 px). | ⚠️ "registrada" lembra a ideia de blockchain; para uma ferramenta de decisão, pode ser trocada por algo como "para decidir onde instalar". |
| 3 | **Botão/aba "Atlas"** | Vai ao Início. Fica destacado em `/` e em qualquer página de usina. | ✅ |
| 4 | **"Placar"** (EN: "Track record") | Vai a `/track-record`. | ⚪ |
| 5 | **"Método"** | Vai a `/method`. | ⚪ |
| 6 | **"Verificar"** | Vai a `/verify`. | ❌ Só serve para a reserva simulada. |
| 7 | **Seletor EN / PT** | Troca todo o texto do site na hora e guarda a escolha. | ✅ |

No celular o menu desce para uma segunda linha.

### 1.2 Rodapé
- Texto: "Dados: ONS, dados abertos (CC-BY). Preços: CCEE, dados abertos (PLD horário)." (REAL, ⚪).
- Texto: "Feito pelo time Nomos para o Colosseum Crypto World's Fair 2026" + link **GitHub**. ⚠️ O link aponta para o repositório do **Guilherme** (`AmorimGui/Hackaton-Project`), não para o seu. A menção ao hackathon pode não ser o que você quer mostrar a uma empresa.

### 1.3 Ao instalar no celular
O site tem um manifesto: no celular dá para "Adicionar à tela inicial" e abrir como app. ⚪

---

## Parte 2. Início (`/`)

Pergunta que a página responde: "Quanta energia cortada existe e como uso isso na minha decisão?".

### 2.1 Bloco de abertura (topo)

| # | Elemento | O que mostra ou faz | Dado | Coerência |
| --- | --- | --- | --- | --- |
| 1 | Linha pequena "Nordeste do Brasil · dados oficiais do ONS" | Contexto. | texto fixo | ⚪ |
| 2 | **Título**: "Se você colocar uma carga ao lado de uma usina eólica ou solar do Nordeste, quanta energia cortada ela poderia ter aproveitado?" | A pergunta de decisão. | texto fixo | ✅ |
| 3 | Frase: "Em 2026 o Nordeste teve 3,4 GW de energia eólica e solar cortados em média…" | O tamanho do problema. | atlas.json (REAL) | ✅ |
| 4 | Parágrafo: "O Nomos é um atlas aberto desse corte… Cada página de usina tem uma calculadora…" | Explica o produto. | texto fixo | ✅ |
| 5 | **Caixa "Experimente a calculadora numa usina"** com **8 botões pretos** (um por usina, ex. "Serra do Assuruá →") | Cada botão leva à página da usina, já descendo até a calculadora. | atlas.json | ✅ |
| 6 | Nota "Estimativas com dados passados do ONS, não garantia. O contrato com a usina precisa ser negociado." | Aviso de honestidade. | texto fixo | ✅ |

### 2.2 Os 4 números de destaque (cartões)

| Cartão | Valor atual | O que significa | Status |
| --- | --- | --- | --- |
| Potência cortada | **3.415 MW** médios | Média de potência cortada no Nordeste em jan–ago/2026. | REAL |
| Energia por dia | **82 GWh** | O mesmo corte em energia por dia. | REAL |
| Valor | **R$ 2,6 bi** | Valor da energia cortada de 1º/jan a 10/out, ao preço horário real (PLD). | ESTIMATIVA ⚠️ "valor de energia desperdiçada" não é dinheiro que ninguém recebeu; vale lembrar isso. |
| Energia capturada | **90% / 95%** | Quanto da energia cortada caiu dentro das nossas janelas previstas (ago / set). | REAL (backtest) |

### 2.3 Seção "Janelas previstas"

| # | Elemento | O que faz | Dado | Coerência |
| --- | --- | --- | --- | --- |
| 1 | Título e frase "Previsões reais, feitas só com dados do ONS publicados até 10/10…" | Explica o que são. | texto | ✅ |
| 2 | **Selo da previsão** ("✓ A impressão digital desta previsão foi gravada na Solana em …") com links **Solana Explorer ↗**, **arquivo da previsão** e o início do **sha256** | Mostra que a previsão do dia está carimbada na blockchain. Só aparece se existe o registro. Lê a blockchain na hora (`/api/previsao`). | REAL (devnet) | ⚪ É o único uso defendido de blockchain; mas pode confundir quem não conhece. |
| 3 | **Abas de dia** (8 botões, de "dom., 11 de out." a "dom., 18 de out.") | Troca o dia mostrado no mapa, na tabela e na frase de totais. | atlas.json | ✅ |
| 4 | **Mapa** (OpenStreetMap + Leaflet) | Um círculo por usina. Cor: verde-água = eólica, laranja = solar. Tamanho = capacidade. Opacidade = maior chance de corte prevista no dia. **Passar o mouse/tocar**: mostra nome e janela, chance e energia. **Clicar** abre a página da usina. Tem botões de zoom (+/−); a rolagem do mouse não dá zoom. | atlas.json | ✅ |
| 5 | **Tabela das 8 usinas** | Uma linha por usina: nome (link para a página), selo eólica/solar, município e UF, **janela** (ex. 07:00–17:30), **chance** (barra e %), **esperado** (ex. ~2,4 GWh e, embaixo, "horas de GPU"), **valor de referência** (ex. R$ 136,5 mil, com "est." quando o PLD da hora ainda não saiu). No celular vira lista de cartões. | atlas.json | ✅ |
| 6 | Dentro da tabela: **"horas de GPU"** (ex. "2,8 mi horas de GPU") | Quantas horas de uma GPU H100 (0,85 kW) caberiam na energia esperada. | ESTIMATIVA | ❌ Vem da ideia de computação/IA. Não ajuda a decidir sobre fábricas e confunde. |
| 7 | Dentro da tabela: **botão "Reservar (demo)"** em cada linha | Abre a janela de reserva (ver Parte 7). | SIMULADO | ❌ |
| 8 | Linha de totais ("Neste dia, 8 das usinas modeladas têm janela: N janelas e X GWh…") | Soma do dia (todas as usinas modeladas, não só as 8). | atlas.json | ✅ |
| 9 | Nota do valor ("Valor de referência = energia cortada esperada × PLD…") | Explica a conta e diz que não é preço. | texto | ✅ |
| 10 | **Bloco roxo "Visão futura, simulada"** | Explica que "Reservar" é uma ideia futura, na devnet, sem comprador validado. | texto | ⚠️ Está lá para proteger, mas só existe por causa do botão. Se o botão sair, o bloco perde a razão. |

### 2.4 Seção "Por que isso acontece" (5 cartões)

| # | Cartão | O que mostra | Interação | Status |
| --- | --- | --- | --- | --- |
| 1 | **Energia cortada por hora do dia (jan–jul/2026)** | Gráfico de barras: eólica × solar, 24 horas. Frase fixa: "61% da energia eólica perdida cai entre 8h e 14h59". | Passar o mouse numa barra mostra o % daquela hora. | REAL ✅ |
| 2 | **Chance de corte**: dia útil × fim de semana e feriado | Dois números grandes (30% × 38%). Explica que o corte sobe quando a demanda cai. | nenhuma | REAL ✅ |
| 3 | **Três tipos de corte** | Barra com ENE (sobra de energia), CNF (confiabilidade) e REL (linha ou equipamento fora). Texto: a parte previsível é a de sobra de energia. Link **"Como nossa previsão trata cada tipo →"** vai ao Placar. | link | REAL ✅ |
| 4 | **O preço bate no piso exatamente quando há corte** | Gráfico por hora: % das horas com PLD no piso. Texto: em tantos % das horas entre 9h e 13h o preço está no piso. | passar o mouse | REAL ✅ |
| 5 | **Potência cortada média no Nordeste, por mês** | Barras mensais, eólica + solar. | passar o mouse | REAL ✅ |

### 2.5 Faixa preta final
**"Veja como a previsão se saiu →"**: leva ao Placar. Mostra "X de Y janelas oferecidas em ago–set confirmadas" e "Ao vivo desde 1º/10: 68 de 98 (69%), amostra de apenas 10 dias". ⚪

---

## Parte 3. Página de uma usina (`/plants/CJU_BASAR` e mais 7)

Usinas: Serra do Assuruá (BA), Rio do Vento (RN), Rio do Vento Expansão (RN), Novo Horizonte (BA), Sol do Sertão (BA), Assu Sol (RN), Itarema V (CE), Mauriti (CE).

| Ordem | Seção | O que mostra ou faz | Status | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Link "← Voltar ao Atlas"** | Volta ao Início. | | ⚪ |
| 2 | **Cabeçalho da usina** | Selo eólica/solar, código do ONS (ex. CJU_BASAR), nome, município e UF ("localização aproximada"), **operador** (ex. ENGIE), **capacidade** (MW), **ponto de conexão**. | REAL | ✅ |
| 3 | Dois cartões: **energia perdida jan–jul/2026** (ex. 337 GWh) e **meias-horas cortadas** (ex. 35%) | Tamanho do corte da usina. | REAL | ✅ |
| 4 | **Mapa** só dessa usina | Um círculo, zoom no local. Clicar no círculo recarrega a página. | | ⚪ |
| 5 | **Tabela "Janelas previstas (aguardando o ONS)"** | Colunas: data, janela, chance (barra), esperado, valor de referência (com "est."), situação do ONS (selo "aguardando ONS"), botão **Reservar (demo)**. | ESTIMATIVA / SIMULADO | ✅ a tabela; ❌ o botão |
| 6 | **"Por que esta usina é cortada (2026)"** | Texto com GWh cortados e a barra ENE/CNF/REL da usina. | REAL | ✅ |
| 7 | **Mapa de calor "Chance de corte por mês e hora"** | Tabela 12 meses × 24 horas, tom mais escuro = mais corte. Passar o mouse mostra "mês hora: %". Escala 0–100% embaixo. Dados de jan/2025 até a data atual. | REAL | ✅ |
| 8 | **Calculadora de carga junto à usina** (ver Parte 3.1) | O coração da ferramenta. | ESTIMATIVA | ✅ |
| 9 | **Tabela "Janelas recentes e o veredito do ONS"** | Últimos ~14 dias: data (marcada **ao vivo** a partir de 1º/10), janela, chance prevista, energia cortada, razões do corte, situação (**confirmada** / **errada**), botão **Replay**. | REAL | ✅ a tabela; ❌ o botão Replay |
| 10 | **Cartão "Teste retroativo desta usina"** | "59 de 61 janelas confirmadas (ago–set)"; se houver, "Ao vivo desde 1º/10: X de Y"; para agosto e setembro: **precisão**, **cobertura** e **energia capturada**. | REAL | ⚪ |

### 3.1 A calculadora de carga (detalhe de cada controle)

| # | Controle | Como funciona |
| --- | --- | --- |
| 1 | **Título e parágrafo** | Explica que tudo é estimativa a partir do passado, sem previsão nem oferta. |
| 2 | **Caixa de aviso (borda preta)** | "Histórico, não garantia. Cálculo com dados do ONS; o contrato com a usina precisa ser negociado." Sempre visível. |
| 3 | **Campo "Carga ao lado da usina (computadores, fábrica…)" em MW** | Padrão 10. Aceita decimais. Se passar da capacidade, aparece o aviso de que o cálculo usa no máximo a capacidade. |
| 4 | **Controle deslizante "Horas de operação por dia"** | De 1 a 24, padrão 8. |
| 5 | **Menu "Começa às"** | De 00:00 a 23:00, padrão 08:00. |
| 6 | **Aviso do melhor horário** (só aparece quando existe horário melhor) | "O melhor horário de início para essa jornada é 06:00: cerca de 221 horas de corte por mês." com botão **"Usar esse horário"**, que muda o menu. |
| 7 | **Cartão "Horas de corte por mês, dentro do seu horário"** | Ex.: 179,3 h de 243 horas de operação (74%). |
| 8 | **Cartão "Energia que a sua carga teria podido usar"** | Ex.: 1.793 MWh por mês, limitada pela carga, pela capacidade e pela potência média cortada da usina (ex. 187 MW). |
| 9 | **Cartão "Valor de referência para negociação"** | Ex.: R$ 186.700 por mês ao PLD médio (R$ 104,15/MWh) e, no texto, o valor ao piso (R$ 57,31/MWh). |
| 10 | Frase "É um ponto de partida para conversar com a usina, não um preço, um lucro nem uma economia garantida." | Aviso de honestidade. |
| 11 | **Tabela "Por que essas horas foram cortadas"** | Linhas: Sobra de energia (ENE), Elétrica (CNF + REL) e, quando relevante, Outras. Colunas: horas por mês e MWh por mês. |
| 12 | Notas | Explica que a divisão é uma aproximação, e que o corte elétrico é menos previsível. |
| 13 | **Caixa "Sobre a regulação"** | Resolução Aneel 1.170/2026 (publicada em 09/10/2026): autoprodução no mesmo ponto de conexão, só corte por sobra de energia, efeitos financeiros depois de transição; diz que o Nomos não avaliou se uma carga específica é coberta. |
| 14 | **Seção recolhível "Como calculamos"** | As fórmulas e os limites. |

Tudo recalcula na hora, enquanto você muda os controles. Nada é enviado a nenhum servidor.

---

## Parte 4. Placar (`/track-record`)

Pergunta que a página responde: "Posso confiar na previsão?".

| Ordem | Seção | O que mostra | Status | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Título e abertura** | "Prevemos cada meia hora de agosto e setembro de 2026 para 154 usinas…", destaque "Nossas janelas capturaram 90% da energia cortada em agosto e 95% em setembro", e "564 de 614 janelas confirmadas". | REAL (retroativo) | ⚪ |
| 2 | **Cartão "Ao vivo desde 1º de outubro"** (borda verde) | "68 de 98 janelas confirmadas (69%)"; **"Amostra: 98 janelas em apenas 10 dias…"**; "Previsões publicadas antes do dia começar (a partir de 8/10): 28 de 29". | REAL | ✅ |
| 3 | Dentro dele: **"Por que o início de outubro está mais fraco"** (caixa laranja) | Os erros se concentram em duas usinas do RN, cujo corte noturno por confiabilidade parou de repente em 28–29/09. | REAL | ✅ |
| 4 | Dentro dele: **"O modelo ganha de uma regra ingênua?"** | Dois números lado a lado: erro médio do modelo e da regra ingênua (hoje 29,9 p.p. nos dois), frase de veredito (hoje "empate"), quantas das janelas a regra ingênua também ofereceria (78 de 98) e aviso de que 10 dias é "uma primeira olhada". | REAL | ✅ |
| 5 | Dentro dele: nota "O resultado ao vivo aparece como vier, erros incluídos…" | Explica quando cada previsão foi publicada e carimbada. | | ⚪ |
| 6 | **Cartão "Três tipos de corte"** | Barra ENE/CNF/REL (Nordeste, 2026) e tabela: tipo, código, parte da energia, % dentro das nossas janelas (ago–set e ao vivo), **ressarcimento à usina** ("Previsto em lei" para CNF e REL, "Não" para ENE). Nota sobre a Lei 15.269/2025 e a decisão da Aneel. Link **Dicionário de dados do ONS ↗**. Gráfico de **composição por mês** (colunas de 100%). | REAL | ✅ |
| 7 | **Tabela "Comparação de modelos (todas as usinas)"** | 6 modelos (taxa média, regra fixa 8h–15h, mesmo mês de 2025, perfil de 8 semanas, combinado e o de produção em destaque). Para ago e set: precisão · cobertura · energia capturada, e o "ganho sobre a média". Abaixo, as definições. | REAL | ⚪ |
| 8 | **Caixa laranja "Leia isto antes de citar a precisão"** | Explica que mesmo um modelo que ignora a hora acerta 89%, pois essas usinas são cortadas em 47% das meias-horas. | REAL | ✅ |
| 9 | **"Calibração (agosto)"** | Gráfico de pontos: chance prevista × observada. Passar o mouse dá os números. | REAL | ⚪ |
| 10 | **"Por tipo de usina"** + lista de usinas | Resultado por eólica e solar, e a lista das 8 usinas (links) com "confirmadas/janelas" no teste e ao vivo. | REAL | ⚪ |
| 11 | **"Reproduzível por qualquer pessoa"** | Caixa preta com as impressões digitais (SHA-256) de cada arquivo de saída, a frase sobre o oráculo declarado e os parâmetros fixados antes do teste. | REAL | ⚪ |

---

## Parte 5. Método (`/method`)

Pergunta que a página responde: "O que é real, o que é simulado e o que é estimado?".

| Seção | Conteúdo | Coerência |
| --- | --- | --- |
| **Título "Método e honestidade"** | "O que é real, o que é simulado e o que é estimado, dito antes de alguém perguntar." | ✅ |
| **3 cartões coloridos: Real / Estimado / Simulado no MVP** | **Real** (verde): dados do ONS, placar ao vivo, previsões, janelas, PLD horário. **Estimado** (laranja): energia esperada (±20%), valor da janela, equivalência em horas de GPU. **Simulado** (roxo): a usina e o operador (carteiras de teste), o trabalho de demonstração, a saída em reais por Pix, a reserva por janela como conceito. | ⚠️ Mencionar GPU e Pix lembra a ideia B. |
| **Definições** | Corte, GNRa, meia hora cortada (≥ 1 MW médio), janela, confirmada, razões ENE/CNF/REL. | ✅ |
| **Dados abertos** (9 links de download) | CSV e JSON: chance de corte por usina/mês/hora, corte por estado e mês, corte por razão, janelas ao vivo, janelas ago–set, janelas dos próximos dias, teste retroativo, catálogo das 166 usinas, impressões digitais. Link **"Código-fonte no GitHub →"** (repositório do Guilherme). | ✅ |
| **Limitações** | Só padrões passados; dados recentes podem ser revisados; o ONS reporta conjuntos, não usinas; não vendemos eletricidade; oráculo declarado e centralizado; **ninguém validou quem pagaria por um certificado horário**; os valores e a calculadora são estimativas. | ✅ Honesto. |
| ⚠️ Detalhe desatualizado | O item "PLD horário… 1º/jan a 8/out/2026" está fixo no texto e já está defasado. | ⚠️ |

---

## Parte 6. Verificar (`/verify`)

**Para que serve:** conferir uma reserva simulada lendo a blockchain.

| # | Elemento | O que faz |
| --- | --- | --- |
| 1 | **Título "Verificar uma reserva"** e texto explicativo | Diz que tudo é lido da blockchain (devnet). |
| 2 | **Campo de texto** (cole o endereço da transação) e botão **"Verificar"** | Busca a transação e mostra os cartões abaixo. |
| 3 | Mensagens | "Endereço inválido", "Carregando…", ou erro do servidor. |
| 4 | **Cartão Pagamento** | Usina, janela, energia, quanto foi pago, divisão (usina/operador/plataforma), comprador (abreviado), data, link **Solana Explorer ↗**. |
| 5 | **Cartão Recibo (fase 1)** | Recibo assinado por usina e operador. |
| 6 | **Cartão Execução** | Quando o trabalho começou e terminou, se foi dentro da janela ou é um replay, energia estimada do notebook, o que o trabalho de IA descobriu (3 causas do corte), links para início, fim e arquivo do resultado. |
| 7 | **Cartão Carimbo do ONS (fase 2)** | Confirmada ou errada, % da janela com corte, energia cortada, arquivo do ONS com seu SHA-256, links para a **cópia exata** e para a **versão atual no ONS**. |
| 8 | **"Confira você mesmo"** e aviso roxo | Passo a passo para verificar sem confiar no site. Aviso: "Demo na devnet: USDC de teste; usina e operador são carteiras de teste; o trabalho não roda na usina, então nenhuma energia cortada foi absorvida." |

**Coerência:** ❌ Para um visitante sem transação, a página é um campo vazio sem sentido (um beco sem saída). Existe só para a ideia B.

---

## Parte 7. A janela "Reservar (demo)" (aparece ao clicar em Reservar ou Replay)

Painel que sobe na tela (no celular, vem de baixo). Fecha com o **✕**, com a tecla **Esc** ou clicando fora.

| # | Elemento | O que faz |
| --- | --- | --- |
| 1 | **Título "Reservar uma janela de computação"** e subtítulo (usina · data · janela) | |
| 2 | **Faixa roxa**: "Demo na devnet da Solana com USDC de teste, nenhum dinheiro real é movimentado." | |
| 3 | **Faixa laranja** (só no Replay): "Replay de uma janela histórica…" | |
| 4 | **Texto "O que você recebe"** | Diz que o operador ao lado da usina roda o seu trabalho e que você recebe o resultado e um recibo público. E diz que **você não está comprando eletricidade**. |
| 5 | **Controle deslizante "Energia que seu trabalho vai usar (MWh)"** | De 0,1 a 5 MWh, passo 0,1. Mostra a nota "Esta janela espera X de corte em Y h; absorver tudo exigiria cerca de Z MW de computadores". |
| 6 | **Caixa de preço** | Preço em USDC; equivalente em R$; PLD usado; aviso de que o preço é de demonstração e **não cobra a computação**; taxa PTAX do Banco Central; aviso quando o PLD da janela é estimado. |
| 7 | **Divisão em uma só transação** | Usina (70%), operador (25%), plataforma (5%) e a nota de que usina e operador são simulados. |
| 8 | Sem Phantom instalada | Aparece "Phantom não encontrada neste navegador" e link **Instalar a Phantom ↗**. |
| 9 | Phantom instalada, não conectada | Botão roxo **"Conectar Phantom"**. Dica para ativar o Modo Testnet. |
| 10 | Conectada | Mostra carteira (4 primeiros e 4 últimos caracteres), saldo (USDC e SOL de teste), avisos de saldo baixo (com links para os "faucets" de moedas de teste) e o botão preto **"Pagar X USDC"**. Mensagem "confirme na Phantom em até 1 minuto". |
| 11 | Depois do pagamento | "✓ Pagamento confirmado na Solana", divisão, memo gravado, estado do **recibo** (fase 1) e do **carimbo do ONS** (fase 2, ou "aguardando"), botão **"Abrir a comprovação completa →"** (vai a `/verify`) e link para o Explorer. |
| 12 | Erros | Cancelado na Phantom; transação expirada; falha de rede; simulação falhou (nenhum dinheiro movimentado). |

**Coerência:** ❌ Esta janela inteira pertence à ideia B. **No projeto que você publicou na Vercel, ela não conclui**: o pagamento até ocorreria na devnet para quem tem Phantom em teste, mas o recibo e o carimbo não são emitidos porque o servidor não tem as chaves (aparece "recibo não pôde ser emitido agora").

---

## Parte 8. Os bastidores (o que roda por trás, sem tela)

| Parte | O que faz | Status |
| --- | --- | --- |
| `GET /api/previsao` | Devolve a previsão publicada e o seu registro na Solana. Usada pelo Selo da previsão. | Funciona no seu site |
| `POST /api/previsao` | Grava o hash da previsão na Solana. A automação diária chama. | Precisa de chaves; **não funciona no seu site** |
| `POST /api/recibo` | Confere a reserva e emite recibo e carimbo. Usada pelo Verificar e pela janela de reserva. | Precisa de chaves |
| `POST /api/carimbar` | Carimba as reservas pendentes. | Precisa de chaves |
| **Atualização diária** (GitHub Actions, 12h40 e 18h10) | Baixa dado novo do ONS, recalcula, publica e registra na Solana. | ⚠️ O arquivo aponta para o site do **Guilherme**; no seu repositório pode estar desligada. |
| **Operador de demonstração** (`operador/`) | Programa que roda no notebook de alguém, esperando reservas. | SIMULADO; não roda sozinho |

---

## Parte 9. O que eu vejo quanto à coerência com a premissa

### 9.1 O que combina com "ferramenta de decisão" (manter)
- Pergunta de abertura e botões para a calculadora.
- Números de destaque, mapa, tabela de janelas, os cinco gráficos de "por que acontece".
- Toda a página da usina (cabeçalho, mapa de calor, razões, calculadora, janelas recentes).
- Placar com amostra, comparação com regra ingênua, três tipos de corte, modelos, calibração.
- Método e dados abertos.

### 9.2 O que não combina e sugiro tirar do caminho principal
1. Botões **Reservar (demo)** (Início e página de usina) e **Replay** (página de usina).
2. A **janela de reserva** inteira.
3. As **"horas de GPU"** na tabela do Início e a menção no Método.
4. A aba **Verificar** e a página `/verify`.
5. O bloco roxo **"Visão futura, simulada"** (só existe por causa do botão).
6. Os itens do Método sobre Pix, operador e "reserva por janela".

### 9.3 O que precisa de ajuste de texto
- Frase do cabeçalho ("mapeada e registrada").
- Rodapé: link para o repositório do Guilherme e a menção ao hackathon.
- Método: a data fixa do PLD (8/out).
- Início: o R$ 2,6 bi chamado de "valor da energia cortada" pode ser lido como dinheiro perdido por alguém.

### 9.4 Lacunas da ferramenta (o que ela ainda não responde)
- Só 8 usinas têm calculadora.
- Não mostra fatores além da energia: conexão elétrica disponível, terreno, internet, impostos, contrato.
- Sem login, relatório exportável ou cenários salvos.
- O site abre em inglês.
- Os dados ficam parados em 10/10 enquanto a atualização diária não for ajustada.

---

## Parte 10. Próximo passo sugerido

Escolher, com este inventário na mão, uma destas versões:

- **Versão "só decisão"**: esconder os itens 9.2 do site (o código continua guardado, só deixa de aparecer). É a que eu recomendo para mandar ao Leonardo.
- **Versão "ambas as ideias"**: manter tudo, mas separar com clareza "Ferramenta" e "Laboratório (simulação)" no menu.

Depois de você escolher, eu aplico, com um commit por mudança.
