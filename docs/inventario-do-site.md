# Inventário completo do site Nomos: cada página, seção, botão e função

Versão de **13/10/2026, depois do redesenho visual para o público-alvo** (branch `design`, em cima da revisão geral e do fluxo apresentação → login → plataforma). Escrito lendo o código do site (`site/src`). Cada item diz **o que é**, **o que acontece quando você usa**, **de onde vem a informação** e se **combina com a premissa**.

**A premissa de referência** (a "Ideia A"): o Nomos é uma **ferramenta de informação para decidir** onde instalar ou expandir uma unidade ao lado de uma usina eólica ou solar. Ele **não vende nada**. O modelo de negócio é hipótese, não validada.

**Legenda de status:**
- **REAL**: dado oficial ou cálculo direto dele.
- **ESTIMATIVA**: cálculo a partir do passado, que não é garantia.
- **SIMULADO**: demonstração em rede de teste, com carteiras falsas.

**Legenda de coerência** com a premissa:
- ✅ **Alinha**: é o coração da ferramenta de decisão.
- ⚪ **Apoio**: sustenta a credibilidade, sem confundir.
- ⚠️ **Revisar**: ainda pede uma decisão ou um ajuste.

> **O fluxo do site agora tem 3 paradas:** (1) a **apresentação** em `/`, que mostra a dor e tem os botões "Quero realizar o cadastro" e "Quero conhecer mais"; (2) a tela de **login** em `/login` (botão do Google); (3) a **plataforma** em `/app` ("Onde instalar"), que é tudo o que este documento descreve nas Partes 1 a 8. O login com o Google **ainda não está ligado**: o botão leva direto à plataforma e a tela avisa.

> **O que mudou neste documento (redesenho visual, 13/10/2026):** o Início virou **"Onde instalar"** (o visitante informa a carga e vê um ranking das usinas), a página da usina ganhou a resposta "em uma frase", o gráfico das horas e botões para copiar/compartilhar/imprimir, há balões de explicação dos termos, glossário, navegação em abas no celular e pré-visualização do link. Nenhum número, fórmula, dado ou rota mudou. A razão de cada escolha está em `docs/design-publico-alvo.md`.

> **O que mudou na versão anterior deste documento (revisão geral):** a reserva (botões Reservar e Replay), as "horas de GPU", o bloco roxo "Visão futura" do Início e a aba "Verificar" saíram do caminho principal e foram para o **Laboratório** (`/lab`). A calculadora subiu para o topo da página da usina. Há aviso de dados antigos, páginas 404 e de erro próprias, e o site abre em português quando o navegador está em português.

---

## Parte 0. O site em números

- **8 páginas** (rotas): **Apresentação `/`**, **Login `/login`**, e as da plataforma: **Onde instalar `/app`**, Usina `/app/plants/<id>` (8 páginas, uma por usina), Placar `/app/track-record`, Método `/app/method`, **Laboratório `/app/lab`** e Verificar `/app/verify` (que faz parte do Laboratório). Mais a página 404 e uma página de erro. Os **endereços antigos** (`/plants/...`, `/track-record`, `/method`, `/lab`, `/verify`) redirecionam para os novos.
- **8 usinas de destaque** têm página própria e calculadora, de **166 conjuntos** modelados (RN, BA e CE).
- **2 idiomas** (PT e EN). Sem escolha salva, o site abre em **português se o idioma principal do navegador for português** (pt, pt-BR, pt-PT) e em inglês nos demais casos. A escolha pelo botão PT/EN fica salva no navegador (`localStorage`).
- **Sem login, sem conta, sem cookies de rastreio, sem analytics.** O que fica guardado no aparelho do visitante: o idioma, o **cenário** (MW, horas por dia e início) e se ele já fechou o quadro "Como ler esta página". Nada disso vai para um servidor.
- **O cenário viaja num link** (`?mw=10&h=8&i=8`, mais `&m=1` para "melhor horário"): quem recebe abre a mesma conta. O endereço é limpo logo depois de lido.
- **Cálculos** da calculadora, do ranking e da comparação com a regra ingênua: feitos com os dados já carregados, no navegador.
- **Funciona em celular, tablet e computador.** No celular há uma **barra de abas fixa embaixo**; as tabelas largas viram cartões.
- **Link no WhatsApp com pré-visualização**: título, descrição e uma imagem (gerada com dados reais) aparecem quando o endereço é colado numa conversa.
- **Tudo é público**: qualquer pessoa com o link vê tudo.

