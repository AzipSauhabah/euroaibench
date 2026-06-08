# ⚖️ EuroAIBench

**Benchmark evaluating LLM reliability on European financial regulatory texts**  
*AMF · MiFID II · DORA — in French*

---

## What is EuroAIBench?

EuroAIBench measures how accurately large language models answer compliance and regulatory questions under French and European financial law. Questions are written in French, reflecting real-world usage by compliance officers, legal teams, and fintech developers.

**Why it matters:** LLMs are increasingly used in financial services for regulatory Q&A, compliance assistance, and legal research. Yet no public benchmark exists for European financial regulation in French. EuroAIBench fills that gap.

## Dataset

20 questions across 3 regulatory frameworks:

| Regulation | Questions | Scope |
|---|---|---|
| **AMF** | 7 | French financial markets authority rules |
| **MiFID II** | 7 | EU investment services directive |
| **DORA** | 6 | EU digital operational resilience act |

Difficulty levels: `easy` · `medium` · `hard`

Each question includes:
- The regulatory question (in French)
- A reference answer with article citations
- Category tag (governance, reporting, sanctions, etc.)

## Scoring

Answers are evaluated by an **LLM judge** (Ollama) on a 0–10 scale:

| Criteria | Points |
|---|---|
| Factual & legal accuracy | 5 |
| Completeness | 2 |
| Clarity and precision | 2 |
| Article references | 1 |

## Leaderboard

*Updated as models are tested. Self-hosted on Synology NAS + Ollama (Mac M5 Max).*

| Model | Avg Score | AMF | MiFID II | DORA | Date |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

*Run your own benchmark: see [Getting Started](#getting-started)*

## Getting Started

```bash
git clone https://github.com/AzipSauhabah/euroaibench
cd euroaibench
cp .env.example .env   # set OLLAMA_HOST
docker-compose up -d
```

Requires: Docker, Ollama running locally or on LAN.

API docs: `http://localhost:8002/docs`  
Frontend: `http://localhost:3200`

## Stack

- **Backend:** FastAPI + PostgreSQL 16
- **Frontend:** React + TypeScript + Vite
- **LLM Judge:** Ollama (any model)
- **Infrastructure:** Docker Compose, self-hosted

## License

- **Code:** AGPL-3.0 — open source, contributions welcome
- **Dataset (questions + reference answers):** CC BY-NC-ND 4.0 — free to use for research, not for commercial products without permission

## Author

Built by [Sauhabah Advisory](https://sauhabah-advisory.eu) — independent quant finance platform (ethical-finance, EuroAIBench).

---

*Feedback, contributions, or partnership inquiries: open an issue or reach out on LinkedIn.*
