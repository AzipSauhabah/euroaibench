from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.db.database import get_db
from app.models.models import BenchmarkRun, Answer, Question
from app.schemas.schemas import RunCreate, RunOut
from app.services.ollama import query_ollama, judge_answer
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[RunOut])
def list_runs(db: Session = Depends(get_db)):
    return db.query(BenchmarkRun).order_by(BenchmarkRun.started_at.desc()).all()

@router.get("/{run_id}", response_model=RunOut)
def get_run(run_id: int, db: Session = Depends(get_db)):
    run = db.query(BenchmarkRun).filter(BenchmarkRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.post("/", response_model=RunOut)
async def create_run(body: RunCreate, db: Session = Depends(get_db)):
    run = BenchmarkRun(
        model_name=body.model_name,
        ollama_host=body.ollama_host or settings.OLLAMA_HOST,
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    questions = db.query(Question).all()
    scores = []
    hallucination_count = 0

    for q in questions:
        prompt = f"""Tu es un assistant expert en réglementation financière européenne.
Réponds de façon précise et complète à la question suivante:

{q.question}

Cite les articles réglementaires pertinents si applicable."""
        try:
            response, latency = await query_ollama(
                prompt, model=body.model_name, host=body.ollama_host
            )
            judgment = await judge_answer(q.question, q.reference_answer, response)
            score = float(judgment.get("score", 0))
            feedback = judgment.get("feedback", "")
            hallucination = bool(judgment.get("hallucination", False))
            hallucination_detail = judgment.get("hallucination_detail", "")
        except Exception as e:
            response, latency = f"ERROR: {e}", 0
            score, feedback = 0.0, "Erreur Ollama"
            hallucination, hallucination_detail = False, ""

        answer = Answer(
            run_id=run.id,
            question_id=q.id,
            model_response=response,
            judge_score=score,
            judge_feedback=feedback,
            latency_ms=latency,
            hallucination=hallucination,
            hallucination_detail=hallucination_detail,
        )
        db.add(answer)
        scores.append(score)
        if hallucination:
            hallucination_count += 1

    run.finished_at = datetime.now(timezone.utc)
    run.avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
    run.hallucination_rate = round(hallucination_count / len(questions), 3) if questions else 0.0
    db.commit()
    db.refresh(run)
    return run
