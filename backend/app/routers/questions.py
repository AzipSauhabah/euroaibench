from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Question
from app.schemas.schemas import QuestionOut

router = APIRouter()

@router.get("/", response_model=List[QuestionOut])
def list_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()

@router.get("/{question_id}", response_model=QuestionOut)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
