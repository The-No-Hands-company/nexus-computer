# Nexus.computer

Your personal AI cloud computer — inspired by zo.computer, built under The No Hands Company.

## What it is

A personal cloud Linux server with an AI agent (powered by Claude) that has full shell access. Chat with Nexus to:
- Run bash commands and scripts
- Create, read, write files
- Install packages and software
- Spin up servers and services
- Build anything

## Stack

- **Backend**: FastAPI + Anthropic SDK (agentic loop with tool use)
- **Frontend**: React + Vite (dark terminal aesthetic)
- **Deployment**: Railway (single Docker service)

## Phase 1 Features

- ✅ AI chat with streaming responses
- ✅ Full bash tool access (workspace sandboxed)
- ✅ File explorer with tree view + content preview
- ✅ Read/write/delete files via REST API
- ✅ Agentic tool loop (multi-step reasoning)

## Deploy to Railway

1. Fork / push this repo
2. Create a new Railway project → Deploy from GitHub
3. Add environment variables:
   - `ANTHROPIC_API_KEY` — your Anthropic API key
   - `NEXUS_MODEL` — (optional) defaults to `claude-sonnet-4-6`
   - `WORKSPACE_DIR` — (optional) defaults to `/workspace`
4. Add a Volume mounted at `/workspace` for persistence
5. Deploy

## Local Dev

```bash
# Backend
cd backend
pip install -r requirements.txt
ANTHROPIC_API_KEY=your_key uvicorn main:app --reload

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Frontend proxies `/api` to `localhost:8000` via vite.config.js.

## Roadmap

- Phase 2: Persistent memory, web terminal, streaming file writes
- Phase 3: Hosting layer — expose ports, integrate with Nexus Hosting
- Phase 4: Nexus AI branding, multi-user federation
