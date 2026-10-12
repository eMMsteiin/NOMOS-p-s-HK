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

Today the product is **information and proof, not energy**. We do not sell electricity.

## 3. What is validated

These come from primary sources, specialized press or our own calculation with open ONS data:

| Fact | Source |
| --- | --- |
| Brazil curtailed at least 73.4 million MWh of wind and solar between Oct 2021 and Aug 2026. | Volt Robotics Curtailment Tracker, as reported by [Canal Solar](https://canalsolar.com.br/curtailment-soma-73-milhoes-mwh-desde-2021/) |
| In 2026, about two thirds of the curtailment is energy surplus (`ENE`), and the Northeast concentrates about 83% of it. | [Cenário Energia, Sep 16, 2026](https://cenarioenergia.com.br/2026/09/16/curtailment-no-limite-brasil-acumula-51-dias-de-cortes-massivos-em-solar-e-eolica-ate-agosto/) (67% energy-surplus share through August, Brazil); the 83% Northeast share still needs a citation |
| In the Northeast in 2026: `ENE` about 66%, `CNF` about 24%, `REL` about 10% of the curtailed energy. | Our calculation, ONS open data |
| Law 15.269/2025 provides retroactive compensation for `CNF` and `REL` cuts. `ENE` cuts are not compensated; on Oct 6, 2026 Aneel decided to share their losses among generators. | [Cenário Energia, Jan 8, 2026](https://cenarioenergia.com.br/2026/01/08/mme-aciona-aneel-para-suspender-ressarcimentos-de-eolicas-e-solares-e-avaliar-impacto-da-lei-15-269-2025/) and [TAGD Law](https://tagdlaw.com.br/?p=15470) on the law; the official text on planalto.gov.br and the Oct 6 Aneel decision still need a citation (we found neither). The MME asked Aneel in Jan 2026 to suspend compensation payments until the model is regulated, so how it is applied is unsettled |
| Today, the main consumer of curtailed energy is bitcoin mining. AI data centers want firm, constant power. | Specialized press (exact citation to add) |
| Energy is roughly 4–11% of the cost of a GPU-hour; GPU depreciation dominates. | Industry estimates (exact citation to add) |
| The Redata regime (Law 15.504/2026) asks for renewable energy contracts, not hour-by-hour proof. | Law text |
| Our data pipeline is reproducible: byte-identical outputs and published SHA-256 fingerprints. | Repository |
| In the August–September 2026 **backtest**, our windows captured 90% (Aug) and 95% (Sep) of the curtailed energy, in 154 plants. | Our test, parameters fixed before it |

## 4. What is NOT validated (hypotheses)

- **Who would pay** for the atlas or the calculator. We have not asked for money from anyone and have no customer.
- **Whether a buyer exists** for an hourly certificate that a load used energy that would otherwise be lost. Nobody has told us they would pay for it.
- **Price and accuracy of commercial curtailment forecasts**: we do not know what the alternatives charge or how well they perform.
- **Aneel rule REN 1.170/2026** (consumption of self-production at the same connection point, protected from energy-surplus curtailment): so far confirmed only by press. It must be checked in the Diário Oficial. If confirmed, it would apply only to self-production and only to `ENE` cuts. We never present it as in force.
- **Live forecast quality.** The live scoreboard has a sample of only 10 days (68 of 98 windows confirmed). On those same windows, our model's average error (29.9 percentage points) is a tie with a naive rule that repeats the plant's habits of the previous month. The model did better on some plants and worse on the two Rio Grande do Norte plants whose night-time cuts stopped abruptly. Ten days is not enough to conclude anything.

## 5. Who might use it (to be tested)

| Possible user | What they would use | Status |
| --- | --- | --- |
| A company that wants to place computers or a factory next to a wind or solar plant | The calculator, to understand how much curtailment they could meet and how predictable it is, before negotiating a contract | Hypothesis |
| A wind or solar plant owner looking for flexible loads | The atlas and the calculator, as a neutral reference to start the conversation | Hypothesis |
| Analysts, researchers and journalists | The open data and the scoreboard | Hypothesis |

Possible ways to earn money, **none tested**: reports or consulting for loads negotiating a contract, a paid data or forecast service for plants and developers, certificates if a buyer shows up. We do not list prices because we have none.

## 6. What the product does not do

- It does not sell or move electricity: any job runs over the internet while the energy stays at the plant.
- The demo runs on Solana devnet with test wallets; the plant and the operator are simulated; the AI job runs on a laptop and absorbs no curtailed energy.
- The phase-2 oracle is declared and centralized: the ONS signs nothing, we record what it published.
- Every value in R$ is a **reference value for negotiation** computed from the past, not a price, a profit or a guaranteed saving.

## 7. Main risks

- **Regulatory:** compensation and protection rules are changing; some are not yet confirmed.
- **Commercial:** the plant has the history and the paid intelligence; it may not need us. Contracts today tend to be long (around 2 years), so a per-window market may not exist.
- **Technical:** the model learns only from past patterns, with no weather or grid-maintenance data, and misses abrupt changes in electrical cuts.
- **Demand side:** AI data centers prefer firm power; the loads that tolerate interruption today are mostly miners.

## 8. Next steps to validate

1. Verify REN 1.170/2026 in the Diário Oficial and update the site accordingly.
2. Talk to 10 or more plant owners, developers and flexible-load operators. Ask: how do you estimate curtailment today, what would you pay for, who decides? Record answers in writing, with permission, before citing anyone.
3. Keep the live scoreboard running for weeks and publish the comparison with the naive rule as the sample grows, whatever it shows.
4. Add data that would catch abrupt electrical cuts (grid maintenance and operating changes).
5. Only after steps 1–3: decide whether certificates, per-window reservations or on-chain receipts have a buyer. Until then they stay a simulated vision.
