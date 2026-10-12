# Raio-X completo do Nomos

> **Atenção:** este raio-X descreve o projeto **antes** da versão `so-decisao` (12/10/2026). A reserva simulada (botões Reservar e Replay), as "horas de GPU" e a aba Verificar saíram do caminho principal e foram para o Laboratório (`/lab`).

Escrito em 12/10/2026, a partir da leitura do código e dos dados do repositório `nomos-v2` (versão publicada na branch `main`). Para quem é iniciante em energia, cripto e programação: cada coisa é explicada em português simples, com a "situação de padaria" quando ajuda.

**Como ler:** a seção 1 resume tudo em 1 minuto. As seções 2 a 9 explicam cada peça. A seção 10 separa o que é **real**, **simulado** e **hipótese**. A seção 11 diz a que "ideia" cada funcionalidade pertence. A seção 12 lista os problemas que encontrei.

---

## 1. Resumo em 1 minuto

O Nomos faz **quatro coisas**:

1. **Baixa os dados oficiais do ONS** (o operador da rede elétrica do Brasil): a cada 30 minutos, quanto cada conjunto de usinas eólicas e solares foi mandado a produzir menos (o "corte"), e por quê.
2. **Calcula e prevê**: em quais horas cada usina costuma ser cortada, e em quais janelas ela provavelmente será cortada nos próximos 8 dias.
3. **Mostra tudo num site** (PT e EN): mapa, páginas por usina, placar público de acertos, método e a **calculadora de carga junto à usina**.
4. **Carimba a previsão na Solana** (uma blockchain de testes, a devnet) antes do dia, para o placar não poder ser reescrito depois. Também existe uma **demonstração simulada** de "reservar uma janela", pagar em USDC de teste e receber um recibo.

O que o produto **é hoje**: informação e prova. **Não vende nada**, nem energia, nem serviço. A demonstração de reserva é uma ideia antiga, simulada.

---

## 2. A estrutura do projeto (o que é cada pasta)

| Pasta ou arquivo | O que é |
| --- | --- |
| `dados/scripts/` | Os 3 programas em Python que baixam o dado do ONS, calculam a previsão e preparam os dados do site. |
| `dados/ccee/` | O preço horário da energia (PLD) da CCEE, baixado à mão (a CCEE bloqueia download automático). |
| `dados/config/` | A localização aproximada (município) das 8 usinas de destaque, com a fonte de cada uma. |
| `dados/saida/` | Os resultados que o Python gera: chance de corte, janelas previstas, teste retroativo, impressões digitais. |
| `operador/` | O "operador de computação" de demonstração (Python). É parte da ideia simulada. |
| `site/` | O site em Next.js (React + TypeScript + Tailwind): tudo que o visitante vê, mais as 3 rotas de servidor (APIs). |
| `site/src/data/` | Os dados que o site lê (`atlas.json`, `previsao_atual.json`, `veredictos.json`). |
| `site/public/data/` | Os mesmos dados abertos para download pela página Método. |
| `site/public/ons/` | Cópias exatas (29 MB) dos arquivos do ONS citados em carimbos, porque o ONS às vezes republica um mês. |
| `site/public/previsoes/` | Cada previsão diária publicada, para qualquer pessoa conferir. |
| `site/public/execucoes/` | O resultado do trabalho de demonstração de cada reserva simulada. |
| `.github/workflows/` | A automação que roda todo dia. |
| `docs/` | O plano de negócio e este raio-X. |
| `CLAUDE.md` | As instruções e regras de honestidade do projeto. |
| `README.md` / `README.pt-BR.md` | Apresentação do projeto, em inglês e em português. |

---

## 3. O caminho dos dados (do ONS até a tela)

```
ONS (dados abertos, a cada 30 min)
   │  baixar_ons.py  → baixa os arquivos Parquet (~100 MB)
   ▼
etapa1.py  → calcula chance de corte, testa o modelo, prevê os próximos 8 dias
   │  grava em dados/saida/
   ▼
atlas.py   → junta tudo + preço (PLD, CCEE) + câmbio (PTAX, Banco Central) + localização
   │  grava site/src/data/atlas.json e site/public/data/
   ▼
Site (Next.js)  → páginas lêem o atlas.json
   ▼
Visitante (celular, tablet, computador)
```

