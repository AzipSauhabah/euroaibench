"""Tests: ollama service layer — TDD"""
import pytest
from unittest.mock import patch, AsyncMock, MagicMock
import json


@pytest.mark.asyncio
async def test_query_ollama_returns_text_and_latency():
    from app.services.ollama import query_ollama
    mock_response = MagicMock()
    mock_response.json.return_value = {"response": "Réponse du modèle."}
    mock_response.raise_for_status = MagicMock()

    with patch("app.services.ollama.httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.post = AsyncMock(return_value=mock_response)
        text, latency = await query_ollama("Question test", model="mistral:7b")

    assert text == "Réponse du modèle."
    assert isinstance(latency, int)
    assert latency >= 0


@pytest.mark.asyncio
async def test_judge_answer_returns_score_and_feedback():
    from app.services.ollama import judge_answer
    judge_json = json.dumps({"score": 8.0, "feedback": "Bonne réponse."})

    with patch("app.services.ollama.query_ollama",
               new_callable=AsyncMock,
               return_value=(judge_json, 100)):
        result = await judge_answer(
            "Qu est-ce que le STOR ?",
            "Le STOR est une déclaration de transaction suspecte.",
            "Le STOR est un système de déclaration."
        )

    assert "score" in result
    assert "feedback" in result
    assert isinstance(result["score"], float)


@pytest.mark.asyncio
async def test_judge_answer_handles_malformed_json():
    from app.services.ollama import judge_answer
    with patch("app.services.ollama.query_ollama",
               new_callable=AsyncMock,
               return_value=("pas du JSON valide", 100)):
        result = await judge_answer("Q", "R", "Réponse")

    assert result["score"] == 0.0
    assert "feedback" in result


@pytest.mark.asyncio
async def test_list_ollama_models_returns_list():
    from app.services.ollama import list_ollama_models
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "models": [{"name": "mistral:7b"}, {"name": "qwen2.5:14b"}]
    }
    mock_response.raise_for_status = MagicMock()

    with patch("app.services.ollama.httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
        models = await list_ollama_models("http://localhost:11434")

    assert "mistral:7b" in models
    assert "qwen2.5:14b" in models


@pytest.mark.asyncio
async def test_judge_answer_parses_json_embedded_in_text():
    from app.services.ollama import judge_answer
    response_with_json = 'Voici mon évaluation: {"score": 7.5, "feedback": "Réponse acceptable."}'
    with patch("app.services.ollama.query_ollama",
               new_callable=AsyncMock,
               return_value=(response_with_json, 100)):
        result = await judge_answer("Q", "R", "Réponse")

    assert result["score"] == 7.5
