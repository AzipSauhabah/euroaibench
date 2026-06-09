from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Question
from app.schemas.schemas import JudgeRequest, JudgeResult
from app.services.ollama import judge_answer

router = APIRouter()

@router.post("/", response_model=JudgeResult)
async def judge_single(body: JudgeRequest, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == body.question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    result = await judge_answer(q.question, q.reference_answer, body.model_response)
    return JudgeResult(
        score=result["score"],
        feedback=result["feedback"],
        hallucination=result.get("hallucination", False),
        hallucination_detail=result.get("hallucination_detail", ""),
    )
