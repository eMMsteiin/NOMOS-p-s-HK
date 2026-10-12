# Revisão geral do projeto Nomos (12/10/2026)

Pedido: checar o projeto todo, de ponta a ponta, e corrigir o que fosse preciso, lembrando que o projeto deve ser coerente com a **Ideia A** (o Nomos é uma ferramenta de informação para decidir onde instalar ao lado de uma usina; **não vende nada**; o modelo de negócio é hipótese). Branch: `revisao-geral`. Nada foi enviado ao GitHub nem publicado.

---

## 1. O que eu verifiquei, e o resultado

| O que | Como | Resultado |
| --- | --- | --- |
| **Vereditos do placar ao vivo** (68 de 98) | Recalculei as 98 janelas direto dos arquivos originais do ONS que estão no repositório (`site/public/ons`), com a regra do projeto (corte = GNRa ≥ 1 MW; janela confirmada se pelo menos metade das meias-horas tem corte) | **98 de 98 batem** (veredito, fração e energia); 68 confirmadas |
| **Vereditos do teste retroativo** (564 de 614) | Mesmo recálculo, para ago–set | **614 de 614 batem** (91,9%) |
| **Impressões digitais SHA-256** | Calculei o SHA-256 de cada arquivo de saída e comparei com `impressoes_digitais.txt`; comparei as cópias em `site/public/data` | **9 de 9 batem**; cópias iguais |
| **Números escritos à mão nos textos** | Comparei cada um com os dados | 61% da perda eólica entre 8h e 14h59 = 60,6% ✓; "cerca de 47% das meias-horas", 89% de precisão, cobertura 82% contra 39%, redução do erro de 54% ✓; "50–60% previsto → 76% observado" ✓; 166 usinas ✓; energia esperada "±20%" (−19% em ago, +12% em set) ✓. **Erros achados:** ver seção 2 |
| **Fórmulas da calculadora** | Li no Python como `energia_perdida_gwh` e `fracao_meias_horas_com_corte` são calculadas | Ambas são de jan–jul/2026, como a calculadora supõe. A "capacidade" mostrada é a **maior disponibilidade informada ao ONS**, não a potência instalada (corrigi o rótulo) |
| **REN Aneel 1.170/2026** | Li os artigos no texto publicado no Legisweb | Publicada no DOU em 09/10/2026, vigente na publicação. A cláusula da autoprodução (art. 2º, §9º) está no artigo do corte por razão energética; o corte elétrico está no art. 3º. **O texto do site afirmava mais do que o texto da norma**; corrigi |
| **Lei 15.269/2025** | Reportagem do O Povo (23/07/2026), página do Senado | Compensa CNF e REL, não ENE. Segundo a imprensa, a Portaria MME 140/2026 cobre eventos de 01/09/2023 a 25/11/2025, para quem aderir e desistir de ações. Não consegui ler o texto integral da lei (corrigi o texto do site com "segundo a imprensa") |
| **Piso do PLD** (R$ 57,31/MWh) | Agência iNFRA (25/08/2026) | Confere. O MME está em consulta para mudar os limites do PLD (risco para os valores de referência) |
| **Regra europeia de hidrogênio** (README) | Busca e leitura de fontes | Existe uma opção em que a energia da rede conta como renovável se a produção reduz a necessidade de redespacho. **Não consegui confirmar o número do parágrafo** ("Art. 4(3)"); passei a citar só "Art. 4" e a dizer que há condições |
| **Segredos** | Procurei chaves privadas, tokens e vetores de chave Solana nos arquivos e nos **58 commits do histórico** | **Nenhum**. O `.gitignore` protege `.env` e chaves |
| **Frases proibidas** (lista do `CLAUDE.md`) | Busca em todo o repositório | Nenhuma |
| **Nomes de pessoas e empresas ouvidas** | Busca | Havia **um primeiro nome** em um documento (`docs/inventario-do-site.md`). Removi do estado atual; **continua no histórico público** (ver seção 3) |
| **Links externos** | Testei cada um | Funcionam (alguns sites bloqueiam robôs: Explorer da Solana, CCEE, Cenário Energia e ENGIE respondem 429/403/406 a testes automáticos, mas abrem no navegador) |
| **Dependências** | `npm audit` (só produção) | 4 vulnerabilidades **moderadas**, todas dentro de `@solana/web3.js` (corrigir exige uma versão com mudança grande). Risco prático baixo para este site |
| **Navegador, no site publicado** | Abri todas as páginas e li o console | **Nenhum erro** (só o 404 esperado numa rota inexistente); layout sem estouro em 320, 360, 390, 768 e 1024 px |
| **Visibilidade do repositório** | Consulta ao GitHub | O repositório `eMMsteiin/nomos-v2` é **público** |

