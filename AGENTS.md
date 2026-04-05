# AGENTS.md

## Project

`nexus-computer` is the active workspace for building a personal AI cloud computer inspired by Zo Computer.

## Current stack

- Backend: FastAPI + Anthropic SDK
- Frontend: React + Vite
- Deployment: Railway via `railway.toml` and `Dockerfile`

## Key files

- `backend/main.py` — API entrypoint
- `backend/agent.py` — agent loop and tool use
- `backend/tools.py` — shell/file tools
- `frontend/src/App.jsx` — main UI
- `frontend/src/components/` — UI pieces

## Working notes

- Keep work inside `/home/workspace/nexus-computer`
- Treat this repo as the primary development target for the user's cloud-computer project
- Prefer small, focused edits and verify behavior after changes
