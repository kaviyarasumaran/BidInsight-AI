from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.db.mongo import close_mongo_connection, connect_to_mongo
from app.db.postgres import init_models
from app.db.redis import close_redis_connection, connect_to_redis


def create_app() -> FastAPI:
    @asynccontextmanager
    async def lifespan(_: FastAPI):
        connect_to_mongo()
        try:
            await connect_to_redis()
        except Exception:
            if settings.redis_required:
                raise
        if settings.env == "dev":
            try:
                await init_models()
            except Exception:
                if settings.postgres_required:
                    raise
        yield
        close_mongo_connection()
        try:
            await close_redis_connection()
        except Exception:
            pass

    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    origins = [o.strip() for o in settings.cors_allow_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins or ["*"],
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=[m.strip() for m in settings.cors_allow_methods.split(",")] if settings.cors_allow_methods != "*" else ["*"],
        allow_headers=[h.strip() for h in settings.cors_allow_headers.split(",")] if settings.cors_allow_headers != "*" else ["*"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_app()
