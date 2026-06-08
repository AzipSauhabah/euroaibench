"""Tests: /judge endpoint — TDD"""
from unittest.mock import patch, AsyncMock


def test_judge_returns_score_and_feedback(client, sample_questions):
    qid = sample_questions[0].id
    with patch("app.routers.judge.judge_answer",
               new_callable=AsyncMock,
               return_value={"score": 8.0, "feedback": "Bonne réponse."}):
        response = client.post("/judge/", json={
            "question_id": qid,
            "model_response": "Le STOR est une déclaration de transaction suspecte."
        })
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "feedback" in data


def test_judge_score_is_float(client, sample_questions):
    qid = sample_questions[0].id
    with patch("app.routers.judge.judge_answer",
               new_callable=AsyncMock,
               return_value={"score": 7.5, "feedback": "Correct."}):
        response = client.post("/judge/", json={
            "question_id": qid,
            "model_response": "Réponse test."
        })
    assert isinstance(response.json()["score"], float)


def test_judge_question_not_found(client):
    response = client.post("/judge/", json={
        "question_id": 99999,
        "model_response": "Réponse test."
    })
    assert response.status_code == 404


def test_judge_score_between_0_and_10(client, sample_questions):
    qid = sample_questions[0].id
    with patch("app.routers.judge.judge_answer",
               new_callable=AsyncMock,
               return_value={"score": 9.0, "feedback": "Excellent."}):
        response = client.post("/judge/", json={
            "question_id": qid,
            "model_response": "Réponse complète et précise."
        })
    score = response.json()["score"]
    assert 0 <= score <= 10


def test_judge_empty_response_handled(client, sample_questions):
    qid = sample_questions[0].id
    with patch("app.routers.judge.judge_answer",
               new_callable=AsyncMock,
               return_value={"score": 0.0, "feedback": "Réponse vide."}):
        response = client.post("/judge/", json={
            "question_id": qid,
            "model_response": ""
        })
    assert response.status_code == 200
