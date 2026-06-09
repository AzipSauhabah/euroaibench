"""Tests: hallucination detection — TDD"""
import pytest
from unittest.mock import patch, AsyncMock
import json


def test_answer_has_hallucination_field(db):
    from app.models.models import Answer
    answer = Answer(judge_score=7.0, hallucination=False)
    assert answer.hallucination is False


def test_answer_hallucination_true(db):
    from app.models.models import Answer
    answer = Answer(judge_score=3.0, hallucination=True,
                    hallucination_detail="Art. 999 MAR cité n'existe pas.")
    assert answer.hallucination is True
    assert "Art. 999" in answer.hallucination_detail


def test_answer_hallucination_defaults_false(db):
    from app.models.models import Answer
    answer = Answer(judge_score=8.0)
    assert answer.hallucination is False


def test_answer_schema_includes_hallucination(client, sample_questions, db):
    from app.models.models import BenchmarkRun, Answer
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="test",
                       started_at=datetime.now(timezone.utc))
    db.add(run); db.commit()
    answer = Answer(run_id=run.id, question_id=sample_questions[0].id,
                    judge_score=7.0, hallucination=True,
                    hallucination_detail="Article inventé.")
    db.add(answer); db.commit()

    data = client.get(f"/runs/{run.id}").json()
    a = data["answers"][0]
    assert "hallucination" in a
    assert "hallucination_detail" in a
    assert a["hallucination"] is True


def test_hallucination_rate_in_run(client, db):
    from app.models.models import BenchmarkRun, Answer
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="test", avg_score=6.0,
                       started_at=datetime.now(timezone.utc))
    db.add(run); db.commit()
    # 2 hallucinations sur 5 réponses = 40%
    for i, h in enumerate([True, False, True, False, False]):
        db.add(Answer(run_id=run.id, question_id=i+1,
                      judge_score=6.0, hallucination=h))
    db.commit()

    data = client.get(f"/runs/{run.id}").json()
    hallucinated = [a for a in data["answers"] if a["hallucination"]]
    rate = len(hallucinated) / len(data["answers"])
    assert abs(rate - 0.4) < 0.01


@pytest.mark.asyncio
async def test_judge_answer_detects_hallucination():
    from app.services.ollama import judge_answer
    judge_json = json.dumps({
        "score": 4.0,
        "feedback": "Cite un article inexistant.",
        "hallucination": True,
        "hallucination_detail": "Art. 999 MAR n'existe pas."
    })
    with patch("app.services.ollama.query_ollama",
               new_callable=AsyncMock,
               return_value=(judge_json, 100)):
        result = await judge_answer(
            "Question test",
            "Réponse de référence.",
            "Selon Art. 999 MAR, ..."
        )
    assert result["hallucination"] is True
    assert "hallucination_detail" in result


@pytest.mark.asyncio
async def test_judge_answer_no_hallucination():
    from app.services.ollama import judge_answer
    judge_json = json.dumps({
        "score": 9.0,
        "feedback": "Réponse exacte.",
        "hallucination": False,
        "hallucination_detail": ""
    })
    with patch("app.services.ollama.query_ollama",
               new_callable=AsyncMock,
               return_value=(judge_json, 100)):
        result = await judge_answer("Q", "R", "Réponse correcte")
    assert result["hallucination"] is False


@pytest.mark.asyncio
async def test_judge_answer_hallucination_defaults_false_on_missing():
    from app.services.ollama import judge_answer
    # Ancien format sans champ hallucination
    judge_json = json.dumps({"score": 7.0, "feedback": "OK."})
    with patch("app.services.ollama.query_ollama",
               new_callable=AsyncMock,
               return_value=(judge_json, 100)):
        result = await judge_answer("Q", "R", "Réponse")
    assert result.get("hallucination", False) is False


def test_run_hallucination_rate_field(client, db):
    """BenchmarkRun doit exposer un taux d'hallucinations calculé"""
    from app.models.models import BenchmarkRun, Answer
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="mistral:7b", avg_score=7.0,
                       hallucination_rate=0.25,
                       started_at=datetime.now(timezone.utc))
    db.add(run); db.commit(); db.refresh(run)

    data = client.get(f"/runs/{run.id}").json()
    assert "hallucination_rate" in data
    assert abs(data["hallucination_rate"] - 0.25) < 0.01
