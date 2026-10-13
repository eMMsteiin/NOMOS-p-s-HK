# Inventário completo do site Nomos: cada página, seção, botão e função

Versão de **12/10/2026, depois da revisão geral e do novo fluxo apresentação → login → plataforma** (branch `fluxo-login`). Escrito lendo o código do site (`site/src`). Cada item diz **o que é**, **o que acontece quando você usa**, **de onde vem a informação** e se **combina com a premissa**.

**A premissa de referência** (a "Ideia A"): o Nomos é uma **ferramenta de informação para decidir** onde instalar ou expandir uma unidade ao lado de uma usina eólica ou solar. Ele **não vende nada**. O modelo de negócio é hipótese, não validada.

**Legenda de status:**
- **REAL**: dado oficial ou cálculo direto dele.
- **ESTIMATIVA**: cálculo a partir do passado, que não é garantia.
- **SIMULADO**: demonstração em rede de teste, com carteiras falsas.

**Legenda de coerência** com a premissa:
- ✅ **Alinha**: é o coração da ferramenta de decisão.
- ⚪ **Apoio**: sustenta a credibilidade, sem confundir.
- ⚠️ **Revisar**: ainda pede uma decisão ou um ajuste.

> **O fluxo do site agora tem 3 paradas:** (1) a **apresentação** em `/`, que mostra a dor e tem os botões "Quero realizar o cadastro" e "Quero conhecer mais"; (2) a tela de **login** em `/login` (botão do Google); (3) a **plataforma** em `/app`, que é tudo o que este documento descreve nas Partes 1 a 8. O login com o Google **ainda não está ligado**: o botão leva direto à plataforma e a tela avisa.

> **O que mudou na versão anterior deste documento (revisão geral):** a reserva (botões Reservar e Replay), as "horas de GPU", o bloco roxo "Visão futura" do Início e a aba "Verificar" saíram do caminho principal e foram para o **Laboratório** (`/lab`). A calculadora subiu para o topo da página da usina. Há aviso de dados antigos, páginas 404 e de erro próprias, e o site abre em português quando o navegador está em português.

---

## Parte 0. O site em números

- **8 páginas** (rotas): **Apresentação `/`**, **Login `/login`**, e as da plataforma: Início `/app`, Usina `/app/plants/<id>` (8 páginas, uma por usina), Placar `/app/track-record`, Método `/app/method`, **Laboratório `/app/lab`** e Verificar `/app/verify` (que faz parte do Laboratório). Mais a página 404 e uma página de erro. Os **endereços antigos** (`/plants/...`, `/track-record`, `/method`, `/lab`, `/verify`) redirecionam para os novos.
- **8 usinas de destaque** têm página própria e calculadora, de **166 conjuntos** modelados (RN, BA e CE).
- **2 idiomas** (PT e EN). Sem escolha salva, o site abre em **português se o idioma principal do navegador for português** (pt, pt-BR, pt-PT) e em inglês nos demais casos. A escolha pelo botão EN/PT fica salva no navegador (`localStorage`).
- **Sem login, sem conta, sem cookies de rastreio, sem analytics.** Nada do visitante é guardado, exceto o idioma.
- **Cálculos** da calculadora e da comparação com a regra ingênua: feitos com os dados já carregados (a calculadora, no navegador).
- **Funciona em celular, tablet e computador.** Em telas estreitas (menos de 640 px) as tabelas largas viram cartões.
- **Tudo é público**: qualquer pessoa com o link vê tudo.

---

## Parte A. Apresentação (`/`): a 1ª parada do fluxo

Página pública que mostra a dor e tenta convencer o visitante. Pergunta que responde: "Isto serve para mim? Por que me cadastrar?".