---

## Parte A. Apresentação (`/`): a 1ª parada do fluxo

Página pública que mostra a dor e tenta convencer o visitante. Pergunta que responde: "Isto serve para mim? Por que me cadastrar?". Visual: papel quente, verde-floresta, títulos em serifa (ver `docs/design-publico-alvo.md`).

| Ordem | Seção | O que mostra ou faz | Dado |
| --- | --- | --- | --- |
| 0 | **Cabeçalho próprio** | Logotipo; âncoras **O problema**, **Como funciona**, **Para quem é**, **Transparência** (só em tela larga); seletor PT/EN; **Entrar** e **Quero me cadastrar** (levam a `/login`; no celular fica só um botão "Entrar"). Fixo no topo. | |
| 1 | **Abertura** | Título "A energia limpa está sobrando no Nordeste. *Descubra quanto dela caberia na sua operação.*", frase de apoio, botões **"Quero me cadastrar"** (vai ao login) e **"Ver como funciona"** (desce até "Como funciona"), três provas ("Dados abertos do ONS e da CCEE", "Placar público de acertos e erros", "Fórmulas à vista") e o aviso "Versão de teste… O Nomos não vende energia nem contrato". Ao lado, o **cartão de exemplo com dados reais**: Serra do Assuruá, carga de 10 MW, 8 h por dia, com o **gráfico das horas em que a usina costuma ser cortada** (o horário da carga em destaque) e três números: 179 h de corte por mês, 1.793 MWh, R$ 186,7 mil de valor de referência (a mesma conta da calculadora, calculada na hora). | atlas.json |
| 2 | **Quanta energia limpa está sobrando** | Explica o corte em duas frases e mostra 3 números (3,4 GW, 82 GWh por dia, R$ 2,6 bi estimados, "não é dinheiro que alguém recebeu"). | atlas.json |
| 3 | **O problema** (`#problema`) | "Decidir no escuro onde instalar uma carga custa caro", as 3 perguntas que quem quer instalar uma carga não consegue responder hoje, e o gráfico "Quando o corte acontece" (eólica × solar por hora; a parte de 8h a 14h59 é calculada na hora, hoje 61%). | atlas.json |
| 4 | **Como funciona** (`#como-funciona`) | 3 passos, cada um com uma miniatura do produto feita com dados reais (campos da carga; ranking das usinas; resultado e divisão sobra de energia × elétrico), e a cobertura honesta: "8 usinas de destaque têm a calculadora; o catálogo modela 166 conjuntos". | atlas.json |
| 5 | **O que você encontra na plataforma** | 4 cartões com ícone: atlas do corte, calculadora de carga, previsão de 8 dias e placar público, dados abertos. | texto |
| 6 | **Para quem é e como seria o acesso** (`#para-quem`) | Selo "Hipótese, ainda não validada": 3 perfis e 3 formatos possíveis, sem preço e sem promessa. | texto |
| 7 | **Transparência** (`#transparencia`) | "O que o Nomos é" × "O que o Nomos não é" (não vende nada; não promete economia nem preço; não substitui contrato nem parecer jurídico), os **três níveis de evidência** ("Dado oficial", "Estimativa", "Simulação", sempre com a mesma cor e ícone) e o que ainda está sendo validado. | texto |
| 8 | **Perguntas frequentes** | 5 perguntas: vende energia? os números são garantidos? de onde vêm os dados? quais usinas estão cobertas? quanto custa ("nesta fase não cobramos e ainda não definimos preços")? | texto |
| 9 | **Chamada final** (painel verde-escuro) | "Pronto para ver o corte da usina que interessa à sua operação?" com **Quero me cadastrar** e **Voltar ao topo**. | |
| 10 | **Rodapé** (faixa escura) | Logotipo, "Versão de teste", links da plataforma, nota sobre os dados, GitHub e a menção ao hackathon. | |

---

