from __future__ import annotations

from arq import cron  # noqa: F401
from arq.connections import RedisSettings

from app.config import settings
from app.db.mongo import connect_to_mongo, close_mongo_connection
from app.db.redis import connect_to_redis, close_redis_connection
from app.db.postgres import init_models
from app.worker import functions


async def startup(ctx):
    connect_to_mongo()
    await connect_to_redis()
    if settings.env == "dev":
        await init_models()


async def shutdown(ctx):
    close_mongo_connection()
    await close_redis_connection()


class WorkerSettings:
    redis_settings = RedisSettings.from_dsn(settings.redis_dsn)
    functions = [functions.tender_extraction, functions.evidence_extraction, functions.evaluation]
    on_startup = startup
    on_shutdown = shutdown