| Ordem | Seção | O que mostra ou faz | Dado |
| --- | --- | --- | --- |
| 0 | **Cabeçalho próprio** | Logotipo; âncoras **O problema**, **Como funciona**, **Transparência** (só em tela larga); seletor EN/PT; **Entrar** e **Quero me cadastrar** (levam a `/login`). Fixo no topo. | |
| 1 | **Abertura** | Título "A energia limpa sobra no Nordeste. Descubra quanto dela caberia na sua unidade.", parágrafo, botões **"Quero realizar o cadastro"** (vai ao login) e **"Quero conhecer mais"** (desce até "Como funciona"), aviso "Versão de teste… O Nomos não vende energia nem contrato". Ao lado, o **cartão de exemplo com dados reais**: Serra do Assuruá, carga de 10 MW, 8 h por dia → 179,3 h de corte por mês, 1.793 MWh, R$ 186.700 de valor de referência (a mesma conta da calculadora, calculada na hora). | atlas.json |
| 2 | **O problema** (`#dor`) | Explica o corte; 3 números (3,4 GW, 82 GWh por dia, R$ 2,6 bi estimados, "não é dinheiro que alguém recebeu"); 3 perguntas que quem quer instalar uma carga não consegue responder hoje. | atlas.json |
| 3 | **Como o Nomos ajuda** (`#como-funciona`) | 3 passos (escolha uma usina, informe a sua carga, veja o que o passado mostra) e a cobertura honesta: "8 usinas de destaque têm a calculadora; o catálogo modela 166 conjuntos". | atlas.json |
| 4 | **O que você encontra na plataforma** | 4 cartões: atlas do corte, calculadora de carga, previsão e placar público, dados abertos. | texto |
| 5 | **Transparência** (`#transparencia`) | "O que o Nomos é" × "O que o Nomos não é" (não vende nada; não promete economia nem preço; não substitui contrato nem parecer jurídico) e o que ainda está sendo validado. | texto |
| 6 | **Para quem é e como seria o acesso** | Hipótese, ainda não validada: 3 perfis e 3 formatos possíveis, sem preço e sem promessa. (Veio do Início da plataforma.) | texto |
| 7 | **Perguntas frequentes** | 4 perguntas: vende energia? os números são garantidos? de onde vêm os dados? quanto custa ("nesta fase não cobramos e ainda não definimos preços")? | texto |
| 8 | **Chamada final** (faixa preta) | "Pronto para ver o corte da usina que interessa à sua operação?" com **Quero realizar o cadastro** e **Voltar ao topo**. | |
| 9 | **Rodapé** | O mesmo da plataforma. | |

---

## Parte B. Login (`/login`): a 2ª parada do fluxo

| # | Elemento | O que faz |
| --- | --- | --- |
| 1 | **Cabeçalho mínimo** | Logotipo (volta à apresentação) e seletor EN/PT. |
| 2 | **Cartão de login** | "Entrar no Nomos. Crie a sua conta ou entre com o Google para abrir a plataforma." |
| 3 | **Botão "Continuar com o Google"** (com o logotipo do Google) | **Hoje leva direto à plataforma**, ou ao endereço pedido em `?from=` quando ele é interno (`/app/...`); qualquer outro destino é ignorado (proteção contra redirecionamento para outro site). |
| 4 | **Aviso roxo** "Versão de teste: o login com o Google ainda não está ligado…" | Aparece enquanto o login real não existir. Some quando ele for ligado. |
| 5 | Frase "Esta é uma versão de teste: os números são estimativas…" | Aviso de honestidade. |
| 6 | Links **← Voltar para a apresentação** e **Quero conhecer mais antes** | Voltam à apresentação (o segundo, já na seção "Como funciona"). |

Como ligar o login real: só o arquivo `site/src/lib/sessao.tsx` muda (ver o `CLAUDE.md`).

---

## Parte 1. Elementos que aparecem em TODAS as páginas da plataforma (`/app/...`)

### 1.1 Cabeçalho (fixo no topo)