Todo dia, depois que o ONS publica (por volta do meio-dia), a automação refaz esse caminho.

### Os três programas Python

1. **`baixar_ons.py`** (71 linhas): baixa os arquivos mensais do ONS de corte de usinas eólicas e solares. Baixa o mês atual e confere os dois mais recentes, porque o ONS os republica.
2. **`etapa1.py`** (658 linhas): o "cérebro". Lê os dados, calcula a chance de corte por usina, mês e hora, faz o teste retroativo de agosto e setembro, o placar ao vivo (a partir de 01/10), e gera as janelas previstas para os próximos dias. Tem os parâmetros fixados antes do teste (limiar de 1 MW para contar como corte, janela oferecida com chance de 50% ou mais, perfil das últimas 8 semanas, atraso de publicação de 7 dias).
3. **`atlas.py`** (361 linhas): pega os resultados do `etapa1.py` e prepara o `atlas.json` do site: mapa de calor por mês e hora, as 8 usinas de destaque, o valor das janelas em R$ (energia esperada × PLD), o câmbio PTAX, os números da manchete e as impressões digitais (SHA-256).

### Como a previsão funciona (em palavras simples)
O modelo de produção se chama "contínuo com atraso". Para cada usina, ele olha as **últimas 8 semanas** de dados já publicados e vê: "em cada meia hora do dia, em dia útil ou fim de semana, quantas vezes essa usina foi cortada?". Isso vira uma chance. Uma **janela** é uma sequência de pelo menos 1 hora em que a chance é de **50% ou mais**. Depois do dia passar, o ONS publica o que aconteceu: a janela é **confirmada** se pelo menos metade das meias-horas dela teve corte, e **errada** caso contrário.

É um modelo simples: só aprende com o passado. **Não usa clima, demanda nem manutenção da rede.**

---

## 4. O site, página por página

O site tem 5 páginas, cabeçalho fixo (com troca PT/EN) e rodapé. Abre em inglês por padrão. A escolha do idioma fica salva no navegador.

### 4.1 Início (`/`)
- **Pergunta de decisão** no topo e botões para a calculadora de cada uma das 8 usinas.
- **4 números de manchete**: 3.415 MW médios cortados no Nordeste (jan–ago/2026), 82 GWh por dia, o valor ao PLD real (R$ 2,6 bilhões até 10/10) e a energia capturada pelas janelas (90% em ago / 95% em set).
- **Janelas previstas**: abas para os próximos dias, mapa (Leaflet + OpenStreetMap) e tabela das 8 usinas com janela, chance, energia esperada, "horas de GPU equivalentes" e valor de referência. Cada linha tem o botão **Reservar (demo)**.
- **Selo da previsão**: mostra que a previsão do dia foi registrada na Solana (lido ao vivo da blockchain).
- **Bloco "Visão futura, simulada"**: avisa que a reserva é simulada.
- **"Por que acontece"**: gráficos de perda por hora do dia, chance em dia útil × fim de semana, mistura por razão (ENE/CNF/REL), preço no piso por hora e média mensal.
- Faixa para o placar.

### 4.2 Página de uma usina (`/plants/CJU_BASAR`, uma para cada uma das 8)
- Cabeçalho: tipo (eólica/solar), operador, capacidade, ponto de conexão, energia perdida, mapa.
- **Janelas previstas** da usina, com botão Reservar (demo).
- **Por que esta usina é cortada**: barra por razão (ENE, CNF, REL).
- **Mapa de calor**: chance de corte por mês × hora.
- **Calculadora de carga junto à usina** (nova): você informa os MW, as horas por dia e o horário de início. Ela mostra horas de corte por mês no seu horário, MWh que a carga teria podido usar, valor de referência em R$ (ao PLD médio e ao piso), a divisão ENE × elétrico, o texto sobre a regra da Aneel e as fórmulas.
- **Janelas recentes e o veredito do ONS**, com botão "Replay".
- **Backtest da usina**: precisão, cobertura, energia capturada em agosto e setembro.

