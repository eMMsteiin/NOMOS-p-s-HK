# CLAUDE.md: direção do projeto Nomos (leia antes de qualquer tarefa)

## Quem sou eu e como trabalhar comigo
- Sou o Stein, 19 anos, estudante de economia, líder do time NOMOS (com o Guilherme). Sou iniciante em cripto, energia e programação. Explique tudo em português simples, com exemplos do dia a dia, e evite jargão sem explicar.
- Ao terminar cada tarefa, dê um resumo curto: o que mudou, quais arquivos, como eu confiro no navegador e como desfazer.
- Faça commits pequenos, um por tarefa, em branch própria. Nunca use force push. Este repositório (origin) é a minha cópia; nunca altere o repositório original do Guilherme (AmorimGui/Hackaton-Project).
- Não toque em .github/workflows, scripts Python de previsão, rotas /api nem em chaves ou variáveis secretas. Nunca coloque segredos, chaves de carteira ou .env no código.
- Se uma tarefa exigir mexer em algo dessa lista, pare e me pergunte.

## Contexto
- Hackathon: Colosseum Crypto World's Fair + Trilha Brasil (Superteam). Prazo: 13/10/2026 03:59 (Brasília) = 12/10 23:59 PDT. Tudo da entrega é em inglês; o site tem PT e EN.
- App: Next.js em /site (leia site/AGENTS.md e node_modules/next/dist/docs antes de escrever código: esta versão do Next tem diferenças). Dados do ONS em /site/public/data e /dados.
- O repositório do Guilherme é a entrega oficial. Esta cópia é para testar melhorias; o que ficar bom será levado para lá (pull request ou cópia de arquivos).

## O que é o Nomos hoje (enquadramento decidido)
- **O Nomos NÃO vende nada: é uma ferramenta de informação para decidir onde instalar ou expandir uma unidade ao lado de uma usina; o modelo de negócio é hipótese (acesso à plataforma, relatórios, alertas), não validada.**
- Nomos é um atlas aberto da energia eólica e solar que o ONS manda cortar no Nordeste: quanto, por quê (ENE sobra de energia, CNF confiabilidade, REL linha ou equipamento fora), previsão por usina para 8 dias e um placar público de acertos, com cada previsão carimbada na Solana antes do dia.
- Mudança de rumo: sair de "previsão do tempo" (a Volt Robotics, a ePowerBay e o painel do ONS já fazem algo parecido) para ferramenta de DECISÃO: "se eu instalar X MW de carga ao lado desta usina, quanto corte eu teria aproveitado?" Essa é a Calculadora de carga junto à usina, na página de cada usina.
- O único uso honesto de blockchain: carimbar a previsão antes do dia para o placar não poder ser reescrito. Recibo de execução e split em USDC são VISÃO FUTURA, simulada na devnet. O comprador do certificado hora a hora NÃO está validado.
- Hoje o produto é informação e prova, não energia. A demo roda na devnet, usina e operador são simulados, o trabalho de IA roda num notebook e não consome energia cortada.

