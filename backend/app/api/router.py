from fastapi import APIRouter

from app.api.routes import health
from app.api.v1.routes import agent, audit, evaluations, job_tabs, jobs, reports, tenders, vendors, ws, chats

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(tenders.router, prefix="/tenders", tags=["tenders"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(job_tabs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
api_router.include_router(evaluations.router, prefix="/evaluations", tags=["evaluations"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
api_router.include_router(ws.router, tags=["ws"])