| # | Elemento | O que faz | Coerência |
| --- | --- | --- | --- |
| 1 | **Logotipo "nomos"** | Clique leva ao início da plataforma (`/app`). | ⚪ |
| 2 | **Frase ao lado do logotipo**: "Para decidir onde instalar ao lado de uma usina." (EN: "To decide where to install next to a power plant.") | Só aparece em tela larga (a partir de 1024 px). | ✅ |
| 3 | **Atlas** | Vai ao Início. Fica destacado em `/` e em qualquer página de usina. | ✅ |
| 4 | **Placar** (EN: "Track record") | Vai a `/track-record`. | ⚪ |
| 5 | **Método** | Vai a `/method`. | ⚪ |
| 6 | **Laboratório** com o selo **"simulação"** (EN: "Lab", "simulation") | Vai a `/lab`. Fica destacado também em `/verify`. No celular o selo fica sobre o canto da aba. | ✅ separa a simulação do produto |
| 7 | **Seletor EN / PT** | Troca todo o texto do site na hora e guarda a escolha. | ✅ |
| 8 | **Sair** | Volta para a apresentação (`/`). Quando o login real for ligado, também encerra a sessão. | ✅ |

No celular o menu desce para uma segunda linha. A apresentação e a tela de login têm cabeçalhos próprios (partes A e B).

### 1.2 Aviso de dados antigos (novo)
Faixa laranja logo abaixo do cabeçalho. **Só aparece quando os dados têm 3 dias ou mais** (contados em dias de Brasília): "Dados até 10 de out. de 2026 (há N dias). Esta versão de teste ainda não se atualiza sozinha, então as janelas previstas para dias que já passaram deixaram de ser previsões." Some sozinha quando os dados forem atualizados. ✅ (evita mostrar "previsão" de um dia que já passou)

### 1.3 Rodapé
- "Dados: ONS, dados abertos (CC-BY). Preços: CCEE, dados abertos (PLD horário)." (REAL, ⚪).
- "Feito pelo time Nomos para o Colosseum Crypto World's Fair 2026" + link **GitHub**. ⚠️ O link aponta para o repositório do **Guilherme** (`AmorimGui/Hackaton-Project`). Para trocar, edite **uma linha**: a constante `REPOSITORIO` em `site/src/lib/tipos.ts` (ela também alimenta o "Código-fonte" do Método). A menção ao hackathon é uma escolha do time.

### 1.4 Outras páginas de sistema
- **Página 404** própria (em PT/EN, com botão "Voltar ao Atlas"), no estilo do site. A padrão do Next ficava preta no modo escuro.
- **Página de erro**: se alguma página falhar, mostra "Algo deu errado" com o botão "Tentar de novo".

### 1.5 Ao instalar no celular
O site tem um manifesto: no celular dá para "Adicionar à tela inicial" e abrir como app. ⚪

---

## Parte 2. Início da plataforma (`/app`)

Pergunta que a página responde: "Quanta energia cortada existe e como uso isso na minha decisão?".

### 2.1 Bloco de abertura

| # | Elemento | O que mostra ou faz | Dado | Coerência |
| --- | --- | --- | --- | --- |
| 1 | Linha pequena "Nordeste do Brasil · dados oficiais do ONS" | Contexto. | texto fixo | ⚪ |
| 2 | **Título**: "Se você colocar uma carga ao lado de uma usina eólica ou solar do Nordeste, quanta energia cortada ela poderia ter aproveitado?" | A pergunta de decisão. | texto fixo | ✅ |
| 3 | Frase: "Em 2026 o Nordeste teve 3,4 GW de energia eólica e solar cortados em média…" | O tamanho do problema. | atlas.json (REAL) | ✅ |
| 4 | Parágrafo: "O Nomos é um atlas aberto desse corte… Cada página de usina tem uma calculadora…" | Explica o produto. | texto fixo | ✅ |
| 5 | **Caixa "Experimente a calculadora numa usina"** com **8 botões pretos** (um por usina) | Cada botão leva à página da usina, já descendo até a calculadora. | atlas.json | ✅ |
| 6 | Nota "Estimativas com dados passados do ONS, não garantia. O contrato com a usina precisa ser negociado." | Aviso de honestidade. | texto fixo | ✅ |

### 2.2 Os 4 números de destaque

| Cartão | Valor atual | O que significa | Status |
| --- | --- | --- | --- |
| Potência cortada | **3.415 MW** médios | Média de potência cortada no Nordeste em jan–ago/2026. | REAL |
| Energia por dia | **82 GWh** | O mesmo corte em energia por dia. | REAL |
| Valor | **R$ 2,6 bi** | "Valor da energia cortada no Nordeste de 1º/jan a 10/out, ao PLD horário real: **estimativa, não é dinheiro que alguém recebeu**". | ESTIMATIVA ✅ |
| Energia capturada | **90% / 95%** | Quanto da energia cortada caiu dentro das nossas janelas previstas (ago / set). | REAL (teste retroativo) |

