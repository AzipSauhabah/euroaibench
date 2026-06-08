"""Tests: /runs endpoints — TDD"""
import pytest


def test_list_runs_empty(client):
    response = client.get("/runs/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_run_not_found(client):
    response = client.get("/runs/99999")
    assert response.status_code == 404


def test_get_run_returns_correct_structure(client, sample_questions, db):
    from app.models.models import BenchmarkRun
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="test-model", avg_score=7.5,
                       started_at=datetime.now(timezone.utc),
                       finished_at=datetime.now(timezone.utc))
    db.add(run); db.commit(); db.refresh(run)

    response = client.get(f"/runs/{run.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "test-model"
    assert data["avg_score"] == 7.5
    assert "answers" in data


def test_list_runs_returns_multiple(client, db):
    from app.models.models import BenchmarkRun
    from datetime import datetime, timezone
    for name in ["mistral:7b", "qwen2.5:14b", "llama3:8b"]:
        db.add(BenchmarkRun(model_name=name, avg_score=7.0,
                            started_at=datetime.now(timezone.utc)))
    db.commit()

    response = client.get("/runs/")
    assert len(response.json()) == 3


def test_run_has_required_fields(client, db):
    from app.models.models import BenchmarkRun
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="mistral:7b",
                       started_at=datetime.now(timezone.utc))
    db.add(run); db.commit(); db.refresh(run)

    data = client.get(f"/runs/{run.id}").json()
    for field in ("id", "model_name", "started_at", "answers"):
        assert field in data


def test_run_answers_list(client, db):
    from app.models.models import BenchmarkRun, Answer
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="mistral:7b",
                       started_at=datetime.now(timezone.utc))
    db.add(run); db.commit()
    answer = Answer(run_id=run.id, question_id=1,
                    judge_score=8.0, judge_feedback="Good")
    db.add(answer); db.commit()

    data = client.get(f"/runs/{run.id}").json()
    assert len(data["answers"]) == 1
    assert data["answers"][0]["judge_score"] == 8.0
