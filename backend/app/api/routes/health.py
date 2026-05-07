from fastapi import APIRouter

from app.db.mongo import get_mongo_db

router = APIRouter()


@router.get("/health")
def health():
    # A lightweight smoke-check that startup initialized the client.
    _ = get_mongo_db()
    return {"status": "ok"}