### 4.3 Placar (`/track-record`)
- **Resultado ao vivo** desde 01/10: 68 de 98 janelas confirmadas (69%), amostra de **10 dias**. Das previstas antes do dia começar: 28 de 29.
- **Explicação dos erros** (duas usinas do RN cujo corte noturno parou de repente).
- **Comparação com a regra ingênua**: empate (29,9 p.p. de erro nos dois).
- **Três tipos de corte** (ENE, CNF, REL): peso, quanto o modelo captura de cada um e se há ressarcimento (CNF e REL por lei; ENE não).
- **Comparação de modelos** (agosto e setembro): taxa média, regra fixa 8h–15h, mesmo mês de 2025, perfil de 8 semanas, combinado e o de produção.
- **Calibração**, resultados por tipo de usina e por usina, e as **impressões digitais (SHA-256)** de todos os arquivos.

### 4.4 Método (`/method`)
O que é **real**, **estimado** e **simulado**, as definições (corte, GNRa, janela, confirmada), os arquivos abertos para baixar (CSV e JSON) e as limitações.

### 4.5 Verificar (`/verify`)
Você cola o endereço de uma transação de reserva e a página lê **direto da blockchain**: o pagamento, o recibo, o carimbo do ONS e o resultado do trabalho. Ensina a conferir tudo sem confiar no site. **Só serve para a ideia simulada.**

### 4.6 Recursos que aparecem em todas as páginas
- **Idiomas PT/EN** (todos os textos em `dicionarios.ts`).
- **Responsivo**: no celular as tabelas viram cartões; no tablet e no computador mantêm a tabela.
- **Instalável** no celular ("Adicionar à tela inicial").
- **Gráficos próprios em SVG** (sem biblioteca) e **mapas Leaflet**.

---

## 5. A calculadora de carga (nova): como cada número sai

Usa só dados que o site já carrega, no navegador. Sem API nova.

| Número | Fórmula |
| --- | --- |
| Horas de corte por mês no seu horário | Média dos 12 meses de [dias do mês × soma, nas horas escolhidas, da chance de corte daquele mês e hora]. |
| Potência média cortada | Energia perdida em jan–jul/2026 ÷ horas com corte (fração de meias-horas cortadas × 5.088 h). |
| Energia (MWh por mês) | Horas de corte por mês × o menor entre sua carga, a capacidade da usina e a potência média cortada. |
| Divisão ENE × elétrico | Fração da energia cortada em 2026 por razão (ENE, CNF + REL), aplicada às horas e aos MWh. |
| Valor de referência (R$/mês) | MWh × PLD médio do Nordeste ponderado pela energia cortada (R$ 104,15). O piso (R$ 57,31) é mostrado como cenário baixo. |

**Limites** (também escritos na tela): usa a potência média e não a real, hora a hora; o mapa de calor mistura anos; o passado não garante o futuro.

---

## 6. As 3 APIs do servidor (rotas `/api`)

Só funcionam com as chaves das carteiras de teste (variáveis de ambiente `VC_CHAVE_*`), que nunca estão no código.

| Rota | O que faz | Precisa de chaves? |
| --- | --- | --- |
| `GET /api/previsao` | Devolve a previsão publicada e o registro do hash dela na Solana. | Não |
| `POST /api/previsao` | Grava o hash da previsão na Solana, se ainda não existe. A automação diária chama. | Sim |
| `POST /api/recibo` | Confere uma reserva e emite o recibo (fase 1) e o carimbo do ONS (fase 2). | Sim para emitir |
| `POST /api/carimbar` | Carimba as reservas pendentes. | Sim |

No projeto que você publicou na Vercel, **não há chaves**: o `GET /api/previsao` funciona (e mostra o selo), mas emitir recibos e carimbos responde "chaves não configuradas".

---

## 7. A parte da Solana (blockchain)

