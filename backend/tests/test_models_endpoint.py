"""Tests: /models endpoint — TDD"""
from unittest.mock import patch, AsyncMock


def test_models_endpoint_returns_list(client):
    with patch("app.routers.models.list_ollama_models",
               new_callable=AsyncMock,
               return_value=["mistral:7b", "qwen2.5:14b"]):
        response = client.get("/models/")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert isinstance(data["models"], list)


def test_models_endpoint_with_custom_host(client):
    with patch("app.routers.models.list_ollama_models",
               new_callable=AsyncMock,
               return_value=["mistral:7b"]):
        response = client.get("/models/?host=http://192.168.1.164:11434")
    assert response.status_code == 200
    assert response.json()["host"] == "http://192.168.1.164:11434"


def test_models_endpoint_ollama_unreachable(client):
    with patch("app.routers.models.list_ollama_models",
               new_callable=AsyncMock,
               side_effect=Exception("Connection refused")):
        response = client.get("/models/")
    assert response.status_code == 200
    data = response.json()
    assert data["models"] == []
    assert "error" in data


def test_models_returns_host_field(client):
    with patch("app.routers.models.list_ollama_models",
               new_callable=AsyncMock, return_value=[]):
        response = client.get("/models/")
    assert "host" in response.json()
