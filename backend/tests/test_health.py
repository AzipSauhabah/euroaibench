"""Tests: /health endpoint"""


def test_health_returns_200(client):
    response = client.get("/health")
    assert response.status_code == 200


def test_health_returns_correct_service(client):
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "euroaibench"


def test_health_response_has_required_keys(client):
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert "service" in data