### 2.3 Seção "Janelas previstas"

| # | Elemento | O que faz | Dado | Coerência |
| --- | --- | --- | --- | --- |
| 1 | Título e frase "Previsões reais, feitas só com dados do ONS publicados até 10/10…" | Explica o que são. | texto | ✅ |
| 2 | **Selo da previsão** ("✓ A impressão digital desta previsão foi gravada na Solana em …") com links **Solana Explorer ↗**, **arquivo da previsão** e o início do **sha256** | Mostra que a previsão do dia está carimbada na blockchain. Só aparece se existe o registro. Lê a blockchain na hora (`/api/previsao`). | REAL (devnet) | ⚪ é o único uso defendido de blockchain |
| 3 | **Abas de dia** (8 botões, de "dom., 11 de out." a "dom., 18 de out.") | Troca o dia mostrado no mapa, na tabela e na frase de totais. | atlas.json | ✅ |
| 4 | **Mapa** (OpenStreetMap + Leaflet) | Um círculo por usina. Cor: verde-água = eólica, laranja = solar. Tamanho = capacidade. Opacidade = maior chance prevista no dia. Passar o mouse/tocar mostra nome, janela, chance e energia. **Clicar** abre a página da usina. Botões de zoom (+/−); a rolagem do mouse não dá zoom. | atlas.json | ✅ |
| 5 | **Tabela das 8 usinas** | Uma linha por usina: nome (link), selo eólica/solar, município e UF, **janela**, **chance** (barra e %), **esperado** (ex. ~2,4 GWh) e **valor de referência** (com "est." quando o PLD da hora ainda não saiu). No celular vira lista de cartões. **Não há mais "horas de GPU" nem botão de reserva.** | atlas.json | ✅ |
| 6 | Linha de totais ("Neste dia, 8 das usinas modeladas têm janela: N janelas e X GWh…") | Soma do dia (todas as usinas modeladas). | atlas.json | ✅ |
| 7 | Nota do valor | "Valor de referência = energia cortada esperada × PLD…: uma referência para a negociação entre uma usina e uma carga ao lado dela, **não um preço**." | texto | ✅ |

### 2.4 Seção "Por que acontece" (5 cartões)

| # | Cartão | O que mostra | Interação | Status |
| --- | --- | --- | --- | --- |
| 1 | **Energia cortada por hora do dia (jan–jul/2026)** | Barras eólica × solar, 24 horas. "61% da perda eólica fica entre 8h e 14h59" (conferido: 60,6%). | passar o mouse mostra o % | REAL ✅ |
| 2 | **Chance de corte**: dia útil × fim de semana e feriado | 30% × 38%. O corte sobe quando a demanda cai. | nenhuma | REAL ✅ |
| 3 | **Três tipos de corte** | Barra ENE/CNF/REL. Link "Como a nossa previsão lida com cada tipo →" vai ao Placar. | link | REAL ✅ |
| 4 | **O preço vai ao piso justamente quando a energia é cortada** | % das horas com PLD no piso, por hora. Usa o mesmo período dos números ao lado (até 10/10). | passar o mouse | REAL ✅ |
| 5 | **Potência cortada média no Nordeste, por mês** | Barras mensais, eólica + solar. | passar o mouse | REAL ✅ |

### 2.5 Seção "Para quem é e como seria o acesso"
Foi **movida para a apresentação** (`/`, ver a Parte A), que agora é a primeira página do site. Na plataforma não aparece mais.

### 2.6 Faixa preta final
**"Veja como a previsão se saiu →"**: leva ao Placar. Mostra "564 das 614 janelas oferecidas em ago–set foram confirmadas" e "Ao vivo desde 1º/10: 68 de 98 (69%), amostra de apenas 10 dias". ⚪

---

## Parte 3. Página de uma usina (`/app/plants/CJU_BASAR` e mais 7)

