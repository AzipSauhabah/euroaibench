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
  -Dsonar.login=sqp_0b2c0f199eef2fd0a4e3f3e06ccf2aed1c20ca63

$SONAR_SCANNER \
  -Dsonar.projectKey=euroaibench-frontend \
  -Dsonar.sources=frontend/src \
  -Dsonar.exclusions="frontend/src/**/*.test.*,frontend/src/test/**" \
  -Dsonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=sqp_8b5d5faeaf7ab2689d3698dc79a5fa3b576e00e0

echo "Done → http://localhost:9000/projects"
