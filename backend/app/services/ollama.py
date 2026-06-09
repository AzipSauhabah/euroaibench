import httpx
import time
import json
import re
from app.core.config import settings


async def query_ollama(prompt: str, model: str = None, host: str = None) -> tuple[str, int]:
    _host = host or settings.OLLAMA_HOST
    _model = model or settings.OLLAMA_MODEL
    url = f"{_host}/api/generate"
    payload = {"model": _model, "prompt": prompt, "stream": False}
    t0 = time.monotonic()
    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
    latency_ms = int((time.monotonic() - t0) * 1000)
    return r.json()["response"], latency_ms


async def judge_answer(question: str, reference: str, model_response: str) -> dict:
    prompt = f"""Tu es un expert en réglementation financière européenne (AMF, MiFID II, DORA).
Évalue la réponse d'un modèle IA à une question réglementaire.

QUESTION: {question}

RÉPONSE DE RÉFÉRENCE: {reference}

RÉPONSE DU MODÈLE: {model_response}

Évalue sur 10 selon ces critères:
- Exactitude factuelle et juridique (5 pts)
- Complétude (2 pts)
- Clarté et précision (2 pts)
- Références aux articles/textes pertinents (1 pt)

Détecte également toute hallucination réglementaire:
- Article ou loi inventé ou incorrectement cité
- Obligation ou règle qui n'existe pas dans le texte réglementaire
- Date ou seuil inexact (ex: délai inventé)

Réponds UNIQUEMENT en JSON valide:
{{"score": <0-10>, "feedback": "<explication en français>", "hallucination": <true/false>, "hallucination_detail": "<description si hallucination, sinon vide>"}}"""

    response, _ = await query_ollama(prompt)
    match = re.search(r'\{.*\}', response, re.DOTALL)
    if match:
        try:
            result = json.loads(match.group())
            return {
                "score": float(result.get("score", 0)),
                "feedback": result.get("feedback", ""),
                "hallucination": bool(result.get("hallucination", False)),
                "hallucination_detail": result.get("hallucination_detail", ""),
            }
        except (json.JSONDecodeError, ValueError):
            pass
    return {"score": 0.0, "feedback": "Erreur de parsing.", "hallucination": False, "hallucination_detail": ""}


async def list_ollama_models(host: str = None) -> list:
    _host = host or settings.OLLAMA_HOST
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(f"{_host}/api/tags")
        r.raise_for_status()
    return [m["name"] for m in r.json().get("models", [])]
