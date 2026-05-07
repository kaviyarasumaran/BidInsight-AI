from __future__ import annotations

from typing import Optional

import redis.asyncio as redis

from app.config import settings

_redis: Optional[redis.Redis] = None


async def connect_to_redis() -> None:
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.redis_dsn, decode_responses=True)
        await _redis.ping()


async def close_redis_connection() -> None:
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None


def get_redis() -> redis.Redis:
    if _redis is None:
        raise RuntimeError("Redis client is not initialized. Did startup run?")
    return _redis


def redis_available() -> bool:
    return _redis is not None