## Parte B. Login (`/login`): a 2ª parada do fluxo

Em tela larga é **dividida em duas**: à esquerda um painel verde-escuro com "Veja onde a energia sobra antes de decidir onde instalar" e 3 pontos (comparar usinas para a sua carga, entender por que o corte acontece, conferir os números); à direita o cartão de login. No celular, os 3 pontos aparecem abaixo do cartão.

| # | Elemento | O que faz |
| --- | --- | --- |
| 1 | **Logotipo e seletor PT/EN** | O logotipo volta à apresentação. |
| 2 | **Cartão de login** | "Entrar no Nomos. Use a sua conta do Google para abrir a plataforma." |
| 3 | **Botão "Continuar com o Google"** (com o logotipo do Google) | **Hoje leva direto à plataforma**, ou ao endereço pedido em `?from=` quando ele é interno (`/app/...`); qualquer outro destino é ignorado (proteção contra redirecionamento para outro site). |
| 4 | **Aviso** "Versão de teste: o login com o Google ainda não está ligado…" | Aparece enquanto o login real não existir. Some quando ele for ligado. |
| 5 | Frase "Esta é uma versão de teste: os números são estimativas…" | Aviso de honestidade. |
| 6 | Links **← Voltar para a apresentação** e **Quero conhecer mais antes** | Voltam à apresentação (o segundo, já na seção "Como funciona"). |

Como ligar o login real: só o arquivo `site/src/lib/sessao.tsx` muda (ver o `CLAUDE.md`).

---

## Parte 1. Elementos que aparecem em TODAS as páginas da plataforma (`/app/...`)

### 1.1 Navegação

| # | Elemento | O que faz | Coerência |
| --- | --- | --- | --- |
| 1 | **Logotipo "nomos"** | Clique leva à página de entrada da plataforma (`/app`). | ⚪ |
| 2 | **Onde instalar** | Vai a `/app`. Fica destacado também em qualquer página de usina. | ✅ |
| 3 | **Placar** | Vai a `/app/track-record`. | ⚪ |
| 4 | **Método** | Vai a `/app/method`. | ⚪ |
| 5 | **Laboratório** com o selo **"simulação"** (em tela média, um ponto roxo) | Vai a `/app/lab`. Fica destacado também em `/app/verify`. | ✅ separa a simulação do produto |
| 6 | **Seletor PT / EN** | Troca todo o texto do site na hora e guarda a escolha. | ✅ |
| 7 | **Sair** (só o ícone, abaixo de 1024 px) | Volta para a apresentação (`/`). Quando o login real for ligado, também encerra a sessão. | ✅ |

**No computador** (a partir de 768 px) a navegação fica no topo, com ícones e nomes; **no celular** o topo mostra só o logotipo, o idioma e "sair", e a navegação vira uma **barra de abas fixa embaixo** (ícone e nome; a aba ativa tem uma linha verde no alto). A apresentação e a tela de login têm cabeçalhos próprios (partes A e B). Há um link "Pular para o conteúdo" para quem usa o teclado.

### 1.2 Aviso de dados antigos
Faixa amarela logo abaixo do cabeçalho. **Só aparece quando os dados têm 3 dias ou mais** (contados em dias de Brasília): "Dados até 10 de out. de 2026 (há N dias). Esta versão de teste ainda não se atualiza sozinha, então as janelas previstas para dias que já passaram deixaram de ser previsões." Some sozinha quando os dados forem atualizados. ✅

### 1.3 Rodapé
- "Dados: ONS, dados abertos (CC-BY). Preços: CCEE, dados abertos (PLD horário)." (REAL, ⚪).
- "Feito pelo time Nomos para o Colosseum Crypto World's Fair 2026" + link **GitHub**. ⚠️ O link aponta para o repositório do **Guilherme** (`AmorimGui/Hackaton-Project`). Para trocar, edite **uma linha**: a constante `REPOSITORIO` em `site/src/lib/tipos.ts` (ela também alimenta o "Código-fonte" do Método). A menção ao hackathon é uma escolha do time.

### 1.4 Outras páginas de sistema
- **Página 404** própria (em PT/EN, com ícone de bússola e botão "Voltar ao início"). A padrão do Next ficava preta no modo escuro.
- **Página de erro**: se alguma página falhar, mostra "Algo deu errado" com o botão "Tentar de novo".

