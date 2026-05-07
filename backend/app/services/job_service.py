from __future__ import annotations

import json
import time
import uuid
from dataclasses import dataclass

from app.db.redis import get_redis
from app.db.redis import redis_available
from app.services.stage_service import init_stages
from app.services.websocket_service import hub


def new_job_id() -> str:
    return f"job_{uuid.uuid4().hex}"


def _job_key(job_id: str) -> str:
    return f"jobs:{job_id}:status"


def _job_logs_key(job_id: str) -> str:
    return f"jobs:{job_id}:logs"


_mem_status: dict[str, dict] = {}
_mem_logs: dict[str, list[dict]] = {}


async def init_job(job_id: str, job_type: str) -> None:
    if redis_available():
        r = get_redis()
        await r.hset(
            _job_key(job_id),
            mapping={
                "job_id": job_id,
                "type": job_type,
                "status": "queued",
                "progress": 0,
                "current_step": "",
                "estimated_next_step": "",
            },
        )
        return
    _mem_status[job_id] = {
        "job_id": job_id,
        "type": job_type,
        "status": "queued",
        "progress": "0",
        "current_step": "",
        "estimated_next_step": "",
    }
    _mem_logs[job_id] = []
    await init_stages(job_id)


async def update_job(
    job_id: str,
    *,
    status: str | None = None,
    progress: int | None = None,
    current_step: str | None = None,
    estimated_next_step: str | None = None,
    **extra: object,
) -> None:
    mapping: dict[str, str] = {}
    if status is not None:
        mapping["status"] = status
    if progress is not None:
        mapping["progress"] = str(progress)
    if current_step is not None:
        mapping["current_step"] = current_step
    if estimated_next_step is not None:
        mapping["estimated_next_step"] = estimated_next_step
    for k, v in extra.items():
        if v is None:
            continue
        mapping[str(k)] = str(v)
    if mapping:
        if redis_available():
            r = get_redis()
            await r.hset(_job_key(job_id), mapping=mapping)
        else:
            _mem_status.setdefault(job_id, {}).update(mapping)
        await hub.broadcast(job_id, {"type": "status", "job_id": job_id, **mapping})


async def append_job_log(job_id: str, message: str, level: str = "info") -> None:
    line = {"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "level": level, "message": message}
    if redis_available():
        r = get_redis()
        await r.rpush(_job_logs_key(job_id), json.dumps(line))
        await r.ltrim(_job_logs_key(job_id), -500, -1)
    else:
        _mem_logs.setdefault(job_id, []).append(line)
        _mem_logs[job_id] = _mem_logs[job_id][-500:]
    await hub.broadcast(job_id, {"type": "log", "job_id": job_id, **line})


async def get_job_status(job_id: str) -> dict | None:
    if redis_available():
        r = get_redis()
        data = await r.hgetall(_job_key(job_id))
        return data or None
    return _mem_status.get(job_id)


async def get_job_logs(job_id: str) -> list[dict]:
    return await get_job_logs_page(job_id, offset=0, limit=500, newest_first=False)


async def get_job_logs_page(job_id: str, *, offset: int = 0, limit: int = 50, newest_first: bool = True) -> tuple[int, list[dict]]:
    offset = max(0, int(offset))
    limit = max(1, min(500, int(limit)))

    if not redis_available():
        all_lines = _mem_logs.get(job_id, [])
        total = len(all_lines)
        if newest_first:
            all_lines = list(reversed(all_lines))
        page = all_lines[offset : offset + limit]
        return total, page

    r = get_redis()
    total = int(await r.llen(_job_logs_key(job_id)))

    if total == 0:
        return 0, []

    if newest_first:
        # Map (offset, limit) in reversed view to LRANGE indices in stored (oldest-first) list.
        start = max(0, total - offset - limit)
        end = total - offset - 1
        raw = await r.lrange(_job_logs_key(job_id), start, end)
        raw = list(reversed(raw))
    else:
        raw = await r.lrange(_job_logs_key(job_id), offset, offset + limit - 1)

    lines: list[dict] = []
    for item in raw:
        try:
            lines.append(json.loads(item))
        except Exception:
            continue
    return total, lines
