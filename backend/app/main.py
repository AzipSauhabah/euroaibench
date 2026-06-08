from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.routers import questions, runs, judge, models
from app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EuroAIBench API",
    description="Benchmark LLMs on AMF/MiFID II/DORA regulatory questions",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions.router, prefix="/questions", tags=["questions"])
app.include_router(runs.router, prefix="/runs", tags=["runs"])
app.include_router(judge.router, prefix="/judge", tags=["judge"])
app.include_router(models.router, prefix="/models", tags=["models"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "euroaibench"}