A Solana é como um **caderno público que ninguém consegue apagar**. O projeto a usa em **devnet**, a versão de testes: as moedas não valem dinheiro.

**O uso defendido (real):** todo dia, o SHA-256 do arquivo de previsão é gravado na Solana (uma "impressão digital" do arquivo). Qualquer pessoa baixa o arquivo, calcula o hash e vê que bate. Prova que a previsão existia **antes** do dia.

**A parte simulada (a reserva):**
1. O visitante clica em Reservar e escolhe os MWh.
2. O preço sai do PLD da janela, convertido em USDC de teste pela PTAX.
3. **Uma única transação** na Phantom divide o pagamento: usina 70%, operador 25%, plataforma 5%.
4. Recibo (fase 1): usina e operador co-assinam um memo.
5. Execução: o operador roda um pequeno trabalho de IA e grava início e fim na Solana.
6. Carimbo (fase 2): no dia seguinte, a plataforma, como **oráculo declarado** (o ONS não assina nada), grava o veredito.

Usina e operador são **carteiras de teste**. O trabalho de IA roda em um notebook, **não na usina**, e **não absorve energia cortada**.

### O operador de demonstração (`operador/`)
- `operador.py`: lê as reservas na Solana, espera a janela, grava início e fim, roda o trabalho e publica o resultado.
- `trabalho.py`: um modelo pequeno de IA que classifica os textos do ONS sobre cada corte e soma a energia por causa ("por que essa usina é cortada?").
- Roda localmente, com a chave do operador **fora** do repositório.

---

## 8. A automação diária (`.github/workflows/atualizacao-diaria.yml`)

Duas vezes por dia (12h40 e 18h10, horário de Brasília), o GitHub Actions: baixa o dado novo do ONS, recalcula, faz commit se algo mudou, **espera o site novo entrar no ar**, grava o hash da previsão na Solana e carimba as reservas pendentes.

**Atenção:** esse arquivo tem o endereço do site **fixo em `https://nomos-energy.vercel.app`**, que é o site do Guilherme. Veja a seção 12.

---

## 9. Os números atuais (dados até 10/10/2026)

- **166 conjuntos de usinas** modelados (RN, BA e CE); **8 usinas de destaque** com página.
- Nordeste: **3.415 MW médios** cortados em jan–ago/2026 (82 GWh por dia). Os números batem com a imprensa (diferença abaixo de 1%).
- Razões no Nordeste em 2026: ENE cerca de 67%, CNF cerca de 24%, REL cerca de 10%.
- **Backtest** (ago–set, 154 usinas): janelas capturaram 90% e 95% da energia cortada.
- **Ao vivo** (01–10/10): 68 de 98 janelas confirmadas (69%); amostra de só **10 dias**.
- **Contra a regra ingênua** (mesmas janelas ao vivo): **empate**.

---

## 10. Real × Simulado × Hipótese

| Parte | Situação |
| --- | --- |
| Dados do ONS, PLD da CCEE, câmbio PTAX | **Real**, dados abertos |
| Cálculos, previsão, backtest, placar ao vivo | **Real** (com amostra ao vivo pequena) |
| Calculadora de carga | **Real**, mas é estimativa a partir do passado |
| Carimbo do hash da previsão na Solana | **Real**, mas na devnet e com oráculo declarado |
| Reserva, pagamento em USDC, recibo, execução, carimbo de reserva | **Simulado** (devnet, carteiras de teste) |
| Usina e operador | **Simulados** |
| Trabalho de IA | Real, mas pequeno e em notebook; **não consome energia cortada** |
| Comprador para o certificado hora a hora | **Hipótese, não validada** |
| Quem pagaria pelo atlas ou pela calculadora | **Hipótese, não validada** |
| Regra Aneel REN 1.170/2026 cobrir uma carga que não é autoprodução | **Não avaliado** |

---

## 11. A que "ideia" cada funcionalidade pertence

**Ideia A: ferramenta de decisão (o que a premissa atual diz).**
- Atlas, mapa, páginas de usina, mapa de calor, razões ENE/CNF/REL
- **Calculadora de carga**
- Previsão de 8 dias e janelas
- Placar, comparação com regra ingênua, método, dados abertos
- Carimbo do hash da previsão na Solana (a prova)