---

## 2. O que eu corrigi

**Textos que contradiziam a Ideia A ou estavam imprecisos**
1. **Valor de referência:** dizia "negociação entre usina e operador, não o que um comprador leva" (vocabulário da ideia de reserva). Agora: "negociação entre uma usina e uma carga ao lado dela, **não um preço**".
2. **Limitações do Método:** falavam de "o trabalho viaja pela internet", "fase 2" e "recibos". Agora dizem: o Nomos **não vende eletricidade nem qualquer outro serviço**; o único registro na blockchain no atlas é a impressão digital da previsão; ninguém validou quem pagaria **pelo atlas ou pela calculadora**; e uma carga ao lado de uma usina **só poderia usar a energia cortada se contrato, conexão e regulação permitirem**.
3. **Frase de reprodutibilidade no Placar:** citava a "fase 2" (da reserva). Agora descreve o que de fato é gravado no atlas. Também deixou de dizer que "todo número vem de dados do ONS" (há PLD da CCEE).
4. **Calculadora:** passou a declarar a premissa ("a usina poderia ter alimentado a sua carga em todas as horas de corte; na prática depende de contrato, conexão e regulação"), e o aviso de "melhor horário" só aparece quando o ganho é de pelo menos 3%.
5. **Página da usina:** a calculadora (o coração da ferramenta) **subiu para logo abaixo do cabeçalho**; antes era a 4ª seção.

**Fatos errados ou desatualizados**
6. **"De março em diante domina a sobra de energia":** na verdade domina **desde fevereiro** (72%). Corrigido nas duas línguas.
7. **Corte noturno do RN:** o texto dizia que "acabou" em 28–29/09. Os dados mostram que **voltou por volta de 8/10**. A explicação dos erros ao vivo agora traz os números conferidos: **21 dos 30 erros** estão em duas usinas do RN; Sol do Sertão e Assu Sol ficaram uns 20 pontos abaixo do teste (com 10 janelas cada); as demais ficaram perto.
8. **Placar, empate:** o empate de 29,9 p.p. na média **escondia** que, usina por usina, o modelo ficou mais perto em **apenas 2 das 8** (a regra ingênua nas outras 6). Agora o Placar mostra isso. (O que eu tinha escrito antes no plano de negócio e no `CLAUDE.md`, "melhor em algumas usinas e pior nas duas do RN", dava a impressão errada; corrigido.)
9. **Regra da Aneel (REN 1.170/2026):** reescrita a partir do texto (art. 2º, §9º), dizendo o que **não** foi avaliado (art. 3º, e se uma carga que só compra energia seria coberta).
10. **Ressarcimento (Lei 15.269/2025):** a nota do Placar agora traz o período e a adesão voluntária (segundo a imprensa) e descreve a REN corretamente (a CCEE rateia a energia cortada).
11. **Capacidade:** rótulo passou a "disponibilidade máxima informada ao ONS".
12. **Gráfico do piso do PLD:** mostrava "até 11 de out." enquanto os números ao lado iam até 10/10. Agora usa o mesmo período.

**Produto**
13. **Aviso de dados antigos:** faixa que aparece quando os dados têm 3 dias ou mais (esta cópia ainda não se atualiza sozinha).
14. **Página 404 do Nomos** (a padrão do Next ficava preta no modo escuro) e **página de erro**. Nesta versão do Next a função de tentar de novo se chama `retry` (conforme a documentação do projeto).
15. Selo "simulação" do cabeçalho: 9 px no celular (era 8).

