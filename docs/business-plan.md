# Nomos: business plan (short, honest version)

This page separates what we have **validated** from what is still a **hypothesis**. We do not state a number here that is not in our data or in a source we can name. Rows marked "exact citation to add" come from our project notes and need a link before submission. Where a number does not exist, we say so.

## 1. The problem

When the Brazilian grid has more clean energy than it can absorb, the grid operator (ONS) orders wind and solar plants to cut output. The ONS publishes what happened, half-hour by half-hour, about a day later, with a reason code for each cut:

- `ENE`: energy surplus in the system.
- `CNF`: grid reliability requirements.
- `REL`: a line or equipment out.

## 2. What Nomos is today

An **open atlas** of that curtailment in the Northeast (RN, BA, CE) and a **decision tool**:

- the curtailed energy per plant, the reason mix and a month × hour heat map;
- a forecast of curtailment windows for the next 8 days, with a public scoreboard that shows every miss;
- a **load calculator** on each plant page: "if I install X MW next to this plant and run Y hours a day, how much curtailment would I have met?" It uses past data and says so on screen;
- the only blockchain use we defend: the fingerprint (SHA-256) of each daily forecast is stamped on Solana before the day, so the scoreboard cannot be rewritten afterwards.

Today the product is **information and proof, not energy**. **Nomos does not sell anything**: not electricity, not a service. The business model (access to the platform, reports, alerts) is a hypothesis.

An earlier idea, reserving a curtailment window for a compute job and paying in USDC with an on-chain receipt, lives in the **Lab** (`/lab`) as a simulation on Solana devnet. It is not the product.

## 3. What is validated

These come from primary sources, specialized press or our own calculation with open ONS data:

