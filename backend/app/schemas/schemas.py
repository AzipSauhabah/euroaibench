from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import RegulationEnum, DifficultyEnum

class QuestionOut(BaseModel):
    id: int
    regulation: RegulationEnum
    difficulty: DifficultyEnum
    category: str
    question: str
    reference_answer: str
    article_ref: Optional[str]
    class Config:
        from_attributes = True

class AnswerOut(BaseModel):
    id: int
    question_id: int
    model_response: Optional[str]
    judge_score: Optional[float]
    judge_feedback: Optional[str]
    latency_ms: Optional[int]
    class Config:
        from_attributes = True

class RunCreate(BaseModel):
    model_name: str
    ollama_host: Optional[str] = None

class RunOut(BaseModel):
    id: int
    model_name: str
    started_at: datetime
    finished_at: Optional[datetime]
    avg_score: Optional[float]
    answers: List[AnswerOut] = []
    class Config:
        from_attributes = True

class JudgeRequest(BaseModel):
    question_id: int
    model_response: str

class JudgeResult(BaseModel):
    score: float
    feedback: str
