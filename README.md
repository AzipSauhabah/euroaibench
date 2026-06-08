# ⚖️ EuroAIBench

**Benchmark evaluating LLM reliability on European financial regulatory texts**
*AMF · MiFID II · DORA — in French*

---

[![Backend Tests](https://img.shields.io/badge/backend%20tests-39%20passed-brightgreen?style=flat-square&logo=pytest)](https://github.com/AzipSauhabah/euroaibench)
[![Frontend Tests](https://img.shields.io/badge/frontend%20tests-43%20passed-brightgreen?style=flat-square&logo=vitest)](https://github.com/AzipSauhabah/euroaibench)
[![Coverage](https://img.shields.io/badge/coverage-88%25-green?style=flat-square&logo=codecov)](https://github.com/AzipSauhabah/euroaibench)
[![Quality Gate](https://img.shields.io/badge/quality%20gate-passing-brightgreen?style=flat-square&logo=sonarqube)](http://localhost:9000/dashboard?id=euroaibench-backend)
[![License Code](https://img.shields.io/badge/code-AGPL--3.0-blue?style=flat-square)](LICENSE)
[![License Data](https://img.shields.io/badge/dataset-CC%20BY--NC--ND%204.0-orange?style=flat-square)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

---

## What is EuroAIBench?

EuroAIBench measures how accurately large language models answer compliance and regulatory questions under French and European financial law. Questions are written in French, reflecting real-world usage by compliance officers, legal teams, and fintech developers.

**Why it matters:** LLMs are increasingly used in financial services for regulatory Q&A, compliance assistance, and legal research. Yet no public benchmark existed for European financial regulation in French. EuroAIBench fills that gap.

## Dataset

20 questions across 3 regulatory frameworks:

| Regulation | Questions | Scope |
|---|---|---|
| **AMF** | 7 | French financial markets authority rules |
| **MiFID II** | 7 | EU investment services directive |
| **DORA** | 6 | EU digital operational resilience act (since Jan 2025) |

Difficulty levels: `easy` · `medium` · `hard`

Each question includes a reference answer with article citations and category tags.

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

| Model | Score | AMF | MiFID II | DORA | Date |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Getting Started

```bash
git clone https://github.com/AzipSauhabah/euroaibench
cd euroaibench
cp .env.example .env   # set OLLAMA_HOST
docker-compose up -d
```

Requires: Docker, Ollama running locally or on LAN.

- API docs: `http://localhost:8002/docs`
- Frontend: `http://localhost:3200`

## Stack

- **Backend:** FastAPI + PostgreSQL 16 + pytest (88% coverage)
- **Frontend:** React 18 + TypeScript + Vite + Vitest
- **LLM Judge:** Ollama (any model)
- **Quality:** SonarQube 9.9 + TDD
- **Infrastructure:** Docker Compose, Gitea CI/CD, Cloudflare Tunnel

## Running SonarQube (ad hoc)

```bash
# Start SonarQube on Mac
docker start sonarqube
# or first time:
docker run -d --name sonarqube -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  --memory=2g sonarqube:9.9-community

# Run scan (from project root on Mac)
bash scripts/sonar-scan.sh
```

## License

- **Code:** AGPL-3.0 — open source, contributions welcome
- **Dataset:** CC BY-NC-ND 4.0 — free for research, not for commercial products

## Author

Built by [Sauhabah Advisory](https://sauhabah-advisory.eu) — independent quant finance platform.

---

*Feedback or partnership inquiries: open an issue or reach out on LinkedIn.*