Usinas: Serra do Assuruá (BA), Rio do Vento (RN), Rio do Vento Expansão (RN), Novo Horizonte (BA), Sol do Sertão (BA), Assu Sol (RN), Itarema V (CE), Mauriti (CE).

| Ordem | Seção | O que mostra ou faz | Status | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Link "← Voltar ao Atlas"** | Volta ao Início. | | ⚪ |
| 2 | **Cabeçalho da usina** | Selo eólica/solar, código do ONS, nome, município e UF ("localização aproximada"), **operador**, **capacidade** (agora rotulada "disponibilidade máxima informada ao ONS", que é o que o dado realmente é), **ponto de conexão**. | REAL | ✅ |
| 3 | Dois cartões: **energia perdida jan–jul/2026** e **meias-horas cortadas** | Tamanho do corte da usina. | REAL | ✅ |
| 4 | **Mapa** só dessa usina | Um círculo, zoom no local. | | ⚪ |
| 5 | **Calculadora de carga junto à usina** (agora **logo abaixo do cabeçalho**; ver 3.1) | O coração da ferramenta. | ESTIMATIVA | ✅ |
| 6 | **Tabela "Janelas previstas (aguardando o ONS)"** | Data, janela, chance, esperado, valor de referência e situação do ONS. **Sem botão de reserva.** | ESTIMATIVA | ✅ |
| 7 | **"Por que esta usina é cortada (2026)"** | GWh cortados e a barra ENE/CNF/REL da usina. | REAL | ✅ |
| 8 | **Mapa de calor "Chance de corte por mês e hora"** | 12 meses × 24 horas; passar o mouse mostra "mês hora: %". Dados de jan/2025 até a data atual. | REAL | ✅ |
| 9 | **Tabela "Janelas recentes e o veredito do ONS"** | Últimos ~14 dias: data (marcada **ao vivo** desde 1º/10), janela, chance prevista, energia cortada, razões, situação (**confirmada** / **errada**). **Sem botão Replay.** | REAL | ✅ |
| 10 | **Cartão "Teste retroativo desta usina"** | "59 de 61 janelas confirmadas (ago–set)", ao vivo, e precisão, cobertura e energia capturada de agosto e setembro. | REAL | ⚪ |

### 3.1 A calculadora de carga (cada controle)

| # | Controle | Como funciona |
| --- | --- | --- |
| 1 | **Título e parágrafo** | Explica que tudo é estimativa a partir do passado, sem previsão nem oferta. |
| 2 | **Caixa de aviso (borda preta)** | "Histórico, não garantia. Cálculo com dados do ONS; o contrato com a usina precisa ser negociado." Sempre visível. |
| 3 | **Campo "Carga ao lado da usina (computadores, fábrica…)" em MW** | Padrão 10. Aceita decimais (vírgula ou ponto). Acima da capacidade, aparece um aviso e o cálculo usa a capacidade. |
| 4 | **Controle deslizante "Horas de operação por dia"** | De 1 a 24, padrão 8. |
| 5 | **Menu "Começa às"** | De 00:00 a 23:00, padrão 08:00. |
| 6 | **Aviso do melhor horário** | Só aparece quando existe um horário de início que dá **pelo menos 3% a mais** de horas de corte (antes aparecia por diferenças mínimas). Botão **"Usar esse horário"**. |
| 7 | **Cartão "Horas de corte por mês, dentro do seu horário"** | Ex.: 179,3 h de 243 horas de operação (74%). |
| 8 | **Cartão "Energia que a sua carga teria podido usar"** | Ex.: 1.793 MWh por mês, limitada pela carga, pela capacidade e pela potência média cortada da usina (ex. 187 MW). |
| 9 | **Cartão "Valor de referência para negociação"** | Ex.: R$ 186.700 por mês ao PLD médio (R$ 104,15/MWh); o texto traz também o valor ao piso (R$ 57,31/MWh). |
| 10 | Duas frases abaixo dos cartões | (a) "É um ponto de partida para conversar com a usina, não um preço, um lucro nem uma economia garantida." (b) **Nova premissa:** "a usina poderia ter alimentado a sua carga em todas as horas de corte; na prática isso depende do contrato, da conexão à rede e da regulação." |
| 11 | **Tabela "Por que essas horas foram cortadas"** | Sobra de energia (ENE), Elétrica (CNF + REL) e, quando relevante, Outras: horas e MWh por mês. |
| 12 | Notas | A divisão é uma aproximação; o corte elétrico é menos previsível. |
| 13 | **Caixa "Sobre a regulação"** | Resolução Aneel 1.170/2026 (publicada em 09/10/2026), descrita **pelo texto**: art. 2º, §9º (autoprodução no mesmo ponto de conexão, corte por razão energética só no que superar o consumo local, até o limite que não afete o processo industrial). Diz que o corte elétrico está em outro artigo (art. 3º), que **não avaliamos**, e que o Nomos não avaliou se uma carga específica é coberta. |
| 14 | **Seção recolhível "Como calculamos"** | As fórmulas e os limites. |

