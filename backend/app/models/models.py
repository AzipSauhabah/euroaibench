from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class DomainEnum(str, enum.Enum):
    MARKET = "MARKET"        # Market finance: derivatives, structured products, vol
    CORPORATE = "CORPORATE"  # Corporate finance: valuation, M&A, capital structure
    PROJECT = "PROJECT"      # Project finance: SPV, DSCR, debt sizing
    RISK = "RISK"            # Risk management: VaR, CVA/xVA, stress testing
    QUANT = "QUANT"          # Quant strategies: factor, momentum, backtesting
    RATES = "RATES"          # Fixed income & rates: IRS, curves, duration

class LangEnum(str, enum.Enum):
    EN = "EN"
    FR = "FR"

class DifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True)
    domain = Column(SAEnum(DomainEnum), nullable=False)
    language = Column(SAEnum(LangEnum), nullable=False, default=LangEnum.EN)
    difficulty = Column(SAEnum(DifficultyEnum), nullable=False)
    category = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    reference_answer = Column(Text, nullable=False)
    source_ref = Column(String(200))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    answers = relationship("Answer", back_populates="question")

class BenchmarkRun(Base):
    __tablename__ = "benchmark_runs"
    id = Column(Integer, primary_key=True)
    model_name = Column(String(100), nullable=False)
    ollama_host = Column(String(200))
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True))
    avg_score = Column(Float)
    hallucination_rate = Column(Float, default=0.0)
    answers = relationship("Answer", back_populates="run")

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True)
    run_id = Column(Integer, ForeignKey("benchmark_runs.id"), nullable=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=True)
    model_response = Column(Text)
    judge_score = Column(Float)
    judge_feedback = Column(Text)
    latency_ms = Column(Integer)
    hallucination = Column(Boolean, default=False, nullable=False)
    hallucination_detail = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    run = relationship("BenchmarkRun", back_populates="answers")
    question = relationship("Question", back_populates="answers")
