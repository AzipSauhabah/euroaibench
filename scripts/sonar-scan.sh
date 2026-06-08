#!/bin/bash
# EuroAIBench SonarQube scan - run on Mac
set -e
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SONAR_SCANNER="docker run --rm --network=host -v $PROJECT_DIR:/usr/src sonarsource/sonar-scanner-cli:5"

echo "=== EuroAIBench SonarQube Scan ==="

echo "[1/3] Backend coverage..."
cd "$PROJECT_DIR/backend"
DATABASE_URL=sqlite:///./test.db python3 -m pytest tests/ -q \
  --cov=app --cov-report=xml --cov-fail-under=80

echo "[2/3] Frontend coverage..."
cd "$PROJECT_DIR/frontend"
npm test -- --run --coverage

echo "[3/3] Scanning..."
cd "$PROJECT_DIR"
$SONAR_SCANNER \
  -Dsonar.projectKey=euroaibench-backend \
  -Dsonar.sources=backend/app \
  -Dsonar.tests=backend/tests \
  -Dsonar.python.coverage.reportPaths=backend/coverage.xml \
  -Dsonar.python.version=3.11 \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=squ_0029b00cf94195245fbdb7656e1b5e423ab14a1a

$SONAR_SCANNER \
  -Dsonar.projectKey=euroaibench-frontend \
  -Dsonar.sources=frontend/src \
  -Dsonar.exclusions="frontend/src/**/*.test.*,frontend/src/test/**" \
  -Dsonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=squ_3d1e3dcffc17bbaaf9e390a4587b501271eb4b75

echo "Done → http://localhost:9000/projects"