Tudo recalcula na hora, no navegador. Nada é enviado a nenhum servidor.

---

## Parte 4. Placar (`/app/track-record`)

Pergunta que a página responde: "Posso confiar na previsão?".

| Ordem | Seção | O que mostra | Status | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Título e abertura** | "Prevemos cada meia hora de agosto e setembro para 154 usinas…", "capturaram 90% (ago) e 95% (set)", "564 de 614 janelas confirmadas". | REAL (retroativo) | ⚪ |
| 2 | **Cartão "Ao vivo desde 1º de outubro"** | "68 de 98 janelas confirmadas (69%)"; **"Amostra: 98 janelas em apenas 10 dias"**; "Previsões publicadas antes do dia (desde 8/10): 28 de 29". | REAL | ✅ |
| 3 | **"Por que o começo de outubro está mais fraco"** | Os erros se concentram em duas usinas do RN (21 dos 30 erros). O corte noturno por confiabilidade delas parou em 28–29/09 e **voltou por volta de 8/10**. A maioria das outras usinas ficou perto do teste; Sol do Sertão e Assu Sol ficaram uns 20 pontos abaixo, com 10 janelas cada. | REAL (conferido nos dados) | ✅ |
| 4 | **"O modelo ganha de uma regra ingênua?"** | Erro médio do modelo e da regra ingênua (hoje 29,9 p.p. nos dois), frase de veredito (hoje "empate"), quantas janelas a regra ingênua também ofereceria (78 de 98), **e, novo, o resultado usina por usina: o modelo ficou mais perto em 2 das 8 e a regra ingênua nas outras 6**, com o aviso de que 10 dias é "uma primeira olhada". | REAL | ✅ |
| 5 | Nota "O resultado ao vivo aparece como vier, erros incluídos…" | Quando cada previsão foi publicada e carimbada. | | ⚪ |
| 6 | **Cartão "Três tipos de corte"** | Barra ENE/CNF/REL e tabela: peso, % capturado nas nossas janelas e **"ressarcimento à usina"** (CNF e REL "previsto em lei"; ENE "não"). A nota diz, segundo a imprensa, que uma portaria do ministério (Portaria MME 140/2026) cobre eventos de set/2023 a nov/2025 para quem aderir, e que a REN 1.170/2026 manda a CCEE ratear a energia cortada entre as usinas elegíveis. Gráfico de composição por mês. | REAL | ✅ |
| 7 | **Tabela "Comparação de modelos"** | 6 modelos (taxa média, regra fixa 8h–15h, mesmo mês de 2025, perfil de 8 semanas, combinado e o de produção em destaque) para ago e set. No celular vira cartões. | REAL | ⚪ |
| 8 | **Caixa "Leia isto antes de citar a precisão"** | Mesmo um modelo que ignora a hora acerta 89%, porque essas usinas são cortadas em cerca de 47% das meias-horas. | REAL | ✅ |
| 9 | **"Calibração (agosto)"** e **"Por tipo de usina"** | Gráfico de pontos e resultado por eólica e solar, mais a lista das 8 usinas com confirmadas/janelas no teste e ao vivo. | REAL | ⚪ |
| 10 | **"Qualquer pessoa pode reproduzir"** | Impressões digitais SHA-256 de cada arquivo de saída (conferidas: as 9 batem), e a frase: "O único registro na blockchain no atlas é a impressão digital de cada previsão diária. A plataforma a grava, como oráculo declarado (o ONS não assina nada)…". | REAL | ✅ |

