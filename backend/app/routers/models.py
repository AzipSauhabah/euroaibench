from fastapi import APIRouter, Query
from app.services.ollama import list_ollama_models
from app.core.config import settings

router = APIRouter()

@router.get("/")
async def get_models(host: str = Query(default=None)):
    try:
        models = await list_ollama_models(host or settings.OLLAMA_HOST)
        return {"models": models, "host": host or settings.OLLAMA_HOST}
    except Exception as e:
        return {"models": [], "error": str(e), "host": host or settings.OLLAMA_HOST}
