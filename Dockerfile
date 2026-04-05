# ── Stage 1: Build the React frontend ─────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python backend + built frontend ───────────────────────────────────
FROM python:3.11-slim
WORKDIR /app

# System deps for subprocess tools (curl, git, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git bash && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Persistent workspace volume
RUN mkdir -p /workspace

WORKDIR /app/backend
ENV WORKSPACE_DIR=/workspace

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
