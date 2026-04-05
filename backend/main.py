from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Literal
import json
import os
import platform
import shutil
import time
import uuid
from datetime import datetime, timezone

from agent import run_agent_stream
from tools import list_files_api, read_file_api, write_file_api, delete_file_api, search_files_api

app = FastAPI(title="Nexus.computer API")

cors_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if cors_origins == ["*"] else cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKSPACE = os.environ.get("WORKSPACE_DIR", "/workspace")
os.makedirs(WORKSPACE, exist_ok=True)
START_TIME = time.time()
REQUESTS_FILE = os.path.join(WORKSPACE, ".nexus", "feature-requests.json")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    search: str | None = None


class FileWriteRequest(BaseModel):
    path: str
    content: str


class FeatureRequestCreate(BaseModel):
    title: str
    details: str = ""


def _load_feature_requests() -> list[dict]:
    try:
        with open(REQUESTS_FILE, "r") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []
    except Exception:
        return []


def _save_feature_requests(items: list[dict]) -> None:
    os.makedirs(os.path.dirname(REQUESTS_FILE), exist_ok=True)
    with open(REQUESTS_FILE, "w") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)


def _sorted_feature_requests(items: list[dict]) -> list[dict]:
    return sorted(
        items,
        key=lambda x: (x.get("votes", 0), x.get("created_at", "")),
        reverse=True,
    )


def _find_feature_request(items: list[dict], request_id: str) -> dict | None:
    for item in items:
        if item.get("id") == request_id:
            return item
    return None


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.get("/api/health")
async def health():
    return {"status": "online", "workspace": WORKSPACE}


@app.get("/api/meta")
async def meta():
    usage = shutil.disk_usage(WORKSPACE)
    feature_requests = _load_feature_requests()
    return {
        "name": "Nexus.computer",
        "model": os.environ.get("NEXUS_MODEL", "claude-sonnet-4-6"),
        "workspace": WORKSPACE,
        "feature_requests": len(feature_requests),
        "uptime_seconds": int(time.time() - START_TIME),
        "platform": platform.platform(),
        "python": platform.python_version(),
        "disk": {
            "total": usage.total,
            "used": usage.used,
            "free": usage.free,
        },
        "values": [
            "free as in freedom",
            "privacy first",
            "no paywalls",
            "open source",
        ],
    }


@app.get("/api/search")
async def search(q: str, path: str = ""):
    if not q.strip():
        raise HTTPException(status_code=400, detail="q cannot be empty")
    return search_files_api(WORKSPACE, q, path)


@app.get("/api/feature-requests")
async def list_feature_requests():
    items = _load_feature_requests()
    return {"items": _sorted_feature_requests(items)}


@app.post("/api/feature-requests")
async def create_feature_request(body: FeatureRequestCreate):
    title = body.title.strip()
    details = body.details.strip()
    if len(title) < 3:
        raise HTTPException(status_code=400, detail="title must be at least 3 characters")

    item = {
        "id": uuid.uuid4().hex,
        "title": title,
        "details": details,
        "status": "open",
        "votes": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    items = _load_feature_requests()
    items.insert(0, item)
    _save_feature_requests(items)
    return item


@app.post("/api/feature-requests/{request_id}/vote")
async def vote_feature_request(request_id: str):
    items = _load_feature_requests()
    item = _find_feature_request(items, request_id)
    if not item:
        raise HTTPException(status_code=404, detail="feature request not found")

    item["votes"] = int(item.get("votes", 0)) + 1
    _save_feature_requests(items)
    return item


@app.post("/api/chat")
async def chat(body: ChatRequest):
    if not body.messages:
        raise HTTPException(status_code=400, detail="messages cannot be empty")
    if body.search:
        search_results = search_files_api(WORKSPACE, body.search, "")
        augmented = body.messages + [
            ChatMessage(
                role="assistant",
                content="Workspace search context:\n" + str(search_results),
            )
        ]
    else:
        augmented = body.messages
    return StreamingResponse(
        run_agent_stream([m.model_dump() for m in augmented], WORKSPACE),
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