### 1.5 Ao instalar no celular, ao imprimir e ao compartilhar
- O site tem um manifesto: no celular dá para "Adicionar à tela inicial" e abrir como app (ícone verde com o símbolo da marca).
- **Impressão / salvar em PDF**: o menu, os botões e o mapa somem; entra uma faixa com a marca, a data e "Estimativas calculadas com dados passados do ONS e da CCEE. Não é garantia."
- **Pré-visualização do link** (WhatsApp, LinkedIn, e-mail): título "Nomos — onde instalar ao lado de uma usina eólica ou solar", descrição e a imagem `opengraph-image` (a mesma ideia do cartão de exemplo da abertura, com o gráfico por hora).

### 1.6 Balões de explicação dos termos
Em vários pontos (cabeçalhos de tabela, calculadora) há um pequeno **ⓘ** ou uma palavra com sublinhado pontilhado (MW, MWh, PLD, ENE, CNF, REL, janela, chance…). Tocar, passar o mouse ou focar com o teclado abre um balão com a definição; Esc ou tocar fora fecha. Os textos vêm do bloco `glossary` do dicionário e aparecem também, em ordem alfabética, no **Glossário** do Método.

---

## Parte 2. Onde instalar (`/app`)

Pergunta que a página responde: "Onde faz mais sentido instalar a minha carga?". É a página de entrada da plataforma.

### 2.1 Abertura

| # | Elemento | O que mostra ou faz | Coerência |
| --- | --- | --- | --- |
| 1 | Etiqueta "Onde instalar" e **título**: "Onde faz mais sentido instalar a sua carga?" | A pergunta de decisão. | ✅ |
| 2 | Frase "Conte como é a sua carga e veja, usina por usina, quanta energia cortada ela teria encontrado no passado." e a etiqueta "Dados até 10 de out. de 2026" | Contexto e idade dos dados. | ✅ |
| 3 | **Quadro "Como ler esta página"** (3 passos, botão **Entendi**) | Aparece na primeira visita; ao fechar, não volta (fica guardado no aparelho). | ✅ |

### 2.2 O cenário ("A sua carga")

| # | Controle | Como funciona |
| --- | --- | --- |
| 1 | **Carga (MW)** com botões − e + e **atalhos 1 · 5 · 10 · 50 · 100 MW** | Padrão 10. Aceita decimais (vírgula ou ponto). Os botões − e + andam de 1, 5, 10 ou 50 MW conforme o tamanho. |
| 2 | **Horas por dia** (controle deslizante, 1 a 24) | Padrão 8. |
| 3 | **Começa às** (menu 00:00 a 23:00) e, abaixo, o horário completo ("08:00–16:00") | Padrão 08:00. |
| 4 | **Horários rápidos**: Horário comercial · 08h–18h, Horas de sol · 09h–15h, 24 horas, Noite · 20h–04h | Preenchem início e horas de uma vez. |
| 5 | **"Usar o melhor horário de início de cada usina"** (chave liga/desliga) | Para cargas que podem escolher quando rodar: cada usina aparece no horário de início com mais horas de corte, e a tabela mostra qual é. |

O cenário vale para todas as páginas e fica guardado no aparelho.

### 2.3 O resultado (o ranking)

