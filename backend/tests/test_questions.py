"""Tests: /questions endpoints — TDD"""
import pytest


def test_list_questions_empty(client):
    response = client.get("/questions/")
    assert response.status_code == 200
    assert response.json() == []


def test_list_questions_returns_all(client, sample_questions):
    response = client.get("/questions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_list_questions_has_required_fields(client, sample_questions):
    response = client.get("/questions/")
    q = response.json()[0]
    required = {"id", "regulation", "difficulty", "category", "question", "reference_answer"}
    assert required.issubset(q.keys())


def test_list_questions_regulation_values(client, sample_questions):
    response = client.get("/questions/")
    regulations = {q["regulation"] for q in response.json()}
    assert regulations.issubset({"AMF", "MIFID2", "DORA"})


def test_list_questions_difficulty_values(client, sample_questions):
    response = client.get("/questions/")
    difficulties = {q["difficulty"] for q in response.json()}
    assert difficulties.issubset({"easy", "medium", "hard"})


def test_get_question_by_id(client, sample_questions):
    qid = sample_questions[0].id
    response = client.get(f"/questions/{qid}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == qid
    assert data["regulation"] == "AMF"


def test_get_question_not_found(client):
    response = client.get("/questions/99999")
    assert response.status_code in (404, 422)


def test_get_question_article_ref(client, sample_questions):
    qid = sample_questions[0].id
    response = client.get(f"/questions/{qid}")
    assert response.json()["article_ref"] == "MAR Art. 16"


def test_question_amf_count(client, sample_questions):
    response = client.get("/questions/")
    amf = [q for q in response.json() if q["regulation"] == "AMF"]
    assert len(amf) == 1


def test_question_mifid2_count(client, sample_questions):
    response = client.get("/questions/")
    mifid = [q for q in response.json() if q["regulation"] == "MIFID2"]
    assert len(mifid) == 1