**Documentação**
16. **README.md e README.pt-BR.md:** passaram a apresentar a Ideia A primeiro; a reserva virou "Laboratório"; números ao vivo atualizados (68 de 98, 28 de 29); `site/README.md` e `site/README.pt-BR.md` listam `/lab` e a calculadora.
17. **`docs/business-plan.md`:** fontes novas (O Povo, Senado, Agência iNFRA, Legisweb), risco do piso do PLD, premissa da calculadora, resultado usina por usina.
18. **`CLAUDE.md`:** atualizei fatos (REN, rateio), o aprendizado e a lista de prioridades (feitos e abertos).
19. **`dados/RELATORIO_ETAPA1.md`:** nota dizendo que é histórico e que os 614 vereditos foram recalculados.
20. **`docs/inventario-do-site.md`:** reescrito para o site de hoje. **`docs/raio-x-nomos.md`:** seções 4, 11 e 12 atualizadas.

---

## 3. O que continua aberto (precisa de você)

| # | Assunto | Por que importa | Minha recomendação |
| --- | --- | --- | --- |
| A | **Atualização diária dos dados.** O workflow `.github/workflows/atualizacao-diaria.yml` aponta para o site do Guilherme (`SITE: https://nomos-energy.vercel.app`). Aqui os dados ficam parados em 10/10 | Quem abrir o site depois de alguns dias vê dados velhos (o aviso ajuda, mas não resolve) | Autorizar uma troca **de uma linha** (`SITE` para o endereço do seu projeto) e ligar as Actions no GitHub. Sem as chaves das carteiras de teste, os últimos passos (gravar na Solana) falham, mas os dados do ONS atualizam e a Vercel publica |
| B | **Publicar esta revisão.** A branch `revisao-geral` não foi enviada | O site no ar ainda tem os textos antigos | Diga "publica" e eu envio a branch e avanço a `main`, como da última vez |
| C | **O histórico público tem um primeiro nome** (commit `9563560` em diante) | Regra do projeto: não citar pessoas ouvidas em conversas | O estado atual está limpo. Tirar do histórico exige reescrever e enviar à força, o que o `CLAUDE.md` proíbe. É só um primeiro nome, sem empresa; sugiro deixar |
| D | **O repositório é público e o `CLAUDE.md` também**: ele tem a idade do Stein e notas estratégicas | Qualquer pessoa lê | Se quiser, tornar o repositório privado na Vercel/GitHub (a Vercel continua funcionando se o app do GitHub tiver acesso) ou tirar o `CLAUDE.md` do repositório |
| E | **Só 8 usinas têm calculadora**, de 166 | Quem não achar a sua usina não testa o caso real | Perguntar a quem testar qual usina interessa; ampliar depois |
| F | **Link do GitHub no rodapé** aponta para o Guilherme; o rodapé cita o hackathon | Para um teste com empresa pode soar "projeto de estudante" | Trocar a constante `REPOSITORIO` em `site/src/lib/tipos.ts` quando decidirem |
| G | **REN 1.170/2026 só foi lida no Legisweb** | É um site secundário | Conferir no texto do Diário Oficial e, para saber se uma carga que só compra energia seria coberta, falar com um advogado regulatório |
| H | **Texto integral da Lei 15.269/2025** não lido | O site diz "segundo a imprensa" | Ler os artigos de ressarcimento no Diário Oficial de 25/11/2025 |
| I | **Vulnerabilidades moderadas** em dependências do Solana | Risco baixo | Reavaliar quando houver uma versão compatível |
| J | **Opcional:** pré-visualização do link (imagem) e pedir aos buscadores para não indexar o protótipo | Primeira impressão ao mandar o link; evitar que o protótipo apareça em buscas | Posso fazer se quiser |
| K | **Sem login, relatório exportável, cenários salvos ou alertas** | É o que uma empresa esperaria de uma plataforma | Só depois de validar com quem poderia usar |

---

## 4. Como conferir em 2 minutos

1. Abra a página de uma usina: a **calculadora** é a primeira seção.
2. Abra o **Placar**: veja "Amostra: 98 janelas em apenas 10 dias", o "empate" e a linha "usina por usina".
3. Abra o **Método**: o cartão roxo só aponta para o Laboratório; as limitações falam do atlas, não da reserva.
4. Abra uma rota que não existe (ex.: `/plants/XYZ`): a página 404 é do Nomos.
5. Abra o **Laboratório**: o aviso roxo diz "não é o produto e não vende eletricidade".