**Ideia B: mercado e recibo simulados (sobra da primeira fase).**
- Botões **Reservar (demo)** e **Replay**
- Pagamento em USDC, divisão 70/25/5, recibo, carimbo de reserva
- Página **Verificar**
- Operador de computação e trabalho de IA
- **"Horas de GPU equivalentes"** na tabela da página inicial
- APIs `recibo` e `carimbar`
- Bloco "Visão futura, simulada"

**Recomendação para alinhar com a premissa:** a Ideia A fica à frente. A Ideia B some do caminho principal (botões e GPU) e fica descrita só no Método e no README como visão futura.

---

## 12. Problemas e riscos que encontrei

1. **A automação diária aponta para o site do Guilherme.** O workflow usa `nomos-energy.vercel.app`. Se as GitHub Actions estiverem ligadas no seu repositório (não consegui verificar), ele recalcula dados e dá commit na sua `main`, mas espera e chama o site do **Guilherme**, não o seu. Em um repositório copiado, as Actions costumam vir **desligadas**. Vale conferir na aba **Actions** do seu repositório. Mudar o workflow é uma das áreas que as suas regras proíbem eu tocar sem você mandar.
2. **Os dados do seu site na Vercel ficam parados em 10/10**, a menos que a automação seja religada e adaptada.
3. **Botão Reservar e "horas de GPU"** continuam visíveis e contradizem a premissa (produto de informação).
4. **A calculadora só existe para 8 usinas**, de um catálogo de 166.
5. **A previsão empata com uma regra ingênua** na amostra ao vivo de 10 dias. Está escrito no site; é preciso mais semanas de dados.
6. **O site abre em inglês** por padrão.
7. **Sem login, sem salvar cenário, sem relatório exportável.**
8. **Afirmações do README que não verifiquei:** o objetivo 24/7 da Google e a regra europeia de hidrogênio (Regulamento Delegado 2023/1184). Estão lá desde antes.
9. **Textos com fonte ainda a completar** no plano de negócio (custo da GPU-hora, bitcoin, 83% do Nordeste, texto oficial da Lei 15.269).
10. **O `CLAUDE.md` está um pouco desatualizado**: diz que a calculadora "falta commit" e que a REN 1.170 é "só imprensa".
11. **A localização das usinas é aproximada** (centro do município, fonte pública); só uma usina (CJU_CEITC) tem o nome comercial não confirmado.

---

## 13. Glossário rápido

- **ONS**: Operador Nacional do Sistema Elétrico. Manda as usinas produzirem mais ou menos.
- **Corte (curtailment, constrained-off)**: quando o ONS manda uma usina produzir menos do que poderia.
- **ENE / CNF / REL**: razões do corte. ENE = sobra de energia no sistema; CNF = confiabilidade da rede; REL = linha ou equipamento fora.
- **GNRa**: a estimativa do próprio ONS de quanta geração deixou de acontecer.
- **PLD**: o preço de curto prazo da energia. Quando há muita sobra, ele cai ao "piso" regulatório.
- **CCEE**: câmara que contabiliza e liquida a energia e publica o PLD.
- **Janela**: um período de pelo menos 1 hora em que a previsão dá 50% ou mais de chance de corte.
- **Backtest (teste retroativo)**: testar o modelo em meses que ele não viu.
- **Placar ao vivo**: o resultado da previsão dia a dia, depois do teste.
- **SHA-256**: uma "impressão digital" de um arquivo: se mudar uma vírgula, a impressão muda.
- **Solana / devnet**: uma blockchain (caderno público); a devnet é a versão de testes.
- **USDC**: moeda digital atrelada ao dólar. Na devnet é de teste.
- **Oráculo**: quem registra na blockchain um fato do mundo real (aqui, a plataforma registra o que o ONS publicou).
- **Autoprodução**: quando quem consome também produz a própria energia no mesmo ponto de conexão.
