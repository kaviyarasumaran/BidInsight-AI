from __future__ import annotations

import time

from app.db.redis import get_redis, redis_available


def _stages_key(job_id: str) -> str:
    return f"jobs:{job_id}:stages"


DEFAULT_STAGES = [
    "Input Received",
    "OCR Processing",
    "Parser Engine",
    "LLM Extraction",
    "Rule Engine Validation",
    "Confidence Scoring",
    "Explainability Engine",
    "Manual Review Detection",
    "Final Report Generation",
]


async def init_stages(job_id: str) -> None:
    if not redis_available():
        return
    r = get_redis()
    now = int(time.time())
    for name in DEFAULT_STAGES:
        await r.hset(_stages_key(job_id), name, f"queued|{now}|0")


async def set_stage(job_id: str, *, name: str, status: str) -> None:
    if not redis_available():
        return
    r = get_redis()
    now = int(time.time())
    raw = await r.hget(_stages_key(job_id), name)
    started = now
    if raw:
        try:
            _, started_s, _ = raw.split("|")
            started = int(started_s)
        except Exception:
            started = now
    duration = max(0, now - started) if status in ("completed", "failed", "manual_review_required") else 0
    await r.hset(_stages_key(job_id), name, f"{status}|{started}|{duration}")


async def get_computer_status(job_id: str, *, overall_progress: int, current_stage: str) -> dict:
    if not redis_available():
        return {
            "job_id": job_id,
            "overall_progress": overall_progress,
            "current_stage": current_stage,
            "stages": [{"name": n, "status": "unknown"} for n in DEFAULT_STAGES],
        }
    r = get_redis()
    raw = await r.hgetall(_stages_key(job_id))
    stages = []
    for name in DEFAULT_STAGES:
        v = raw.get(name)
        if not v:
            stages.append({"name": name, "status": "queued"})
            continue
        status, _, duration = v.split("|")
        entry = {"name": name, "status": status}
        if duration and duration != "0":
            entry["duration"] = f"{duration}s"
        stages.append(entry)
    return {"job_id": job_id, "overall_progress": overall_progress, "current_stage": current_stage, "stages": stages}
