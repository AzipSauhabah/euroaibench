import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base, get_db
from app.models.models import Question, RegulationEnum, DifficultyEnum

SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def sample_questions(db):
    questions = [
        Question(
            regulation=RegulationEnum.AMF,
            difficulty=DifficultyEnum.easy,
            category="Obligations declaratives",
            question="Qu est-ce que le STOR ?",
            reference_answer="Le STOR est le système de déclaration de transactions suspectes à l AMF.",
            article_ref="MAR Art. 16"
        ),
        Question(
            regulation=RegulationEnum.MIFID2,
            difficulty=DifficultyEnum.medium,
            category="Best execution",
            question="Quels sont les critères de meilleure exécution ?",
            reference_answer="Prix, coûts, rapidité, probabilité d exécution.",
            article_ref="MiFID II Art. 27"
        ),
        Question(
            regulation=RegulationEnum.DORA,
            difficulty=DifficultyEnum.hard,
            category="Tests",
            question="Qu est-ce qu un TLPT ?",
            reference_answer="Test de pénétration fondé sur la menace, obligatoire tous les 3 ans.",
            article_ref="DORA Art. 26"
        ),
    ]
    for q in questions:
        db.add(q)
    db.commit()
    return questions
