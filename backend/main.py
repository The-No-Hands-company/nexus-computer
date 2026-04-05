from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os

from agent import run_agent_stream
from tools import list_files_api, read_file_api, write_file_api, delete_file_api

app = FastAPI(title="Nexus.computer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKSPACE = os.environ.get("WORKSPACE_DIR", "/workspace")
os.makedirs(WORKSPACE, exist_ok=True)


class ChatRequest(BaseModel):
    messages: list


class FileWriteRequest(BaseModel):
    path: str
    content: str


@app.get("/api/health")
async def health():
    return {"status": "online", "workspace": WORKSPACE}


@app.post("/api/chat")
async def chat(body: ChatRequest):
    return StreamingResponse(
        run_agent_stream(body.messages, WORKSPACE),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/api/files")
async def get_files(path: str = ""):
    return list_files_api(WORKSPACE, path)


@app.get("/api/files/read")
async def read_file(path: str):
    return read_file_api(WORKSPACE, path)


@app.post("/api/files/write")
async def write_file(body: FileWriteRequest):
    return write_file_api(WORKSPACE, body.path, body.content)


@app.delete("/api/files")
async def delete_file(path: str):
    return delete_file_api(WORKSPACE, path)


# Serve built frontend — checked at startup
for _dir in ["/app/frontend/dist", "frontend/dist", "../frontend/dist"]:
    if os.path.exists(_dir):
        app.mount("/", StaticFiles(directory=_dir, html=True), name="static")
        break
