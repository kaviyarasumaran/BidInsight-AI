from __future__ import annotations

import hashlib
import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import settings


def new_upload_id() -> str:
    return f"upl_{uuid.uuid4().hex}"


def _safe_filename(name: str) -> str:
    return name.replace("/", "_").replace("\\", "_")


async def save_upload_files(upload_id: str, files: list[UploadFile]) -> list[dict]:
    if settings.storage_backend != "local":
        raise NotImplementedError("Only local storage is wired in this scaffold.")

    root = Path(settings.local_storage_path).resolve()
    target_dir = root / upload_id
    target_dir.mkdir(parents=True, exist_ok=True)

    saved: list[dict] = []
    for f in files:
        filename = _safe_filename(f.filename or "file")
        out_path = target_dir / filename
        hasher = hashlib.sha256()
        size = 0
        with out_path.open("wb") as out:
            while True:
                chunk = await f.read(1024 * 1024)
                if not chunk:
                    break
                out.write(chunk)
                hasher.update(chunk)
                size += len(chunk)

        saved.append(
            {
                "filename": filename,
                "path": str(out_path),
                "sha256": hasher.hexdigest(),
                "bytes": size,
                "content_type": f.content_type,
            }
        )
    return saved
