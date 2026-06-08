"""Tests: scoring logic — TDD"""
import pytest


def test_score_range_valid():
    """Judge scores must be between 0 and 10"""
    from app.models.models import Answer
    answer = Answer(judge_score=8.5)
    assert 0 <= answer.judge_score <= 10


def test_score_zero_is_valid():
    from app.models.models import Answer
    answer = Answer(judge_score=0.0)
    assert answer.judge_score == 0.0


def test_score_ten_is_valid():
    from app.models.models import Answer
    answer = Answer(judge_score=10.0)
    assert answer.judge_score == 10.0


def test_avg_score_calculation(client, db):
    """avg_score on a run should equal mean of answer scores"""
    from app.models.models import BenchmarkRun, Answer
    from datetime import datetime, timezone
    run = BenchmarkRun(model_name="test", avg_score=7.5,
                       started_at=datetime.now(timezone.utc))
    db.add(run); db.commit()
    scores = [6.0, 8.0, 9.0, 7.0]
    for i, s in enumerate(scores):
        db.add(Answer(run_id=run.id, question_id=i+1, judge_score=s))
    db.commit()

    data = client.get(f"/runs/{run.id}").json()
    answer_scores = [a["judge_score"] for a in data["answers"] if a["judge_score"] is not None]
    assert abs(sum(answer_scores) / len(answer_scores) - 7.5) < 0.01


def test_latency_ms_positive(db):
    from app.models.models import Answer
    answer = Answer(judge_score=7.0, latency_ms=1500)
    assert answer.latency_ms > 0


def test_answer_without_score_is_valid(db):
    from app.models.models import Answer
    answer = Answer(question_id=1, model_response="some response")
    assert answer.judge_score is None
    assert answer.model_response == "some response"
