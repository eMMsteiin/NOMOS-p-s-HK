# Raio-X completo do Nomos

> **Atualizado em 12/10/2026 (revisão geral).** A reserva simulada (botões Reservar e Replay), as "horas de GPU" e a aba Verificar saíram do caminho principal e foram para o Laboratório (`/lab`); a calculadora subiu para o topo da página da usina; há aviso de dados antigos e páginas 404 e de erro próprias. **O detalhe de cada tela está em [`inventario-do-site.md`](inventario-do-site.md)** e o resultado da revisão em [`revisao-geral-2026-10-12.md`](revisao-geral-2026-10-12.md).

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
| `docs/` | O plano de negócio, este raio-X, o inventário do site e o relatório da revisão geral. |
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

O inventário completo (cada seção, botão e controle) está em [`inventario-do-site.md`](inventario-do-site.md). Em resumo, hoje o site tem:

- **Início (`/`)**: a pergunta de decisão ("se você colocar uma carga ao lado de uma usina, quanta energia cortada ela poderia ter aproveitado?"), 8 botões que levam à calculadora de cada usina, 4 números de destaque, as janelas previstas (mapa e tabela, **sem botão de reserva e sem "horas de GPU"**), os gráficos de "por que acontece", a seção **"Para quem é e como seria o acesso"** (hipótese, não validada) e a faixa para o Placar.
- **Página de usina (`/plants/<id>`, 8 páginas)**: cabeçalho, **calculadora de carga logo abaixo**, janelas previstas, por que a usina é cortada, mapa de calor mês × hora, janelas recentes com o veredito do ONS e o teste retroativo da usina.
- **Placar (`/track-record`)**: resultado ao vivo com o tamanho da amostra, **comparação com uma regra ingênua (empate; usina por usina o modelo ficou mais perto em 2 das 8)**, os três tipos de corte, comparação de modelos, calibração e impressões digitais SHA-256.
- **Método (`/method`)**: o que é real, estimado e simulado (o item simulado aponta para o Laboratório), definições, dados abertos e limitações.
- **Laboratório (`/lab`)**: a reserva demonstrativa (escolha de usina e janela), um ciclo completo de exemplo (08/10) e a lista do que é simulado, com um aviso destacado de que **não é o produto**. A página **Verificar (`/verify`)** faz parte dele e, sem transação, explica a si mesma.
- **Em todas as páginas**: cabeçalho (Atlas, Placar, Método, Laboratório com o selo "simulação", seletor EN/PT), **aviso de dados com 3 dias ou mais**, rodapé, página 404 e página de erro. O site abre em português quando o navegador está em português, funciona em celular, tablet e computador (as tabelas viram cartões no celular) e pode ser instalado na tela inicial.

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
- **Contra a regra ingênua** (mesmas janelas ao vivo): **empate** (29,9 p.p. nos dois); usina por usina, o modelo ficou mais perto em 2 das 8.

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

## 11. A que "ideia" cada funcionalidade pertence (e como ficou)

**Ideia A: ferramenta de decisão (a premissa atual)**, no caminho principal:
- Atlas, mapa, páginas de usina, mapa de calor, razões ENE/CNF/REL
- **Calculadora de carga** (primeira seção da página de usina)
- Previsão de 8 dias e janelas
- Placar, comparação com a regra ingênua, método, dados abertos
- Carimbo do hash da previsão na Solana (a prova)
- Seção "Para quem é" (hipótese)

**Ideia B: mercado e recibo simulados**, agora no **Laboratório** (`/lab` e `/verify`):
- Reserva demonstrativa (botões Reservar e Replay), pagamento em USDC de teste, divisão 70/25/5, recibo, carimbo de reserva
- Operador de computação e trabalho de IA
- APIs `recibo` e `carimbar`
- Escondidos por interruptores (`site/src/lib/recursos.ts`): botões nas páginas do atlas, "horas de GPU" na tabela do Início, bloco "Visão futura" do Início e a aba "Verificar"

## 12. Problemas e riscos (estado depois da revisão geral)

Resolvidos na revisão geral (detalhes em [`revisao-geral-2026-10-12.md`](revisao-geral-2026-10-12.md)): textos da Ideia B no caminho principal, número de mês errado, explicação dos erros ao vivo, regra da Aneel descrita pelo texto, empate escondendo o resultado por usina, 404 padrão preta, data fixa do PLD, link do gráfico do piso, nome de uma pessoa num documento.

Ainda abertos:

1. **A automação diária aponta para o site do Guilherme.** O workflow usa `nomos-energy.vercel.app`. Não foi alterado (área proibida sem autorização). Neste site os dados ficam parados em 10/10 e o site avisa quando têm 3 dias ou mais.
2. **Só 8 usinas** têm calculadora, de 166.
3. **A previsão empata com uma regra ingênua** na amostra ao vivo de 10 dias. Está escrito no Placar.
4. **Sem login, relatório exportável, cenários salvos ou alertas.**
5. **O repositório é público** (inclui o `CLAUDE.md`, os documentos e o histórico).
6. **No site publicado não há as chaves das carteiras de teste**: a reserva do Laboratório não emite recibo.
7. **Vulnerabilidades moderadas** em dependências do `@solana/web3.js` (corrigir exige uma mudança grande de versão): risco prático baixo, anotado.
8. **O link do GitHub no rodapé** aponta para o repositório do Guilherme.
9. **Texto do README sobre a regra europeia de hidrogênio**: não conseguimos confirmar o número do parágrafo (ficou "Art. 4").

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