---

## Parte 5. Método (`/app/method`)

Pergunta que a página responde: "O que é real, o que é simulado e o que é estimado?".

| Seção | Conteúdo | Coerência |
| --- | --- | --- |
| **Título "Método e transparência"** | "O que é real, o que é simulado e o que é estimado — dito antes de alguém perguntar." | ✅ |
| **3 cartões coloridos** | **Real** (verde): dados do ONS, placar ao vivo, previsões, janelas e o **PLD horário com o período lido dos dados** (hoje "1º jan 2026 – 11 out 2026"). **Estimado** (laranja): energia esperada (±20%) e valor da janela. **Visão futura, simulada** (roxo): um único item dizendo que reserva de janelas, pagamento em USDC de teste e recibos **não fazem parte do produto e ficam no Laboratório**, com o link "Ver o Laboratório (simulação) →". | ✅ (Pix, operador e reserva por janela saíram daqui) |
| **Definições** | Corte, GNRa, meia hora cortada (≥ 1 MW médio), janela, confirmada, razões ENE/CNF/REL. | ✅ |
| **Dados abertos** (9 links de download) | CSV e JSON do atlas, mais o link **"Código-fonte no GitHub →"** (repositório do Guilherme; ver 1.3). | ✅ |
| **Limitações** | Só padrões passados; dados recentes podem ser revisados; o ONS reporta conjuntos; **"O Nomos não vende eletricidade nem qualquer outro serviço hoje"**; o único registro na blockchain é a impressão digital da previsão (oráculo declarado e centralizado); valores e calculadora são estimativas; **ninguém validou quem pagaria pelo atlas, pela calculadora ou por um certificado**; e **uma carga ao lado de uma usina só poderia usar a energia cortada se contrato, conexão e regulação permitirem**. | ✅ |

---

## Parte 6. Laboratório (`/app/lab`)

Onde está tudo o que veio da ideia anterior (reserva, pagamento de teste, recibo). **Não é o produto.**

| # | Elemento | O que faz |
| --- | --- | --- |
| 1 | **Título** "Laboratório (simulação)" | |
| 2 | **Caixa roxa destacada** | "Visão futura, simulada na devnet: não é o produto e não vende eletricidade." |
| 3 | Parágrafo de abertura | Explica a ideia e diz que nada da página faz parte do produto. |
| 4 | **"1. Experimente uma reserva (demonstração)"**: menu **Usina** e menu **Janela** (grupos "Próximas janelas" e "Janelas passadas (replay)") | Mostra um resumo da janela escolhida (janela, chance, esperado ou cortado, veredito) e o botão **Reservar (demo)** (ou **Replay** em janela passada), que abre a janela de reserva (ver 6.1). |
| 5 | **"2. Veja um ciclo completo"** | Explica o ciclo real de 08/10 (Rio do Vento Expansão, janela 18:30–24:00; o trabalho rodou dentro da janela; o ONS confirmou corte em 82% das meias-horas, 427 MWh) e leva a `/verify` com essa transação. |
| 6 | **"3. Verifique uma reserva"** | Leva a `/verify`. |
| 7 | **Cartão "O que é simulado"** | 7 itens: usina e operador são carteiras de teste; o trabalho roda num notebook e não absorve energia; saída em reais (Pix) seria por provedor autorizado; a reserva por janela é um conceito (hoje os contratos são longos); o oráculo da fase 2 é declarado; recibos dependem das chaves do servidor; ninguém validou que um comprador pagaria. |
| 8 | **Cartão "Como a demonstração funciona"** | Os 5 passos: previsão carimbada, reserva e pagamento (usina 70%, operador 25%, plataforma 5%), recibo, execução, carimbo do ONS. |

