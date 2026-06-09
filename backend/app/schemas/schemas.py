from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import DomainEnum, LangEnum, DifficultyEnum

class QuestionOut(BaseModel):
    id: int
    domain: DomainEnum
    language: LangEnum
    difficulty: DifficultyEnum
    category: str
    question: str
    reference_answer: str
    source_ref: Optional[str] = None
    class Config:
        from_attributes = True

class AnswerOut(BaseModel):
    id: int
    question_id: Optional[int] = None
    model_response: Optional[str] = None
    judge_score: Optional[float] = None
    judge_feedback: Optional[str] = None
    latency_ms: Optional[int] = None
    hallucination: bool = False
    hallucination_detail: Optional[str] = None
    class Config:
        from_attributes = True

class RunCreate(BaseModel):
    model_name: str
    ollama_host: Optional[str] = None

class RunOut(BaseModel):
    id: int
    model_name: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    avg_score: Optional[float] = None
    hallucination_rate: Optional[float] = None
    answers: List[AnswerOut] = []
    class Config:
        from_attributes = True

class JudgeRequest(BaseModel):
    question_id: int
    model_response: str

class JudgeResult(BaseModel):
    score: float
    feedback: str
    hallucination: bool = False
    hallucination_detail: str = ""