| Fact | Source |
| --- | --- |
| Brazil curtailed at least 73.4 million MWh of wind and solar between Oct 2021 and Aug 2026. | Volt Robotics Curtailment Tracker, as reported by [Canal Solar](https://canalsolar.com.br/curtailment-soma-73-milhoes-mwh-desde-2021/) |
| In 2026, about two thirds of the curtailment is energy surplus (`ENE`), and the Northeast concentrates about 83% of it. | [Cenário Energia, Sep 16, 2026](https://cenarioenergia.com.br/2026/09/16/curtailment-no-limite-brasil-acumula-51-dias-de-cortes-massivos-em-solar-e-eolica-ate-agosto/) (67% energy-surplus share through August, Brazil); the 83% Northeast share still needs a citation |
| In the Northeast in 2026 (Jan 1 to Oct 10): `ENE` 66.5%, `CNF` 24%, `REL` 10% of the curtailed energy. | Our calculation, ONS open data |
| Law 15.269/2025 provides compensation for `CNF` and `REL` cuts. According to the press, MME Portaria 140/2026 covers events from Sep 1, 2023 to Nov 25, 2025 for companies that adhere voluntarily and drop lawsuits (up to R$ 3.3 billion if all adhere). `ENE` cuts are not compensated. | [O Povo, Jul 23, 2026](https://mais.opovo.com.br/jornal/economia/2026/07/23/cortes-por-excedente-de-energia-ficam-fora-do-plano-de-compensacao-da-uniao.html) on the Portaria, the period and the exclusion; the law's record on [Senado](https://legis.senado.leg.br/norma/41727716) (we did not read the curtailment articles in the full text, which is in the Diário Oficial of Nov 25, 2025); earlier context in [Cenário Energia, Jan 8, 2026](https://cenarioenergia.com.br/2026/01/08/mme-aciona-aneel-para-suspender-ressarcimentos-de-eolicas-e-solares-e-avaliar-impacto-da-lei-15-269-2025/) and [TAGD Law](https://tagdlaw.com.br/?p=15470). How it is applied is still unsettled |
| Aneel REN 1.170/2026 (signed Oct 6, published Oct 9, 2026) says the CCEE shares the curtailed energy among the eligible plants (art. 2, §6), and sets that self-production consumed at the same connection point can be curtailed for energy reasons only above its local consumption (art. 2, §9). | [Legisweb](https://www.legisweb.com.br/legislacao/?id=502740), articles read in the text published there; not yet checked in the Diário Oficial |
| The 2026 PLD floor is R$ 57.31/MWh. The MME is consulting on changing the PLD limits, possibly pushing the minimum close to zero at some hours. | [Agência iNFRA, Aug 25, 2026](https://agenciainfra.com/blog/?p=46389) |
| Today, the main consumer of curtailed energy is bitcoin mining. AI data centers want firm, constant power. | Specialized press (exact citation to add) |
| Energy is roughly 4–11% of the cost of a GPU-hour; GPU depreciation dominates. | Industry estimates (exact citation to add) |
| The Redata regime (Law 15.504/2026) asks for renewable energy contracts, not hour-by-hour proof. | Law text |
| Our data pipeline is reproducible: byte-identical outputs and published SHA-256 fingerprints. | Repository |
| In the August–September 2026 **backtest**, our windows captured 90% (Aug) and 95% (Sep) of the curtailed energy, in 154 plants. | Our test, parameters fixed before it |

## 4. What is NOT validated (hypotheses)

- **Who would pay** for the atlas or the calculator. We have not asked for money from anyone and have no customer.
- **Whether a buyer exists** for an hourly certificate that a load used energy that would otherwise be lost. Nobody has told us they would pay for it.
- **Price and accuracy of commercial curtailment forecasts**: we do not know what the alternatives charge or how well they perform.
- **Whether a flexible load could use REN 1.170/2026.** The self-production clause (art. 2, §9) sits in the article on energy-surplus curtailment; electrical curtailment is in art. 3, which we have not assessed. It speaks of *self-production*: whether a load that only buys energy from the plant would qualify is not assessed, and needs a regulatory lawyer. We have not yet checked the text in the Diário Oficial itself, only as published on Legisweb.
- **Whether a plant could physically and contractually supply a load during every curtailed hour.** The calculator assumes it could; in practice that depends on the contract, the grid connection and the regulation.
- **Live forecast quality.** The live scoreboard has a sample of only 10 days (68 of 98 windows confirmed). On those same windows, our model's average error (29.9 percentage points) is a tie with a naive rule that repeats the plant's habits of the previous month. Plant by plant, the model was closer in 2 of the 8 plants and the naive rule in the other 6; the two Rio Grande do Norte plants whose night-time cuts stopped abruptly on Sep 28–29 (and came back around Oct 8) account for 21 of the 30 misses. Ten days is not enough to conclude anything. What we can say today: the value is in the history, the calculator and the transparency.

## 5. Who might use it (to be tested)

| Possible user | What they would use | Status |
| --- | --- | --- |
| A company that wants to place computers or a factory next to a wind or solar plant | The calculator, to understand how much curtailment they could meet and how predictable it is, before negotiating a contract | Hypothesis |
| A wind or solar plant owner looking for flexible loads | The atlas and the calculator, as a neutral reference to start the conversation | Hypothesis |
| Analysts, researchers and journalists | The open data and the scoreboard | Hypothesis |

Possible ways to earn money, **none tested**: reports or consulting for loads negotiating a contract, a paid data or forecast service for plants and developers, certificates if a buyer shows up. We do not list prices because we have none.

## 6. What the product does not do

- It does not sell anything, and it does not sell or move electricity.
- The Lab demo runs on Solana devnet with test wallets; the plant and the operator are simulated; the AI job runs on a laptop and absorbs no curtailed energy.
- The only on-chain record in the atlas is the fingerprint of each daily forecast, written by the platform: a declared, centralized oracle. The ONS signs nothing.
- The data on the test site only update when someone refreshes them: the site warns when they are 3 days old or more.
- Every value in R$ is a **reference value for negotiation** computed from the past, not a price, a profit or a guaranteed saving.

## 7. Main risks

- **Regulatory:** compensation and protection rules are changing; some are not yet confirmed. The PLD floor behind every R$ reference value may change (MME consultation, Aug 2026).
- **Commercial:** the plant has the history and the paid intelligence; it may not need us. Contracts today tend to be long (around 2 years), so a per-window market may not exist.
- **Technical:** the model learns only from past patterns, with no weather or grid-maintenance data, and misses abrupt changes in electrical cuts.
- **Demand side:** AI data centers prefer firm power; the loads that tolerate interruption today are mostly miners.

## 8. Next steps to validate

1. Read REN 1.170/2026 in the official Diário Oficial text (not only Legisweb) and ask a regulatory lawyer whether a flexible load could qualify.
2. Talk to 10 or more plant owners, developers and flexible-load operators. Ask: how do you estimate curtailment today, what would you pay for, who decides? Record answers in writing, with permission, before citing anyone.
3. Keep the live scoreboard running for weeks and publish the comparison with the naive rule as the sample grows, whatever it shows.
4. Add data that would catch abrupt electrical cuts (grid maintenance and operating changes).
5. Only after steps 1–3: decide whether certificates, per-window reservations or on-chain receipts have a buyer. Until then they stay a simulated vision.