| # | Elemento | O que mostra ou faz | Dado | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Título** "Para 10 MW, 8 h por dia (08:00–16:00)" + selo **Estimativa** | Resume o cenário e avisa que é estimativa. | cálculo | ✅ |
| 2 | **Ordenar por**: Energia · Horas · Valor · Parte previsível | Reordena as usinas. | cálculo | ✅ |
| 3 | Frase "A usina que mais teria dado à sua carga: Novo Horizonte (BA), cerca de 1.870 MWh por mês." | O destaque do cenário. | cálculo | ✅ |
| 4 | **Tabela (computador) / cartões (celular)** das 8 usinas | Para cada uma: nome (link), selo eólica/solar, município e UF, **horas de corte por mês**, **energia aproveitável por mês** (MWh, com barra), **valor de referência por mês** e **sobra de energia** (a parte previsível da energia cortada, ENE). A primeira recebe o selo "Mais energia". Uma seta leva à calculadora da usina. | atlas.json (mesma conta da calculadora) | ✅ |
| 5 | Nota do valor | "Valor de referência por mês = energia aproveitável × o PLD médio de R$ 104,15/MWh…". | texto | ✅ |
| 6 | **Aviso amarelo** | "Mais energia cortada não significa um negócio melhor: ainda é preciso conferir a conexão à rede, o contrato e a regulação. O valor é uma referência…" | texto | ✅ |
| 7 | **Mapa** (OpenStreetMap + Leaflet, em tons de cinza) ao lado da tabela | Um círculo por usina: azul = eólica, âmbar = solar; tamanho = capacidade; preenchimento = aproveitamento relativo no cenário. **Passar o mouse numa linha da tabela destaca a usina no mapa.** Clicar num círculo abre a página da usina. A rolagem do mouse não dá zoom. | atlas.json | ✅ |

### 2.4 Janelas previstas

| # | Elemento | O que faz | Dado |
| --- | --- | --- | --- |
| 1 | Título e frase "Previsões reais, feitas só com dados do ONS publicados até 10/10…" | Explica o que são. | texto |
| 2 | **Selo da previsão** (quadro verde: "A impressão digital desta previsão foi gravada na Solana em …") com links **Solana Explorer ↗**, **arquivo da previsão** e o início do **sha256** | Mostra que a previsão do dia está carimbada na blockchain. Só aparece se existe o registro. Lê a blockchain na hora (`/api/previsao`). REAL (devnet), ⚪ é o único uso defendido de blockchain. | |
| 3 | **Abas de dia** (8 botões, de "dom., 11 de out." a "dom., 18 de out."; rolam para o lado no celular) | Trocam o dia mostrado na tabela e na frase de totais. | atlas.json |
| 4 | **Tabela das 8 usinas** | Nome, **janela**, **chance** (barra e %), **esperado** (ex. ~2,4 GWh) e **valor de referência** (com "est." quando o PLD da hora ainda não saiu). No celular vira lista de cartões. **Não há "horas de GPU" nem botão de reserva** (os interruptores de `recursos.ts` continuam lá). | atlas.json |
| 5 | Linha de totais e nota do valor | Soma do dia (todas as usinas modeladas) e "valor de referência = energia esperada × PLD…, não um preço". | atlas.json |

### 2.5 "O corte no Nordeste, em números" e "Por que acontece"

| # | Elemento | O que mostra | Status |
| --- | --- | --- | --- |
| 1 | **4 números**: 3.415 MW médios cortados · 82 GWh por dia · R$ 2,6 bi (estimativa, "não é dinheiro que alguém recebeu") · 90% / 95% da energia cortada dentro das nossas janelas (ago / set) | O tamanho do corte e a captura. | REAL / ESTIMATIVA |
| 2 | **Energia cortada por hora do dia (jan–jul/2026)** | Duas linhas, eólica e solar, com o pico de cada uma, a faixa de 8h a 15h sombreada e balão com os valores ao passar o mouse (ou com as setas do teclado). A frase "61% da perda eólica fica entre 8h e 14h59" agora é **calculada dos dados**. | REAL ✅ |
| 3 | **Chance de corte**: dia útil × fim de semana e feriado | 30% × 38%. O corte sobe quando a demanda cai. | REAL ✅ |
| 4 | **Três tipos de corte** | Uma linha por razão (ENE em destaque, CNF e REL em cinza) com o nome, o código e o %. Link para o Placar. | REAL ✅ |
| 5 | **O preço vai ao piso justamente quando a energia é cortada** | % das horas com PLD no piso, por hora (colunas finas; pico de 8h a 15h sombreado). | REAL ✅ |
| 6 | **Potência cortada média no Nordeste, por mês** | Colunas mensais, eólica + solar. | REAL ✅ |

Todos os gráficos têm **"Ver como tabela"** (a versão em números do mesmo gráfico).

