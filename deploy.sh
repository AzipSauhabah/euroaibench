#!/bin/bash
set -e
PROJECT=/volume1/docker/euroaibench
DOCKER="sudo /var/packages/ContainerManager/target/usr/bin/docker"
COMPOSE="sudo /var/packages/ContainerManager/target/usr/bin/docker-compose"

cd "$PROJECT"
echo "=== EuroAIBench Deploy ==="

echo "[1/3] Build frontend..."
$DOCKER run --rm \
  -v "$PROJECT/frontend:/app" \
  -w /app \
  -e VITE_API_URL=http://192.168.1.47:8002 \
  node:20-alpine \
  sh -c "npm install && npm run build"

echo "[2/3] Docker compose up..."
$COMPOSE up -d --build

echo "[3/3] Waiting for DB..."
sleep 10
$DOCKER exec euroaibench-db psql -U euroaibench -d euroaibench \
  -c "SELECT COUNT(*) FROM questions;" 2>/dev/null \
  && echo "DB already seeded" \
  || $DOCKER exec -i euroaibench-db psql -U euroaibench -d euroaibench \
    < "$PROJECT/postgres/init/01_seed_questions.sql"

echo ""
echo "✅ EuroAIBench running:"
echo "   API      -> http://192.168.1.47:8002"
echo "   Docs     -> http://192.168.1.47:8002/docs"
echo "   Frontend -> http://192.168.1.47:3200"
