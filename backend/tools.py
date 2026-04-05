import os
import shutil
from fastapi import HTTPException


def _safe(workspace: str, path: str) -> str:
    """Resolve and verify path stays within workspace."""
    workspace_real = os.path.realpath(workspace)
    resolved = os.path.realpath(os.path.join(workspace_real, path.lstrip("/")))
    if os.path.commonpath([workspace_real, resolved]) != workspace_real:
        raise HTTPException(status_code=403, detail="Path traversal denied")
    return resolved


def list_files_api(workspace: str, path: str = ""):
    try:
        target = _safe(workspace, path)
        if not os.path.exists(target):
            return {"items": [], "path": path}

        items = []
        for entry in os.scandir(target):
            items.append(
                {
                    "name": entry.name,
                    "path": os.path.join(path, entry.name).lstrip("/"),
                    "is_dir": entry.is_dir(),
                    "size": 0 if entry.is_dir() else entry.stat().st_size,
                    "modified": entry.stat().st_mtime,
                }
            )

        return {
            "items": sorted(items, key=lambda x: (not x["is_dir"], x["name"])),
            "path": path,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def read_file_api(workspace: str, path: str):
    try:
        target = _safe(workspace, path)
        with open(target, "r", errors="replace") as f:
            content = f.read()
        return {"path": path, "content": content}
    except HTTPException:
        raise
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def write_file_api(workspace: str, path: str, content: str):
    try:
        target = _safe(workspace, path)
        parent = os.path.dirname(target)
        if parent:
            os.makedirs(parent, exist_ok=True)
        with open(target, "w") as f:
            f.write(content)
        return {"path": path, "status": "written"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def delete_file_api(workspace: str, path: str):
    try:
        target = _safe(workspace, path)
        if os.path.isdir(target):
            shutil.rmtree(target)
        else:
            os.remove(target)
        return {"path": path, "status": "deleted"}
    except HTTPException:
        raise
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