### 2.6 Faixa final
**"Veja como a previsão se saiu →"**: painel verde-escuro que leva ao Placar. Mostra "564 das 614 janelas oferecidas em ago–set foram confirmadas" e "Ao vivo desde 1º/10: 68 de 98 (69%), amostra de apenas 10 dias". ⚪

---

## Parte 3. Página de uma usina (`/app/plants/CJU_BASAR` e mais 7)

Usinas: Serra do Assuruá (BA), Rio do Vento (RN), Rio do Vento Expansão (RN), Novo Horizonte (BA), Sol do Sertão (BA), Assu Sol (RN), Itarema V (CE), Mauriti (CE).

| Ordem | Seção | O que mostra ou faz | Status | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Link "← Onde instalar"** | Volta à página de entrada. | | ⚪ |
| 2 | **Cabeçalho da usina** | Selo eólica/solar, código do ONS, **nome em serifa**, município e UF ("localização aproximada"), **operador**, **capacidade** ("disponibilidade máxima informada ao ONS", com balão sobre MW), **ponto de conexão**. | REAL | ✅ |
| 3 | Dois cartões: **energia perdida jan–jul/2026** e **meias-horas cortadas** | Tamanho do corte da usina. | REAL | ✅ |
| 4 | **Mapa** só dessa usina | Um círculo, zoom no local. | | ⚪ |
| 5 | **Calculadora de carga junto à usina** (logo abaixo do cabeçalho; ver 3.1) | O coração da ferramenta. | ESTIMATIVA | ✅ |
| 6 | **Tabela "Janelas previstas (aguardando o ONS)"** | Data, janela, chance, esperado, valor de referência e situação do ONS. **Sem botão de reserva.** | ESTIMATIVA | ✅ |
| 7 | **"Por que esta usina é cortada (2026)"** | GWh cortados e uma linha por razão (ENE, CNF, REL). | REAL | ✅ |
| 8 | **"Teste retroativo desta usina"** | "59 de 61 janelas confirmadas (ago–set)", ao vivo, e precisão, cobertura e energia capturada de agosto e setembro. | REAL | ⚪ |
| 9 | **Mapa de calor "Chance de corte por mês e hora"** | 12 meses × 24 horas numa escala de uma cor só (quanto mais escuro, mais vezes cortada); balão com "mês · hora: %"; **o horário do seu cenário aparece sublinhado nas colunas**. Dados de jan/2025 até a data atual. | REAL | ✅ |
| 10 | **Tabela "Janelas recentes e o veredito do ONS"** | Últimos ~14 dias: data (marcada **ao vivo** desde 1º/10), janela, chance prevista, energia cortada, razões, situação (**confirmada** / **errada**). **Sem botão Replay.** | REAL | ✅ |

### 3.1 A calculadora de carga (cada controle)

