import httpx
import time
from app.core.config import settings

async def query_ollama(prompt: str, model: str = None, host: str = None) -> tuple[str, int]:
    """Query Ollama, return (response_text, latency_ms)."""
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
    """Use Ollama as LLM judge. Returns {score: 0-10, feedback: str}."""
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

Réponds UNIQUEMENT en JSON valide:
{{"score": <nombre entre 0 et 10>, "feedback": "<explication concise en français>"}}"""

    response, _ = await query_ollama(prompt)
    import json, re
    match = re.search(r'\{.*\}', response, re.DOTALL)
    if match:
        return json.loads(match.group())
    return {"score": 0.0, "feedback": "Erreur de parsing de la réponse du juge."}

async def list_ollama_models(host: str = None) -> list:
    _host = host or settings.OLLAMA_HOST
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(f"{_host}/api/tags")
        r.raise_for_status()
    return [m["name"] for m in r.json().get("models", [])]