### 6.1 A janela de reserva (abre ao clicar em Reservar ou Replay)
Painel que sobe na tela (no celular, vem de baixo). Fecha com o **✕**, com a tecla **Esc** ou clicando fora. Contém: faixa roxa "Demo na devnet…", faixa laranja de replay (se for o caso), o texto "O que você recebe" (diz que **não se compra eletricidade**), controle deslizante de MWh (0,1 a 5), caixa de preço (USDC, R$, PLD, câmbio PTAX; a computação não entra no preço), a divisão 70/25/5, e o fluxo da Phantom: instalar → conectar → saldo → **Pagar X USDC** → pagamento confirmado → recibo e carimbo → link para a comprovação. Mensagens de erro para cancelamento, expiração, falha de rede e simulação.

⚠️ **No site publicado na Vercel não há as chaves das carteiras de teste**, então o pagamento de teste acontece, mas o recibo e o carimbo não são emitidos (o Laboratório avisa isso). Exige Phantom em modo teste com SOL e USDC de teste.

---

## Parte 7. Verificar (`/app/verify`)

Faz parte do Laboratório (um aviso lilás no topo diz isso).

| # | Elemento | O que faz |
| --- | --- | --- |
| 1 | **Título "Verificar uma reserva"** e aviso "Parte da simulação (Laboratório). Não é o produto Nomos." | |
| 2 | **Sem transação (novo):** cartão "Ainda não há reserva para verificar" | Explica a página e traz dois links: o **exemplo completo do ciclo de 08/10** e o **Laboratório**. |
| 3 | **Campo para colar a transação** ("Já tem o endereço de uma transação? Cole aqui:") e botão **Verificar** | Busca a transação e mostra os cartões abaixo. |
| 4 | Cartões **Pagamento**, **Recibo (fase 1)**, **Execução**, **Carimbo do ONS (fase 2)** | Lidos direto da Solana devnet: valores, assinantes, janela, se o trabalho rodou dentro da janela, o que a IA encontrou, veredito do ONS, links para a cópia exata do arquivo do ONS e a versão atual. |
| 5 | **"Confira você mesmo"** e aviso roxo | Passo a passo para verificar sem confiar no site. |

O ciclo de exemplo funciona no site publicado (só leitura: não precisa das chaves).

---

## Parte 8. Os bastidores (sem tela)

| Parte | O que faz | Status |
| --- | --- | --- |
| `GET /api/previsao` | Devolve a previsão publicada e o seu registro na Solana. Usada pelo selo da previsão. | Funciona no site publicado |
| `POST /api/previsao` | Grava o hash da previsão na Solana. | Precisa de chaves; **não funciona no site publicado** |
| `POST /api/recibo` | Confere uma reserva e emite recibo e carimbo. | Só leitura funciona; emitir precisa de chaves |
| `POST /api/carimbar` | Carimba as reservas pendentes. | Precisa de chaves |
| **Atualização diária** (GitHub Actions, 12h40 e 18h10) | Baixa o dado novo do ONS, recalcula, publica e registra na Solana. | ⚠️ O arquivo aponta para o site do **Guilherme** (`nomos-energy.vercel.app`) e não foi alterado. Neste site os dados ficam parados em 10/10. |
| **Operador de demonstração** (`operador/`) | Programa que roda no notebook de alguém, esperando reservas. | SIMULADO |

---

## Parte 9. Coerência com a premissa (resumo)

**Tudo o que está no caminho principal (apresentação, login, início, usina, Placar, Método) é ✅ ou ⚪.** O que pertencia à reserva simulada (botões, GPU, bloco roxo, página Verificar, operador) está no Laboratório ou escondido por interruptores em `site/src/lib/recursos.ts`.

Pontos que ainda pedem uma decisão do time:
1. **Atualização diária dos dados desta cópia** (depende de mexer no workflow, que está na lista de proibidos sem autorização).
2. **Link do GitHub do rodapé** (trocar `REPOSITORIO` em `tipos.ts`) e a menção ao hackathon.
3. **Só 8 usinas** têm calculadora, de 166.
4. **Sem login, relatório exportável, cenários salvos ou alertas** (os "formatos de acesso" da página inicial são só ideias).
5. **O modelo empata com a regra ingênua** (10 dias de amostra): está dito no Placar.
6. **O Laboratório é público**, com o selo "simulação" no menu.