## O que está comprovado e o que é hipótese
Comprovado (fonte primária ou imprensa especializada):
- Brasil cortou ao menos 73,4 milhões de MWh de eólica e solar entre out/2021 e ago/2026 (Volt Robotics). Em 2026, cerca de dois terços dos cortes são por sobra de energia (ENE), e o Nordeste concentra cerca de 83%.
- ENE ~66%, CNF ~24%, REL ~10% no Nordeste em 2026 (cálculo do time com dados do ONS).
- Lei 15.269/2025 prevê ressarcimento retroativo para cortes por confiabilidade (CNF) e indisponibilidade externa (REL), e não só REL. Cortes energéticos (ENE) não são ressarcidos. A REN Aneel 1.170/2026 (assinada em 06/10/2026, publicada no DOU em 09/10/2026) manda a CCEE ratear a energia cortada entre as usinas elegíveis (art. 2º, §6º; conferido no texto do Legisweb).
- Hoje quem consome energia cortada é sobretudo a mineração de bitcoin. Data center de IA quer energia firme e constante. A energia é uns 4–11% do custo da GPU-hora (e não 1–2%). A depreciação da GPU domina o custo.
- Redata (Lei 15.504/2026) exige contratos de energia renovável, não prova hora a hora.
Hipótese ou não verificado (nunca afirmar como fato):
- REN Aneel 1.170/2026, art. 2º, §9º: a autoprodução com consumo no mesmo ponto de conexão só pode ser cortada, por razão energética, no que superar o consumo local naquele instante, até o limite que não afete o processo industrial. Lido no texto do Legisweb (publicação no DOU em 09/10/2026); falta conferir no próprio Diário Oficial. A cláusula está no artigo do corte energético; o corte elétrico (CNF, REL) está no art. 3º, que não avaliamos. Vale para autoprodução: se uma carga que só compra energia da usina seria coberta, ninguém avaliou (precisa de advogado regulatório). Diga "segundo o texto publicado no Legisweb".
- Quem pagaria pelo atlas ou pela calculadora. Se existe comprador para o certificado horário. Preço e acurácia de previsões comerciais de curtailment.
- O placar ao vivo tem poucos dias de amostra (67% em ~11 dias); o teste retroativo (90–95%) é retroativo.

## Aprendizados
- O modelo hoje empata com a regra ingênua; o valor está no histórico, na calculadora e na transparência. (Medido em 12/10/2026, em 10 dias de placar ao vivo: erro médio de 29,9 pontos percentuais nos dois. Usina por usina, o modelo ficou mais perto em 2 das 8 e a regra ingênua nas outras 6. As duas usinas do RN em que o corte noturno parou em 28–29/09 concentram 21 dos 30 erros; esse corte voltou por volta de 8/10.)

## Regras de honestidade (valem para site, README, pitch e qualquer texto)
- Nunca escrever: "IA barata", "energia grátis", "energia cortada vale zero", "mercado de energia cortada", "provamos que a energia foi usada", "parceria" com qualquer empresa, "1–2% do custo da GPU", "só REL entra no ressarcimento".
- Sempre deixar claro: demo na devnet, usina e operador simulados, oráculo declarado (o ONS não assina nada), comprador do certificado não validado, cálculos são histórico e não garantia.
- Não citar nomes de empresas ou pessoas ouvidas em conversas; usar "um operador que ouvimos". Só citar com autorização por escrito.
- Nunca inventar números, fontes ou resultados. Se um número não existe nos dados, diga que não existe.

## Backlog em ordem de prioridade
Feitos (até 12/10/2026): 1. calculadora de carga junto à usina; 2. correção de textos e READMEs pelas regras de honestidade; 3. placar com linha de base ingênua e tamanho da amostra em dias (resultado: empate); 4. página inicial com a pergunta de decisão, reserva/USDC movidos para o Laboratório (`/lab`); 5. docs/business-plan.md.

Abertos, em ordem de prioridade:
1. Validar com quem poderia usar (operadores de carga flexível, geradoras, investidores): a calculadora responde à pergunta deles? O que falta? Pagariam por quê? Registrar por escrito e só citar nomes com autorização.
2. Atualização diária dos dados desta cópia: o workflow `.github/workflows/atualizacao-diaria.yml` aponta para o site do Guilherme (`SITE: https://nomos-energy.vercel.app`); hoje os dados deste site ficam parados em 10/10 e o site mostra um aviso quando têm 3 dias ou mais. Mexer no workflow exige autorização do Stein.
3. Cobertura: só 8 usinas de destaque têm calculadora, de 166 conjuntos modelados.
4. Conferir a REN Aneel 1.170/2026 no Diário Oficial e consultar um advogado regulatório sobre cargas que não são autoprodução.
5. Produto: relatório exportável, cenários salvos, alertas, contas (só depois da validação do item 1).