| # | Elemento | Como funciona |
| --- | --- | --- |
| 1 | **Título, frase de apoio e selo "Estimativa"** | Explica que tudo é estimativa a partir do passado, sem previsão nem oferta. |
| 2 | **Aviso amarelo** | "Histórico, não garantia. Cálculo com dados do ONS; o contrato com a usina precisa ser negociado." Sempre visível. |
| 3 | **Campos do cenário** (MW com − e +, horas por dia, começa às, atalhos) | Os mesmos de "Onde instalar", lidos e gravados no mesmo cenário. Acima da capacidade da usina, um aviso diz que o cálculo usa a capacidade; se a carga passa do que a usina costuma cortar, outro aviso diz que uma carga maior não encontraria mais energia. |
| 4 | **"Em uma frase"** | A resposta num texto corrido: "Com 10 MW ligados 8 horas por dia (08:00–16:00), esta usina teve corte em cerca de 179 horas por mês dentro do seu horário (74% dele). Nesse tempo, a sua carga teria podido usar cerca de 1.793 MWh por mês, o que vale cerca de R$ 186,7 mil por mês ao preço de referência: um ponto de partida para negociar, não um preço." |
| 5 | **Três cartões** | **Horas de corte por mês** dentro do seu horário (ex. 179 h de 243 horas de operação, 74%); **Energia que a sua carga teria podido usar** (ex. 1.793 MWh por mês, com balão sobre MWh); **Valor de referência para negociação** (ex. R$ 186,7 mil por mês ao PLD médio de R$ 104,15/MWh; ao piso, R$ 102,7 mil). |
| 6 | Duas frases | (a) "É um ponto de partida para conversar com a usina, não um preço, um lucro nem uma economia garantida." (b) "Premissa: a usina poderia ter alimentado a sua carga em todas as horas de corte; na prática isso depende do contrato, da conexão à rede e da regulação." |
| 7 | **Gráfico "Quando esta usina é cortada"** | 24 colunas com a chance de corte em cada hora (média do ano); as horas do seu horário em verde, as outras em cinza; uma chave sob o eixo marca o horário (vale também quando atravessa a meia-noite). Balão ao passar o mouse; "Ver como tabela". |
| 8 | **Aviso do melhor horário** | Só aparece quando existe um horário de início que dá **pelo menos 3% a mais** de horas de corte; o gráfico contorna esse horário. Botão **"Usar esse horário"**. |
| 9 | **"Por que essas horas foram cortadas"** | Duas linhas: Sobra de energia (ENE) e Elétrica (CNF + REL), com % , horas e MWh por mês (e "Outras" quando relevante). |
| 10 | Notas | A divisão é uma aproximação; o corte elétrico é menos previsível (quadro amarelo). |
| 11 | **Barra de ações**: **Copiar resumo**, **Copiar link do cenário**, **Enviar no WhatsApp**, **Imprimir / salvar em PDF** | O resumo é um texto pronto para colar numa conversa (usina, carga, horas, MWh, valor, o aviso de estimativa e o link com o cenário). Se o navegador não deixar copiar, o texto aparece numa caixa para copiar à mão. |
| 12 | Link **"Comparar com as outras usinas neste cenário"** | Volta a "Onde instalar" com o mesmo cenário. |
| 13 | **Quadro recolhível "Sobre a regulação"** | Resolução Aneel 1.170/2026 (publicada em 09/10/2026), descrita **pelo texto**: art. 2º, §9º (autoprodução no mesmo ponto de conexão, corte por razão energética só no que superar o consumo local, até o limite que não afete o processo industrial). Diz que o corte elétrico está em outro artigo (art. 3º), que **não avaliamos**, e que o Nomos não avaliou se uma carga específica é coberta. |
| 14 | **Quadro recolhível "Como calculamos"** | As fórmulas e os limites. |

Tudo recalcula na hora, no navegador. Nada é enviado a nenhum servidor (o botão do WhatsApp só abre o WhatsApp com o texto pronto).

---

## Parte 4. Placar (`/app/track-record`)

Pergunta que a página responde: "Posso confiar na previsão?".

| Ordem | Seção | O que mostra | Status | Coerência |
| --- | --- | --- | --- | --- |
| 1 | **Título, abertura e o placar em 3 números** | "Prevemos cada meia hora de agosto e setembro para 154 usinas…"; três cartões: **90% / 95%** da energia cortada dentro das nossas janelas (564 de 614 janelas confirmadas), **69%** ao vivo (68 de 98, "amostra de apenas 10 dias") e **"Empate"** na comparação com a regra ingênua (erro médio do modelo × da regra, em pontos percentuais). Abaixo, atalhos para cada seção. | REAL (retroativo) | ⚪ |
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
| **3 cartões com faixa colorida e o selo do nível de evidência** | **Real / Dado oficial** (verde): dados do ONS, placar ao vivo, previsões, janelas e o **PLD horário com o período lido dos dados** (hoje "1º jan 2026 – 11 out 2026"). **Estimado** (laranja): energia esperada (±20%) e valor da janela. **Visão futura, simulada** (roxo): um único item dizendo que reserva de janelas, pagamento em USDC de teste e recibos **não fazem parte do produto e ficam no Laboratório**, com o link "Ver o Laboratório (simulação) →". | ✅ (Pix, operador e reserva por janela saíram daqui) |
| **Glossário** (`#glossario`) | Em ordem alfabética, em duas colunas: ONS, CCEE, PLD, MW, MWh, corte, GNRa, meia hora cortada (≥ 1 MW médio), janela, chance, confirmada, teste retroativo e as razões ENE/CNF/REL. São os mesmos textos dos balões de explicação. | ✅ |
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
